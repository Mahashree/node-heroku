var redis = require("redis");
var redisClient = require('redis-connection')();
var redisServer = require('redis-server');
var propertiesParse = require('properties-parser');
var properties = propertiesParse.read('./config/fbbot-tr.properties');
exports.wshost = properties['fbbot.ws.tr.host'];
exports.wsport = properties['fbbot.ws.tr.port'];
exports.wsmethodType = properties['fbbot.ws.tr.methodtype'];
exports.mrktCd = properties['fbbot.common.tr.mrktCd'];
exports.langCd = properties['fbbot.common.tr.langCd'];
exports.devKey = properties['fbbot.ws.tr.dev.devKey'];
var redisPort =properties['fbbot.redis.tr.redisPort'];
var redisUrl=properties['fbbot.redis.tr.redisUrl'];
var redisAuth_pass=properties['fbbot.redis.tr.redisAuth_pass'];
var redisServername =properties['fbbot.redis.tr.redisServername'];

exports.client = redis.createClient(redisPort,redisUrl, {auth_pass: redisAuth_pass, tls: {servername: redisServername}});

exports.prepareWSDetails= function(type, data) {
	
	
    var path = "";

    switch (type) {

        case "GETITMDATA":
            path = properties['fbbot.ws.getitem.path'];
            break;
        case "MERGEREPORDER":
            path = properties['fbbot.ws.mrgreporder.tr.path'];
            break;
        case "SAVEREPORDER":
            path = properties['fbbot.ws.savereporder.tr.path'];
            break;

        case "GETPENDINGITMS":
            path = properties['fbbot.ws.getpendingitms.tr.path'];
            break;
        case "VERIFYFBLOGIN":
            path = properties['fbbot.ws.verifylogin.tr.path'];         
            var options = {

				host: properties['fbbot.ws.tr.host'],
				port: properties['fbbot.fbgraph.port'],
				path: path,
				method:properties['fbbot.ws.tr.methodtype'],
				family: 4,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Content-Length': data.length
				}
			};
			return options;
			
        case "PRODUCTIMAGE":
            path = properties['fbbot.ws.productimage.tr.path'];
            break;
        case "GETDELIVERYADDR":
            path = properties['fbbot.ws.deliveryaddr.tr.path'];
            break;

        case "SUBMITREPORDER":
            path = properties['fbbot.ws.submitreporder.tr.path'];
            break;
        case "REPPROFILE":
            path = properties['fbbot.ws.repProfile.tr.path'];
            break;

        case "VALIDATELINENRQTY":
            path = properties['fbbot.ws.validatelinenrqty.path'];
            break;

        case "MODIFYITEM":
            path = properties['fbbot.ws.modifyitem.tr.path'];
            break;

        case "DELETEREPORDER":
            path = properties['fbbot.ws.deleteorder.tr.path'];
            break;
        case "DELETEITEM":
            path = properties['fbbot.ws.deleteitem.tr.path'];
            break;
		case "UPDATELASTDELIVADDRESS":
			path = properties['fbbot.ws.updatelastdelivaddr.tr.path'];
            break;
		case "UPDATEDEFAULTDELIVADDRESS":
			path = properties['fbbot.ws.updatedefaultdelivaddr.tr.path'];
            break;
		case "GETDELIVADDRESS":
			path = properties['fbbot.ws.getdelivaddr.tr.path'];
            break;
		case "DISPLAYDELIVADDRESS":
			path = properties['fbbot.ws.displaydelivaddr.tr.path'];
            break;
        default:
            path = "";
            break;

    }
    var options = {

        host: properties['fbbot.ws.tr.host'],
        port: properties['fbbot.ws.tr.port'],
        path: path,
        method: properties['fbbot.ws.tr.methodtype'],
        family: 4,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };
    return options;
}
