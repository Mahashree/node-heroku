//var requireDirectory = require('require-directory');
//var api1 = requireDirectory(module,'./api');
var requireDir = require('require-dir');

//exports.route = require('require-dir')('./api');
var requireDir1 = requireDir('./api');
exports.requireVal = requireDir1;
console.log("Step1");
console.log(requireVal);
console.log(requireVal.save.getMsg());
console.log("Step2");