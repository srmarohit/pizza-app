// Create model for pizza menu

const mongoose = require('mongoose');
const Schema = mongoose.Schema

   // the first letter of Schema represent class constructor 
const menuSchema = new Schema({
    name : {
        type : String
    },
    image : {
        type : String
    },
    price : {
        type : Number
    },
    size : {
        type : String
    }
});

module.exports = mongoose.model('Menu', menuSchema)

// Note : collection creation "menus" must be in small letter with prural.