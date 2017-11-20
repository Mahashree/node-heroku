exports.fbLogin = function (event,redisData) {
var modules = require('../chatbotmodules.js');
var https = require('https');
var request = require('request');
console.log("Inside login1");
var client = modules.api.client;
client.hmset(event.sender.id, {
				'orderId':'',
				'orderedListArrayInputsDB':'""'				
							
	});
		
		var data = JSON.stringify({
		  "facebookLoginVerifyReq":{"version":"1","id":modules.getAccNrWithToken.senderId,"mrktCd":modules.api.mrktCd,"langCd":modules.api.langCd,"devKey":modules.api.devKey}
		});
		
		
	var options = modules.api.prepareWSDetails("VERIFYFBLOGIN",data);		
	var req = https.request(options, function(res) {	
	console.log("inside req");
	console.log("res"+res);	
	var msg ='';
	res.setEncoding('utf8');	
	res.on('data', function(chunk) {
		console.log(chunk);
			msg += chunk;
	});
	console.log(msg);
	
	res.on('end', function() {	
		
		
		if(JSON.parse(msg).facebookLoginVerifyResp && JSON.parse(msg).facebookLoginVerifyResp.success){
			console.log("Inside if login");
			var token=JSON.parse(msg).facebookLoginVerifyResp.token;		
			var userId=JSON.parse(msg).facebookLoginVerifyResp.userId;
				
			client.hmset(event.sender.id, {
			'token':token,
			'userId':userId									
				});				
				
				modules.getRedisInfo.getRedisInfo(event,client).then(users => {
					modules.getRepInfo.getRepInfo(event,users);
				}).catch(err => {
					console.log("promise error inside catch:3");
					console.log(err);
				});
				
		}else{
			
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.auth.user')});
		}
		
		
   }); 
	 }).on('error', function(e){
		 
		modules.getMessages.getMessages('err.auth.user');
		
	});
						
		req.write(data);
		req.end(); 
}