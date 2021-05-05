const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

   // the first letter of Schema represent class constructor 

const userSchema = new Schema({
    name :{
        type : String
    },
    email :{
        type : String
    },
    password :{
        type : String
    },
    role :{
        type : String,
        default:'customer'
    }
}, {
    timestamps:true
});

module.exports = mongoose.model('User', userSchema);

// Note : collection creation "users" must be in small letter with prural.