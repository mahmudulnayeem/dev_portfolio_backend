const {model,Schema} = require('mongoose');

const registerSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName: {
        type : String,
        required : true
    },
    phone: {
        type :Number,
        required : true
    },
    status: {
        type :String,
        default: "user"
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    image : {
        type : String,
        // required : true,
       
    }
},{timestamps : true});

module.exports = model('user',registerSchema);