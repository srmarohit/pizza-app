// config dotenv file at top of the file
require("dotenv").config();
const express = require("express");
const app = express();
const Emitter = require('events'); // return event class
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongo"); // it reutrn a constructor takes session as parameter.
const flash = require("express-flash");
const passport = require("passport");
const {init, facebookAuth, instagramAuth, googleAuth} = require("./app/config/passport");
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3300;

// MongoDB Connection
const url = "mongodb://localhost/pizza";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("database Connected..!");
  })
  .catch((err) => {
    console.log("connection failed.. !");
  });

// Session store

let mongoStore = new MongoDbStore({
  mongoUrl: url,
  autoRemove: "native",
  //mongooseConnection : connection , // this line create mongo connect but have already "connection"
  //collectionName : 'sessions'  // provide collection name must be prural that store session data in it.
});

//Event Emitter
const eventEmitter = new Emitter();
// set eventEmitter instance to set for which use this event emitter from any where in application
app.set('eventEmitter', eventEmitter);

// Session new Config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 Hours
    //cookie : {maxAge : 1000 * 10} // 24 Hours
  })
);

// setup passport and configuration and must be below or after session configuration
// passport local strategies comes from config folder
init(passport);
facebookAuth(passport);
instagramAuth(passport);
googleAuth(passport);
app.use(passport.initialize());
app.use(passport.session());

// set urlencoded forr req.body print in console
app.use(express.urlencoded({ extended: false }));

// set JSON response
app.use(express.json());

// set flash configuration
app.use(flash());

//use public assets
app.use(express.static("public"));

//set Global variable middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set Template engine after routes

app.use(expressLayout);
app.set("views", path.join(__dirname, "./resources/views"));
app.set("view engine", "ejs");

// use Routes after use and set method.
// importing initRoute that return a function initRoute call directly.

require("./routes/web/web")(app); // pass app as parameter

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}  ! `);
});

// install websocket
const io = require('socket.io')(server) ;  // pass server to this websocket.

//Initialize the Socket
io.on('connection', (socket)=>{
    // when first time connect establish get socket.id
   console.log(socket.id)

    // call on method with 'join' of socket to create a room provided by user.
    socket.on('join', (joinRoom)=>{
        console.log(joinRoom); // here we set a orderid as a rooma name
        socket.join(joinRoom)
    })
})


eventEmitter.on('orderUpdated', (data)=>{ // this orderUpdated event comes from statusController of admin folder
    io.to(`order_${data.id}`).emit('orderUpdated', data); // send orderUpdate event name with data to client 
})


//listen event from custemr orderController when customer do order
eventEmitter.on('orderPlaced', order =>{
    io.to('adminRoom').emit('orderPlaced', order)
})