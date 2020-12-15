


const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserConnectionSchema = new Schema({
    from: {
        type: Number,
        required: true
    },
    to: {
        type: Number,
        required: true
    },
    user_image: {
        type: String,
        required: false,
    },
    conversation_id:{
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now },
    conversations: [{ type: Schema.Types.ObjectId, ref: 'UserConversation' }]

});


const UserConversationSchema = new Schema({
    connection:{ type: Schema.Types.ObjectId, ref: 'UserConnection' },
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
    isMine:Boolean


 
});

const UserConnectionModel = mongoose.model('UserConnection', UserConnectionSchema);

const UserConversationModel = mongoose.model('UserConversation',UserConversationSchema);

module.exports = {UserConversationModel,UserConnectionModel};