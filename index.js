﻿
<!DOCTYPE html>
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
</html>
