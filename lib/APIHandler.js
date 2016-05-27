'use strict';

const path = require('path');

const async = require('async');

const AuthenticationModule = require('./AuthenticationModule');
const DatabaseConnector = require('./DatabaseConnector');


/**
 * APIHandler - General handling of all API functions
 *
 * @param  {String} jwtSecret Secret for the JSON Web Tokens
 */
const APIHandler = function APIHandler(jwtSecret) {
    this.auth = new AuthenticationModule(jwtSecret);
    this.databaseConnector = new DatabaseConnector();

    this.databaseConnector.connect(path.join(__dirname, 'db.json'));
};

APIHandler.prototype = {
    createUser: function createUser() {

    },
    createBusiness: function createBusiness() {

    },
    
    /**
     * login - log a user in, returning token
     *
     * @param  {String} email    User's email
     * @param  {String} password Provided password
     * @param  {function} done     Callback (err, token)
     * @return {String}          (In Callback) jwt - token
     */
    login: function login(email, password, done) {
        const userID = this.auth.md5HalfX(email);

        this.databaseConnector.getKey(userID, function(err, value) {
            if(err) {
                done(err);
            } else {
                const calculatedHash = this.auth.hashPassword(password, value.salt).toString();

                if (calculatedHash === value.password) {
                    const token = this.auth.getToken(value);
                    done(null, token);
                } else {
                    done('Password incorrect', null);
                }
            }
        });
    },

    /**
     * checkUserInTo - Check a user into a business
     *
     * @param  {String} email    User's email
     * @param  {String} business Business' ID
     * @param  {function} done     Callback (err)
     */
    checkUserInTo: function checkUserInTo(email, business, done) {
        const userID = this.auth.md5halfX(email);

        this.databaseConnector.getKey(userID, function(uerr, uvalue) {
            if(uerr) {
                done(uerr);
            } else {
                this.databaseConnector.getKey(business, function(berr, bvalue) {
                    if (berr) {
                        done(berr);
                    } else {
                        // Insert check in in the user record
                        if (uvalue["check-ins"]) {
                            uvalue["check-ins"].push(business);
                        } else {
                            uvalue["check-ins"] = [business];
                        }

                        // Insert check in in the business record
                        if (bvalue["check-ins"]) {
                            bvalue["check-ins"].push(userID);
                        } else {
                            uvalue["check-ins"] = [userID];
                        }

                        this.databaseConnector.setKey(userID, uvalue, function(err) {
                            if (err) {
                                done(err);
                            } else {
                                this.databaseConnector.setKey(business, bvalue, function(err) {
                                    if (err) {
                                        done(err);
                                    } else {
                                        done(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * getCheckIns - Get all check ins of a user
     *
     * @param  {String} email User's email
     * @param  {function} done  Callback (err, checkIns)
     * @return {Array}       (In Callback) Array of checked in businesses
     */
    getCheckIns: function getCheckIns(email, done) {
        const userID = this.auth.md5halfX(email);

        this.databaseConnector.getKey(userID, function(err, value) {
            if (err) {
                done(err);
            } else {
                const checkInKeys = value["check-ins"];
                const checkInNames = [];

                async.forEachOf(checkInKeys, function(k, key, cb) {
                    this.databaseConnector.getKey(key, function(err, value) {
                        if (err) {
                            cb(err);
                        } else {
                            checkInNames.push(value.name);
                            cb(null);
                        }
                    });
                }, function(err) {
                    if (err) {
                        done(err);
                    } else {
                        done(null, checkInNames);
                    }
                });
            }
        });
    },

    /**
     * searchBusiness - Search for businesses by tags
     *
     * @param  {Array} tags Tags to be searched for
     * @param  {function} done Callback(err, businesses)
     * @return {Array}      (In Callback) Array of businesses
     */
    searchBusiness: function searchBusiness(tags, done) {
        const allKeys = this.databaseConnector.getAllKeys();

        async.forEachOf(allKeys, function(k, key, cb){
            const businesses = [];
            this.databaseConnector.getKey(key, function(err, value) {
                if (err) {
                    cb(err);
                } else {
                    for (const tagKey in tags) {
                        if(value.tags.indexOf(tags[tagKey])) {
                            businesses.push(value.name);
                            break;
                        }
                    }
                }
            }, function(err) {
                if (err) {
                    done(err);
                } else {
                    done(null, businesses);
                }
            });
        });
    }
};

module.exports = exports = AuthenticationModule;
