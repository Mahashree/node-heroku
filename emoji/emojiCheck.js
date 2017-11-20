exports.emojiCheck = function(emojipatternchkInt,event){	
	console.log("Inside emoji check");
	try{	
	var modules = require('../chatbotmodules.js');
	var client = modules.api.client;
	var codeValueforEmoji="";
	var textEntered = event.message.text;
	console.log(event.message.text);
	var chkLength = 0;
	var emojipatternchk=emojipatternchkInt;
	for (var i=0;i<textEntered.length;i++){
		codeValueforEmoji += textEntered[i].charCodeAt(0).toString(16)+" ";
	}
	chkLength+=((textEntered.length*4)+textEntered.length);
	if(codeValueforEmoji.length === chkLength){
	emojipatternchk++;
	client.hmset(event.sender.id, {
		'emojipatternchk':emojipatternchk									
	});
	}
  }catch(ex){
	 console.log(ex); 
  }
}