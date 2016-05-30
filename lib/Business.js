'use strict';

const util = require('util');

const User = require('./User');

const Business = function Business(id, name, email, hash, salt, checkIns, location, category, tags) {

    User.call(this, id, name, email, hash, salt, checkIns);

    this.tags = tags || [];
    this.category = category || "";
    this.location = location || "";
};

Business.prototype = {

    /*
     *  Getters and setters
     */
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
