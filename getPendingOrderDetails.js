exports.getPendingOrderDetails = function (redisDatas){
				
		console.log("order 1");
		console.log("redisdata In getPendingOrderDetails");
				   console.log(redisDatas);
				 
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
		  console.log("order 2");
		var response = JSON.parse(msg).pendingOrdDetlResp;
		var pendingOrderDetl = response.repPendingOrdDetl[0];
		if(response!=='undefined' && response.success && pendingOrderDetl.hasOwnProperty("items")&& pendingOrderDetl.items.length > 0){	
			console.log("order 3");		
			/*var items = pendingOrderDetl.items;	
			var indexBaseditemsLen = items.length;		
			var pendingItemsLen = pendingOrderDetl.totalItemCnt; 					
			var orderedItemsImagesRedis = JSON.parse(redisDatas.itemImages);				
			var viewcount= parseInt(redisDatas.viewMoreCount);				
			var itemImagesLen = Object.keys(orderedItemsImagesRedis).length; 				
			var totalQty = pendingOrderDetl.totQty;							
			pendingItemsLen =(pendingItemsLen-(3*viewcount));*/
			console.log(response);
			 
			 /*var jsdom = require("jsdom").jsdom;
			 var document = jsdom("hello world");
			 
			var label= document.createElement("label");
			var description = document.createTextNode(pair);
			var checkbox = document.createElement("input");

			checkbox.type = "checkbox";    // make the element a checkbox
			checkbox.name = "slct[]";      // give it a name we can check on the server side
			checkbox.value = pair;         // make its value "pair"

			label.appendChild(checkbox);   // add the box to the element
			label.appendChild(description);// add the description to the element
			var div = document.createElement('div');
			// add the label element to your div
			document.getElementById('some_div').appendChild(label);
			 window.location.href = "./index.html";*/
			 
			 
			 var jsrender = require('node-jsrender');
 
				// Load a template from ./templates/myTemplate.html 
				//     Contents of ./templates/myTemplate.html is: "{{:data}}" 
				jsrender.loadFileSync('#myTemplate', './index.html');
				jsrender.render['#myTemplate']({data: 'hello'});
							 
			 
		}
    
}); 
});
req.write(data);
req.end(); 

}