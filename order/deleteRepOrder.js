exports.deleteRepOrder = function (event,redisDatas){	
	var modules = require('../chatbotmodules.js');
	var client = modules.api.client;
	client.hmset(event.sender.id, {
			'orderSubmitFlag':true									
		});
	
	var data = JSON.stringify({
		"deleteRepOrder" : {                   
		"mrktCd": modules.api.mrktCd,
		"acctNr": redisDatas.userId,
		"userId": redisDatas.userId,
		"version": "2",
		"devKey": modules.api.devKey,
		"token": redisDatas.token,
		"orderId": redisDatas.orderId,
		"langCd": modules.api.langCd
	}
	});

	var http = require('http');		
	var options = modules.api.prepareWSDetails("DELETEREPORDER",data); 		
	
	var req = http.request(options, function(res) {
		var msg = '';

		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			msg += chunk;
		  });       
		res.on('end', function() {							
			var response = JSON.parse(msg); 
			if(response!=='undefined'&& response.orders.hasOwnProperty("success") && response.orders.success){					
				modules.resetGlobalVariables.resetGlobalVariables(event,client);
				modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.delete.success')});
			}else{	
						
				if(response.orders.hasOwnProperty("code") && (response.orders.code =='600')){
					modules.resetGlobalVariables.resetGlobalVariables(event,client);
					message = {text: modules.getMessages.getMessages('err.session.expired')}
					modules.sendMessage.sendMessage(event.sender.id, message);				
				}else{
					
					message = {text: modules.getMessages.getMessages('err.deleteorder')}
					modules.sendMessage.sendMessage(event.sender.id, message);
				}	
			}
					
		 
		}); 
	});

	req.write(data);
	req.end();
				
}