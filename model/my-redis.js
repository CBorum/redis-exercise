/**
 * Created by ChristopherBorum on 11/10/16.
 */
var redis = require('redis');
var async = require('async');

var exports = module.exports = {};

var client = {}

exports.connectToRedis = function (conf) {
    client = redis.createClient(conf.port, conf.endpoint, {no_ready_check: true});
    client.auth(conf.password, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

exports.getAllKeys = function (cb) {
    var sessionObjects = [];
    async.series([
        function (callback) {
            client.keys('sess:*', function (err, keys) {
                if (err) return console.log(err);
                async.forEach(keys, function (item, callback) {
                    client.get(item, function (err, res) {
                        if (err) {
                            callback();
                        }
                        var sesObj = JSON.parse(res);
                        sesObj.id = item;
                        sessionObjects.push(sesObj);
                        callback();
                    });
                }, function (err) {
                    callback();
                });
            });
        }
    ], function () {
        cb(sessionObjects);
    });
}

exports.getClient = function () {
    return client;
}