/*!
 * Price Recommendation Service
 * ----------------------------
 * Logging middleware for Express.
 */

'use strict';

var on_headers = require('on-headers');


/////////////////////////////////////////////
//  Globals
/////////////////////////////////////////////

var hostname = require('os').hostname();


/////////////////////////////////////////////
//  Public functions
/////////////////////////////////////////////

var logRequest = function(req, res, next) {

    //  Start the stopwatch
    req.service.StartTime = Date.now();

    //  Set up callback that is triggered when response is being sent
    on_headers(res, function() {
        logRequestComplete(req, res);
    });

    //  Proceed.
    next();

};


/////////////////////////////////////////////
//  Private functions
/////////////////////////////////////////////

var logRequestComplete = function(req, res) {

    //  Stop the stopwatch
    var elapsedMillis = Date.now() - req.service.StartTime;

    var logRecord = {
        "Hostname": hostname,
        "Operation": req.service.Operation,
        "Status": res.statusCode,
        "ElapsedMillis": elapsedMillis,
        "Request": {
            "Method": req.method,
            "Url": req.originalUrl
        }
    };

    //  If this is an error response, provide error details if available
    if (res.statusCode >= 400 && res.service && res.service.Err) {
        logRecord.Error = {
            "Err": res.service.Err,
            "Reason": res.service.Err.name
        };
    }

    //  Emit the log record
    console.log('request: ' + JSON.stringify(logRecord));

};


/////////////////////////////////////////////
//  Exports
/////////////////////////////////////////////

exports.logRequest = logRequest;
