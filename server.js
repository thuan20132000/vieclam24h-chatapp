var express = require('express');
const path = require('path');
var uuid = require('node-uuid');


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://vieclam24h:0976904548@cluster0.otzgp.mongodb.net/test',
    { useNewUrlParser: true, useUnifiedTopology: true }
);


var app = new express();
const ejs = require('ejs');
app.set('view engine', 'ejs');


var WebSocket = require('ws')
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });


const UserConversationController = require('./Controller/UserConversationController');

var clients = [];


function wsSend(type, client_uuid, nickname, message) {
    for (let i = 0; i < clients.length; i++) {
        var clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
                "type": type,
                "id": client_uuid,
                "nickname": nickname,
                "message": message
            }));
        }
    }
}
var clientIndex = 1;


wss.on(`connection`, function (ws) {

    var client_uuid = uuid.v4();
    var nickname = "AnonymousUser" + clientIndex;
    clientIndex += 1;
    clients.push({ "id": client_uuid, "ws": ws, "nickname": nickname });
    console.log("client [%s] connected", client_uuid);
    var connect_message = nickname + " has connected";

    wsSend("notification", client_uuid, nickname, connect_message);


    ws.on('message', function (message) {


        UserConversationController.saveConversations(client_uuid);

        let data = JSON.parse(message);
        console.log(data.text);

        if (message.indexOf('/nick') === 0) {
            var nickname_array = message.split(' ');
            if (nickname_array.length >= 2) {
                var old_nickname = nickname;
                nickname = nickname_array[1];
                var nickname_message = "Client " + old_nickname + " changed to " + nickname;
                wsSend("nick_update", client_uuid, nickname_message);
            }
        } else {
            wsSend("message", client_uuid, nickname, message);
        }
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







app.get('/home', function (req, res) {
    res.render('client');
});



var server = app.listen(3000, () => {
    console.log(`server is running on port`, server.address().port);

});
