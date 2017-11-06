exports.getRepInfo = function(event,redisData) {
	var modules = require('../module.js');
    var http = require('http');
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

    var options = modules.api.prepareWSDetails("REPPROFILE", data);//end 20170824:01
    var req = http.request(options, function (res) {
        var msg = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            console.log("res end success");
            console.log(JSON.parse(msg));
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
                                "title": "Sure, I can help you on that! How would you like to add products?",
                                "subtitle": "Your current campaign is " + campaign,
                                "buttons": [{
                                    "type": "postback",
                                    "payload": "lineNrWithQtySearch",
                                    "title": "Enter line number"
                                },
                                {
                                    "type": "postback",
                                    "payload": "productDescSearch",
                                    "title": "Search product"
                                }]
                            }]
                        }
                    }
                };
                sendMessage(event.sender.id, message);
            }, 1000);
        });
    });

    req.write(data);
    req.end();

}