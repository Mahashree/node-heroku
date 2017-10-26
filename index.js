var requireDirectory = require('require-directory');
var chkval = requireDirectory(module, './api');


//var chkval = require('./api');
console.log(chkval);
console.log("Hello world");