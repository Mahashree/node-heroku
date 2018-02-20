
var http = require('http');  
http.createServer(function(req, res) {  
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.write('<!DOCTYPE html>
<html>
<title>Web view</title>
<body>
<h2>Hello Mahashree!!</h2>
<script>

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'Messenger'));

</script>
</body>
</html>');
  res.end();
}).listen(8888, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8888');




