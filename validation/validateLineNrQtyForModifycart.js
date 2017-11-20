
exports.validateLineNrQtyForModifycart = function(event,delOrModifyLineNr,modifyqty,redisDatas){
	console.log("Inside validateLineNrQtyForModifycart function");
	var modules = require('../chatbotmodules.js');	
	var client = modules.api.client;
    return new Promise((resolve, reject) => {
	 
        var modifyReqItems = [];
		var http = require('http');
		modifyReqItems.push( {  
					"itemCampaignYear":redisDatas.campaignYr,
					"qty":modifyqty,
					"lineNr":delOrModifyLineNr,
					"itemCampaignNr":redisDatas.campaign
					}
				  );
		var data = JSON.stringify({
			"validateitem":{
				"orderCampaignYear": redisDatas.campaignYr, 
				"orderCampaignNr": redisDatas.campaign, 
				"acctNr": redisDatas.userId, 
				"mrktCd": modules.api.mrktCd,
				"langCd" : modules.api.langCd,
				"token": redisDatas.token,
				"version": "1",
				"devKey":modules.api.devKey,
				"userId":redisDatas.userId,
				"items":modifyReqItems
		} 
		});

		console.log(data);
		var options = modules.api.prepareWSDetails("VALIDATELINENRQTY",data);
		console.log(options);	
		var req = http.request(options, function(res) {
		var msg = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
		msg += chunk;
		});
		res.on('end', function() {
			var itemsList = JSON.parse(msg).itemvalidation.items;
			itemsList=(typeof itemsList === 'undefined')?[]:itemsList;			
			if(itemsList[0].validItem){					
				var isValidLineNrQty = true;	
				client.hmset(event.sender.id, {
					'isValidLineNrQty':true
					}); 	
				return resolve(isValidLineNrQty);					
			}else{
				if(itemsList[0].errors[0].errCd === '000136'){	
				 client.hmset(event.sender.id, {
						'qtyEntered':true,
						'searchProduct':false,
						'isModifyItem':true
						 
					});  
					var errDesc = modules.getErrDescription.getErrDescription(itemsList[0].errors[0].errCd);				
					modules.sendMessage.sendMessage(event.sender.id,{text:errDesc}); 
											  

				}else{
					var errDesc = modules.getErrDescription.getErrDescription(itemsList[0].errors[0].errCd);				
					modules.sendMessage.sendMessage(event.sender.id,{text:errDesc});				
					
					client.hmset(event.sender.id, {			
						'viewMoreCount':0,
						'startIndexPending':0,
						'endIndexPending':3		 
			
					});
			
					modules.getRedisInfo.getRedisInfo(event,client).then(validateObj => {							
							
						modules.getPendingOrderDetails.getPendingOrderDetails(validateObj.orderId,validateObj,"false","false",event);	

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
			 })			 
}