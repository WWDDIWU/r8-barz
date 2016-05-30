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
        return crypto.createHash('sha512').update(password + salt).digest('hex').toString();
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
    },

    /**
     * md5HalfX - creates an md5HalfX hash of the value it is called with
     *
     * @param  {string} value
     * @return {string}       md5HalfX hash
     */
    md5HalfX(value) {
        const hash = crypto.createHash('md5').update(value).digest('hex');
        const hashHalfs = [hash.substr(0, hash.length / 2), hash.substr(hash.length / 2, hash.length)];
        const halfX = [];
        hashHalfs[0].split('').forEach((e, i) => halfX.push(String.fromCharCode(e.charCodeAt(0) / 2 + hashHalfs[1].charCodeAt(i) / 2)));
        return halfX.join('');
    },

    /**
     * generateSalt
     *
     * @return {string}  salt
     */
    generateSalt() {
        return crypto.randomBytes(64).toString('hex');
    }
};

module.exports = exports = AuthenticationModule;
