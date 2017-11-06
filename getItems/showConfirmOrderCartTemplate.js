exports.showConfirmOrderCartTemplate = function (recipientId,actionValue){
	
		if(actionValue=="NEWORD"){
			
			message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [{
							"title": "Please select  Add Item to add products in Cart",
							"buttons": [{
								"type": "postback",
								"payload": "addmoreitems",
								"title": "Add Item"
								}]
						}]
					}
						}
				};
		}else{
		     message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [{
							"title": "Please select to add more products or confirm",
							"buttons": [{
								"type": "postback",
								"payload": "addmoreitems",
								"title": "Add more"
								},{
								"type": "postback",
								"payload": "modifyCart",
								"title": "Modify Cart"
								},{
								"type": "postback",
								"title": "Confirm Order",
								"payload": "confirmOrderCart"
							}]
						}]
					}
						}
				};
			
		}	
		sendMessage(recipientId, message);			 
	
}