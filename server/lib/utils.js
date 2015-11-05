/*!
 * Price Recommendation Service
 * ----------------------------
 * Utility functions.
 */

'use strict';


/////////////////////////////////////////////
//  Public functions
/////////////////////////////////////////////

var sendErrorResponse = function(err, req, res) {

    if (typeof err.status === 'undefined') {
        err.status = 500;
    }

    var errorTitle = err.name || 'An error occurred.';

    var errorObject = {
        "status": err.status,
        "content": {
            "message": errorTitle
        }
    };

    res.status(err.status).send(errorObject);

};

var getQueryValue = function(collection, keyName) {

    var keyValue = null;

    if (typeof keyName !== 'string') {
        keyName = '';
    }

    keyName = keyName.trim().toLowerCase();

    if (keyName && collection && typeof collection === 'object') {
        var keys = Object.keys(collection);
        for (var i=0; i < keys.length; ++i) {
            var key = keys[i].trim().toLowerCase();
            if (key === keyName) {
                keyValue = collection[keys[i]];
                if (keyValue && typeof keyValue === 'string') {
                    keyValue = keyValue.trim();
                }
                break;
            }
        }
    }

    return keyValue;

};


/////////////////////////////////////////////
//  Exports
/////////////////////////////////////////////

exports.sendErrorResponse = sendErrorResponse;
exports.getQueryValue = getQueryValue;
