'use strict';
const express = require('express');
const router = express.Router();
const APIHandler = new(require('../lib/APIHandler'))('aae6691ba4f5a237b2557841fb1d6277');

router.get('/', function(req, res, next) {
    res.sendStatus(200);
});

router.get('/businesses', function(req, res) {
    APIHandler.searchBusiness((err, buisnesses) => {
        if (err) {
            res.status(401).send(err);
        } else {
            res.status(201).send(JSON.stringify(buisnesses));
        }
    });
});

router.post('/businesses', function(req, res) {
    const {
        name,
        email,
        password,
        latitude,
        longitude,
        category,
        tags
    } = req.body;

    APIHandler.createBusiness({
        name,
        email,
        password,
        latitude,
        longitude,
        category,
        tags
    }, (err, key) => {
        if (err) {
            res.status(401).send(err);
        } else {
            res.status(201).send(JSON.stringify(key));
        }
    });
});

router.post('/users', function(req, res) {
    const {
        email,
        password
    } = req.body;

    APIHandler.createUser({
        email,
        password
    }, (err, key) => {
        if (err) {
            res.status(401).send(err);
        } else {
            res.status(201).send(JSON.stringify(key));
        }
    });


    router.post('/login', function(req, res) {
        APIHandler.login(req.body.email, req.body.password, (err, token) => {
            if (err) {
                res.status(401).send(err);
            } else {
                res.status(201).send(token);
            }
        });
    });
});

module.exports = exports = router;
