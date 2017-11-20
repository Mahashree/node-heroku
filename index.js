var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));
app.use(session({secret: 'ssshhhhh'}));
var http = require('http');
var https = require('https');
var request = require('request');
var session = require('express-session');
var XRegExp = require('xregexp');
/*
var logger = require('./util/logger');
const appInsights = require("applicationinsights");
appInsights.setup("a12c9fe7-387f-4e6b-843c-0bfc6ea80b9b");
appInsights.start();*/

var propertiesParse = require('properties-parser');
var properties = propertiesParse.read('./config/fbbot-tr.properties');
var modules = require('./chatbotmodules.js');
var client = modules.api.client;
var sess;



// Server frontpage
app.get('/', function (req, res) {
		
	sess = req.session;
	sess.test="false";
    res.send('This is TestBot Server new');
});
 
// Facebook Webhook
app.get('/webhook', function (req, res) {
	
    if (req.query['hub.verify_token'] === 'verify_me') {
        res.send(req.query['hub.challenge']);
    } else {
      
		res.send(req.query['hub.challenge']);
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {	
		sess = req.session;		
		
    var events = req.body.entry[0].messaging;	 
	var eventsLen = events.length;
    for (i = 0; i < eventsLen; i++) {
		var event = events[i];   
		

// Usage:
modules.getRedisInfo.getRedisInfo(event,client).then(redisData => { 
	  
	if(event.message && event.message.text) {		
		
		var	emojiCheckInt=parseInt(redisData.emojipatternchk);
		modules.emojiCheck.emojiCheck(emojiCheckInt,event);
		
		if(emojiCheckInt > 0){
		modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('err.emoji')});
		client.hmset(event.sender.id, {
				'emojipatternchk':0									
			});
		
		}else if(redisData.lineNrWithQtyFlag === "true"){
							
		   client.hmset(event.sender.id, {
				'isModifyItem':false,
				'searchProduct':false,
				'startIndexPending':0,
				'endIndexPending':3,
				'isModifyItem':false,
				'isDeleteItem':false
				
			});		
		    var orderedItemsArray = event.message.text.trim().replace(/\n\s*\n/g, '\n').replace(/ +/g, ' ').replace(/\t+/g, "").split(/[\n-]+/);
		    modules.validateRepOrders.validateRepOrders(orderedItemsArray,redisData,event); 
				
		}else if(redisData.searchProduct ==="true"  && redisData.isModifyItem ==="false"){			
				
				var searchKeyWord = event.message.text.trim().replace(/\s\s+/g, ' ');
				
				client.hmset(event.sender.id, {
						'lineNrWithQtyFlag':false,
						'searchKeyWord':searchKeyWord
					}); 			
				var regex = /^[a-zA-Z0-9]/; 
				var regex2 = new XRegExp("^\\p{L}*$");       
					
			if(regex.test(searchKeyWord) === true||regex2.test(searchKeyWord) === true) {							
				modules.getRedisInfo.getRedisInfo(event,client).then(users => { 
					modules.getProductDetails.getProductDetails(event,users);	
				}).catch(err => {
				    console.log("promise error inside catch:");
				    console.log(err);
				});
					
					
			}else{
				message = {text:modules.getMessages.getMessages('msg.searchprduct.description')}
				  modules.sendMessage.sendMessage(event.sender.id, message);
			}	
			
		}else if(redisData.qtyEntered  ==="true"&& redisData.isModifyItem ==="false" && event.message.text){ 
			
			client.hmset(event.sender.id, {
				'isDelOrModifyLineNr':false,
				'isModifyItem':false									
			}); 
		
				 if(isNaN(event.message.text)){
					
					   client.hmset(event.sender.id, {
							'qtyEntered':false
						}); 
					message = {
								"attachment": {
									"type": "template",
									"payload": {
										"template_type": "generic",
										"elements": [{
											"title":modules.getMessages.getMessages('msg.NaNqty.title'),
											
											"buttons": [{
												"type": "postback",
												"payload": "qtyEnteredSearchProduct",
												"title": modules.getMessages.getMessages('btn.action.ok')
												}]      
											}]
									}
								}
							};	
					modules.sendMessage.sendMessage(event.sender.id, message);	
				}else{
					
					var redisLineNumber = redisData.lineNumber;
					var ordSearchItemsArray = [];

						ordSearchItemsArray.push({
							"lineNr": redisLineNumber,
							"qty": event.message.text
						});	
						modules.validateRepOrders.validateRepOrders(ordSearchItemsArray,redisData,event);
					
				}
			
		}else if(redisData.qtyEntered==="true" && redisData.searchProduct ==="false"&& redisData.isModifyItem ==="true" && event.message.text){ 
			
			var modifyqty = event.message.text;
			if(isNaN(modifyqty)){
				  
					 
				   client.hmset(event.sender.id, {
						'qtyEntered':true,
						'searchProduct':false,
						'isModifyItem':true,
						'isDelOrModifyLineNr':true
					}); 
										 
					 modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('msg.NaNqty.title')});
			
					
					
			}else{
									
				try{			
				modules.validateLineNrQtyForModifycart.validateLineNrQtyForModifycart(event,redisData.delOrModifyLineNr,modifyqty,redisData)
					.then(obj => {					
					if(obj===true){						
						modules.modifyIemByLineNumber.modifyIemByLineNumber(event,redisData.delOrModifyLineNr,modifyqty,redisData);
					
					}else{
						 modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('msg.NaNqty.title')});
				
					}
				});
				}catch(ex){
					 console.log(ex);
				}
			}//esle
		}else{
			
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.unknowntext')});
			
		}	
}//event.messages
if(event.postback){	
	 console.log("payloadText");			
	var payloadText = JSON.stringify(event.postback.payload);
	console.log(payloadText);	
	if(payloadText === "\"Welcome to Avon\""){
		try{
		console.log("Welcome to Avon");
		var firstName = "";		
					
		var contactUsUrl =properties['fbbot.contactUsUrl'];			
		var imageUrl = properties['fbbot.imageUrl'];			
		var https = require('https');									
		var qsObj = "access_token="+properties['fbbot.common.tr.accesstoken'];					
					
					
		var options = {
			host: properties['fbbot.fbgraph.host'],
			port: properties['fbbot.fbgraph.port'],
			path: '/v2.6/'+event.sender.id+'?'+qsObj,
			method: properties['fbbot.fbgraph.method'],
			headers: {
			'Content-Type': 'application/json; charset=utf-8'
			}
		};
				
		var req = https.request(options, function(res) {
						
		var msg = '';

		res.setEncoding('utf8');
		  res.on('data', function(chunk) {
			msg += chunk;
		  });
		res.on('end', function() {
				 
			firstName = JSON.parse(msg).first_name;		
			
			message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [{
							"title": modules.getMessages.getMessages('hi.msg')+" "+firstName+","+modules.getMessages.getMessages('welcome.titleMsg'),
							"subtitle": "",
							"image_url": imageUrl ,
							"buttons": [{
								"type": "postback",
								"title": modules.getMessages.getMessages('btn.placeorder'),
								"payload":"startOrder",
							},{
								"type": "web_url",
								"url": contactUsUrl,
								"title": modules.getMessages.getMessages('btn.contactus'),
							}]
						}]
					}
				}
			};
			modules.sendMessage.sendMessage(event.sender.id, message);									

			}); 
		});			
		req.end();
		}catch(ex){
			console.log(ex);
		}
		modules.resetGlobalVariables.resetGlobalVariables(event,client);
           
	}else if(payloadText === "\"startOrder\""){
		modules.resetGlobalVariables.resetGlobalVariables(event,client);		
		modules.getAccNrWithToken.getAccNrWithToken(event,redisData);	
		
	}else if(redisData.orderSubmitFlag==="true"){
		modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.aftr.ordersubmit.selectoption')});
		
	}else if(payloadText === "\"confirmQty\""){ 	 //Save Order	
		
		 client.hmset(event.sender.id, {
			'startIndexPending':0,
			'endIndexPending':3						
									
		}); 
		 var  orderedListRedisInputsDB = JSON.parse(redisData.orderedListArrayInputsDB);
		 var repOrderOrd = redisData.orderId;
		
			var orderedCartItemsLen = Object.keys(orderedListRedisInputsDB).length; 
			if(orderedCartItemsLen > 0){
				
				modules.saveRepOrder.saveRepOrder(event,redisData);							
			}
     
	}else if(payloadText === "\"lineNrWithQtySearch\""){
		if(redisData.orderConfirmedFlag==="true"){
		modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.aftr.orderconfirm.addproduct')});
		client.hmset(event.sender.id, {
		'orderConfirmedFlag':false
		});		
		
		}else{
		
		
		client.hmset(event.sender.id, {
		'addToCart':false,
		'lineNrWithQtyFlag':true,
		'qtyEntered':false,
		'searchProduct':false
		}); 
		productsInSession = true;
			   
        modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.lineNr.description')});	
		}	
	}else if(payloadText === "\"addmoreitems\""){
		
			if(redisData.orderConfirmedFlag==="true"){
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.aftr.orderconfirm.addmore')});	
			client.hmset(event.sender.id, {
				'orderConfirmedFlag':false														
					});
			
			}else{
				client.hmset(event.sender.id, {
				'viewMoreCount':0
				}); 
		
				
				message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [{
							"title": modules.getMessages.getMessages('addproduct.title'),
							"subtitle":modules.getMessages.getMessages('campaign.subtitle.msg')+campaign,
							"buttons": [{
								"type": "postback",
								"payload": "lineNrWithQtySearch",
								"title": modules.getMessages.getMessages('btn.enter.lineNr')
								},
								{
								"type": "postback",
								"payload": "productDescSearch",
								"title": modules.getMessages.getMessages('btn.searchproduct')
									}]
							}]
						}
					}
				};
			modules.sendMessage.sendMessage(event.sender.id, message);
		}
		client.hmset(event.sender.id, {				
				'qtyEntered':false
				});
	}else if(payloadText === "\"productDescSearch\""){
	
		if(redisData.orderConfirmedFlag==="true"){
			modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('err.aftr.orderconfirm.searchproduct')});	
			client.hmset(event.sender.id, {
				'orderConfirmedFlag':false
															
			});
		
		}else{
			client.hmset(event.sender.id, {
			'addToCart':false,
			'lineNrWithQtyFlag':false,		
			'searchProduct':true,
			'startIndex':1,
			'endIndex':5
			});
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.enterproduct.description')});
		}
           	
	}else if(payloadText === "\"viewMoreItemsCart\""){ 			
			var startIndexVal =  parseInt(redisData.endIndexPending)+1;
			var endIndexVal =  startIndexVal+2;			
			 client.hmset(event.sender.id, {
				'startIndexPending':startIndexVal,
				'endIndexPending': endIndexVal										
				}); 
			
			modules.getRedisInfo.getRedisInfo(event,client).then(users => {			
				modules.getPendingOrderDetails.getPendingOrderDetails(users.orderId,users,users.isModifyItem,users.isDeleteItem,event);

			 }).catch(err => {
			    console.log("promise error inside catch:");
			    console.log(err);
			  });			
	
   }else if(payloadText === "\"confirmOrderCart\""){
		client.hmset(event.sender.id, {
			'orderConfirmedFlag':true																
		});		
		if(redisData.isCartEmpty==="true"){			
			
			modules.sendMessagePromise.sendMessagePromise(event.sender.id, {text: modules.getMessages.getMessages('msg.cartempty.additem')}).then(obj => {
				modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD");
			  }).catch(err => {
			    console.log("promise error inside showConfirmOrderCartTemplate6");
			  });			
		}else{
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.delivaddress.selection')});
			modules.getdelivryaddr.getdelivryaddr(event,redisData);
		}
		
		
	}else if(payloadText === "\"LASTDELIVADDR\"" || payloadText === "\"DEFAULTADDR\"" ){
			var repOrderOrd = redisData.orderId;
			if(payloadText === "\"LASTDELIVADDR\""){
					modules.updateLastDelivAddress.updateLastDelivAddress(event,redisData);
			}
			if(payloadText === "\"DEFAULTADDR\""){
					modules.updateDefaultAddr.updateDefaultAddr(event,redisData);	
			}
			
	}else if(redisData.isModifyItem ==="true" && redisData.isDelOrModifyLineNr==="true" ){ 	
		
		 var delOrModifyLineNr = payloadText.replace(/[^a-zA-Z0-9 ]/g, "");
		 
	   client.hmset(event.sender.id, {
			'qtyEntered':true,
			'delOrModifyLineNr':delOrModifyLineNr,
			'isDeleteItem':false,
			'lineNrWithQtyFlag':false
		}); 		 
		
		 modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages( 'msg.updateQty')});
		
		
	}else if(redisData.qtyEntered ==="false" && redisData.isDeleteItem ==="true" && redisData.isDelOrModifyLineNr==="true"){ 
		
		var delOrModifyLineNr = payloadText.replace(/[^a-zA-Z0-9 ]/g, "");
		client.hmset(event.sender.id, {			
			'delOrModifyLineNr':delOrModifyLineNr			
		}); 
		
		modules.deleteItemByLineNumber.deleteItemByLineNumber(event,delOrModifyLineNr,redisData);
		
	}else if(payloadText === "\"qtyEnteredSearchProduct\""){		
		
	   client.hmset(event.sender.id, {
			'qtyEntered':true
		}); 
         modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages( 'msg.Enterqty')});	
			 
	}else if(payloadText === "\"submitOrderDeliv\""){
		
		client.hmset(event.sender.id, {
							'orderSubmitFlag':true,
							'smartClick':true
						});
		
		modules.getRedisInfo.getRedisInfo(event,client).then(users => {	
				if(users.smartClick ==="true"){
					modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.request.Status')});
				}
				modules.submitOrderfn.submitOrderfn(event,users);
				client.hmset(event.sender.id, {
							'smartClick':false
						});

			 }).catch(err => {
			    console.log("promise error inside catch:");
			    console.log(err);
			  });	
		
        
	}else if(payloadText === "\"viewMoreProducts\""){
		
		var startIndexval=parseInt(redisData.endIndex)+1;
		var endIndexval=startIndexval+4;
		
		client.hmset(event.sender.id, {
							'startIndex':startIndexval,
							'endIndex':endIndexval									
						});
		modules.getRedisInfo.getRedisInfo(event,client).then(users => {	 
				modules.getProductDetails.getProductDetails(event,users);	
		}).catch(err => {
			    console.log("promise error inside catch:");
			    console.log(err);
			  });
		 
				
	}else if(payloadText === "\"modifyCart\""){		
		
		var repOrderOrd = redisData.orderId;
		
			if(repOrderOrd === "" || repOrderOrd === " " || redisData.isCartEmpty==="true"){
				
					modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.cartempty.neword')});
				
			}else{
			
				message = {
					"attachment": {
						"type": "template",
						"payload": {
							"template_type": "generic",
							"elements": [{
								"title": modules.getMessages.getMessages('msg.For.selectoption'),
								"buttons": [{
									"type": "postback",
									"title": modules.getMessages.getMessages('btn.modifyItem'),
									 "payload": "modifyItem",
									}, {
									"type": "postback",
									"title": modules.getMessages.getMessages('btn.deleteItem'),
									"payload": "deleteItem"
								}]
							}]
						}
					}
				}; 
				modules.sendMessage.sendMessage(event.sender.id, message);
			}	
		
		
	}else if(payloadText === "\"ViewOrderDetails\""){		
		 if(redisData.orderId!=="" || redisData.orderId.length > 0){
			modules.getPendingOrderDetails.getPendingOrderDetails(redisData.orderId,redisData,"false","false",event);		
		 }else{
			 modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.cartempty.additem')});
			 modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD");
		 }	 
		
	}else if(payloadText === "\"modifyItem\""){
	    if(redisData.isCartEmpty==="true"){
			modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.cartempty.additem')});
			modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD");			
		}else{	
			client.hmset(event.sender.id, {
				'isModifyItem':true,
				'isDeleteItem':false,
				'viewMoreCount':0,
				'startIndexPending':0,
				'endIndexPending':3	
				}); 			
			modules.getRedisInfo.getRedisInfo(event,client).then(users => {	
				modules.getPendingOrderDetails.getPendingOrderDetails(users.orderId,users,"true","false",event);	

			 }).catch(err => {
			    console.log("promise error inside catch:");
			    console.log(err);
			  });
		
		}			
	}else if(payloadText === "\"deleteItem\""){
		 if(redisData.isCartEmpty==="true"){
			modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('msg.cartempty.additem') });
			modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD");			
		}else{
			
					
			client.hmset(event.sender.id, {
							'isModifyItem':false,
							'isDeleteItem':true,
							'qtyEntered':false,
							'viewMoreCount':0,
							'startIndexPending':0,
				            'endIndexPending':3
			}); 
			
			modules.getRedisInfo.getRedisInfo(event,client).then(users => {	
				modules.getPendingOrderDetails.getPendingOrderDetails(users.orderId,users,"false","true",event);

			 }).catch(err => {
			    console.log("promise error inside catch:");
			    console.log(err);
			  });			
		}		
	}else if(payloadText === "\"modifyQtyLnr\""){
		 	client.hmset(event.sender.id, {
				'isModifyItem':true,
				'isDelOrModifyLineNr':true
							
			}); 
         modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.modifyQty')});	
			
	}else if(payloadText === "\"viewOrderPersistentMenu\""){
		var repOrderOrd = redisData.orderId;
		if(repOrderOrd === "" || repOrderOrd === " " || redisData.isCartEmpty ==="true"){
			modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('msg.cartempty.neword') });

		}else{			
			
			modules.getPendingOrderDetails.getPendingOrderDetails(redisData.orderId,redisData,redisData.isModifyItem,redisData.isDeleteItem,event);	
         }
			
	}else if(payloadText === "\"cancelOrder\""){
		modules.deleteRepOrder.deleteRepOrder(event,redisData);
		
    }else if(redisData.addToCart==="true"){
			
		client.hmset(event.sender.id, {
		'addToCart':false,			
		'searchProduct':false,
		'qtyEntered':true,		
		'isModifyItem':false,	
		'isDelOrModifyLineNr':false,	
		'isDeleteItem':false		
		});		
		var product = stripAlphaChars(payloadText);		
		var productArray = payloadText.toString().split("|");		
		var lineNumber = stripAlphaChars(productArray[0]).trim();
		client.hmset(event.sender.id, {
			'lineNumber':lineNumber																		
		});
		productImage = productArray[1].toString();
		productDescription = productArray[2].toString();
		modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.Enterqty')});		
		
	}else{
		modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.unknowntext')});
		
	}
	
}
  }).catch(err => {
    console.log("promise error inside catch:2");
    console.log(err);
  });

   
    }
    res.sendStatus(200);
});


function stripAlphaChars(source) { 
  var out = source.replace(/[^0-9]/g, '');
  return out; 
} 

function isEmpty(data){
	var value = (data)?data.trim():"";
	return value;
}

