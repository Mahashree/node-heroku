console.log("Inside chatbot module.js1");

//var api = require('./api/index.js');
//var path = require( "path" );
//var updater = require( path.resolve( __dirname, "./getRepInfo/index.js" ) ); 
//console.log(updater );
//var requireDirectory = require('require-directory');
//var api = requireDirectory(module,'./api/index.js');
/*try{
var api = require('./apiws/api.js');
}
catch(ex){
	console.log(ex);
}*/
module.exports = {
	
	
	
	   api: require('./apiws/api.js')
	   /*,
	
	//getMessages
		getMessages: require('./getMessages'),

	//getRepInfo
		getRepInfo: require('./getRepInfo'),
		
	//login
		fbLogin: require('./login/fbLogin.js'),
		getAccNrWithToken: require('./login/getAccNrWithToken.js'),
	
	//emoji
	   emojiCheck: require('./emoji/emojiCheck.js'),
	   
	//getItems  
	   getItemsData: require('./getItems/getItemsData.js'),
	   getPendingOrderDetails:require('./getItems/getPendingOrderDetails.js'),
	   getProductDetails: require('./getItems/getProductDetails.js'),
	   getProductImage: require('./getItems/getProductImage.js'),
	   getRedisInfo: require('./getItems/getRedisInfo.js'),
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
		getRedisDetails : require('./modifyCart/getRedisDetails.js'),
		modifyIemByLineNumber : require('./modifyCart/modifyIemByLineNumber.js'),
		
	//order
		deleteRepOrder : require('./order/deleteRepOrder.js'),
		resetGlobalVariables : require('./order/resetGlobalVariables.js'),
		saveRepOrder : require('./order/saveRepOrder.js'),
		submitOrderfn : require('./order/submitOrderfn.js'),
	
	//validation
		getErrDescription : require('./validation/getErrDescription.js'),
		prepareRepOrderList : require('./validation/prepareRepOrderList.js'),
		validateLineNrQtyForModifycart : require('./validation/validateLineNrQtyForModifycart.js'),
		validateRepOrders : require('./validation/validateRepOrders.js'),
	*/
 

   
};
console.log("Inside chatbot module.js2");