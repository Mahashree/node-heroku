exports.updateDefaultAddress = function(event,redisData){
	
	var modules = require('../module.js');
	
	var data = JSON.stringify({
			"updatedeliveryInfo": {
							"addrLocType":redisData.defaultAddrLocTyp ,
							"acctNr": redisData.userId,
							"addr": {
											"addrLine1Txt": redisData.defaultdelivAddr,
											"addrLocTyp": redisData.defaultAddrLocTyp,
											"cashOnDlvryInd": "N",
											"ordTyp": "REG"
							},
							"version": "1",
							"ordId": redisData.orderId,
							"devKey": modules.api.devKey,
							"langCd": modules.api.langCd,
							"mrktCd": modules.api.mrktCd,
							"dlvryAddrTyp": "Std",
							"userId": redisData.userId,
							"token": redisData.token,
							"ordTyp": "REG"
			}
		});

			var options = modules.api.prepareWSDetails("UPDATEDEFAULTDELIVADDRESS",data);
			var http = require('http');
			var req = http.request(options, function(res) {
			var msg = '';
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
			msg += chunk;
			});
			res.on('end', function() {
			
			message = {
				"attachment": {
					"type": "template",
					"payload": {
					"template_type": "button",
					"text": modules.getMessages.getMessages(msg.orderSummary.title)+repOrderOrd+ modules.getMessages.getMessages(totalprice.msg) +redisData.totalPrice,
					"buttons":[{
						"type":"postback",
						"title":modules.getMessages.getMessages(btn.action.Confirm),
						"payload":"submitOrderDeliv"
								},			
								{
						"type":"postback",
						"title":modules.getMessages.getMessages(btn.action.cancel),
						"payload":"cancelOrder"
								}
						]
								}
							 }
							
					};
			sendMessage(event.sender.id, message);
			
			});
			});
			req.write(data);
			req.end();					
		}