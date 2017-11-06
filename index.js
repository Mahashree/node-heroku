//import module from './module.js';
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var request = require('request');
var session = require('express-session');
var redis = require("redis");
var redisClient = require('redis-connection')();
var redisServer = require('redis-server');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));
app.use(session({secret: 'ssshhhhh'}));

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

console.log("Step 1");
var dataFiles = require('./module.js');
var modules = dataFiles.pathDetails;
console.log("modules");
console.log(modules);
console.log("Step 2");
console.log(modules.api);
console.log("Step 3");
var client = redis.createClient(modules.api.redisPort,api.redisUrl, {auth_pass: modules.api.redisAuth_pass, tls: {servername: modules.api.redisServername}});

//var PropertiesReader = require('properties-reader');
//var properties = PropertiesReader('fbbot-tr-properties.properties');
var errProperties = PropertiesReader('fbbot-tr-errProperties.properties');





// handler receiving messages
app.post('/webhook', function (req, res) {
	
		sess = req.session;
			
		
    var events = req.body.entry[0].messaging;	 

    for (i = 0; i < events.length; i++) {
		var event = events[i];	
		var redisData;
		var redisInfo;
				
		function getRedisInfo () {
		  return new Promise((resolve, reject) => {
			client.hgetall(event.sender.id, function(err, obj) {
					redisData = obj;
						  if (err) {
				// Reject the Promise with an error
				return reject(err);
			  }

			  // Resolve (or fulfill) the promise with data
			  return resolve(obj);
				});
		  })
		}

// Usage:
getRedisInfo().then(users => {
	
	if(event.message && event.message.text) {
		
	var	emojiCheckInt=parseInt(redisData.emojipatternchk);
	modules.emojiCheck.emojiCheck(emojiCheckInt,event);
	
	if(emojiCheckInt > 0){
	sendMessage(event.sender.id, {text:modules.getMessages.getMessages(err.emoji)});
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
				'isDeleteItem':false,
				
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
			
			if (regex.test(searchKeyWord) !== false) {			
			getRedisInfo().then(users => { 
				modules.getProductDetails.getProductDetails(event,users);	
		}).catch(err => {
			   console.log("promise error inside catch:");
			   console.log(err);
			  });
				
				
			}else{
				message = {text:modules.getMessages.getMessages(msg.searchprduct.description)}
			   sendMessage(event.sender.id, message);
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
										"title":modules.getMessages.getMessages(msg.NaNqty.title),
										
										"buttons": [{
											"type": "postback",
											"payload": "qtyEnteredSearchProduct",
											"title": modules.getMessages.getMessages(btn.action.ok)
											}]      
										}]
								}
							}
						};	
				sendMessage(event.sender.id, message);	
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
								 	 
				 sendMessage(event.sender.id, {text:modules.getMessages.getMessages(msg.NaNqty.title)});
		
				
				
		}else{
										
						
			modules.validateLineNrQtyForModifycart.validateLineNrQtyForModifycart(event,redisData.delOrModifyLineNr,modifyqty,redisData)
			  .then(obj => {
				
				if(obj===true){
					
					modules.modifyIemByLineNumber.modifyIemByLineNumber(event,redisData.delOrModifyLineNr,modifyqty,redisData);
				
				}else{
					 sendMessage(event.sender.id, {text:modules.getMessages.getMessages(msg.NaNqty.title)});
			
				}
			  	})
			
		}
		
	}else  {
		
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.unknowntext)});
        
    }
	
}
if(event.postback){	
		
		
	var payloadText = JSON.stringify(event.postback.payload);
		
	if(payloadText === "\"Welcome to Avon\""){		
		var firstName = "";		
					
		var contactUsUrl =properties.get('fbbot.contactUsUrl');			
		var imageUrl = properties.get('fbbot.imageUrl');			
		var https = require('https');									
		var qsObj = "access_token="+properties.get('fbbot.common.tr.accesstoken');					
					
					
		var options = {
			host: properties.get('fbbot.fbgraph.host'),
			port: properties.get('fbbot.fbgraph.port'),
			path: '/v2.6/'+event.sender.id+'?'+qsObj,
			method: properties.get('fbbot.fbgraph.method'),
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
							"title": modules.getMessages.getMessages(hi.msg)+" "+firstName+","+modules.getMessages.getMessages(welcome.titleMsg),
							"subtitle": "",
							"image_url": imageUrl ,
							"buttons": [{
								"type": "postback",
								"title": "Place an order",
								"payload": modules.getMessages.getMessages(btn.placeorder),
							},{
								"type": "web_url",
								"url": contactUsUrl,
								"title": modules.getMessages.getMessages(btn.contactus),
							}]
						}]
					}
				}
			};
			sendMessage(event.sender.id, message);									

			}); 
		});			
		req.end();
           
	}else if(payloadText === "\"startOrder\""){
		resetGlobalVariables(event);		
		modules.getAccNrWithToken.getAccNrWithToken(event);	
		
	}else if(redisData.orderSubmitFlag==="true"){
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(err.aftr.ordersubmit.selectoption)});
		
	}else if(payloadText === "\"confirmQty\""){ 	
		
		 client.hmset(event.sender.id, {
			'startIndexPending':0,
			'endIndexPending':3						
									
		}); 
		 var  orderedListRedisInputsDB = JSON.parse(redisData.orderedListArrayInputsDB);
		 var repOrderOrd = redisData.orderId;
		
			var orderedCartItemsLen = Object.keys(orderedListRedisInputsDB).length; 
			if(orderedCartItemsLen > 0){
				//Save Order	
				modules.saveRepOrder.saveRepOrder(event,redisData);							
			}
     
	}else if(payloadText === "\"lineNrWithQtySearch\""){
		if(redisData.orderConfirmedFlag==="true"){
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(err.aftr.orderconfirm.addproduct)});
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
			   
        sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.lineNr.description)});	
		}	
	}else if(payloadText === "\"addmoreitems\""){
		
		if(redisData.orderConfirmedFlag==="true"){
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(err.aftr.orderconfirm.addmore)});	
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
					"title": modules.getMessages.getMessages(addproduct.title),
					"subtitle":modules.getMessages.getMessages(campaign.subtitle.msg)+campaign,
					"buttons": [{
						"type": "postback",
						"payload": "lineNrWithQtySearch",
						"title": modules.getMessages.getMessages(btn.enter.lineNr)
						},
						{
						"type": "postback",
						"payload": "productDescSearch",
						"title": modules.getMessages.getMessages(btn.searchproduct)
							}]
					}]
				}
			}
		};
		sendMessage(event.sender.id, message);
		}
	}else if(payloadText === "\"productDescSearch\""){
	
		if(redisData.orderConfirmedFlag==="true"){
		sendMessage(event.sender.id, {text:modules.getMessages.getMessages(err.aftr.orderconfirm.searchproduct)});	
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
		
		
			
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.enterproduct.description)});
		}
		
           	
	}else if(payloadText === "\"viewMoreItemsCart\""){ 
		
			
			var startIndexVal =  parseInt(redisData.endIndexPending)+1;
			var endIndexVal =  startIndexVal+2;
			
			
			 client.hmset(event.sender.id, {
				'startIndexPending':startIndexVal,
				'endIndexPending': endIndexVal										
				}); 
			
			
			
			getRedisInfo().then(users => { //PMS
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
			
			modules.sendMessagePromise.sendMessagePromise(event.sender.id, {text: modules.getMessages.getMessages(msg.cartempty.additem)}).then(obj => {
				modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD");
			  }).catch(err => {
			   console.log("promise error inside showConfirmOrderCartTemplate6");
			  });			
		}else{
			sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.delivaddress.selection)});
			modules.getdelivryaddr.getdelivryaddr(event,redisData);
		}
		
		
	}else if(payloadText === "\"LASTDELIVADDR\"" || payloadText === "\"DEFAULTADDR\"" ){
			var repOrderOrd = redisData.orderId;
			if(payloadText === "\"LASTDELIVADDR\""){
					modules.updateLastDelivAddress.updateLastDelivAddress(event,redisData);
			}
			if(payloadText === "\"DEFAULTADDR\""){
					modules.updateDefaultAddress.updateDefaultAddress(event,redisData);	
			}
			
	}else if(redisData.isModifyItem ==="true" && redisData.isDelOrModifyLineNr==="true" ){ 	
		
		 var delOrModifyLineNr = payloadText.replace(/[^a-zA-Z0-9 ]/g, "");
		 
	   client.hmset(event.sender.id, {
			'qtyEntered':true,
			'delOrModifyLineNr':delOrModifyLineNr,
			'isDeleteItem':false,
			'lineNrWithQtyFlag':false
		}); 		 
		
		 sendMessage(event.sender.id, {text:modules.getMessages.getMessages( msg.updateQty)});
		
		
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
         sendMessage(event.sender.id, {text: modules.getMessages.getMessages( msg.Enterqty)});	
			 
	}else if(payloadText === "\"submitOrderDeliv\""){
		
		client.hmset(event.sender.id, {
							'orderSubmitFlag':true,
							'smartClick':true
						});
		
		getRedisInfo().then(users => { //PMS
				if(users.smartClick ==="true"){
					sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.request.Status)});
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
		getRedisInfo().then(users => { //PMS
				modules.getProductDetails.getProductDetailsgetProductDetails(event,users);	
		}).catch(err => {
			   console.log("promise error inside catch:");
			   console.log(err);
			  });
		 
				
	}else if(payloadText === "\"modifyCart\""){		
		
		var repOrderOrd = redisData.orderId;
		 	
		
			if(repOrderOrd === "" || repOrderOrd === " " || redisData.isCartEmpty==="true"){
				
					sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.cartempty.neword)});
				}
			}else{
			
				message = {
					"attachment": {
						"type": "template",
						"payload": {
							"template_type": "generic",
							"elements": [{
								"title": modules.getMessages.getMessages(msg.For.selectoption),
								"buttons": [{
									"type": "postback",
									"title": modules.getMessages.getMessages(btn.modifyItem),
									 "payload": "modifyItem",
									}, {
									"type": "postback",
									"title": modules.getMessages.getMessages(btn.deleteItem),
									"payload": "deleteItem"
								}]
							}]
						}
					}
				}; 
				sendMessage(event.sender.id, message);
			}	
		
		
	}else if(payloadText === "\"modifyItem\""){
	    if(redisData.isCartEmpty==="true"){
			sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.cartempty.additem)});
			modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD");			
		}else{	
			client.hmset(event.sender.id, {
				'isModifyItem':true,
				'isDeleteItem':false,
				'viewMoreCount':0,
				'startIndexPending':0,
				'endIndexPending':3	
				}); 
				
			
			
			getRedisInfo().then(users => { //PMS
				modules.getPendingOrderDetails.getPendingOrderDetails(users.orderId,users,"true","false",event);	

			 }).catch(err => {
			   console.log("promise error inside catch:");
			   console.log(err);
			  });
		
		}			
	}else if(payloadText === "\"deleteItem\""){
		 if(redisData.isCartEmpty==="true"){
			sendMessage(event.sender.id, {text:modules.getMessages.getMessages(msg.cartempty.additem) });
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
			
				
			
			getRedisInfo().then(users => { //PMS
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
         sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.modifyQty)});	
			
	}else if(payloadText === "\"viewOrderPersistentMenu\""){
		var repOrderOrd = redisData.orderId;
		if(repOrderOrd === "" || repOrderOrd === " " || redisData.isCartEmpty ==="true"){
			sendMessage(event.sender.id, {text:modules.getMessages.getMessages(msg.cartempty.neword) });

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
		'isDeleteItem':false,	
		
		});
		
		var product = stripAlphaChars(payloadText);		
		var productArray = payloadText.toString().split("|");		
		var lineNumber = stripAlphaChars(productArray[0]).trim();
		client.hmset(event.sender.id, {
			'lineNumber':lineNumber																		
		});
		productImage = productArray[1].toString();
		productDescription = productArray[2].toString();
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.Enterqty)});		
	}else{
		sendMessage(event.sender.id, {text: modules.getMessages.getMessages(msg.unknowntext)});
		
	}	
  }).catch(err => {
   console.log("promise error inside catch:2");
   console.log(err);
  });

   
    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {
	console.log('message: ', message);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
		console.log('message sent successfully');
    });
};

