'use strict';


/**
 * const - The User Object
 *
 * @param  {String} id       User's ID
 * @param  {String} name     User's name
 * @param  {String} email    User's email
 * @param  {String} hash     User's password
 * @param  {String} salt     User's salt
 * @param  {Array} checkIns User's check ins
 * @return {User}
 */
const User = function(id, name, email, hash, salt, checkIns) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = hash;
    this.salt = salt;

    // Optionals
    this.checkIns = checkIns || [];
};

User.prototype = {
    /**
     *    Getters and setters
     */
    getSalt() {
        return this.salt;
    },
    getPassword() {
        return this.password;
    },
    getEmail() {
        return this.email;
    },
    setEmail(email) {
        this.email = email;
    },
    getName() {
        return this.name;
    },
    getID() {
        return this.id;
    },
    addCheckIn(checkIn) {
        this.checkIns.push(checkIn);
    },
    getCheckIns() {
        return this.checkIns;
    },
    isBusiness() {
        return (this.name !== undefined);
    }
};

module.exports = exports = User;
