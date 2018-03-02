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

console.log('1');

socket.on('connect', function(data) {
	console.log('2');
    socket.on('response', function(data) {
		console.log('3');
                console.log(data);
        });
	
	});
	console.log('4');
	
 socket.on('eventemit', function(data) {
	 console.log('5');
                console.log(data);
        });

/*var Client = require('node-rest-client').Client;
 
var client = new Client();
 
// direct way 
client.get("https://obscure-stream-93442.herokuapp.com/getRepData", function (data, response) {
    // parsed response body as js object 
   // console.log(data);
     console.log("response");
    console.log(response.responseUrl);
	res.redirect(response.responseUrl);
	
});
 
// registering remote methods 
client.registerMethod("jsonMethod", "https://obscure-stream-93442.herokuapp.com/getRepData", "GET");
 
/*client.methods.jsonMethod(function (data, response) {
      
    console.log(data);
    // raw response 
    console.log(response);
});*/

});

