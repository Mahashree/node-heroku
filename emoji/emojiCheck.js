exports.emojiCheck = function(emojipatternchkInt,event){	
	
	var codeValueforEmoji="";
	var textEntered = event.message.text;
	var chkLength = 0;
	var emojipatternchk=emojipatternchkInt;
	for (var i=0;i<textEntered.length;i++){
		codeValueforEmoji += textEntered[i].charCodeAt(0).toString(16)+" ";
	}
	chkLength+=((textEntered.length*4)+textEntered.length);
	if(codeValueforEmoji.length ==chkLength){
	emojipatternchk++;
	client.hmset(event.sender.id, {
		'emojipatternchk':emojipatternchk									
	});
	}
	
}