
exports.validateLineNrQtyForModifycart = function(event,delOrModifyLineNr,modifyqty,redisDatas){
	var modules = require('../module.js');	
		
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

				
		var options = modules.api.prepareWSDetails("VALIDATELINENRQTY",data);
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
					message = {text: "Its demo Product and the qty entered exceeds demo limit.So Please  enter valid  qty to add item in your cart."};
					sendMessage(event.sender.id, message);							  

				}else{
				var errDesc = modules.getErrDescription.getErrDescription(itemsList[0].errors[0].errCd);				
				sendMessage(event.sender.id,{text:errDesc});
				sendMessage(event.sender.id,{text:"Unable to update the qty"});
				getPendingOrderDetails(repOrderOrd,redisDatas,"false","false",event);	

				}
			}
		     
		}); 
				});
				req.write(data);				
				req.end();				 
			 })			 
}