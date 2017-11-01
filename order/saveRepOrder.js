exports.saveRepOrder = function(event,redisData){	

var modules = require('../module.js');	

 client.hmset(event.sender.id, {
	'startIndexPending':0,
	'endIndexPending':3						
							
}); 
var  orderedListRedisInputsDB = JSON.parse(redisData.orderedListArrayInputsDB);
var repOrderOrd = redisData.orderId;

var orderedCartItemsLen = Object.keys(orderedListRedisInputsDB).length; 
if(orderedCartItemsLen > 0){							
			var http = require('http');			
			var newOrd = (repOrderOrd)?false:true;
			var data = JSON.stringify({
						  "order": {
							"userId": redisData.userId,
							"acctNr": redisData.userId,
							"orderCampaignYear": redisData.campaignYr,
							"orderCampaignNr": redisData.campaign,
							"langCd": modules.api.langCd,
							"mrktCd": modules.api.mrktCd,
							"version": "3",
							"token": redisData.token,
							"devKey": modules.api.devKey,
							"newOrd": newOrd,
							"ordSource": "BOT",
							"items": orderedListRedisInputsDB
						  }
						});						
						
						
			var options = api.prepareWSDetails("SAVEREPORDER",data);					
			
			var req = http.request(options, function(res) {
			  var msg = '';
			 res.setEncoding('utf8');
			  res.on('data', function(chunk) {
				msg += chunk;
			  });
			 res.on('end', function() {
												
				var responseSaveRepOrder = JSON.parse(msg).order;
				if(responseSaveRepOrder!=='undefined'&&responseSaveRepOrder.success && !(responseSaveRepOrder.hasOwnProperty("errors"))){
					
					var orderId =(responseSaveRepOrder.hasOwnProperty("orderId"))?responseSaveRepOrder.orderId.toString():"";
													
				   client.hmset(event.sender.id, {
						'qtyEntered':false,
						'orderedListArrayInputsDB':'""',
						'orderId':orderId,
						'searchProduct':false,
						'lineNrWithQtyFlag':false,
						'isCartEmpty':false
					}); 
														
					sendMessage(event.sender.id, {text:modules.getMessages.getMessages(msg.orderrequest.status)});
														
					ordSearchItemsArray = [];									
					modules.getRedisInfo.getRedisInfo().then(users => {
						modules.getPendingOrderDetails.getPendingOrderDetails(orderId,users,"false","false",event);
					 }).catch(err => {
					   console.log("promise error inside catch:3");
					   console.log(err);
					  });
				}else{
					message = "";						
					if(responseSaveRepOrder.hasOwnProperty("errors")){								
						
						if(responseSaveRepOrder.errors[0].errCd === "000136"){
							
							var lineNr = responseSaveRepOrder.errors[0].lineNr;
							message = {text: modules.getMessages.getMessages(err.demo.limit)+lineNr}
							
							sendMessage(event.sender.id, message);
							if(typeof orderId === 'undefined' || orderId === ""){
								
								message = {
								"attachment": {
									"type": "template",
									"payload": {
										"template_type": "generic",
										"elements": [{
											"title": modules.getMessages.getMessages(msg.cartempty.title),
											"subtitle":modules.getMessages.getMessages(campaign.subtitle.msg)+campaign,
											"buttons": [{
												"type": "postback",
												"payload": "lineNrWithQtySearch",
												"title": modules.getMessages.getMessages(lineNr.entry.btn.msg)
												},
												{
												"type": "postback",
												"payload": "productDescSearch",
												"title":  modules.getMessages.getMessages(searchproduct.btn.msg)
												}]
										}]
									}
								}
							};
							sendMessage(event.sender.id, message);
							
							client.hmset(event.sender.id, {
								'orderedListArrayInputsDB':'""'
							});																					
							
							}else{
							modules.getRedisInfo.getRedisInfo().then(users => {
							modules.getPendingOrderDetails.getPendingOrderDetails(orderId,users,"false","false",event);
							}).catch(err => {
							console.log("promise error inside catch:3");
							console.log(err);
							});
							}
							
						}else {
							
							var errDesc = getErrDescription(responseSaveRepOrder.errors[0].errCd );
							message = {text:errDesc};
							sendMessage(event.sender.id, message);
							if(typeof orderId === 'undefined' || orderId === ""){
								message = {
								"attachment": {
									"type": "template",
									"payload": {
										"template_type": "generic",
										"elements": [{
											"title": modules.getMessages.getMessages(msg.cartempty.title),
											"subtitle":modules.getMessages.getMessages(campaign.subtitle.msg)+campaign,
											"buttons": [{
												"type": "postback",
												"payload": "lineNrWithQtySearch",
												"title": modules.getMessages.getMessages(lineNr.entry.btn.msg)
												},
												{
												"type": "postback",
												"payload": "productDescSearch",
												"title": modules.getMessages.getMessages(searchproduct.btn.msg)
												}]
											}]
										}
									}
								};
								sendMessage(event.sender.id, message);
								client.hmset(event.sender.id, {
									'orderedListArrayInputsDB':'""'
								});
							}else{
							modules.getRedisInfo.getRedisInfo().then(users => {
							modules.getPendingOrderDetails.getPendingOrderDetails(orderId,users,"false","false",event);
							}).catch(err => {
							console.log("promise error inside catch:3");
							console.log(err);
							});
							}
						}
					}else{			
						
						if(responseSaveRepOrder.hasOwnProperty("code")&& (responseSaveRepOrder.code=="600")){
							message = {text: modules.getMessages.getMessages(err.session.expired)}			
							sendMessage(event.sender.id,message);
						}
					}
					if(message==="" ||message.length===0){
						message = {text:modules.getMessages.getMessages(err.occured)}										
						sendMessage(event.sender.id,message);
					}
					
				}
			  }); 
			});

		req.write(data);
		req.end();
					
	}

	}
}