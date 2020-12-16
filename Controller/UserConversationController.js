
const {UserConversationModel,UserConnectionModel} = require('../Model/UserConversationModel');
// const UserConnection = require('../Model/UserConnectionModel');

exports.saveConversations = async (data) => {

    try {
        



        let xx = await UserConversationModel.create(data);

        let connection = await UserConnectionModel.findOne({_id:data.connection});
        console.log('data connection: ',connection);

        let a = await connection.conversations.push(xx);
        await connection.save();
        console.log('connection: ',connection);
        
        // let aa = await a.save();
        // console.log('aaaa: ',aa);

    } catch (error) {
        console.log(error);
    }


    // console.log('created: ',xx);

}




/**
 * author:thuantruong
 * created_at:15/12/2020
 * description: get all conversations of users
 * @param {*} req 
 * @param {*} res 
 */
exports.getConversations = async (req, res) => {
    try {
        let connection_id = req.params.connection_id;
        let sortBy = req.query.sortby || 'asc';
        let limit = Number(req.query.limit) || 15;
        let next_page_number = Number(req.query.pagenext) || 0;
        
        let user_conversation = await UserConversationModel.find({connection:connection_id})
            .sort({ date: sortBy })
            .limit(limit)
            .skip(next_page_number)


       
        res.json({
            status: true,
            data: user_conversation,
            page_number:next_page_number,
            message: "Get Conversation successfully"
        });



    } catch (error) {
        res.json({
            status: false,
            data: [],
            message: "Get User conversation failed "+error
        });
    }
}


/**
 * author:thuantruong
 * created_at:15/12/2020
 * description: Check whereas user has been connected or not, if not create new
 * @param {*} req 
 * @param {*} res 
 */
exports.checkToCreateUserConnection = async (req, res) => {

    try {

        // let from = Number(req.params.user_id);
        let connectionData = {
            conversation_id: req.body.conversation_id,
            from: Number(req.body.from),
            to: Number(req.body.to),
            user_image: req.body.user_image
        };

     //   let conversation_id = `${from}-2222`;
        let userConnection = await UserConnectionModel
        .findOne({ conversation_id: connectionData.conversation_id });

        if (userConnection) {
            console.log("User was exists");
            res.json({
                status: true,
                data: userConnection,
                message: "User was exists"
            });
        } else {
            
            let createdUser = await UserConnectionModel
            .create(connectionData);
            console.log("User was not exists");
            res.json({
                status: false,
                data: createdUser,
                message: "Create user connection successfully"
            });
        }


    } catch (error) {
        res.json({
            status: false,
            data: [],
            message: "Check user connection failed "+error
        });

    }
}



/**
 * author:thuantruong
 * created_at:15/12/2020
 * description: get all user's connection that connected or chat to user
 * @param {*} req 
 * @param {*} res 
 */
exports.getUserConnection = async (req, res) => {


    try {
        let user_id = req.params.user_id;
        
        let user_connections = await UserConnectionModel.find().or([{from:user_id},{to:user_id}])
        .limit(15)
        .sort({date:'desc'})
        .populate({path:'conversations',options: { sort: { 'date': -1 } }} );
        
        res.json({
            status: true,
            data: user_connections,
            message: "Get user's connection successfully"
        });

    } catch (error) {
        res.json({
            status: false,
            data: [],
            message: "Get user's connection failed "+error
        });
    }


}

