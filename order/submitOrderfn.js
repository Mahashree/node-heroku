exports.submitOrderfn = function (event,redisData){
	var modules = require('../chatbotmodules.js');	 
	var repOrderID = redisData.orderId;	
	var http = require('http');					
	var data = JSON.stringify({
	  "order": {
		"emailAddrTxt": "",
		"acctNr": redisData.userId,
		"mrktCd": modules.api.mrktCd,
		"ordTyp": "REG",
		"langCd": modules.api.langCd,
		"version": "2",
		"orderCampaignNr": redisData.campaign,
		"orderCampaignYear": redisData.campaignYr,
		"orderId": repOrderID,
		"userId": redisData.userId,
		"devKey": modules.api.devKey,
		"token": redisData.token
	  }
	});	
	var options = modules.api.prepareWSDetails("SUBMITREPORDER",data);		
	var req = http.request(options, function(res) {
	var msg = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		msg += chunk;
	});       
	res.on('end', function() {									
			var response = JSON.parse(msg);
			var responseStatus = response.order.success; 					
			if(responseStatus){                			
				modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('msg.order.success')+ redisData.orderId});
			}else{	
				if(response.order.hasOwnProperty("code")&& (response.order.code=="600")){
					modules.resetGlobalVariables.resetGlobalVariables(event,client);
					message = {text: modules.getMessages.getMessages('err.session.expired')}					
					modules.sendMessage.sendMessage(event.sender.id, message);
				}else{
					modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.submitorder.status')});
				}	
			}		 
	  }); 
	});

	req.write(data);
	req.end();
}

