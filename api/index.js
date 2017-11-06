console.log("Inside API");
var PropertiesReader = require('properties-reader');
var requireDirectory = require('require-directory');
var fbbotProperties = requireDirectory(module,'./facebookbot-tr.properties');
console.log(fbbotProperties);
//properties = PropertiesReader('facebookbot-tr.properties');
//console.log(properties);
/*
exports.wshost = properties.get('fbbot.ws.tr.host');
exports.wsport = properties.get('fbbot.ws.tr.port');
exports.wsmethodType = properties.get('fbbot.ws.tr.methodtype');
exports.mrktCd = properties.get('fbbot.common.tr.mrktCd');
exports.langCd = properties.get('fbbot.common.tr.langCd');
exports.devKey = properties.get('fbbot.ws.tr.dev.devKey');

exports.redisPort =properties.get('fbbot.redis.tr.redisPort');
exports.redisUrl=properties.get('fbbot.redis.tr.redisUrl');
exports.redisAuth_pass=properties.get('fbbot.redis.tr.redisAuth_pass');
exports.redisServername =properties.get('fbbot.redis.tr.redisServername');



exports.prepareWSDetails= function(type, data) {

    var path = "";

    switch (type) {

        case "GETITMDATA":
            path = properties.get('fbbot.ws.getitem.path');
            break;
        case "MERGEREPORDER":
            path = properties.get('fbbot.ws.mrgreporder.tr.path');
            break;
        case "SAVEREPORDER":
            path = properties.get('fbbot.ws.savereporder.tr.path');
            break;

        case "GETPENDINGITMS":
            path = properties.get('fbbot.ws.getpendingitms.tr.path');
            break;
        case "VERIFYFBLOGIN":
            path = properties.get('fbbot.ws.verifylogin.tr.path');            
            var options = {

				host: properties.get('fbbot.fbgraph.host'),
				port: properties.get('fbbot.fbgraph.port'),
				path: path,
				method:properties.get('fbbot.fbgraph.method'),,
				family: 4,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Content-Length': data.length
				}
			};
			return options;
			
        case "PRODUCTIMAGE":
            path = properties.get('fbbot.ws.productimage.tr.path');
            break;
        case "GETDELIVERYADDR":
            path = properties.get('fbbot.ws.deliveryaddr.tr.path');
            break;

        case "SUBMITREPORDER":
            path = properties.get('fbbot.ws.submitreporder.tr.path');
            break;
        case "REPPROFILE":
            path = properties.get('fbbot.ws.repProfile.tr.path');
            break;

        case "VALIDATELINENRQTY":
            path = properties.get('fbbot.ws.validatelinenrqty.path');
            break;

        case "MODIFYITEM":
            path = properties.get('fbbot.ws.modifyitem.tr.path');
            break;

        case "DELETEREPORDER":
            path = properties.get('fbbot.ws.deleteorder.tr.path');
            break;
        case "DELETEITEM":
            path = properties.get('fbbot.ws.deleteitem.tr.path');
            break;
		case "UPDATELASTDELIVADDRESS":
			path = properties.get('fbbot.ws.updatelastdelivaddr.tr.path');
            break;
		case "UPDATEDEFAULTDELIVADDRESS":
			path = properties.get('fbbot.ws.updatedefaultdelivaddr.tr.path');
            break;
		case "GETDELIVADDRESS":
			path = properties.get('fbbot.ws.getdelivaddr.tr.path');
            break;
		case "DISPLAYDELIVADDRESS"
			path = properties.get('fbbot.ws.displaydelivaddr.tr.path');
            break;
        default:
            path = "";
            break;

    }
    var options = {

        host: wshost,
        port: wsport,
        path: path,
        method: wsmethodType,
        family: 4,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };
    return options;
}