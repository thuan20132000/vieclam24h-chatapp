


const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserMessageSchema = new Schema({
    user_id:Number,
    user_name:String,
    user_email:String,
    user_phonenumber:String,
    

})