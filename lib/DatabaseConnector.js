'use strict';

const DatabaseCache = require('./DatabaseCache');
const fs = require('fs');

/**
 * DatabaseConnector - Class wich handles the Database, on file base
 *
 * @return {object}  instance of DatabaseConnector
 */
const DatabaseConnector = function DatabaseConnector() {
    this.connection = null;
    this.path = null;
    this.cache = new DatabaseCache(this);
};

DatabaseConnector.prototype = {

    /**
     * connect - gets the database content from the specified path
     *
     * @param  {type} path              db file
     * @callback  {function} callback   gets called either with an error or if connection is ready
     */
    connect(path, callback) {
        if(typeof callback === 'undefined') {
            callback = (() => {});
        }

        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                if (err.errno === -2) {
                    this.connection = {};
                    this.cache.setMaster({
                        users: [],
                        bars: []
                    });
                    this.path = path;
                    callback();
                } else {
                    callback(err);
                }
            } else {
                this.path = path;
                if (data.match(/{(?:"[A-z0-9=+/\-_]{6,16}": ?"[A-z0-9=+/\-_]+"(, |,)?)+}/)) {
                    data = JSON.parse(data);
                    this.cache.setMaster(data.master);
                    this.connection = data;
                    callback();
                } else {
                    this.connection = {};
                    this.cache.setMaster({
                        users: [],
                        bars: []
                    });
                    callback();
                }
            }
        });
    },

    /**
     * getAllKeys - access the master record in the cache and returns all available keys
     *
     * @return {object}  available keys splitted into users and bars
     */
    getAllKeys() {
        return this.cache.getAllKeys();
    },

    /**
     * getKey - retrieve key from cache or from db
     *
     * @param  {string} key
     * @return {object}     value
     */
    getKey(key, callback) {
        let value = this.cache.retrieve(key);

        if (!value) {
            value = this.cache.store(key, this.connection[key]);
        }
        callback(null, value);
    },

    /**
     * setKey - updates the key in the cache
     *
     * @param  {string} key
     * @param  {object} value
     * @callback {function} callback which gets passed to the cache, in case of a fileupdate
     */
    setKey(key, value, callback) {
        this.cache.update(key, value, callback);
    },

    /**
     * close - will remove all data from the object, after a last file update;
     *
     * @callback  {function} gets called with an error or no arguments after everything is finished
     */
    close(callback) {
        this._fetchUpdates((err) => {
            if (err) {
                callback(err);
            } else {
                delete this.cache;
                delete this.connection;
                callback();
            }
        });
    },

    _fetchUpdates(callback) {
        if (this.cache.updates.length !== 0) {
            for (const updateKey in this.cache.updates) {
                if (this.cache.updates.hasOwnProperty(updateKey)) {
                    this.connection[updateKey] = this.cache.updates[updateKey];
                    delete this.cache.updates[updateKey];
                }
            }

            fs.writeFile(this.path, JSON.stringify(this.connection), 'utf-8', (err) => {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            });
        } else {
            callback();
        }
    }

};

module.exports = exports = DatabaseConnector;
