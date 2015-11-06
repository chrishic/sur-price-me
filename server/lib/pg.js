/*!
 * Price Recommendation Service
 * ----------------------------
 * Postgresql access.
 */

'use strict';

var assert = require('assert'),
    util = require('util'),
    CONF = require('config'),
    pg = require('pg');


/////////////////////////////////////////////
//  Globals
/////////////////////////////////////////////

var connectionStr;


/////////////////////////////////////////////
//  Public functions
/////////////////////////////////////////////

var doQuery = function(sqlQueryStr, values, callback) {

    assert(sqlQueryStr && typeof sqlQueryStr === 'string');
    assert(values && Array.isArray(values));
    assert(callback && typeof callback === 'function');

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
//  On first invocation
/////////////////////////////////////////////

(function() {

    //  By default PostgreSQL returns data as strings along with an OID that identifies
    //  its type.  We're setting the parser to convert OID 20 (int8) into a javascript
    //  integer.
    pg.types.setTypeParser(20, function(val) {
        return val === null ? null : parseInt(val, 10);
    });

    //  Build connection string
    connectionStr = util.format('postgres://%s:%s@%s:%s/%s',
        CONF.postgres.user, CONF.postgres.password, CONF.postgres.hostname, CONF.postgres.port, CONF.postgres.db_name);

})();


/////////////////////////////////////////////
//  Exports
/////////////////////////////////////////////

exports.doQuery = doQuery;
