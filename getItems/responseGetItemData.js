exports.responseGetItemData =function (event,productDetails){
	var modules = require('../chatbotmodules.js');
	var client = modules.api.client;			
	client.hmset(event.sender.id, {
		'productsArray':''
	});
	
	var productsList = [];				
	var productUrl = "";	
	var productDetailsLen = productDetails.lclLineNr.length;	
					
	if(productDetailsLen > 0){	
		if(productDetailsLen > 1){			
			for(var i=0; i<productDetailsLen; i++){
				var getItmLineNumber = productDetails.lclLineNr[i].lineNr;
				var lineNrDesc= productDetails.lclLineNr[i].lclLineNrLang[0].lineNrNm;
				var itemPrice =productDetails.lclLineNr[i].brchrPrcAmt;
			
				productsList.push({
				"title": lineNrDesc+"|"+getItmLineNumber,
				"subtitle": modules.getMessages.getMessages('LineNr.msg')+getItmLineNumber+" "+modules.getMessages.getMessages('itemprice.msg')+ itemPrice,            
				"image_url": productUrl,
				"buttons": [{
					
				  "type": "postback",
				  "title": modules.getMessages.getMessages('btn.action.addTocart'),
				  "payload": getItmLineNumber+"|"+productUrl+"|"+lineNrDesc,					
				}]
				});
			}
							
		}else{						 
								
			client.hmset(event.sender.id, {
			'searchProduct':false
			}); 
			var productImgUrl = ""; 
			var getItmsLineNumber = productDetails.lclLineNr[0].lineNr;								

			productsList.push({
				"title": productDetails.lclLineNr[0].lclLineNrLang[0].lineNrShrtDescTxt+"|"+getItmsLineNumber,
				"subtitle":modules.getMessages.getMessages('LineNr.msg')+getItmsLineNumber+" Item Price:"+productDetails.lclLineNr[0].brchrPrcAmt,           
				"image_url": productImgUrl,
				"buttons": [{
					
				  "type": "postback",
				  "title": modules.getMessages.getMessages('btn.action.addTocart'),
				  "payload": getItmsLineNumber+"|"+productImgUrl+"|"+productDetails.lclLineNr[0].lclLineNrLang[0].lineNrShrtDescTxt,					
				}]
				});
		 
		}
		var serializedArr = JSON.stringify(productsList);
								
		client.hmset(event.sender.id, {
			'searchProduct':false,
			'productsArray':serializedArr
		});
	}else{
		client.hmset(event.sender.id, {
		'searchProduct':true,
		
		}); 
		}
		client.hmset(event.sender.id, {
		'addToCart':true
					});		
					 		
}