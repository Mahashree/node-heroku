var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Node server is running***');
});
app.get('/', function (req, res) {


	
var https=require('https');

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
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.log('GET result:\n');
         
        console.log('\n\nCall completed');
    });

});

/*//reqGet.end();
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
    res.sendFile(__dirname +'/'+'index.html');
});

/*app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send(name + ' Submitted Successfully!');
});*/



