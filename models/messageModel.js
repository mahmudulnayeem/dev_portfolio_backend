const {model,Schema} = require('mongoose');

const messageSchema = new Schema({
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
        default:"Anonymous"
    },
    email : {
        type : String,
        required : true
    },
    image : {
        type : String,
       
    },
    message:{
        type:String,
        required:true
    }
},{timestamps : true});

module.exports = model('message',messageSchema);