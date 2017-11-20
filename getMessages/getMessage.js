var PropertiesReader = require('properties-reader');
var getMessagesProperties = PropertiesReader('./getMessages/tr_Message.properties');
exports.getMessages = function(msgkey){	
	var  msgvalue= getMessagesProperties.get(msgkey);	
	return msgvalue;
}
