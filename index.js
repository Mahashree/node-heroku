var requireDirectory = require('require-directory');
exports.api1 = requireDirectory(module,'./api');
//var requireDir = require('require-dir');

//exports.route = require('require-dir')('./api');
console.log(api1);
console.log(api1.save.chkfn());