exports.getAccNrWithToken =function (event){
	
	var modules = require('../module.js');	
	
	var id=event.sender.id;	
	var https = require('https');
	var properties = PropertiesReader('fbbot-tr-login.properties');
	var senderId ="";
	var qsObj = "access_token="+properties.get('fbbot.common.tr.accesstoken');	
	var options = {
		host: properties.get('fbbot.ws.tr.host'),
		port: properties.get('fbbot.ws.tr.port'),
		path: '//v2.10/'+id+'/ids_for_apps?app='+properties.get('fbbot.common.tr.appid')+'&'+qsObj,	
		method: properties.get('fbbot.ws.tr.methodtype'),
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		  }
	};					
	var req = https.request(options, function(res) {						 
	var msg = '';

	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		msg += chunk;
	});
	res.on('end', function() {
		
	if(JSON.parse(msg).data != '' ){
		exports.senderId = 	JSON.parse(msg).data[0].id;				
		modules.fbLogin.fbLogin(event);
	}else{
			
		sendMessage(event.sender.id, {text:modules.getMessages.getMessages(err.auth.user)});
	}
	}); 
	});

	req.end();
  	
}