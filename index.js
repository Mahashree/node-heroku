
var http = require('http');  
http.createServer(function(req, res) {  
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write('<!DOCTYPE html>\n<html>\n<title>Web view</title>\n'+
'\n<body>\n<h2>Hello Mahashree!!</h2>\n'+
'\n<script>\n(function(d, s, id){'+
  '\nvar js, fjs = d.getElementsByTagName(s)[0];'+
  '\nif (d.getElementById(id)) {return;}'+
 '\n js = d.createElement(s); js.id = id;'+
  '\njs.src = "//connect.facebook.com/en_US/messenger.Extensions.js";'+
  '\nfjs.parentNode.insertBefore(js, fjs);'+
'\n}(document, '+'script'+', '+'Messenger'+'));'+

'\n</script>\n'+
'\n</body>'+
'\n</html>');
  res.end();
}).listen(3000, 'localhost');
console.log('Server running at http://127.0.0.1:8888');