function stripAlphaChars(source) { 
  var out = source.replace(/[^0-9]/g, '');
  return out; 
} 

function isEmpty(data){
	var value = (data)?data.trim():"";
	return value;
}

function resetGlobalVariables(event){	

	var testArray = ["1","2"];	
	var testArrarString = JSON.stringify(testArray);
	console.log("client:"+client);
	client.on('connect', function() {
		console.log('Connected to Redis');
	});
	client.on("error", function (err) {
		console.log("RedisError first" + err);
	});
	client.hmset(event.sender.id, {
		'redistest':'redistest',
		'searchProduct':false,
		'lineNrWithQtyFlag':false,
		'qtyEntered':false,
		'addToCart':false,
		'orderId': '',
		'lineNumber':'',
		'productsArray':'',
		'orderedListArrayInputsDB':'""',
		'itemImages':'""',		
		'delOrModifyLineNr':'',  
		'isDelOrModifyLineNr':false,
		'isDeleteItem':false,
		'isModifyItem' :false,
		'isCartEmpty':true,	
        'isValidLineNrQty':false,
		'viewMoreCount':0,
		'startIndexPending':0,
		'endIndexPending':3, 
		'orderConfirmedFlag':false,
		'startIndex':1,
		'endIndex':5,
		'orderSubmitFlag':false,
		'patternmatch':0,
		'patternmismatch':0,
		'totalPrice':0,
		'token':'',
		'userId':'',
		'campaign':'',
		'campaignYr':'',
		'defaultdelivAddr':'',
		'defaultAddrLocTyp':'',
		'lastdelivAddr':'',
		'lastAddrLocTyp':'',
		'smartClick':false,
		'searchKeyWord':'',
		'testArray' : testArrarString
	});		
	client.hget(event.sender.id, "testArray", function (err, obj) {
		console.log("inside redis :"+obj);
	});	

	 
};

