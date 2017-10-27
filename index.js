var requireDirectory = require('require-directory');
var api = requireDirectory(module,'./api');

//chkval.exports = require('./api')();
console.log(api.save);