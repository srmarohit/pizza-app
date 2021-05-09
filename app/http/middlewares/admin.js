// create middleware for check authentication for admin

const admin = (req,res,next) =>{
    // call pasport method
    if(req.isAuthenticated() && req.user.role === 'admin'){
        //user is logged in
       return next();
    }
    //when user not logged in
    return res.redirect('/')
 }
 
 module.exports = admin ;