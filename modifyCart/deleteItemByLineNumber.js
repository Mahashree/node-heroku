exports.deleteItemByLineNumber=function (event,delReqLineNr,redisDatas){ 
   
	var modules = require('../chatbotmodules.js');	
	var client = modules.api.client;	
	var repOrderOrd =  redisDatas.orderId;	
	var http = require('http');					
	var data = JSON.stringify({
		  "deleteRepOrder": {
			"userId": redisDatas.userId,
			"acctNr": redisDatas.userId,
			"langCd": modules.api.langCd,
			"mrktCd": modules.api.mrktCd,
			"version": "1",
			 "token": redisDatas.token,
			"devKey": modules.api.devKey,
			"orderId":repOrderOrd,
			"lineNr":delReqLineNr
		  }
		});					
		                  
		var options = modules.api.prepareWSDetails("DELETEITEM",data);
		var req = http.request(options, function(res) {
		var msg = '';

		res.setEncoding('utf8');
		  res.on('data', function(chunk) {
			msg += chunk;
		  });
		res.on('end', function() {
					
		var responseDeleteLineNr = JSON.parse(msg);
		var responseDeleteItem = responseDeleteLineNr.DeleteByLineNrResp;
		if(responseDeleteLineNr!='undefined' && responseDeleteItem.success &&!responseDeleteItem.hasOwnProperty("errors")){	
		
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.productdelete.status')});				
			client.hmset(event.sender.id, {
				'isDelOrModifyLineNr':false,
				'isDeleteItem':false,
				'viewMoreCount':0,
				'startIndexPending':0,
				'endIndexPending':3,				
				'delOrModifyLineNr':''
						
			}); 						
						
			modules.getRedisInfo.getRedisInfo(event,client).then(users => {
				modules.getPendingOrderDetails.getPendingOrderDetails(repOrderOrd,users,"false","false",event);
			 }).catch(err => {
			   console.log("promise error inside catch:");
			   console.log(err);
			  });

							
		}else{
											
			client.hmset(event.sender.id, {
				'isDelOrModifyLineNr':true,
				'isDeleteItem':true		
						
			}); 
			message = {text: modules.getMessages.getMessages('err.occured')}
			
			if(responseDeleteItem.hasOwnProperty("code")&& (responseDeleteItem.code=="600")){
				modules.resetGlobalVariables.resetGlobalVariables(event,client);
				message = {text: modules.getMessages.getMessages('err.session.expired')}					
				
			}					
			modules.sendMessage.sendMessage(event.sender.id, message);
					
		}
					
				  }); 
				});

				req.write(data);
				req.end(); 
						
	  
 }
 
