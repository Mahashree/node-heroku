 exports.prepareRepOrderList=function (itemsOrderArray){ 
 
	var matchedLineNrList = {};
	var finalineNrList = []; 	 
	var itemsLen = itemsOrderArray.length; 		
	for(var i=0; i<itemsLen; i++){
			var e = itemsOrderArray[i];
			if(!matchedLineNrList[e.lineNr]){
				matchedLineNrList[e.lineNr] = 0					
			}
			matchedLineNrList[e.lineNr] += parseInt(e.qty);			   
		
	}
	for(var lineNr in matchedLineNrList){
		finalineNrList.push({lineNr : lineNr, qty : matchedLineNrList[lineNr]})
	}
	
	return finalineNrList;
	 
}