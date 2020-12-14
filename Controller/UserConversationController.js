
const UserConversation = require('../Model/UserConversationModel');

exports.saveConversations = async (data) => {

    try {
        console.log('data send: ',data);
        let conversation_id = `${data.from.id}-${data.to.id}`;
        let dataSend = { ...data, conversation_id };
        // console.log(dataSend);
        let xx = await UserConversation.create(dataSend);
    } catch (error) {
        console.log(error);
    }


    // console.log('created: ',xx);

}