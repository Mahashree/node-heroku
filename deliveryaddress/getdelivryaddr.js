exports.getdelivryaddr =function(event,redisDatas){
	
	var modules = require('../module.js');
	
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
	
			var options = modules.api.prepareWSDetails("GETDELIVADDRESS",data);
			var req = http.request(options, function(res) {
			var msg = '';
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
			msg += chunk;
			});
			res.on('end', function() {
				
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
			var redisDatasAddr;
			function getDatasAddr () {
			  return new Promise((resolve, reject) => {
				client.hgetall(event.sender.id, function(err, obj) {
						redisDatasAddr = obj;
							  if (err) {
					return reject(err);
				  }
				  return resolve(obj);
					});
			  })
			}

			getDatasAddr().then(obj => {
				modules.deliveryaddrdisplay.deliveryaddrdisplay(event,redisDatasAddr);
			  }).catch(err => {
			   console.log("promise error inside getDatasAddr");
			  });			
			
			});
			}).on('error', function(e){
				console.log("inside getdelivryadrr error");
				console.log("error:"+e);
			});
					

		req.write(data);
		req.end();
	
}