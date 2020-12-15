var express = require('express');
const path = require('path');
var uuid = require('node-uuid');

const apiRoute = require('./routes/api_v1');
var bodyParser = require('body-parser')


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://vieclam24h:0976904548@cluster0.otzgp.mongodb.net/test',
    { useNewUrlParser: true, useUnifiedTopology: true }
);


var app = new express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json());

const UserConversationController = require('./Controller/UserConversationController');




app.get('/home', function (req, res) {
    res.render('client');
});





app.get('/', async (req, res) => {
    res.json({
        status: 201
    })
})

app.use('/api/v1', apiRoute);






var port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    console.log("WEBHOOK IS LISTENING..: " + port)
);



// const { Server } = require('ws');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server });


var clients = [];


function wsSend(type, user_id, nickname, message) {

    let clientIndex = clients.findIndex(e => e.id == user_id);
    console.log(clientIndex);
    let userSocket = clients[0].ws;
    userSocket.send(JSON.stringify({
        "type": "text",
        "id": 1111,
        "nickname": "text",
        "message": "text"
    }));


    // for (let i = 0; i < clients.length; i++) {
    //     var clientSocket = clients[i].ws;
    //     if (clientSocket.readyState === WebSocketServer.OPEN) {
    //         console.log(nickname);
    //         clientSocket.send(JSON.stringify({
    //             "type": type,
    //             "id": user_id,
    //             "nickname": nickname,
    //             "message": message
    //         }));
    //     }
    // }
}


function websocketSend(data) {
    for (let i = 0; i < clients.length; i++) {
        var clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocketServer.OPEN) {
            clientSocket.send(JSON.stringify(data));
        }
    }
}

var clientIndex = 1;


wss.on(`connection`, function (ws, req) {

    let user_req = req.url;
    let user_id = user_req.substr(1,);
    // console.log(user_id);

    var client_uuid = uuid.v4();
    var nickname = "AnonymousUser" + clientIndex;
    clientIndex += 1;
    clients.push({ "id": user_id, "ws": ws, "nickname": nickname });
    console.log("client [%s] connected", user_id);
    var connect_message = nickname + " has connected";

    wsSend("notification", user_id, nickname, connect_message);


    ws.on('message', function (message) {

        let data = JSON.parse(message);
        let recipient_id = data.to.id;


       // ws.send(JSON.stringify(data));

        for (let i = 0; i < clients.length; i++) {
            var clientSocket = clients[i].ws;
            if (clientSocket.readyState === WebSocketServer.OPEN) {
                clientSocket.send(JSON.stringify(data));
            }
        }
        // wsSend("text", user_id, "thuan", "hello");

        UserConversationController.saveConversations(data);
        //  websocketSend(data);

        // if (message.indexOf('/nick') === 0) {
        //     var nickname_array = message.split(' ');
        //     if (nickname_array.length >= 2) {
        //         var old_nickname = nickname;
        //         nickname = nickname_array[1];
        //         var nickname_message = "Client " + old_nickname + " changed to " + nickname;
        //         wsSend("nick_update", client_uuid, nickname_message);
        //     }
        // } else {
        //     wsSend("message", client_uuid, nickname, message);
        // }
    })






    ws.on('close', function () {
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id == client_uuid) {
                console.log(`Client [%s] disconcted`, client_uuid);
                clients.splice(i, 1);
            }

        }
    })
});



