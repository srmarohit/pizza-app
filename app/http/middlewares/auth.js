// create middleware for check authentication 

const auth = (req,res,next) =>{
   // call pasport method
   if(req.isAuthenticated()){
       //user is logged in
      return next();
   }
   //when user not logged in
   return res.redirect('/login')
}

module.exports = auth ;