exports.fbLogin = function (event) { 

var modules = require('../module.js');	

client.hmset(event.sender.id, {
				'orderId':'',
				'orderedListArrayInputsDB':'""'				
							
	}); 		


var http = require('http');
	var data = JSON.stringify({
	  "facebookLoginVerifyReq":{"version":"1","id":modules.getAccNrWithToken.senderId,"mrktCd":modules.api.mrktCd,"langCd":modules.api.langCd,"devKey":modules.api.devKey}
	});
						
	var options = modules.api.prepareWSDetails("VERIFYFBLOGIN",data);	
	var req = http.request(options, function(res) {		 
	var msg = '';

	res.setEncoding('utf8');
	  res.on('data', function(chunk) {
		msg += chunk;
	});
	res.on('end', function() {
		
	if(JSON.parse(msg).facebookLoginVerifyResp && JSON.parse(msg).facebookLoginVerifyResp.success){
		
		var token=JSON.parse(msg).facebookLoginVerifyResp.token;		
		var userId=JSON.parse(msg).facebookLoginVerifyResp.userId;
			
		client.hmset(event.sender.id, {
		'token':token,
		'userId':userId									
			});
			//Get Rep Information
			modules.getRepInfo.getRepInfo(event,redisData);
		}else{
			sendMessage(event.sender.id, {text: modules.getMessages.getMessages(err.auth.user)});
		}
		 }); 
	 }).on('error', function(e){
						modules.getMessages.getMessages(err.auth.user)});
					});
					
		req.write(data);
		req.end(); 
}