"use strict";

const mocha = require('mocha');
const should = require('should');
const AuthenticationModule = require('../lib/AuthenticationModule');

describe('Test AuthenticationModule', function () {
    it('should hash a password', function() {
            const auth = new AuthenticationModule('akmasdvadsjnvlsdjlnv');
            const hash = auth.hashPassword('test', 'test');
            hash.should.be.equal('125d6d03b32c84d492747f79cf0bf6e179d287f341384eb5d6d3197525ad6be8' +
                'e6df0116032935698f99a09e265073d1d6c32c274591bf1d0a20ad67cba921bc');
    });
});
