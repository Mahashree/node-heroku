exports.showConfirmOrderCartTemplate = function (recipientId,actionValue){
	console.log("inside showConfirmOrderCartTemplate ");
	var modules = require('../chatbotmodules.js');
		if(actionValue==="NEWORD"){
			
			message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [{
							"title": modules.getMessages.getMessages('cartempty.additem.msg'),
							"buttons": [{
								"type": "postback",
								"payload": "addmoreitems",
								"title": modules.getMessages.getMessages('action.additem')
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
							"title": modules.getMessages.getMessages('cartempty.additem.msg'),
							"buttons": [{
								"type": "postback",
								"payload": "addmoreitems",
								"title": modules.getMessages.getMessages('action.additem')
								},{
								"type": "postback",
								"payload": "modifyCart",
								"title": modules.getMessages.getMessages('action.modifycart')
								},{
								"type": "postback",
								"title": modules.getMessages.getMessages('action.confirmorder'),
								"payload": "confirmOrderCart"
							}]
						}]
					}
						}
				};
			
		}	
		modules.sendMessage.sendMessage(recipientId, message);			 
	
}