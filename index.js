var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Node server is running***');
});

	
app.get('/', function (req, res) {
res.sendFile(__dirname +'/'+'index.html');
var io = require('socket.io-client');
var socket = io.connect('obscure-stream-93442.herokuapp.com/', {reconnect: true});

console.log('2');

socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
	
	});
socket.on('messages', function(data) {
                console.log(data);
        });

});

