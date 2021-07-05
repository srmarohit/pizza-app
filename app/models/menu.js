// Create model for pizza menu

const mongoose = require('mongoose');
const pagination = require("mongoose-paginate-v2")
const Schema = mongoose.Schema

   // the first letter of Schema represent class constructor 
const menuSchema = new Schema({
    name : {
        type : String
    },
    image : {
        type : String
    },
    category : {
        type : String
    },
    price : {
        type : Number
    },
    mrp : {
        type : Number
    },
    description : {
        type : String
    },
    size : {
        type : String
    }
});

menuSchema.plugin(pagination);

module.exports = mongoose.model('Menu', menuSchema)

// Note : collection creation "menus" must be in small letter with prural.