'use strict';

const util = require('util');

const User = require('./User');

const Business = function(id, name, email, hash, salt, checkIns, location, category, tags) {

    User.call(this, id, name, email, hash, salt, checkIns);

    this.tags = tags || [];
    this.category = category || "";
    this.location = location || "";
};

Business.prototype = {

    /**
     * generateFromJSON - Generates a Business Object from JSON
     *
     * @param  {Object} json JSON object
     * @return {Business}      Description Object
     */
    generateFromJSON: function generateFromJSON(json) {
        return Business.call(this, json.id, json.name, json.email, json.hash, json.salt, json.checkIns, json.location, json.category, json.tags);
    },

    /*
     *  Getters and setters
     */
    getJSON() {
        const obj = User.call(this);
        obj.tags = this.tags;
        obj.category = this.category;
        obj.location = this.location;
        return obj;
    },
    getTags() {
        return this.tags;
    },
    addTag(tag) {
        this.tags.push(tag);
    },
    getCategory() {
        return this.category;
    },
    setCategory(category) {
        this.category = category;
    }
};

Business.prototype.constructor = Business;

module.exports = exports = Business;
