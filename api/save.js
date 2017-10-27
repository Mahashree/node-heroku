exports.chkfn = function(){
 var requireDir  = require('require-dir');
 var Deletejsfile = require(requireDir+'/Deletejsfile.js');
 console.log(Deletejsfile);
 console.log(Deletejsfile.Delete());
console.log("inside api save js chkfn ");
}