
const guest = (req,res,next) => {
    if(!req.isAuthenticated()){  // isAuthenticated() comes from passport
        return next();
    }

    res.redirect('/');
}

module.exports = guest ;