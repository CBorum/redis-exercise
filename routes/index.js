var express = require('express');
var router = express.Router();
var redis = require("redis");
var myRedis = require('../model/my-redis');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express', session: req.session});
});

router.get('/admin', function (req, res, next) {
    myRedis.getAllKeys(function (result) {
        res.render('admin', {sessionObjects: result});
    })
});

router.get('/session/set/:name/:email', function (req, res) {
    var user = {name: req.params.name, email: req.params.email};
    req.session.user = user;
    res.send('session written to Redis successfully: ' + JSON.stringify(user));
});

router.get('/session/get/', function (req, res) {
    if (req.session.user)
        res.send('Session value stored in Redis: ' + JSON.stringify(req.session.user));
    else
        res.send("No session value stored in Redis ");
});

module.exports = router;
