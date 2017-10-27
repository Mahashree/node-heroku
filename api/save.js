exports.chkfn = function(){
 //var requireDir  = require('require-dir');
 var fs = require('fs');
 console.log(fs.readdirSync('api',{}));
 console.log(fs.statSync('./api'));
 //var Deletejsfile = require('Deletejsfile.js');
 //console.log(Deletejsfile);
 //console.log(Deletejsfile.Delete());
console.log("inside api save js chkfn ");
}