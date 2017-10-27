var requireDir = require('require-dir');
/*var directory ="";
directory+=__dirname.slice(0,__dirname.lastIndexOf('/'));
console.log(directory);*/

var api = requireDir('./api');
//console.log(require.main.filename);
//var api =apiPath.normalize("..//api");
//var api = require('./api');
api.save.chkfn();
api.Deletejsfile.Delete();
//console.log("idheebjebrf");