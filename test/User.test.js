'use strict';

const should = require('should');

const User = require('../lib/User');

describe('User - Testing getters, setters', function() {
    const mock = {
        id: "1",
        name: "Test",
        email: "test@me.com",
        hash: "1234",
        salt: "1234",
    };

    it('should set attributes', function() {
        const user = new User(mock.id, mock.name, mock.email, mock.hash, mock.salt);

        user.getName().should.be.equal(mock.name);

        user.getSalt().should.be.equal(mock.salt);

        user.getPassword().should.be.equal(mock.hash);

        user.getEmail().should.be.equal(mock.email);

        user.getName().should.be.equal(mock.name);
        user.getID().should.be.equal(mock.id);

        user.setEmail("test");
        user.getEmail().should.be.equal("test");

        user.isBusiness().should.be.not.ok;

        const userObj = user.getJSON();
        if (userObj.id === mock.id && userObj.name === mock.name && userObj.email === "test" && userObj.hash === mock.hash && userObj.salt === mock.salt) {
            (true === true).should.be.ok;
        } else {
            (true === false).should.be.ok;
        }

        user.getCheckIns().should.be.with.lengthOf(0);
        user.addCheckIn("test");
        user.getCheckIns().should.be.with.lengthOf(1);
        user.getCheckIns()[0].should.be.equal("test");
    });
});
