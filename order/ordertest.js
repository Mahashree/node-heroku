var requireDirectory = require('require-directory');
var api = requireDirectory(module.slice(0, module.indexOf('/')),'./api');

//var api = require('./api');
api.save.chkfn();
api.Deletejsfile.Delete();