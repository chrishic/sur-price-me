/*!
 * Price Recommendation Service
 * ----------------------------
 * Controller [item-price].
 */

'use strict';

var assert = require('assert'),
    util = require('util'),
    CONF = require('config'),
    pg = require('pg'),
    _ = require('underscore'),
    ServiceError = require('../../../lib/errors'),
    ServiceUtils = require('../../../lib/utils');


/////////////////////////////////////////////
//  Public functions
/////////////////////////////////////////////

var getPriceRecommendation = function(req, res, next) {

    // Possible GET Response Status Codes
    // 200 OK: The request was successful and the response body contains the representation requested.
    // 400 BAD REQUEST: Your request was not formatted correctly.
    // 401 UNAUTHORIZED: Missing or bad authentication.
    // 403 FORBIDDEN: Access to the resource was denied (throttled or access permissions).
    // 500 SERVER ERROR: We couldn't return the representation due to an internal server error.

    //  Check for 'item' query parameter
    var item = ServiceUtils.getQueryValue(req.query, 'item');

    //  Check for 'city' query parameter
    var city = ServiceUtils.getQueryValue(req.query, 'city');

    //  Do we allow 'city' only requests? (default is yes - it must be specifically disabled)
    //  [Note: 'item' only requests are always permissable.]
    var allowCityOnly = (CONF.app.item_price_service.allow_city_only !== false);

    //  Are the required parameters specified?
    if (!item && !city || (!allowCityOnly && !item)) {
        return next(new ServiceError.NotFound(req.url));
    }

    getItemPrices(item, city, function(err, results) {
        if (err) {
            return next(err);
        }

        if (!results || typeof results !== 'object' || !Array.isArray(results.rows)) {
            return next(new ServiceError.ServerFailure('Unexpected response from database server.'));
        }

        //  Calculate total count of item prices
        var counts = _.map(results.rows, function(row) { return row.count; });

        var totalCount = _.reduce(counts, function(memo, num) { return memo + num; }, 0);

        //  Price suggestion is first row of results.
        var priceSuggestion = results.rows.length > 0 ? results.rows[0].list_price : 0;

        var status = 200;

        var responseObject = {
            "status" : status,
            "content" : {
                "item": item ? item : 'Not specified',
                "item_count": totalCount,
                "price_suggestion": priceSuggestion,
                "city": city ? city : 'Not specified'
            }
        };

        //  Send output to stdout for logging
        console.log('debug: ' + JSON.stringify(responseObject, null, 2));

        //  output result to client
        res.format({
            json: function() {
                res.status(status).send(responseObject);
            }
        });
    });

};


/////////////////////////////////////////////
//  Private functions
/////////////////////////////////////////////

var getItemPrices = function(item, city, callback) {

    assert(callback && typeof callback === 'function');

    var values = [];
    var whereClause = '';

    if (item) {
        values.push(item);
        whereClause += 'title=$1';
    }

    if (city) {
        if (whereClause) {
            whereClause += ' AND ';
        }

        values.push(city);
        whereClause += util.format('city=$%s', values.length);
    }

    if (whereClause) {
        whereClause = util.format(' WHERE %s ', whereClause);
    }

    var sqlQueryStr = 'SELECT list_price, count(*) FROM "itemPrices_itemsale"';
    sqlQueryStr += whereClause;
    sqlQueryStr += 'GROUP BY list_price ORDER BY count(*) DESC, list_price DESC';

    doQuery(sqlQueryStr, values, callback);

};

var doQuery = function(sqlQueryStr, values, callback) {

    assert(sqlQueryStr && typeof sqlQueryStr === 'string');
    assert(values && Array.isArray(values));
    assert(callback && typeof callback === 'function');

    //  Build connection string
    var connectionStr = util.format('postgres://%s:%s@%s:%s/%s',
        CONF.postgres.user, CONF.postgres.password, CONF.postgres.hostname, CONF.postgres.port, CONF.postgres.db_name);

    //  Connect to database
    pg.connect(connectionStr, function(err, client, done) {

        var resultCallback = function(err, results) {
            if (client) {
                done(client);
            }

            if (err) {
                return callback(err);
            }

            callback(null, results);
        };

        if (err) {
            return resultCallback(err);
        }

        //  Submit the query
        client.query(sqlQueryStr, values, resultCallback);

    });

};


/////////////////////////////////////////////
//  Exports
/////////////////////////////////////////////

exports.getPriceRecommendation = getPriceRecommendation;
