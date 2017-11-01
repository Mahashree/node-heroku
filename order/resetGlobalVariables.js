exports.resetGlobalVariables=function (event){	

	var testArray = ["1","2"];	
	var testArrarString = JSON.stringify(testArray);
	
	
	client.hmset(event.sender.id, {
		'redistest':'redistest',
		'searchProduct':false,
		'lineNrWithQtyFlag':false,
		'qtyEntered':false,
		'addToCart':false,
		'orderId': '',
		'lineNumber':'',
		'productsArray':'',
		'orderedListArrayInputsDB':'""',
		'itemImages':'""',		
		'delOrModifyLineNr':'',  //20171013:01
		'isDelOrModifyLineNr':false,
		'isDeleteItem':false,
		'isModifyItem' :false,
		'isCartEmpty':true,	
        'isValidLineNrQty':false,
		'viewMoreCount':0,
		'startIndexPending':0,
		'endIndexPending':3, 
		'orderConfirmedFlag':false,
		'startIndex':1,
		'endIndex':5,
		'orderSubmitFlag':false,
		'patternmatch':0,
		'patternmismatch':0,
		'totalPrice':0,
		'token':'',
		'userId':'',
		'campaign':'',
		'campaignYr':'',
		'defaultdelivAddr':'',
		'defaultAddrLocTyp':'',
		'lastdelivAddr':'',
		'lastAddrLocTyp':'',
		'smartClick':false,
		'searchKeyWord':'',
		'testArray' : testArrarString
	});		
	

	 
}