const User = require('../models/user')
const bcrypt = require('bcrypt')

const LocalStrategies = require('passport-local').Strategy ; // return a strategy class

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



module.exports = init ;