/*!
 * Price Recommendation Service
 * ----------------------------
 * Server creation & initialization.
 */

'use strict';

var util = require('util'),
    http = require('http'),
    CONF = require('config'),
    express = require('express'),
    express_log = require('./lib/express-log'),
    pkg = require('../package.json'),
    ServiceError = require('./lib/errors'),
    ServiceUtils = require('./lib/utils');


/////////////////////////////////////////////
//  Private functions
/////////////////////////////////////////////

var installUncaughtHandler = function() {

    process.on('uncaughtException', function(err) {

        var message = err.message || '';

        console.error(util.format('Unhandled exception: %s. Details: %s', message, util.inspect(err)));

        if (err.stack) {
            console.error('Error stack: ' + err.stack);
        }

        //  Shutdown
        process.exit(1);

    });

};

var configurePg = function() {

    var pg = require('pg');

    // By default PostgreSQL returns data as strings along with an OID that identifies
    // its type.  We're setting the parser to convert OID 20 (int8) into a javascript
    // integer.
    pg.types.setTypeParser(20, function(val) {
        return val === null ? null : parseInt(val, 10);
    });

};

var createApp = function() {

    //  Create our express app
    var app = express();

    //  Disable display of stack errors by default
    app.set('showStackError', false);

    //  Each request gets a custom 'service' object attached to Express `req` object
    app.use(function(req, res, next) { req.service = {}; next(); });

    //  Hook per request logging middleware
    app.use(express_log.logRequest);

    //  Configure environments
    if (process.env.NODE_ENV === 'development') {
        console.log('Configuring for DEVELOPMENT environment...');
        app.set('showStackError', true);
    }

    return app;

};

var installRoutes = function(app) {

    var setOperation = function(operation) {
        return function(req, res, next) {
            req.service.Operation = operation;
            next();
        };
    };

    //  'Item-Price' routes
    var itemPriceRouter = require('./app/controllers/item-price');

    app.get('/item-price-service', setOperation('GET-PRICE-RECOMMENDATION'), itemPriceRouter.getPriceRecommendation);

    //  Install catch-all / error routes
    installErrorRoutes(app);

};

var installErrorRoutes = function(app) {

    //  The end of the line in the middleware chain, so request is "not found".
    app.use(function(req, res, next) {
        req.service.Operation = '404-NOT-FOUND';
        next(new ServiceError.NotFound(req.url));
    });

    /*jshint unused:false */

    // Catch-all error handler.
    app.use(function(err, req, res, next) {
        if (typeof err.status === 'undefined') {
            err.status = 500;
        }

        if (app.settings.showStackError && typeof err.stack !== 'undefined') {
            console.error('Error stack: ' + err.stack);
        }

        res.service = {
            "Err": err
        };

        ServiceUtils.sendErrorResponse(err, req, res);
    });

    /*jshint unused:true */

};

var startServer = function(app) {

    //  Create our server
    var server = http.createServer(app);

    //  Listen for server 'close' event
    server.on('close', function() {
        console.log('Closed.');
        process.exit(1);
    });

    var trapExit = function() {
        console.log('Received shutdown signal. Closing down...');
        server.close();
    };

    process.on('SIGINT', function() {
        trapExit();
    });

    process.on('SIGTERM', function() {
        trapExit();
    });

    //  Now start listening for incoming requests
    server.listen(CONF.app.port);

    console.log(util.format('%s [v.%s] started at: %s.', pkg.description, pkg.version, new Date()));
    console.log('Listening on port: ' + CONF.app.port);

};


/////////////////////////////////////////////
//  Entry point
/////////////////////////////////////////////

(function() {

    //  Install handler for uncaught exceptions
    installUncaughtHandler();

    //  Configure postgres driver
    configurePg();

    //  Now create our Express app and configure it
    var app = createApp();

    //  Install our routes
    installRoutes(app);

    //  Now start the server.
    startServer(app);

})();
