exports.getMessages = function(event,msgkey){
	
	var getMessagesProperties = PropertiesReader('en_us_Message.properties');
	var  msgvalue= getMessagesProperties.get(msgkey);
	return msgvalue;
}
}