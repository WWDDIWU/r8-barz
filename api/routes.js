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
        id,
        name,
        email,
        hash,
        salt,
        checkIns,
        location,
        category,
        tags
    } = req.body;

    APIHandler.createBusiness({
        id,
        name,
        email,
        hash,
        salt,
        checkIns,
        location,
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
        id,
        name,
        email,
        hash,
        salt,
        checkIns
    } = req.body;

    APIHandler.createUser({
        id,
        name,
        email,
        hash,
        salt,
        checkIns
    }, (err, key) => {
        if (err) {
            res.status(401).send(err);
        } else {
            res.status(201).send(JSON.stringify(key));
        }
    });
});

module.exports = exports = router;
