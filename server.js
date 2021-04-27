const  express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300 ;

// use Routes befor use and set method.
app.get('/', (req, res) => {
    res.render('index')
})

// set Template engine after routes

app.use(expressLayout);
app.set('views', path.join(__dirname,'./resources/views'));
app.set('view engine', 'ejs');




app.listen(PORT, () => console.log(`Example app listening on port ${PORT}  ! `))