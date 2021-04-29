const  express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300 ;

//use public assets
app.use(express.static('public'))

// set Template engine after routes

app.use(expressLayout);
app.set('views', path.join(__dirname,'./resources/views'));
app.set('view engine', 'ejs');


// use Routes after use and set method.
app.get('/', (req, res) => {
    res.render('index')
})

// cart get method 
app.get('/cart', (req,res)=>{
    // Dont use / in front of render path.
    res.render('customers/cart');
})

// auth get method
app.get('/register',(req,res)=>{
    res.render('auth/register')
})

app.get('/login',(req,res)=>{
    res.render('auth/login')
})



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}  ! `))