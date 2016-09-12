$(document).ready(function() {
    var name = prompt("What's your name?");
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var userName = $('#userName');
    
    (function getName() {
        userName.append(name);
        socket.emit('naming', name);
    })();
    
    
    
    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });
    
    socket.on('message', addMessage);
});