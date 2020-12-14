


const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserConversationSchema = new Schema({
    conversation_id:String,
    from:{
        id:Number,
        name:String,

    },
    to:{
        id:Number,
        name:String
    },
    message:String,
    image_url:{
        type:Array,
        default:[],
    },
    type:String,
    date:{ type: Date, default: Date.now },

 
});

const UserConversationModel = mongoose.model('UserConversation',UserConversationSchema);

module.exports = UserConversationModel;