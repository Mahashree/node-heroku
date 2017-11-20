exports.getProductDetails = function (event,redisData) {	
	var modules = require('../chatbotmodules.js');
	var client = modules.api.client;		
	modules.getItemsData.getItemsData(event,redisData).then(obj => {
		if(modules.getItemsData.getItemdataValue){
		modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('msg.searchrequest.status')});
		}		
		var productsArrayRedis;			
		var itemImagesRedis;
		var redisInfoGetItems;
		 modules.getRedisInfo.getRedisInfo(event,client).then(obj => {
				
		productsArrayRedis = JSON.parse(obj.productsArray);
		itemImagesRedis = JSON.parse(obj.itemImages);
					
		var productListLen = Object.keys(productsArrayRedis).length;
										
		var itemImagesLen = Object.keys(itemImagesRedis).length;
						
		if(productListLen == 1){					
			
			var productTitle = productsArrayRedis[0].title.split("|");		
			var productLineNumber = productTitle[1];			
			for(var j= 0;j<itemImagesLen;j++){
					
				if(productLineNumber === itemImagesRedis[j].lineNr){
					var  productImgUrl = itemImagesRedis[j].url;									
					productsArrayRedis[0].image_url= productImgUrl;
				}
			}
			productsArrayRedis[0].title = productTitle[0]; 
			productsArrayRedis.push({
				"title":modules.getMessages.getMessages('newsearch.title.msg'),
				"buttons":[{
									"title": modules.getMessages.getMessages('btn.action.newsearch'),
									"type": "postback",
									"payload": "productDescSearch"  
								}
				]});
				
			message = {
			"attachment": {
				"type": "template",
				"payload": {
				"template_type": "generic",							
					"elements": productsArrayRedis
				}
			}
			};						
			modules.sendMessage.sendMessage(event.sender.id, message);						
					
							
		}else if(productListLen > 1){	
											
			for (var i = 0; i < productListLen; i++){
				for(var j = 0;j<itemImagesLen;j++){					 
					
						var productsTitle = productsArrayRedis[i].title.split("|");
						var productlineNr = productsTitle[1]; 
						
						if(productlineNr === itemImagesRedis[j].lineNr){
							var productImgUrl = itemImagesRedis[j].url;
							productsArrayRedis[i].image_url= productImgUrl;							
						}
				} 	
							
			}
			for (var i = 0; i < productListLen; i++){
				var productsTitle = productsArrayRedis[i].title.split("|");				
				productsArrayRedis[i].title = productsTitle[0]; 
			}
			if (productListLen < 5){
					productsArrayRedis.push({
					"title":modules.getMessages.getMessages('newsearch.title.msg'),
					"buttons":[{
										"title":modules.getMessages.getMessages('btn.action.newsearch') ,
										"type": "postback",
										"payload": "productDescSearch"  
									}
							] });
			}else{
					productsArrayRedis.push({
						"title":modules.getMessages.getMessages('newsearchWithViewMore.title.msg'),
						"buttons":[
										{
										"title": modules.getMessages.getMessages( 'btn.action.viewmore'),
										"type": "postback",
										"payload": "viewMoreProducts"                        
										},{
											"title": modules.getMessages.getMessages('btn.action.newsearch'),
											"type": "postback",
											"payload": "productDescSearch"  
										}
					] });
			}
				message = {
					"attachment": {
				"type": "template",
				"payload": {
				"template_type": "generic",
				"image_aspect_ratio":"square",							
					"elements": productsArrayRedis,
							}
				}
				};
					
				modules.sendMessage.sendMessage(event.sender.id, message);	
		}else{
				message={text:modules.getMessages.getMessages('err.occured')}	
				modules.sendMessage.sendMessage(event.sender.id, message); 
							
							
			}				 
			
		}).catch(err => {
			   console.log("promise error inside catch redisInfoGetItems");
			  });	
			}).catch(err => {
		console.log("promise error inside catch 4");

  });			
		client.hmset(event.sender.id, {
		'searchProduct':true
		});		
				   
} 
