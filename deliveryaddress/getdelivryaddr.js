exports.getdelivryaddr =function(event,redisDatas){
	
	var modules = require('../chatbotmodules.js');
	var client = modules.api.client;
	var repOrderOrd = redisDatas.orderId;		
		var http = require('http');
		var data = JSON.stringify({                                  
			"getDlvryAddr": {
				"mrktCd": modules.api.mrktCd,
				"acctNr": redisDatas.userId,
				"userId": redisDatas.userId,
				"version": "1",
				"devKey": modules.api.devKey,
				"ordId": repOrderOrd,
				"token": redisDatas.token,
				"langCd": modules.api.langCd
			}
		});
	       console.log(data);
			var options = modules.api.prepareWSDetails("GETDELIVADDRESS",data);
			console.log(options);
			var req = http.request(options, function(res) {
			var msg = '';
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
			msg += chunk;
			});
			res.on('end', function() {
				var responseGetdelivAddr = JSON.parse(msg);
				if(responseGetdelivAddr.hasOwnProperty('dlvryAddrResp')&& responseGetdelivAddr.dlvryAddrResp.success){ 
					var deliveryAddrArray = JSON.parse(msg).dlvryAddrResp.addrDetl[0].delivAddr;
					for(var i=0;i<deliveryAddrArray.length;i++){						
						if (deliveryAddrArray[i].addrLocTyp === "DELIV"){					
							var defaultdelivAddr = deliveryAddrArray[i].addrLine1Txt;
							var defaultAddrLocTyp = deliveryAddrArray[i].addrLocTyp;										
							client.hmset(event.sender.id, {
								'defaultdelivAddr':defaultdelivAddr,
								'defaultAddrLocTyp':defaultAddrLocTyp						
																
							}); 
						}
				    }					
					  modules.getRedisInfo.getRedisInfo(event,client).then(obj => {
							modules.deliveryaddrdisplay.deliveryaddrdisplay(event,obj);
					  }).catch(err => {
					   console.log("promise error inside getDatasAddr");
					  });	
					
					
				}else{
					if(responseGetdelivAddr.hasOwnProperty("code")&& (responseGetdelivAddr.code=="600")){
							message = {text: modules.getMessages.getMessages('err.session.expired')}			
							modules.sendMessage.sendMessage(event.sender.id,message);
					}else{
					modules.sendMessage.sendMessage(event.sender.id, {text: modules.getMessages.getMessages('err.occured')});
					}
				}				
			
			});
			}).on('error', function(e){
				console.log("inside getdelivryadrr error");
				console.log("error:"+e);
			});
					

		req.write(data);
		req.end();
	
}