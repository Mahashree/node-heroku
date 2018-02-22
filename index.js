var express = require('express');
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	

    res.sendFile(__dirname +'/'+'index.html');
	//res.location('https://smidalms.herokuapp.com/');
	
  /*
  res.set({
  'Content-Type': 'text/plain',  
  'X-Frame-Options': 'ALLOW-FROM https://www.messenger.com/'
});
  
  
  var options = {    
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
		'X-Frame-Options':'ALLOW-FROM https://www.messenger.com/'
    }
  };

  var fileName = __dirname +'/'+'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });

});*/
	
	
	
	
});
app.listen('8080', function() {
  console.log("Node app is running at localhost:" );
});
/*app.post('/submit-student-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send(name + ' Submitted Successfully!');
});*/
