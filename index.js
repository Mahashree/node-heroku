var requireDirectory = require('require-directory');
var chkval = requireDirectory(module, './api');
var order = require('/../order');
//console.log(module);
//var chkval = require('./api');
console.log(chkval);
console.log(order);
//console.log("Hello world");