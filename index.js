var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Node server is running***');
});
/*
//var app = require('express')();
var server = require('http').createServer(app);
server.listen(process.env.PORT || 3000);
var io = require('socket.io')(server);
//io.on('connection', function(){  });

var socket = io.connect('obscure-stream-93442.herokuapp.com');
socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});
 */
	
app.get('/', function (req, res) {
// Connect to server
var io = require('socket.io-client')
var socket = io.connect('obscure-stream-93442.herokuapp.com', {reconnect: true});

console.log('2');

// Add a connect listener
socket.on('connect', function(socket) { 
    console.log('Connected!');
	//socket.emit('join', 'Hello World from client');
});
socket.on("message",function(message){  
                /*
                    When server sends data to the client it will trigger "message" event on the client side , by 
                    using socket.on("message") , one cna listen for the ,message event and associate a callback to 
                    be executed . The Callback function gets the dat sent from the server 
                */
                console.log("Message from the server arrived")
                message = JSON.parse(message);
                console.log(message); /*converting the data into JS object */
                //$('#content').append('<div >'+message.data+'</div>'); /*appending the data on the page using Jquery */
 });
var data ="received";
socket.send(JSON.stringify(data)); 

});
/*app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send(name + ' Submitted Successfully!');
	
	
});
var https=require('http');

//
var optionsget = {
    
  'host': 'obscure-stream-93442.herokuapp.com', 
  'path': '/getRepData',
  'method': 'GET'

};

console.log('Options prepared:');
console.log(optionsget);
console.log('Do the GET call');

// do the GET request
try{
var reqGet = https.request(optionsget, function(res) {
	console.log("statusCode");
    console.log(res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.log('GET result:\n');
         
        console.log('\n\nCall completed');
    });

});
}
catch(ex){
	console.log(ex);
}
//reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});

//




//make the request object
var request=http.request({
  'host': 'obscure-stream-93442.herokuapp.com',
  'port': 3000,
  'path': '/getRepData',
  'method': 'GET'
});

//assign callbacks
request.on('response', function(response) {
   console.log('Response status code:'+response.statusCode);

   response.on('data', function(data) {
     console.log('Body: '+data);
   });
});*/
    //res.sendFile(__dirname +'/'+'index.html');






