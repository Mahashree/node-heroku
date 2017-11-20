exports.getPendingOrderDetails = function (repOrderID,redisDatas,isModifyItemCart,isDeleteItemCart,event){
	
		var modules = require('../chatbotmodules.js');
		var client = modules.api.client;
		var productImage = "";
		var productList = [];	
		var startIndexPending = redisDatas.startIndexPending;
		var endIndexPending =  redisDatas.endIndexPending;		
		
		var http = require('http');
		var data = JSON.stringify({
		"getPendingOrdDetl" : {
			 mrktCd : modules.api.mrktCd,
			 devKey : modules.api.devKey,
			 langCd : modules.api.langCd,
			 token : redisDatas.token,
			 userId : redisDatas.userId,
			 acctNr : redisDatas.userId,	
			 version : "4",
			 orderIdList : repOrderID,
			 perfrmGomacValidation : false,
			 startIndex :startIndexPending,
			 endIndex :endIndexPending
		}
		});
		
		var options = modules.api.prepareWSDetails("GETPENDINGITMS",data);
		
		var req = http.request(options, function(res) {		
		var msg = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
		msg += chunk;
		});
		res.on('end', function() {
		  
		var response = JSON.parse(msg).pendingOrdDetlResp;
		var pendingOrderDetl = response.repPendingOrdDetl[0];
		if(response!=='undefined' && response.success && pendingOrderDetl.hasOwnProperty("items")&& pendingOrderDetl.items.length > 0){			
			var items = pendingOrderDetl.items;	
			var indexBaseditemsLen = items.length;		
			var pendingItemsLen = pendingOrderDetl.totalItemCnt; 					
			var orderedItemsImagesRedis = JSON.parse(redisDatas.itemImages);				
			var viewcount= parseInt(redisDatas.viewMoreCount);				
			var itemImagesLen = Object.keys(orderedItemsImagesRedis).length; 				
			var totalQty = pendingOrderDetl.totQty;							
			pendingItemsLen =(pendingItemsLen-(3*viewcount));
			
			if(isModifyItemCart==="true" || isDeleteItemCart ==="true"){	 

				client.hmset(event.sender.id, {
				'isDelOrModifyLineNr':true,
				'isCartEmpty':false									
				});						
				if(pendingItemsLen==1){
					productList.push({
					"title":modules.getMessages.getMessages('orderitems.msg'),				
					"subtitle":modules.getMessages.getMessages('cartitems.msg')						
					});
				}				
				productList.push({
				"title":modules.getMessages.getMessages('title.totalprice')+" = "+pendingOrderDetl.totOrdAmt+" "+modules.getMessages.getMessages('currency.symbol'), 
				"subtitle":modules.getMessages.getMessages('title.noOfItems.added')+" : "+pendingItemsLen+ modules.getMessages.getMessages('title.totalqty')+" : " +totalQty
				});
						
				for(var i=0; i<indexBaseditemsLen; i++){								
					for(var j=0;j<itemImagesLen;j++){

						if(orderedItemsImagesRedis[j].lineNr === items[i].lineNr){									
							productList.push({
							"title":items[i].lineNrDesc,
							"image_url":orderedItemsImagesRedis[j].url,
							"subtitle":items[i].brchrPrcAmt+"* "+items[i].qty+"= "+ items[i].brchrPrcAmt*items[i].qty+" "+modules.getMessages.getMessages('currency.symbol'),	
							"buttons": [
								  {
									"title": modules.getMessages.getMessages('btn.action.Select'),
									"type": "postback",
									"payload":items[i].lineNr
									
								  }
								]
							});							
							break;
						}
					}	
				}
				client.hmset(event.sender.id, {
					'totalPrice':pendingOrderDetl.totOrdAmt															
				});	
				
				var totalPrice=redisDatas.totalPrice;						
				if((pendingItemsLen-indexBaseditemsLen)<=0){						
					message = {
					"attachment": {
						"type": "template",
						"payload": {
						"template_type": "list",
						"elements":productList,
						"top_element_style": "compact"					
							}
					   }};
					modules.sendMessage.sendMessage(event.sender.id, message);	
						
				}else{
					viewcount++;
					client.hmset(event.sender.id, {
						'viewMoreCount':viewcount									
					});	
							
					message = {
					"attachment": {
						"type": "template",
						"payload": {
						"template_type": "list",
						"elements":productList,
						"top_element_style": "compact",
						"buttons": [
							{
							"title": modules.getMessages.getMessages('btn.action.viewmore'),
							 "type": "postback",
							"payload": "viewMoreItemsCart"
							}
						 ]
							}
					   }};
					modules.sendMessage.sendMessage(event.sender.id, message);						 
				}
						
					client.hmset(event.sender.id, {						
						'viewMoreCount':viewcount									
						});							
						
			}else{
				client.hmset(event.sender.id, {						
				'isCartEmpty ':false									
				}); 
				
				if(viewcount == 0){
				modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('msg.cart.products')});	
				}
				if(pendingItemsLen==1){
					productList.push({
					"title":modules.getMessages.getMessages('orderitems.msg'),				
					"subtitle":modules.getMessages.getMessages('cartitems.msg')						
					});
				}
				
				productList.push({
				"title":modules.getMessages.getMessages('title.totalprice')+" = "+pendingOrderDetl.totOrdAmt+" "+modules.getMessages.getMessages('currency.symbol'), 
				"subtitle":modules.getMessages.getMessages('title.noOfItems.added')+" : "+pendingOrderDetl.totalItemCnt+ modules.getMessages.getMessages('title.totalqty')+" : " +totalQty
				});
				
				for(var i=0; i<indexBaseditemsLen; i++){						
					for(var j=0;j<itemImagesLen;j++){
						
						if(orderedItemsImagesRedis[j].lineNr === items[i].lineNr){
							
							productList.push({
							"title":items[i].lineNrDesc,
							"image_url":orderedItemsImagesRedis[j].url,
							"subtitle":items[i].brchrPrcAmt+"* "+items[i].qty+"= "+ items[i].brchrPrcAmt*items[i].qty+" "+"TL",	
							
							});
							
							break;
					   }
					}					
					
				}
				client.hmset(event.sender.id, {
					'totalPrice':pendingOrderDetl.totOrdAmt															
				});	
							
				var totalPrice=redisDatas.totalPrice;
					
				if((pendingItemsLen-indexBaseditemsLen)<=0){
						
					message = {
					"attachment": {
						"type": "template",
						"payload": {
						"template_type": "list",
						"elements":productList,
						"top_element_style": "compact"					
							}
						   }};
					
					modules.sendMessagePromise.sendMessagePromise(event.sender.id, message).then(obj => {
						modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"EXISTORD");
					  }).catch(err => {
							console.log("promise error inside catch showConfirmOrderCartTemplate");
					  });
					
				}else{
						
					viewcount++;
					client.hmset(event.sender.id, {
						'viewMoreCount':viewcount
					});
					message = {
					"attachment": {
						"type": "template",
						"payload": {
						"template_type": "list",
						"elements":productList,
						"top_element_style": "compact",
						"buttons": [
							{
							"title": modules.getMessages.getMessages('btn.action.viewmore'),
							 "type": "postback",
							"payload": "viewMoreItemsCart"
							}
						 ]
							}
						   }};

				modules.sendMessagePromise.sendMessagePromise(event.sender.id, message).then(obj => {
					if(viewcount == 1){
						modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"EXISTORD");
					}  
					  }).catch(err => {
					   console.log("promise error inside catch showConfirmOrderCartTemplate");
					  });
						}
				
			}		
			
		}else{			
				
			client.hmset(event.sender.id, {
				'orderId':'',
				'isCartEmpty ':true	
			}); 

								
			message = {text: "Sorry cart details Not available."}
			if(response.hasOwnProperty("code")&& (response.code=="00"||response.code=="100")){
				message = {text: modules.getMessages.getMessages('msg.cartempty.additem')}
				
				modules.sendMessagePromise.sendMessagePromise(event.sender.id, message).then(obj => {
					modules.showConfirmOrderCartTemplate.showConfirmOrderCartTemplate(event.sender.id,"NEWORD"); 
					  }).catch(err => {
					   console.log("promise error inside catch showConfirmOrderCartTemplate");
					  });
			}
			if(response.hasOwnProperty("code")&& (response.code=="600")){
				modules.resetGlobalVariables.resetGlobalVariables(event,client);
				message = {text: modules.getMessages.getMessages('err.occured')}
				modules.sendMessage.sendMessage(event.sender.id, message);
			}	
		  
		}	

}); 
});
req.write(data);
req.end(); 

}