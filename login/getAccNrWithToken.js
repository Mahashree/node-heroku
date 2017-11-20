exports.getAccNrWithToken =function (event,redisData){
	
	var modules = require('../chatbotmodules.js');	 
	var id=event.sender.id;	
	var https = require('https');
	var propertiesParse = require('properties-parser');
	var properties = propertiesParse.read('./config/fbbot-tr.properties');
	var senderId ="";
	var qsObj = "access_token="+properties['fbbot.common.tr.accesstoken'];	 
	var options = {
		host: properties['fbbot.fbgraph.host'],
		port: properties['fbbot.fbgraph.port'],
		path: '//v2.10/'+id+'/ids_for_apps?app='+properties['fbbot.common.tr.appid']+'&'+qsObj,	
		method: properties['fbbot.fbgraph.method'],
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
		var responseGetAcct = JSON.parse(msg);		
		if(responseGetAcct.hasOwnProperty('data')&& responseGetAcct.data != ''){
			exports.senderId = 	responseGetAcct.data[0].id;				
			modules.fbLogin.fbLogin(event,redisData);
		}else{
				
			modules.sendMessage.sendMessage(event.sender.id, {text:modules.getMessages.getMessages('err.auth.user')});
		}
	}); 
	});

	req.end();
	
  	
}