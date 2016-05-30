'use strict';

const should = require('should');

const Business = require('../lib/Business');

describe('Business - Testing getters, setters', function() {
    const mock = {
        id: "1",
        name: "Test",
        email: "test@me.com",
        hash: "1234",
        salt: "1234",
    };

    it('should set attributes', function() {
        const business = new Business(mock.id, mock.name, mock.email, mock.hash, mock.salt);

        business.getTags().should.be.with.lengthOf(0);
        business.getCategory().should.be.equal("");

        business.addTag("test");
        business.getTags().should.be.with.lengthOf(1);
        business.getTags()[0].should.be.equal("test");

        business.setCategory("test");
        business.getCategory().should.be.equal("test");
    });
});
