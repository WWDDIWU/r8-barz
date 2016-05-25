'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * AuthenticationModule
 *
 * @param  {string} jwtSecret
 * @return {object}             instance of AuthenticationModule
 */
const AuthenticationModule = function AuthenticationModule(jwtSecret) {
    this.jwtSecret = jwtSecret;
};

AuthenticationModule.prototype = {

    /**
     * hashPassword - Hashes the password value with sha512 and the salt
     *
     * @param  {string} password
     * @param  {salt} salt
     * @return {string} sha512 hashed value
     */
    hashPassword: function hashPassword(password, salt) {
        return crypto.createHash('sha512').update(password + salt).digest('hex');
    },

    /**
     * jwtAuth - Middleware Function for use in Express to verify and decode a JSON Web Token
     */
    jwtAuth: function jwtAuth(req, res, next) {
        const token = req.headers.authorization.substring('bearer '.length, req.headers.authorization.length);
        if (token) {
            jwt.verify(token, this.jwtSecret, function(err, decoded) {
                if (err) {
                    return res.sendStatus(401);
                } else {
                    req.jwt = decoded;
                    next();
                }
            });
        } else {
            return res.sendStatus(401);
        }
    }
};

module.exports = exports = AuthenticationModule;
