'use strict';

const path = require('path');

const async = require('async');

const AuthenticationModule = require('./AuthenticationModule');
const DatabaseConnector = require('./DatabaseConnector');
const User = require('./User');
const Business = require('./Business');


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

    /**
     * createUser - Creates a new User and returns it
     *
     * @param  {String} id User id
     * @param  {String} name User name
     * @param  {String} email User email
     * @param  {String} hash User hash
     * @param  {String} salt User salt
     * @param  {Array - optional} checkIns User checkIns
     * @param  {Array - optional} location User location
     * @param  {Array - optional} category User category
     * @param  {Array - optional} tags User tags
     * @return {User}   The created User if successful
     */
    createUser: function createUser(id, name, email, hash, salt, checkIns) {
        if (!id || !name || !email || !hash || !salt) {
            return false;
        } else {
            return new User(id, name, email, hash, salt, checkIns);
        }
    },

    /**
     * createBusiness - Creates a new business and returns it
     *
     * @param  {String} id Business id
     * @param  {String} name Business name
     * @param  {String} email Business email
     * @param  {String} hash Business hash
     * @param  {String} salt Business salt
     * @param  {Array - optional} checkIns Business checkIns
     * @param  {Array - optional} location Business location
     * @param  {Array - optional} category Business category
     * @param  {Array - optional} tags Business tags
     * @return {Business}   The created business if successful
     */
    createBusiness: function createBusiness(id, name, email, hash, salt, checkIns, location, category, tags) {
        if (!id || !name || !email || !hash || !salt) {
            return false;
        } else {
            return new Business(id, name, email, hash, salt, checkIns, location, category, tags);
        }
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
                const user = User.generateFromJSON(value);
                const calculatedHash = this.auth.hashPassword(password, user.getSalt()).toString();

                if (calculatedHash === user.getPassword()) {
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
    checkUserInTo: function checkUserInTo(email, businessID, done) {
        const userID = this.auth.md5halfX(email);

        this.databaseConnector.getKey(userID, function(uerr, uvalue) {
            if(uerr) {
                done(uerr);
            } else {
                const user = User.generateFromJSON(uvalue);

                this.databaseConnector.getKey(businessID, function(berr, bvalue) {
                    if (berr) {
                        done(berr);
                    } else {
                        const business = Business.generateFromJSON(bvalue);

                        user.addCheckIn(businessID);
                        business.addCheckIn(userID);

                        this.databaseConnector.setKey(userID, user.getJSON(), function(err) {
                            if (err) {
                                done(err);
                            } else {
                                this.databaseConnector.setKey(businessID, business.getJSON(), function(err) {
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
                const user = User.generateFromJSON(value);
                const checkInKeys = user.getCheckIns();
                const checkInNames = [];

                async.forEachOf(checkInKeys, function(k, key, cb) {
                    this.databaseConnector.getKey(key, function(err, value) {
                        const business = Business.generateFromJSON(value);
                        if (err) {
                            cb(err);
                        } else {
                            checkInNames.push(business.getName());
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
                    const business = Business.generateFromJSON(value);
                    const businessTags = Business.getTags();
                    if (business.isBusiness()) {
                        for (const tagKey in tags) {
                            if(businessTags.indexOf(tags[tagKey])) {
                                businesses.push(value.name);
                                break;
                            }
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
