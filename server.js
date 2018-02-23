‘use strict’;
// ================================================================
// get all the tools we need
// ================================================================
var express = require(‘express’);
var routes = require(‘./routes/index.js’);
var port = process.env.PORT || 3000;
var app = express();
// ================================================================
// setup our express application
// ================================================================
app.use(‘/public’, express.static(process.cwd() + ‘/public’));
app.set(‘view engine’, ‘ejs’);
// ================================================================
// setup routes
// ================================================================
routes(app);
// ================================================================
// start our server
// ================================================================
app.listen(process.env.PORT || 3000, function () {
    console.log('Node server is running***');
});