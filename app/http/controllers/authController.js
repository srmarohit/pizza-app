
///// Here we created a authController factory function that returns an object.
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authController = () =>{

    const _redirectUrl = (req)=>{
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders' ;
    }

    // it return an object has a callback function of their respective routes.
    return {
                  // GET ROute : /register
        register : (req,res) => {
            res.render('auth/register')
        },

                  // POST ROute : /register
        postRegister : async(req,res) => {
            // console.log(req.body)

            const {name, email, password} = req.body ;
            //Validating field
            if(!name || !email || !password){
                //setup flash message
                req.flash('error', 'All fields are required !')
                req.flash('name', name)
                req.flash('email',email)
                return res.render('auth/register');
            }

            // Check given email is already taken or not into db
            await User.exists({ email:email },(err, result)=>{
                if(result){
                req.flash('error', 'Email is already taken !')
                req.flash('name', name)
                req.flash('email',email)
                return res.redirect('/register'); // in redirect should be / in front of pathname
                }
            });

            // hash password 
            const hashPassword = await bcrypt.hash(password, 10);

            // Create a new User 
            const user = new User({name : name, email:email, password : hashPassword})
            await user.save().then((user)=>{

                // login related code with passport-local stratigies

                // redirect to home page 
                // redirect just call get routes for /
                return res.redirect('/');
            }).catch(e => {
                req.flash('error',  'Something went wrong')
                return res.redirect('/register')
            });
            
        },
                  // GET ROute : /login

        login : (req,res) =>{
            res.render('auth/login')
        },      
        
        
        // POST ROute : /login
        postLogin : (req,res, next) => {
             // console.log(req.body)

             const {email, password} = req.body ;
             //Validating field
             if( !email || !password){
                 //setup flash message
                 req.flash('error', 'All fields are required !')
                 req.flash('email',email)
                 return res.render('auth/login');
             }
 
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }

                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login') 
                }

                // if all correct
                req.login(user, (err)=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    // redirect home page
                    return res.redirect(_redirectUrl(req))
                })
            })(req, res, next) ; // it returns a function has argument req,res,next .
        },

        // POST ROute : /logout

        logout : (req,res) => {
            req.logout();
            return res.redirect('/');
        }
    }
}

module.exports = authController ;