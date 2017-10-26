var requireDirectory = require('require-directory');
var chkval = requireDirectory(module, './api');
var order = requireDirectory(module, './order');

//var chkval = require('./api');
//console.log(chkval);
console.log(order.ordertest);
//console.log("Hello world");