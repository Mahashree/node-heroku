exports.getErrDescription = function (errCode){
	var errProperties = PropertiesReader('fbbot-tr-errProperties.properties');
	var errDesc = errProperties.get(errCode);
	return errDesc;
}