
const UserConversation = require('../Model/UserConversationModel');

exports.saveConversations = async (client_uuid) => {

    let xx = await UserConversation.create({
        conversation_id: client_uuid,
        from: {
            id: 1,
            name: "Thuan 1"
        },
        to: {
            id: 2,
            name: "Thuan 2"
        },
        message: "Hello world",
        image_url: [],

    });

    console.log('created: ',xx);

}