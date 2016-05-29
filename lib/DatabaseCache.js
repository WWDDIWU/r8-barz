'use strict';

const User = require('./User');
const Business = require('./Business');

/**
 * DatabaseCache - Class wich handles Data and provides a layer for interchange of base64 and json data
 *
 * @param  {type} name description
 * @return {type}      description
 */
const DatabaseCache = function DatabaseCache(dbc) {
    this.dbc = dbc;
    this.master = null;
    this.store = {};
    this.updates = {};
    this.updateCounter = 0;
};

DatabaseCache.prototype = {

    /**
     * setMaster - sets master key store of cache
     *
     * @param  {string} master base64 encoded master key value
     */
    setMaster(master) {
        if(typeof master === 'object') {
            this.master = master;
        } else {
            this.master = this._decode(master);
        }
    },

    /**
     * getAllKeys - returns all available keys
     *
     * @return {object}  available keys splitted into users and bars
     */
    getAllKeys() {
        return this.master;
    },

    /**
     * retrieve - returns the value to a specific key
     *
     * @param  {string} key
     * @return {object}     value
     */
    retrieve(key) {
        return this.store[key];
    },

    /**
     * store - stores the value to a specific key
     *
     * @param  {string} key
     * @param  {string} value base64 encoded JSON
     * @return {object}       userobject
     */
    store(key, value) {
        const type = this._getType(key);
        const data = this._decode(value);

        if (type === 0) {
            this.store[key] = new User(data);
            return this.store[key];
        } else if (type === 1) {
            this.store[key] = new Bar(data);
            return this.store[key];
        } else {
            return -1;
        }
    },

    /**
     * update - sets the value to the specified key in the cache and updates the file if necessary
     *
     * @param  {strings} key
     * @param  {object} value
     * @callback  {function}  callback gets passed to the fetchUpdates function of the master
     *                          dbc or called with no args if nothing gets updated
     */
    update(key, value, callback) {
        const type = this._getType(key);
        
        if (type === -1) {
            if (value instanceof User) {
                this.master.users.push(key);
            } else if (value instanceof Business) {
                this.master.bars.push(key);
            }
            this.updates.master = this._encode(this.master);
        }

        this.store[key] = value;
        this.updates[key] = this._encode(value);
        this.updateCounter += 1;

        if (this.updateCounter%5 === 0)  {
            this.dbc._fetchUpdates(callback);
        } else {
            callback(null, key);
        }
    },

    _getType(key) {
        const user = this.master.users.indexOf(key);
        const bar = this.master.bars.indexOf(key);

        return user !== -1 ? 0 : bar !== -1 ? 1 : -1;
    },

    _decode(base64) {
        const buf = Buffer.from(base64, 'base64');
        return JSON.parse(buf.toString());
    },

    _encode(object) {
        const json = JSON.stringify(object);
        return Buffer.from(json, 'utf-8').toString('base64');
    }
};

module.exports = exports = DatabaseCache;
