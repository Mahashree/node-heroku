var requireDirectory = require('require-directory');
var chkval = requireDirectory(module, './api');

chkval.save.chkfn();
chkval.Deletejsfile.Delete();
//var chkval = require('./api');
console.log(chkval);
console.log("Hello world");