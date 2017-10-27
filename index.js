//var requireDirectory = require('require-directory');
//var api1 = requireDirectory(module,'./api');
var requireDir = require('require-dir');

//exports.route = require('require-dir')('./api');
//var requireDir = require('./api');
console.log("Step1");
console.log(requireDir);
console.log(requireDir.save.getMsg());
console.log("Step2");