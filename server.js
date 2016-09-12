var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connectionCount = 0;
var users = [];

function getUserName(id) {
    for (var i=0; i<users.length; i++) {
        if (users[i].id == id) {
            return users[i].name;
        }
    }
}

io.on('connection', function(socket) {
    connectionCount++;
    io.emit('message', connectionCount + " users are connected.");
    
    socket.on('naming', function(name) {
        var newUser = {};
        newUser.name = name;
        newUser.id = socket.id;
        users.push(newUser);
        io.emit('message', name + " has joined.");
    });
    
    socket.on('message', function(message){
        var sendingUser = getUserName(socket.id);
        io.emit('message', sendingUser + ": " + message);
    });
    
    socket.on('disconnect', function() {
        for (var i=0; i<users.length; i++) {
            if (users[i].id == socket.id) {
                io.emit('message', users[i].name + " has left the room");
                users.splice(i, 1);
            }
        }
        connectionCount--;
        io.emit('message', connectionCount + " users are connected.");
    });
    

    
});


server.listen(process.env.PORT || 8080);