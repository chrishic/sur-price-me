/*!
 * Price Recommendation Service
 * ----------------------------
 * Errors.
 */

'use strict';

var http = require('http'),
    util = require('util');


//  All custom errors inherit off BaseError.

function BaseError(msg) {
    this.message = msg || 'Error';
}
util.inherits(BaseError, Error);
BaseError.prototype.name = 'BaseError';


//  API-specific errors
//  These map to HTTP failure codes

function ApiError(status) {
    var msg = http.STATUS_CODES[status] || '';
    ApiError.super_.call(this, msg);
    this.status = status;
}
util.inherits(ApiError, BaseError);
ApiError.prototype.name = 'ApiError';


function BadRequest(details) {
    BadRequest.super_.call(this, 400);
    this.details = details || '';
}
util.inherits(BadRequest, ApiError);
BadRequest.prototype.name = 'Bad request';


function NotFound(path) {
    NotFound.super_.call(this, 404);
    this.details = path ? 'Cannot find ' + path : '';
}
util.inherits(NotFound, ApiError);
NotFound.prototype.name = 'Not found';


function ServerFailure(err) {
    ServerFailure.super_.call(this, 500);
    this.details = err;
}
util.inherits(ServerFailure, ApiError);
ServerFailure.prototype.name = 'Server failure';


/////////////////////////////////////////////
//  Exports
/////////////////////////////////////////////

module.exports = {
    BadRequest: BadRequest,
    NotFound: NotFound,
    ServerFailure: ServerFailure
};
