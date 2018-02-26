var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	
    res.sendFile(__dirname +'/'+'index.html');
});

/*app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send(name + ' Submitted Successfully!');
});*/

var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Node server is running***');
});


var http=require('https');

//make the request object
var request=http.request({
  'host': 'https://obscure-stream-93442.herokuapp.com',
  'port': process.env.PORT,
  'path': '/getRepData',
  'method': 'GET'
});

//assign callbacks
request.on('response', function(response) {
   console.log('Response status code:'+response.statusCode);

   response.on('data', function(data) {
     console.log('Body: '+data);
   });
});