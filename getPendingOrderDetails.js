
exports.getPendingOrderDetails = function (redisDatas){
				
		console.log("======Inside Get Pending Items=======");
		 
		//var items="";		 
		var http = require('http');
		var options = {

				host:  'webeservicesqaf-g.avon.com',
				port:  80,
				path: '/agws/srvc/order/getPendingOrdDetl',
				method: 'POST',
				family: 4,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
					
				}
		};
		var data = JSON.stringify({
		"getPendingOrdDetl" : {
			 mrktCd : "TR",
			 devKey : "Fy9s3PCOW4vQoW/+EXSq8RpUSRXO4WtB",
			 langCd : "tr",
			 token : redisDatas.token,
			 userId : redisDatas.userId,
			 acctNr : redisDatas.userId,	
			 version : "4",
			 orderIdList : redisDatas.orderId,
			 perfrmGomacValidation : false,
			 startIndex :1,
			 endIndex :9999
		}
		});
		
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
			console.log("order 3");	
			//items =pendingOrderDetl.items;
			
			var items = pendingOrderDetl.items;	
			console.log(items);
		   return items;
//		
			
			 
			
		}
    
}); 
});
req.write(data);
req.end(); 
//module.exports.items=items;
}