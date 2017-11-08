console.log("Inside getMessages");
var PropertiesReader = require('properties-reader');
console.log(PropertiesReader);
var getMessagesProperties = PropertiesReader('./en_us_Message.properties');
console.log(getMessagesProperties);
exports.getMessages = function(event,msgkey){
	
	var  msgvalue= getMessagesProperties.get(msgkey);
	return msgvalue;
}
}