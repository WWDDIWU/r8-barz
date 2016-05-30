'use strict';

const path = require('path');

const asyncjs = require('async');

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

    this.databaseConnector.connect(path.join(__dirname, '..', 'db.json'));
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
     * @param  {Array} checkIns User checkIns
     * @param  {Array} location User location
     * @param  {Array} category User category
     * @param  {Array} tags User tags
     * @return {User}   The created User if successful
     */
    createUser: function createUser(info, done) {
        if (!info.email || !info.password) {
            done('not enough info');
        } else {
            const salt = this.auth.generateSalt();
            const hash = this.auth.hashPassword(info.password, salt);
            const id = this.auth.md5HalfX(info.email);
            const user = new User(id, info.name, info.email, hash, salt, info.checkIns);
            this.databaseConnector.setKey(id, user, done);
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
     * @param  {Array} checkIns Business checkIns
     * @param  {Array} location Business location
     * @param  {Array} category Business category
     * @param  {Array} tags Business tags
     * @callback {Business}   The created business if successful or error
     */
    createBusiness: function createBusiness(info, done) {
        if (!info.name || !info.email || !info.password) {
            done('not enough info');
        } else {
            const salt = this.auth.generateSalt();
            const hash = this.auth.hashPassword(info.password, salt);
            const id = this.auth.md5HalfX(info.email);
            const business = new Business(id, info.name, info.email, hash, salt, info.checkIns, {
                latitude: info.latitude,
                longitude: info.longitude
            }, info.category, info.tags);
            this.databaseConnector.setKey(id, business, done);
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

        this.databaseConnector.getKey(userID, (err, value) => {
            if (err) {
                done(err);
            } else {
                const user = new User(value.id, value.name, value.email, value.password, value.salt, value.checkIns);
                const calculatedHash = this.auth.hashPassword(password, user.getSalt());

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
            if (uerr) {
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

                        this.databaseConnector.setKey(userID, user, function(err) {
                            if (err) {
                                done(err);
                            } else {
                                this.databaseConnector.setKey(businessID, business, function(err) {
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
                const user = new User(value.id, value.name, value.email, value.hash, value.salt, value.checkIns);
                const checkInKeys = user.getCheckIns();
                const checkInNames = [];

                asyncjs.forEachOf(checkInKeys, function(k, key, cb) {
                    this.databaseConnector.getKey(key, function(err, value) {
                        const business = new Business(value.id, value.name, value.email, value.hash, value.salt, value.checkIns, value.location, value.category, value.tags);
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
        let all = false;
        const businesses = [];

        if (typeof tags === 'function') {
            done = tags;
            all = true;
        }

        asyncjs.each(allKeys.bars, (key, cb) => {
            this.databaseConnector.getKey(key, function(err, value) {
                if (err) {
                    cb(err);
                } else {
                    const business = new Business(value.id, value.name, value.email, value.hash, value.salt, value.checkIns, value.location, value.category, value.tags);
                    business.longitude = business.location.longitude;
                    business.latitude = business.location.latitude;
                    if (!all) {
                        const businessTags = business.getTags();
                        for (const tagKey in tags) {
                            if (businessTags.indexOf(tags[tagKey])) {
                                businesses.push(business);
                                break;
                            }
                        }
                    } else {
                        businesses.push(business);
                    }
                    cb();
                }
            });
        }, function(err) {
            if (err) {
                done(err);
            } else {
                done(null, businesses);
            }
        });
    }
};

module.exports = exports = APIHandler;
