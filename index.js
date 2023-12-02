const express = require('express');
const socketIO = require('socket.io');
const http = require('node:http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

var users = 0;

io.on("connection", function(socket){
    console.log("New User connected!");
    users++;
    io.sockets.emit("onlineusers",users);

    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " joined the chat-room!");
    });

    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " left!");
    });

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });

    socket.on("disconnect", function(){
        console.log("User disconnected");
        users--;
        io.sockets.emit("onlineusers",users);
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});