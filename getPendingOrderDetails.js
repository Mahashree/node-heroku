/*(function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, "script", "Messenger"));
        		
		window.extAsyncInit = function () {
            // the Messenger Extensions JS SDK is done loading
            MessengerExtensions.getUserID(function success(uids) {
                var psid = uids.psid;//This is your page scoped sender_id
                alert("Getting PSID")
                alert("This is the user's psid " + psid);
            }, function error(err) {
                alert("Messenger Extension Error: " + err);
            });
        };
		
	window.extAsyncInit = function () {
    // the Messenger Extensions JS SDK is done loading
    MessengerExtensions.getUserID(function success(uids) {
        var psid = uids.psid;//This is your page scoped sender_id
		 alert("Heroku calling--"+ psid);
		 var responseItems=getOrderItems(psid);
		 console.log(responseItems);
		 //document.getElementById('myField').value = psid;
		 //document.getElementById('myField').value = psid;
		// var $ = require('jQuery');
       // $.post('obscure-stream-93442.herokuapp.com/sendOnWebviewClose', {"psid": psid})
		//post('https://guarded-bastion-64052.herokuapp.com/sendOnWebviewSenderId', {"psid": psid});
    }, function error(err) {
        alert("Messenger Extension Error: " + err);
    });
};
function sendMessage() {
            alert('Booking completed. What to do now? How to send the message back to bot?')
            /// how to return? the facebook docs don't say anything
            /// you HAVE to make a server round trip.. https://stackoverflow.com/questions/43956045/messengerextensions-how-to-send-a-message-by-messenger-to-users
            return {
                text: "HOTEL_SERVICE_PAYLOAD",
                attachments: [
                    {
                        email: "some@email.com",
                        hotelName: "Hotel marriott",
                        confirmNumber: "1234567"
                    }
                ]
            }
            MessengerExtensions.requestCloseBrowser(function success() {

            }, function error(err) {

            });
        }*/

		
		
		
function getOrderItems (senderId){
	new Promise((resolve, reject) => {
				console.log('Initial');
			
			   client.hgetall(senderId, function(err, obj) {			
				 if (err) {
					// Reject the Promise with an error
					return reject(err);
				  }
				  // Resolve (or fulfill) the promise with data
				  return resolve(obj);
				});
				 
		 }).then(redisInfo => {							
				 
				console.log("=======Response pending items======");
				getPendingOrderDetails(redisInfo).then(orderedItems => {	
					//orderedItems=orderDetails.getPendingOrderDetails(redisInfo);
					console.log("orderedItems");
					return orderedItems;
					
				
				}).catch(err => {
					console.log("Error");
					console.log(err);
					});
		 });
}	
		
function getPendingOrderDetails (redisDatas){
				
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
			 startIndex :"1",
			 endIndex :"9999"
		}
		});
		
		var req = http.request(options, function(res) {		
		var msg = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
		msg += chunk;
		});
		res.on('end', function() {		   
		 console.log(JSON.parse(msg));    
		var response = JSON.parse(msg).pendingOrdDetlResp;
		var pendingOrderDetl = response.repPendingOrdDetl[0];
		if(response!=='undefined' && response.success && pendingOrderDetl.hasOwnProperty("items")&& pendingOrderDetl.items.length > 0){	
			console.log("order 3");	
			//items =pendingOrderDetl.items;
			
			var items = pendingOrderDetl.items;	
			//console.log(items);
		   return items;
//		
			
			 
			
		}
    
}); 
});
req.write(data);
req.end(); 
//module.exports.items=items;
}