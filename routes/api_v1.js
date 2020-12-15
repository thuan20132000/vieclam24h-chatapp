const router = require('express').Router();
const userConversationController = require('../Controller/UserConversationController');


router.get('/', function(req,res){
    res.json({
        status:"API is working",
        message:"Welcome to Vieclam24h"
    });
})


/**
 * 
 * description:  message chat conversations
 */
router.route('/conversations/:conversation_id')
.get(userConversationController.getConversations);



/**
 * description:  connections user list
 */
router.route('/connection/:user_id')
.post(userConversationController.checkToCreateUserConnection);

router.route('/user/:user_id/connection/')
.get(userConversationController.getUserConnection);


module.exports = router;