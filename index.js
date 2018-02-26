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
});
	

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



*/



