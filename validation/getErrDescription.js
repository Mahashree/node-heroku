exports.getErrDescription = function (errCode){
	var PropertiesReader = require('properties-reader');
	var errProperties = PropertiesReader('./config/fbbot_tr_errproperties_trlang.properties');
	var errDesc = errProperties.get(errCode);
	return errDesc;
}