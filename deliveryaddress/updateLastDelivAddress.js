exports.updateLastDelivAddress = function(event,redisData){ 

	var modules = require('../chatbotmodules.js');
	
	var repOrderOrd = redisData.orderId;	
	var data = JSON.stringify({
		"updatedeliveryInfo": {
						"addrLocType":redisData.lastAddrLocTyp ,
						"acctNr": redisData.userId,
						"addr": {
							"addrLine1Txt": encodeURIComponent(redisData.lastdelivAddr),
							"addrLocTyp": redisData.lastAddrLocTyp,
							"cashOnDlvryInd": "N",
							"ordTyp": "REG"
						},
						"version": "1",
						"ordId": repOrderOrd,
						"devKey": modules.api.devKey,
						"langCd": modules.api.langCd,
						"mrktCd": modules.api.mrktCd,
						"dlvryAddrTyp": "Std",
						"userId": redisData.userId,
						"token": redisData.token,
						"ordTyp": "REG"
		}
	});

		
		var options = modules.api.prepareWSDetails("UPDATELASTDELIVADDRESS",data);
		var http = require('http');
		var req = http.request(options, function(res) {
		var msg = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
		msg += chunk;
		});
		res.on('end', function() {
		
		var responseUpdateAddr=JSON.parse(msg);
		if(responseUpdateAddr.hasOwnProperty('updateDeliveryInfoResp')&& responseUpdateAddr.updateDeliveryInfoResp.success){ 
			message = {
				"attachment": {
					"type": "template",
					"payload": {
					"template_type": "button",
					"text": modules.getMessages.getMessages('msg.orderSummary.title')+repOrderOrd+ modules.getMessages.getMessages('totalprice.msg') +redisData.totalPrice,
					"buttons":[{
						"type":"postback",
						"title":modules.getMessages.getMessages('btn.action.Confirm'),
						"payload":"submitOrderDeliv"
								},			
								{
						"type":"postback",
						"title":modules.getMessages.getMessages('btn.action.cancel'),
						"payload":"cancelOrder"
								}
						]
								}
							 }
							
					};
			modules.sendMessage.sendMessage(event.sender.id, message);
		}else{
				
			 if(responseUpdateAddr.hasOwnProperty("code")&& (responseUpdateAddr.code=="600")){
					message = {text: modules.getMessages.getMessages('err.session.expired')}			
					modules.sendMessage.sendMessage(event.sender.id,message);
			}else{
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.occured')});
			}
				
		}
		
		});
		});
		req.write(data);
		req.end();		

}					
		