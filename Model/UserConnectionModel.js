


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


});

const UserConnectionModel = mongoose.model('UserConnection', UserConnectionSchema);

module.exports = UserConnectionModel;