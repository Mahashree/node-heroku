var requireDirectory = require('require-directory');
var api = requireDirectory(module,'./api');
//var requireDir = require('require-dir');

exports.route = require('require-dir')('./api');
console.log(route);
console.log(api.save.chkfn());