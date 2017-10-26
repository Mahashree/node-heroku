var requireDirectory = require('require-directory');
var directory =__dirname.slice(0,__dirname.lastIndexOf('/'))+"/api";

var api = require(directory);
console.log(api);
//var api =apiPath.normalize("..//api");
//var api = require('./api');
api.save.chkfn();
api.Deletejsfile.Delete();
console.log("idheebjebrf");