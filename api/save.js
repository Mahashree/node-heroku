exports.chkfn = function(){
 var requireDir  = require('require-dir');
 var api = requireDir('./api');
 console.log(api.Deletejsfile.Delete());
console.log("inside api save js chkfn ");
}