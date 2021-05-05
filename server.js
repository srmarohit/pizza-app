// config dotenv file at top of the file
require('dotenv').config();
const  express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongo') ; // it reutrn a constructor takes session as parameter.
const flash = require('express-flash')
const passport = require('passport')
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300 ;

// MongoDB Connection
const url = 'mongodb://localhost/pizza' ;
mongoose.connect(url, {useNewUrlParser :true, useCreateIndex :true, useUnifiedTopology:true});
const connection = mongoose.connection ;
connection.once('open', ()=>{
    console.log('database Connected..!')
}).catch(err => {
    console.log("connection failed.. !")
});

// Session store 

let mongoStore = new MongoDbStore({
    mongoUrl : url,
    autoRemove:'native',
    //mongooseConnection : connection , // this line create mongo connect but have already "connection" 
    //collectionName : 'sessions'  // provide collection name must be prural that store session data in it.
})


// Session new Config
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave :false,
    store:mongoStore,
    saveUninitialized : false,
    cookie : {maxAge : 1000 * 60 * 60 * 24} // 24 Hours
   //cookie : {maxAge : 1000 * 10} // 24 Hours

}))


// setup passport and configuration and must be below or after session configuration
   // passport local strategies comes from config folder
   require('./app/config/passport')(passport) ;
   app.use(passport.initialize())
   app.use(passport.session())


// set urlencoded forr req.body print in console 
app.use(express.urlencoded({extended:false}))

// set JSON response
app.use(express.json())

// set flash configuration 
app.use(flash())

//use public assets
app.use(express.static('public'))

//set Global variable middleware
app.use((req,res,next) => {
    res.locals.session = req.session ;
    res.locals.user = req.user ;
    next();
})

// set Template engine after routes

app.use(expressLayout);
app.set('views', path.join(__dirname,'./resources/views'));
app.set('view engine', 'ejs');


// use Routes after use and set method.
   // importing initRoute that return a function initRoute call directly.

   require('./routes/web/web')(app) ; // pass app as parameter 




app.listen(PORT, () => console.log(`Example app listening on port ${PORT}  ! `))