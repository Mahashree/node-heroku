exports.getRepInfo = function(event,redisData) {
	
	var modules = require('../chatbotmodules.js');
    var http = require('http');
	var client = modules.api.client;
    var data = JSON.stringify({
        "profile": {
            "userId": redisData.userId,
            "mrktCd": modules.api.mrktCd,
            "acctNr": redisData.userId,
            "token": redisData.token,
            "devKey": modules.api.devKey,
            "langCd": modules.api.langCd,
            "version": "1",
            "wsShippingFacilityCode": "018"
        }
    });	
	
    var options = modules.api.prepareWSDetails("REPPROFILE", data); 
	console.log(options);
    var req = http.request(options, function (res) {
        var msg = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {           
            var campaignArray = JSON.parse(msg).profile.data.campaigns;
            campaign = campaignArray[0].cmpgnNr;   
            campaignYr = campaignArray[0].cmpgnYrNr;
			client.hmset(event.sender.id, {
				'campaign':campaign,
				'campaignYr':campaignYr									
			});
            setTimeout(function () {
                message = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [{
                                "title": modules.getMessages.getMessages('addproduct.title'),
                                "subtitle": modules.getMessages.getMessages('campaign.subtitle.msg') + campaign,
                                "buttons": [{
                                    "type": "postback",
                                    "payload": "lineNrWithQtySearch",
                                    "title": modules.getMessages.getMessages('btn.enter.lineNr')
                                },
                                {
                                    "type": "postback",
                                    "payload": "productDescSearch",
                                    "title": modules.getMessages.getMessages('btn.searchproduct')
                                }]
                            }]
                        }
                    }
                };
				 
                modules.sendMessage.sendMessage(event.sender.id, message);
            }, 1000);
        });
    });

    req.write(data);
    req.end();

}