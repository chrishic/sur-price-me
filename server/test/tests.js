/*!
 * Price Recommendation Service
 * ----------------------------
 * Test cases.
 */

'use strict';

var assert = require('chai').assert,
    util = require('util'),
    qs = require('querystring'),
    request = require('request');


/////////////////////////////////////////////
//  Globals
/////////////////////////////////////////////

var GET_PRICE_RECOMMENDATION_TESTS = [
    { "Params": { "item": "Furniture", "city": "Philadelphia" }, "ExpectedStatus": 200 },
    { "Params": { "item": "Furniture" }, "ExpectedStatus": 200 },
    { "Params": { "item": "Furniture", "city": "Madrid" }, "ExpectedStatus": 200 },
    { "Params": { "item": "Bananas", "city": "Philadelphia" }, "ExpectedStatus": 200 },
    { "Params": { "item": "Wii", "city": "Atlanta" }, "ExpectedStatus": 200 },
    { "Params": { "item": "Wii" }, "ExpectedStatus": 200 },
    { "Params": { }, "ExpectedStatus": 404 }
];


/////////////////////////////////////////////
//  Test cases
/////////////////////////////////////////////

describe('Price Recommendation Service Unit Tests', function () {

    var path = require('path');
    process.env.NODE_CONFIG_DIR = path.normalize(__dirname + '/config');

    var CONF = require('config');

    var baseUri = util.format('http://%s:%s/item-price-service/', CONF.sur_price_me.hostname, CONF.sur_price_me.port);

    describe('GET-PRICE-RECOMMENDATION Tests', function() {

        var testCount = 0;

        GET_PRICE_RECOMMENDATION_TESTS.forEach(function(test) {

            assert.ok(test);
            assert.isObject(test);

            testCount++;

            describe('GetPriceRecommendation Test #' + testCount, function() {

                it('should successfully make GET-PRICE-RECOMMENDATION call', function(done) {

                    var uri = baseUri;
                    var querystring = qs.stringify(test.Params);
                    if (querystring && typeof querystring === 'string') {
                        uri += util.format('?%s', querystring);
                    }

                    var reqOpts = {
                        "uri": uri,
                        "method": "GET"
                    };

                    submitRequest(reqOpts, function(err, result) {
                        assert.ok(!err, util.format('%s call failed! Reason: %s', uri, util.inspect(err)));

                        assert.isNotNull(result, 'Result is empty!');
                        assert.strictEqual(result.status, test.ExpectedStatus, 'Unexpected status');

                        done();
                    });

                });

            });

        });
    });

});


/////////////////////////////////////////////
//  Helper functions
/////////////////////////////////////////////

var submitRequest = function(reqOpts, callback) {

    assert(reqOpts && typeof reqOpts === 'object');
    assert(callback && typeof callback === 'function');

    reqOpts.headers = {
        "Accept": "application/json"
    };

    request(reqOpts, function(err, res, body) {
        if (err) {
            return callback(err);
        }

        if (!res) {
            return callback(new Error('Unexpected response from API call, %s: response object is empty.', reqOpts.uri));
        }

        if (body) {
            try {
                body = JSON.parse(body);
            }
            catch (e) {
                var msg = util.format('Unable to parse response from API call, %s, as JSON. Reason: %s.',
                    reqOpts.uri, util.inspect(e));
                return callback(new Error(msg));
            }
        }

        var result = {
            "status": res.statusCode,
            "body": body
        };

        callback(null, result);
    });

};
