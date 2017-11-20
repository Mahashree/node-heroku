try{
 module.exports = {
		
	api: require('./apiws/api.js'), 	 
	getMessages: require('./getMessages/getMessage.js'),	 
	getRepInfo: require('./getRepInfo/getRepInfo'),
	fbLogin: require('./login/fbLogin.js'),
	getAccNrWithToken: require('./login/getAccNrWithToken.js'),
	//emoji
    emojiCheck: require('./emoji/emojiCheck.js'),
	   
	//getItems  
	   getItemsData: require('./getItems/getItemsData.js'),
	   getPendingOrderDetails:require('./getItems/getPendingOrderDetails.js'),
	   getProductDetails: require('./getItems/getProductDetails.js'),
	   getProductImage: require('./getItems/getProductImage.js'),
	   getRedisInfo: require('./common/getRedisInfo.js'),
	   responseGetItemData: require('./getItems/responseGetItemData.js'),
	   sendMessagePromise: require('./getItems/sendMessagePromise.js'),
	   showConfirmOrderCartTemplate: require('./getItems/showConfirmOrderCartTemplate.js'),
	   
	//delivery address
	   deliveryaddrdisplay : require('./deliveryaddress/deliveryaddrdisplay.js'),
	   getdelivryaddr : require('./deliveryaddress/getdelivryaddr.js'),
	   updateDefaultAddr : require('./deliveryaddress/updateDefaultAddr.js'),
	   updateLastDelivAddress : require('./deliveryaddress/updateLastDelivAddress.js'),
	   
	//modifyCart
		deleteItemByLineNumber : require('./modifyCart/deleteItemByLineNumber.js'),
		//getRedisDetails : require('./modifyCart/getRedisDetails.js'),
		modifyIemByLineNumber : require('./modifyCart/modifyIemByLineNumber.js'),
		
	//order
		deleteRepOrder : require('./order/deleteRepOrder.js'),
		resetGlobalVariables : require('./common/resetGlobalVariables.js'),
		saveRepOrder : require('./order/saveRepOrder.js'),
		submitOrderfn : require('./order/submitOrderfn.js'),
	
	//validation
		getErrDescription : require('./validation/getErrDescription.js'),
		prepareRepOrderList : require('./validation/prepareRepOrderList.js'),
		validateLineNrQtyForModifycart : require('./validation/validateLineNrQtyForModifycart.js'),
		validateRepOrders : require('./validation/validateRepOrders.js'),
	
	//sendMessage Template
		sendMessage : require('./sendMessage/sendMessageTemplate.js')
 
 };
}catch(ex){
console.log(ex);
}
