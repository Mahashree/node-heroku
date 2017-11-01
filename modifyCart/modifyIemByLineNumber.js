exports.modifyIemByLineNumber=function (event,lineNr,qty,redisData){
	
	var modules = require('../module.js');	
		
	var repOrderOrd = redisData.orderId;
	var token = redisData.token;
	var userId = redisData.userId;
	 
	var http = require('http');				
	var data = JSON.stringify({
	  "ModifyOrderReq": {
		"userId": redisData.userId,
		"acctNr": redisData.userId,
		"langCd": modules.api.langCd,
		"mrktCd": modules.api.mrktCd,
		"version": "1",
		 "token": redisData.token,
		"devKey": modules.api.devKey,
		"qty": qty,
		"lineNr": lineNr,
		"orderId":repOrderOrd
	  }
	});	
			
			                  
	var options = modules.api.prepareWSDetails("MODIFYITEM",data);
	var req = http.request(options, function(res) {
	var msg = '';

	res.setEncoding('utf8');
	  res.on('data', function(chunk) {
		msg += chunk;
	  });
	res.on('end', function() {
		
	var responseModifyItem = JSON.parse(msg).order;
		
	if(responseModifyItem!='undefined' && responseModifyItem.success &&!responseModifyItem.hasOwnProperty("errors")){
		client.hmset(event.sender.id, {
			'isModifyItem':false,		 
			'qtyEntered':false
		});
			
		modules.getRedisDetails.getRedisDetails(event).then(users => { 
							
			modules.getPendingOrderDetails.getPendingOrderDetails(repOrderOrd,users,"false","false",event);	

		}).catch(err => {
			   console.log("promise error inside catch:");
			   console.log(err);
		});						
						
	}else{ 
		client.hmset(event.sender.id, {
		'isModifyItem':false			 
		
		});	
		if(responseModifyItem.hasOwnProperty("code")&& (responseModifyItem.code=="600")){
				orders.resetGlobalVariables.resetGlobalVariables(event);
				message = {text: modules.getMessages.getMessages(err.session.expired)}					
				sendMessage(event.sender.id, message);
		}else{
			message = {text: modules.getMessages.getMessages(err.msg.modify.status)};											
			sendMessage(event.sender.id, message);
			
			modules.getRedisDetails.getRedisDetails(event).then(users => { 					
				modules.getPendingOrderDetails.getPendingOrderDetails(repOrderOrd,users,"false","false",event);	
			}).catch(err => {
						   console.log("promise error inside catch:");
						   console.log(err);
			});		
			
		}		
			
	}					
			  }); 
			});

			req.write(data);
			req.end(); 					 

 }