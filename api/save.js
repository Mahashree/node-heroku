exports.getMsg = function(){
	var modules = require('./test.js');
	
	console.log("inside api getMsg Function1 ");
	modules.order1.getOrder();
 //var requireDir  = require('require-dir');
 /*var fs = require('fs');
 console.log(fs.readdirSync('api',{}));
 console.log(fs.statSync('./api'));*/
 //var Deletejsfile = require('Deletejsfile.js');
 //var routedel = route.Deletejsfile;
 //console.log("Step1");
 //console.log(routedel);
 //console.log("Step2");
 //console.log(Deletejsfile.Delete());

}