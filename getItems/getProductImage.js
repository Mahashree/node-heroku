exports.getProductImage = function (imgLineNumber,event,redisDatas){
	
	var modules = require('../chatbotmodules.js');
	var client = modules.api.client;	
	return new Promise((resolve, reject) => {
	
	var itemImagesList=JSON.parse(redisDatas.itemImages);	
	var http = require('http');
	var data = JSON.stringify({
	  "getProdUrl":{
		"version":"1",
	  "userId":redisDatas.userId,
	  "acctNr":redisDatas.userId,
	  "mrktCd":modules.api.mrktCd,
	  "langCd":modules.api.langCd,
	  "devKey":modules.api.devKey,
	  "cmpgnYrNr": redisDatas.campaignYr,
	  "cmpgnNr": redisDatas.campaign,
	  "token":redisDatas.token,
	  "lineNr":imgLineNumber
	  }
	});		
											
	var options = modules.api.prepareWSDetails("PRODUCTIMAGE",data);					
	var req = http.request(options, function(res) {
		 
	var msg = '';

	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		msg += chunk;
	});
	res.on('end', function() {
	 
	var response = JSON.parse(msg);						 
	if(response.ProdUrlResp && response.ProdUrlResp.success){
		var responseImages = response.ProdUrlResp.details;
		var responseImagesLen = responseImages.length; 								
		var itemImagesListLen = Object.keys(itemImagesList).length;
		if(itemImagesListLen > 0){
			for(var i= 0;i<responseImagesLen;i++){
				itemImagesList.push({  
					"lineNr":responseImages[i].lineNr,
					"url":responseImages[i].url,
					});		
			}									
			var serializedArrImages = JSON.stringify(itemImagesList);	
			client.hmset(event.sender.id, {
						'itemImages':serializedArrImages
			}); 
			return resolve("success");
		}else{
			var newordImages = [];
			for(var i= 0;i<responseImagesLen;i++){
					newordImages.push({  
						"lineNr":responseImages[i].lineNr,
						"url":responseImages[i].url,
					});	
			}	
			var serializedArrImages = JSON.stringify(newordImages);	
			client.hmset(event.sender.id, {
				'itemImages':serializedArrImages
			}); 
			return resolve("success");
		   }										
			
	}else{
			
			 return reject("product image failure");
			
			
			}
		}); 
	}).on('error', function(e){
		console.log("inside error");
		console.log("error:"+e);
		return reject(e);
		});

	req.write(data);
	req.end();			

	
})	
}