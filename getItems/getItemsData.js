exports.getItemsData =function (event,redisDatas){	
	
	var modules = require('../module.js');	
	
 return new Promise((resolve, reject) => { 
                                            
	var searchInputByProdName = "";	
	var searchInputByLineNr = "";       
	var searchValue = redisDatas.searchKeyWord.trim().replace(/\s\s+/g, ' ').replace(/(\r\n|\r|\n)/g, ' ');
	var startIndex=redisDatas.startIndex;
	var endIndex=redisDatas.endIndex;
	if(isNaN(redisDatas.searchKeyWord)){
	
		searchInputByProdName =  searchValue;
				
	}else{
	
	searchInputByLineNr = searchValue;
	}	
	var http = require('http'); 			
	
	var data = JSON.stringify({
		"lclLineNrReq": {
		"mrktCd": modules.api.mrktCd,
		"devKey": modules.api.devKey,
		"langCd": modules.api.langCd,
		"token": redisDatas.token,
		"userId": redisDatas.userId,
		"acctNr": redisDatas.userId,
		"version": "3",
		"paiDataNeeded": "true",
		"startIndex":startIndex,
		"endIndex": endIndex,
		"searchCategory":searchInputByLineNr,					
		"cmpgnNr": redisDatas.campaign,
		"cmpgnYrNr": redisDatas.campaignYr,
		"endCmpgnNr": redisDatas.campaign,
		"endCmpgnYrNr": redisDatas.campaignYr,
		"shipmentMethod": "REG",
		"wsShippingFacilityCode":"018",
		"isAphrodite": "true",
		"ishwPilotRep": "false",   
		"selectionParameter": searchInputByProdName					
		}
	});					
					 
	var options = modules.api.prepareWSDetails("GETITMDATA",data);
	var req = http.request(options, function(res) {
	var msg = '';

	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		msg += chunk;
	});
	res.on('end', function() {
					
	var  productDetails = (JSON.parse(msg).lclLineNrResp)?JSON.parse(msg).lclLineNrResp:[];	
	console.log(productDetails);
	if(productDetails && productDetails.success && !productDetails.hasOwnProperty("errors")){							
		
		client.hmset(event.sender.id, {
			'searchProduct':false
		}); 								
		 
		var productDetailsLen = productDetails.lclLineNr.length;		
		var getItmLineNumberList = "";
		for(var i=0; i<productDetailsLen; i++){
			 getItmLineNumberList += productDetails.lclLineNr[i].lineNr+",";
		}		 
		var lineNrImagesList = getItmLineNumberList.slice(0, getItmLineNumberList.length-1);					
		modules.getProductImage.getProductImage(lineNrImagesList,event,redisDatas).then(productImage => {
		
		var data = modules.responseGetItemData.responseGetItemData(event,productDetails);
		if (data) {
     		return resolve(data);
  		} else {
		return resolve(data);
  		}
		}).catch(err => {
		console.log("promise error inside catch 1");
		console.log(err);
		});	
	}else{		 
		
		client.hmset(event.sender.id, {
		'productsArray':'',
		'searchProduct':false
		});
			
		message = {text: modules.getMessages.getMessages(err.searchproduct)}
		
		if(productDetails.hasOwnProperty("errors")){
			if(productDetails.errors[0].errCd =='10172'){
				
			client.hmset(event.sender.id, {
				'searchProduct':true
			}); 
			message ={text: modules.getMessages.getMessages(err.search.decription)}
			}
			
		}else{
			if(productDetails.code=='600'){
				resetGlobalVariables(event);
				 message = {text: modules.getMessages.getMessages(err.session.expired)}
			}
				
		}
		sendMessage(event.sender.id, message);	
	}
	
  }); 
});

	req.write(data);
	req.end(); 
				
})					
}

