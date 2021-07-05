const User = require('../models/user')
const bcrypt = require('bcrypt')

const LocalStrategies = require('passport-local').Strategy ; // return a strategy class
const FacebookStrategies = require('passport-facebook').Strategy ; 
const InstagramStrategies = require('passport-instagram').Strategy ;
const GoogleStrategies = require("passport-google-oauth2").Strategy ;
const passport = require('passport');

const init = (passport) => {
    passport.use(new LocalStrategies({usernameField : 'email'}, async (email, password, done) => {
        //Login
         // check if email exists

         const user = await User.findOne({email : email});

         if(!user){
             return done(null, false, {message : "No user with this email"});
         }

         bcrypt.compare(password, user.password).then(match => {
             if(match){
                 // password matched
                 return done(null, user , {message : "User Successfully Logged in.!"})
             }

             return done(null, false, {message : "username or password does not matched."})

         }).catch(e => {
             return done(null, false, {message : "Something went wrong.!"})
         })

    }));


    // use Serialization 
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    // use De-Serialization 
    passport.deserializeUser((id, done) => {
        //first check and authenticate id
        User.findById(id, (err, user)=>{
            done(err, user) ; // pass two para error in first and user in second in callback done()
        });
    });
} 


const facebookAuth = (passport) => {
    passport.use(new FacebookStrategies({
        // set these key and their valid value
        clientID : process.env.FB_APP_ID,
        clientSecret : process.env.FB_SECRET,
        callbackURL :"http://localhost:3300/auth/facebook/done",
        profileFields:['id','name','gender','picture.type(large)', 'email']
    },  function(accessToken, refreshToken, profile, done){
         User.findOne({'facebook_id':profile.id}, function(err, user){
             console.log(profile)
            if(err){
                return done(err)
            }

            if(user){
                console.log(user)
                return done(null, user)
            }

            // create new customer
            const newUser = new User() ;
            newUser.facebook_id = profile.id ;
            newUser.email = profile.emails[0].value ;
            newUser.name = profile.name['givenName'] ;
            newUser.password = accessToken ;

             newUser.save(function(err){
                if(err){
                    return done(err)
                }else{
                    return done(null, newUser)
                }
            });
        }) 
    }));

    serialization()
   
}

const instagramAuth = (passport) =>{
    passport.use(new InstagramStrategies({
        clientID: process.env.INSTA_ID,
        clientSecret: process.env.INSTA_SECRET,
        callbackURL: "http://localhost:3300/auth/instagram/done"
        //token :EAAoOjUofZAAYBALscp14HehwIvgE171h4zJO87S6dKgiO57DE4znrLnm0lLW8SuKsS35nNjoUGsz88t9AbZB8CLgJXcYsbZA7YaN7r9XlqAYGhbsd01n0kuF4EdGBovozW9HUhXSK8VMDWzIeCbmrDS93UwfGNZAHZCqZAbPhmmTRsw6yVmZCHKlsFMs7MCZCawqihPQZCjocaAZDZD
      },
      function(accessToken, refreshToken, profile, done) {
          console.log(profile)
          User.findOrCreate({ instagramId: profile.id }, function (err, user) {
            return done(err, user);
          });
      }
    ));

    serialization();

}

const googleAuth = (passport) => {
    passport.use(new GoogleStrategies({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3300/auth/google/done"
      },
      function(accessToken, refreshToken, profile, done) {
          console.log("data ",profile.id," ",profile.displayName, " ",profile.email)
        User.findOne({ 'google_id': profile.id }, function (err, user) {
            console.log(profile)
            if(err){
                return done(err)
            }

            if(user){
                console.log(user)
                return done(null, user)
            }

            // create new customer
            const newUser = new User() ;
            newUser.google_id = profile.id ;
            newUser.email = profile.email ;
            newUser.name = profile.displayName ;
            newUser.password = accessToken ;

             newUser.save(function(err){
                if(err){
                    return done(err)
                }else{
                    return done(null, newUser)
                }
            }); 
         });
      }
    ));

    serialization();
}


function serialization(){
     // use Serialization 
     passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    // use De-Serialization 
    passport.deserializeUser((id, done) => {
        //first check and authenticate id
        User.findById(id, (err, user)=>{
            done(err, user) ; // pass two para error in first and user in second in callback done()
        });
    });
}



module.exports = {init, facebookAuth, instagramAuth, googleAuth} ;