/**
 * Logger
 *
 * @description :: Handles error logging
 * @help        :: See http://expressjs.com/
 * Version History ::
 *              0.1     -   Initial Draft
 * 		0.2     -   Review comment fixes done.
 *                      -   Appropriate comments added in the code.
 *                      -   Exception handling changes.
 */

/**
 * Module dependencies.
 */
var winston = require('winston');
var fs = require('fs');
var logDir = './logs';

var config = module.exports = {};

config.logger = {};
config.logger.level = 'error'; /* error, warn, info, debug */
config.logger.logging = true; /* true, false */
config.logger.logfile = 'log'; /* log file name */
config.logger.levels = {error: 0, warn: 1, info: 2, debug: 3}; /* 0 - 3 : high - low */
config.logger.colors = {info: "green", warn: "yellow", error: "red"};

/**
 * Configuring log levels & colors.
 */
winston.emitErrs = true;
winston.setLevels(config.logger.levels);
winston.addColors(config.logger.colors);

/**
 * Creating log directory if it does not exist.
 */
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var tsFormat = (new Date()).toLocaleTimeString();

/**
 * Method to write logs.
 */
var logger = new winston.Logger({
    exitOnError: false,
    levels: config.logger.levels,
    transports: [
        //new (require('winston-daily-rotate-file'))({
        new (require('winston-daily-rotate-file'))({
            filename: logDir + '/' + config.logger.logfile + '_error.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            json: true,
            handleExceptions: true,
            level: 'error',
            name: 'logError'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: logDir + '/' + config.logger.logfile + '_warn.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            json: true,
            level: 'warn',
            name: 'logWarn'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: logDir + '/' + config.logger.logfile + '_info.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            json: true,
            level: 'info',
            name: 'logInfo'
        }),
        new (require('winston-daily-rotate-file'))({
            filename: logDir + '/' + config.logger.logfile + '_debug.log',
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            json: true,
            level: 'debug',
            name: 'logDebug'
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ]

});

/**
 * Exports logger object.
 */
module.exports = logger;

/**
 * Exports stream object. Helps to handle uncaught exceptions.
 */
module.exports.stream = {
    write: function (message, encoding) {
        if (config.logger.logging) {
            //logger.info(message);
            //logger.debug(message);
            //logger.warn(message);
            logger.error(message);
        }
    }
};





