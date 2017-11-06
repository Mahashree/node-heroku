exports.getProductDetails = function (event,redisData) {
	
	var modules = require('../module.js');
		
	sendMessage(event.sender.id, {text:modules.getMessages.getMessages(msg.searchrequest.status)}); 
	modules.getItemsData.getItemsData(event,redisData).then(obj => {
				
		var productsArrayRedis;	
		var productsArrayRedisDummy = [];	
		var itemImagesRedis;
		var redisInfoGetItems;
		function getRedisInfo () {
			  return new Promise((resolve, reject) => {
				client.hgetall(event.sender.id, function(err, obj) {
						redisInfoGetItems = obj;
							  if (err) {
					// Reject the Promise with an error
					return reject(err);
				  }

				  // Resolve (or fulfill) the promise with data
				  return resolve(obj);
					});
			  })
		}	
		getRedisInfo().then(obj => {
				
		productsArrayRedis = JSON.parse(obj.productsArray);
		itemImagesRedis = JSON.parse(obj.itemImages);				
		productsArrayRedisDummy.push(productsArrayRedis);
					
		var productListLen = Object.keys(productsArrayRedis).length;
										
		var itemImagesLen = Object.keys(itemImagesRedis).length;
						
		if(productListLen == 1){				
			var slicelen = productsArrayRedis[0].subtitle.indexOf('I')-1;
			var productLineNumber = productsArrayRedis[0].subtitle.slice(7, slicelen);
			for(var j= 0;j<itemImagesLen;j++){							
				if(productLineNumber == itemImagesRedis[j].lineNr){
					var  productImgUrl = itemImagesRedis[j].url;									
					productsArrayRedis[0].image_url= productImgUrl;
					}
			}
			productsArrayRedis.push({
				"title":modules.getMessages.getMessages(newsearch.title.msg),
				"buttons":[{
									"title": modules.getMessages.getMessages(btn.action.newsearch),
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
			sendMessage(event.sender.id, message);						
					
							
		}else if(productListLen > 1){	
											
			for (var i = 0; i < productListLen; i++){
				for(var j = 0;j<itemImagesLen;j++){					 
					var productlineNr =productsArrayRedis[i].subtitle.slice(7, (productsArrayRedis[i].subtitle.indexOf('I')-1));
					
				if(productlineNr == itemImagesRedis[j].lineNr){
					var productImgUrl = itemImagesRedis[j].url;
					productsArrayRedis[i].image_url= productImgUrl;							
						}
				} 					  
			}
			if (productListLen < 5){
					productsArrayRedis.push({
					"title":modules.getMessages.getMessages(newsearch.title.msg),
					"buttons":[{
										"title":modules.getMessages.getMessages(btn.action.newsearch) ,
										"type": "postback",
										"payload": "productDescSearch"  
									}
							] });
			}else{
					productsArrayRedis.push({
						"title":modules.getMessages.getMessages(newsearchWithViewMore.title.msg),
						"buttons":[
										{
										"title": modules.getMessages.getMessages( btn.action.viewmore),
										"type": "postback",
										"payload": "viewMoreProducts"                        
										},{
											"title": modules.getMessages.getMessages(btn.action.newsearch),
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
					
				sendMessage(event.sender.id, message);	
		}else{
							message={text:modules.getMessages.getMessages(err.occured)}	
							sendMessage(event.sender.id, message); 
							
							
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
