
exports.validateRepOrders = function(orderedItemsArray,redisDatas,event){
		
	var modules = require('../chatbotmodules.js');
    var client = modules.api.client;	
	var qtyEnteredSearch = redisDatas.qtyEntered;
	var orderedListRedisDB= JSON.parse(redisDatas.orderedListArrayInputsDB);	
	var isProceedReg = false;
	var lineNumber;
	var validityFlag = true;   		
	var addMoreTemplate = true;		
	var orderedListArray = [];   
	var quantityNo;
	var orderedListObj;
	var errorMsg="";
	var orederedListItem;		
	var regex =/^[0-9]+,([0-9]+)$/;
	var orderedItemsArrayLen = orderedItemsArray.length;	
	var patternmismatch=redisDatas.patternmismatch;
	var emojipatternchk=parseInt(redisDatas.emojipatternchk);
	var patternmatch =redisDatas.patternmatch;
			
	for(var i=0; i<orderedItemsArrayLen; i++){		
	
		if(qtyEnteredSearch==="true"){			
			 orderedListObj = orderedItemsArray[i].lineNr+","+ orderedItemsArray[i].qty;
			 			 
		}else{			
			
			orderedListObj = orderedItemsArray[i].replace(/\s+/g, '');
		}
		 
		if (regex.test(orderedListObj) !== false) { // String matches regex
			patternmatch++;	
			
			orederedListItem = orderedListObj.split(",");
			orderedListArray.push({
				"lineNr": orederedListItem[0],
				"qty": orederedListItem[1]

			});							
		}else{	
			
			patternmismatch++;
			
			errorMsg+="["+orderedListObj+"],";
			
		}
		
	}
		
	
		if(patternmismatch > 0 && patternmatch > 0){
			validityFlag = true;
			addMoreTemplate = false;
			var errorMsgDisplay = errorMsg.slice(0, errorMsg.length-1);	
			modules.sendMessage.sendMessage(event.sender.id, {text:errorMsgDisplay+modules.getMessages.getMessages('err.lineNrQty.format')});	
			message = {
					"attachment": {
						"type": "template",
						"payload": {
							"template_type": "generic",
							"elements": [{
								"title":modules.getMessages.getMessages('invalid.lineNrqty.msg'),
								
								"buttons": [{
									"type": "postback",
									"payload": "lineNrWithQtySearch",
									"title":modules.getMessages.getMessages('btn.action.ok')
									}]      
								}]
						}
					}
				};	
			modules.sendMessage.sendMessage(event.sender.id, message);	
		}
		
		if(patternmismatch>0 && patternmatch==0 && emojipatternchk == 0){
			validityFlag = false;
			var errorMsgDisplay = errorMsg.slice(0, errorMsg.length-1);
			setTimeout(function () {
			message = {
						"attachment": {
							"type": "template",
							"payload": {
								"template_type": "generic",
								"elements": [{
									"title": errorMsgDisplay+modules.getMessages.getMessages('err.lineNrQty.format'),
									"subtitle":modules.getMessages.getMessages('invalid.lineNrqty.msg'),
									"buttons": [{
										"type": "postback",
										"payload": "lineNrWithQtySearch",
										"title": modules.getMessages.getMessages('btn.action.ok')
										}]      
									}]
							}
						}
					};	
				modules.sendMessage.sendMessage(event.sender.id, message);	},100);
			}
			
		var invalidLineNrArray =[];
		var invalidQtyArray=[];
		var notForSaleArr=[];
		var errArray=[];
		
		if(orderedListArray.length > 0 && validityFlag){
			
			var addMoreWithConfirmFlag;					
			var itemListArray=[];
			for(var i=0;i<orderedListArray.length;i++){

					lineNumber = orderedListArray[i].lineNr;
					quantityNo = orderedListArray[i].qty;
					itemListArray.push( {  
							"itemCampaignYear":redisDatas.campaignYr,
							"qty":quantityNo,
							"lineNr":lineNumber,
							"itemCampaignNr":redisDatas.campaign
							}
					  );
					
			}
			var http = require('http');
			var data = JSON.stringify({
				"validateitem":{
					"orderCampaignYear": redisDatas.campaignYr, 
					"orderCampaignNr": redisDatas.campaign, 
					"acctNr": redisDatas.userId, 
					"mrktCd": modules.api.mrktCd,
					"langCd" : modules.api.langCd,
					"token": redisDatas.token,
					"version": "1",
					"devKey":modules.api.devKey,
					"userId":redisDatas.userId,
					"items":itemListArray
			} 
			});		
			
			var options = modules.api.prepareWSDetails("VALIDATELINENRQTY",data);			
			var req = http.request(options, function(res) {
			var msg = '';
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				msg += chunk;
			});
			res.on('end', function() {
				var responseItemValidation=JSON.parse(msg);				
				if(responseItemValidation!=='undefined'&&responseItemValidation.itemvalidation.success && !(responseItemValidation.itemvalidation.hasOwnProperty("errors"))){
				var itemsList=responseItemValidation.itemvalidation.items;						
				var lineNrImages = ""; 									
				itemsList=(typeof itemsList === 'undefined')?[]:itemsList;	
				addMoreWithConfirmFlag = true;
				var  orderedListDB = [];				
				for(var j=0;j<itemsList.length;j++){					
					if(itemsList[j].validItem){
								
							orderedListDB.push({  
								"qty":itemsList[j].qty,
								"lineNr":itemsList[j].lineNr,
							});						
							lineNrImages+=itemsList[j].lineNr+ ",";
							orderedListDB= modules.prepareRepOrderList.prepareRepOrderList(orderedListDB);							
							for(var i= 0;i<orderedListDB.length;i++){
								orderedListDB[i].itemCampaignYear=itemsList[j].itemCampaignYear;
								orderedListDB[i].itemCampaignNr=itemsList[j].itemCampaignNr;						
							}						
					}else{
							if(qtyEnteredSearch==="false"){						
								if(itemsList[j].errors[0].errCd === '000112'){							
									invalidLineNrArray.push(itemsList[j].lineNr);
								}else if(itemsList[j].errors[0].errCd === '000115'){							
									invalidQtyArray.push({
										"lineNr":itemsList[j].lineNr,
										"qty":itemsList[j].qty							
										});
								}else if(itemsList[j].errors[0].errCd === '000114'){
									notForSaleArr.push(itemsList[j].lineNr);
							
								}else{							
									errArray.push({
										"lineNr":itemsList[j].lineNr,
										"errCd":itemsList[j].errors[0].errCd							
										});
								}
							}else{
								if(itemsList[j].errors[0].errCd === '000136'){
									addMoreWithConfirmFlag = false;
									addMoreTemplate = false;
									client.hmset(event.sender.id, {
										'addToCart':true
									}); 
									modules.sendMessagePromise.sendMessagePromise(event.sender.id,{text:errDesc}).then(obj => {						
										message = {text: modules.getMessages.getMessages('err.demo.qtylimit')};
										modules.sendMessage.sendMessage(event.sender.id, message);
						
									}).catch(err => {
										console.log("promise error inside sendMessagePromise errDesc");
									});
								}else if(itemsList[j].errors[0].errCd === '000115'){
									
									addMoreWithConfirmFlag = false;
									addMoreTemplate = false;
									client.hmset(event.sender.id, {
										'addToCart':true
									}); 
									try{
									var errDesc = modules.getErrDescription.getErrDescription(itemsList[j].errors[0].errCd);
									}catch(ex){
										console.log(ex);
									}
									
									modules.sendMessagePromise.sendMessagePromise(event.sender.id,{text:errDesc}).then(obj => {						
									message = {text:errDesc};
									modules.sendMessage.sendMessage(event.sender.id, message);
						
									}).catch(err => {
										console.log("promise error inside sendMessagePromise errDesc");
									});
								}else{
									var errDesc = modules.getErrDescription.getErrDescription(itemsList[j].errors[0].errCd);
									addMoreWithConfirmFlag = false;
									addMoreTemplate = false;
									modules.sendMessagePromise.sendMessagePromise(event.sender.id,{text:errDesc}).then(obj => {
						
										message = {text: modules.getMessages.getMessages('err.invalid.search')};
										modules.sendMessage.sendMessage(event.sender.id, message);						
									}).catch(err => {
										console.log("promise error inside sendMessagePromise errDesc2");
									});
								}						
							}					
					}										
				}
				
			var orderedListDBLen = orderedListDB.length;
			if(orderedListDBLen > 0){ 
				var lineNrImagesList = lineNrImages.slice(0, lineNrImages.length-1);				
				modules.getProductImage.getProductImage(lineNrImagesList,event,redisDatas);
			}
			if(Object.keys(orderedListRedisDB).length >0 ){
						for(var i= 0;i<orderedListDB.length;i++){
							orderedListRedisDB.push(orderedListDB[i]);
					}			
				}
			
			var repOrderItemlist=modules.prepareRepOrderList.prepareRepOrderList(orderedListRedisDB);
			for(var i= 0;i<repOrderItemlist.length;i++){
				repOrderItemlist[i].itemCampaignYear=campaignYr;
				repOrderItemlist[i].itemCampaignNr=campaign;
			}
			var orderListForDB = (Object.keys(orderedListRedisDB).length > 0 )?repOrderItemlist:orderedListDB;
			client.hmset(event.sender.id, {
									'orderedListArrayInputsDB':JSON.stringify(orderListForDB)
								});
			
			if(invalidLineNrArray.length>0){
				
				addMoreWithConfirmFlag = false;
				var invalidLineNrs="";
				for(var i=0; i<invalidLineNrArray.length;i++){
					invalidLineNrs+=invalidLineNrArray[i]+",";
				}
				var invalidlineNr = invalidLineNrs.slice(0, invalidLineNrs.length-1);				
				modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('linenr.textmsg')+invalidlineNr+modules.getMessages.getMessages('err.msg.entinvalid')});	
			}
			if(errArray.length>0){
				addMoreWithConfirmFlag = false;				
				var errDescMsgs="";
				for(var i=0; i<errArray.length;i++){
					var errDesc = modules.getErrDescription.getErrDescription(errArray[i].errCd);		
					errDescMsgs+=errArray[i].lineNr+":"+errDesc+",";
				}				
				var errDescMsg = errDescMsgs.slice(0, errDescMsgs.length-1);				
				modules.sendMessage.sendMessage(event.sender.id, {text: errDescMsg});	
			}
			if(notForSaleArr.length>0){
				addMoreWithConfirmFlag = false;
				var notForSaleLineNrs="";
				for(var i=0; i<notForSaleArr.length;i++){
					notForSaleLineNrs+=notForSaleArr[i]+",";
				}
				var notForSaleLineNr = notForSaleLineNrs.slice(0, notForSaleLineNrs.length-1);				
				modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('linenr.textmsg')+notForSaleLineNr+modules.getMessages.getMessages('err.msg.notforsale')});
			}
			
			if(invalidQtyArray.length>0){
					
				addMoreWithConfirmFlag = false;
				var invalidQtyMsgs="";
				for(var i=0; i<invalidQtyArray.length;i++){
					invalidQtyMsgs+=invalidQtyArray[i].lineNr+modules.getMessages.getMessages('err.msg.invalidqty') +invalidQtyArray[i].qty+",";
				}
				var errorMsgforqty = invalidQtyMsgs.slice(0, invalidQtyMsgs.length-1);
				modules.sendMessage.sendMessage(event.sender.id, {text: errorMsgforqty+modules.getMessages.getMessages('err.msg.invalidLineNrqty')});	
					
			}
			
			if(addMoreWithConfirmFlag && addMoreTemplate){	
								
				message = {
							"attachment": {
								"type": "template",
								"payload": {
									"template_type": "generic",
									"elements": [{
										"title": modules.getMessages.getMessages('lineNr.Qty.Confirm.msg'),
										"buttons": [{
											"type": "postback",
											"payload": "addmoreitems",
											"title": modules.getMessages.getMessages('btn.action.addmore')							
											},{
											"type": "postback",
											"title": modules.getMessages.getMessages('btn.action.vieworder'),
											"payload": "confirmQty" 
										}]
									}]
								}
							}
						};
						modules.sendMessage.sendMessage(event.sender.id, message);				
					
			}
				 
			if((!addMoreWithConfirmFlag) && addMoreTemplate){					
				setTimeout(function () {
				message = {
						"attachment": {
							"type": "template",
							"payload": {
								"template_type": "generic",
								"elements": [{
									"title":modules.getMessages.getMessages('invalid.lineNrqty.msg'),
									"buttons": [{
										"type": "postback",
										"payload": "lineNrWithQtySearch",
										"title": modules.getMessages.getMessages('btn.action.ok')
										}]      
									}]
							}
						}
					};
					modules.sendMessage.sendMessage(event.sender.id, message);
				},100);
			}
				 
			if((!addMoreWithConfirmFlag) && addMoreTemplate ){ 			
						 
					message = {text: modules.getMessages.getMessages('err.msg.invalidLineNrqty')};				
					modules.sendMessage.sendMessage(event.sender.id, message);					 
			}
		}else{
			if(responseItemValidation.itemvalidation.hasOwnProperty("code")&& (responseItemValidation.itemvalidation.code=="600")){
							message = {text: modules.getMessages.getMessages('err.session.expired')}			
							modules.sendMessage.sendMessage(event.sender.id,message);
				}else{
							message = {text: modules.getMessages.getMessages('err.occured')}			
							modules.sendMessage.sendMessage(event.sender.id,message);
							
						}
		}
			}); 
				
			});
			req.write(data);
				
			req.end();
	
		}	
			
		invalidLineNrArray =[];
		invalidQtyArray=[];
		notForSaleArr=[];	
		errArray=[];
		client.hmset(event.sender.id, {
			'lineNrWithQtyFlag':false,
			'patternmatch':0,
			'emojipatternchk':0,
			'patternmismatch':0					
		});
}