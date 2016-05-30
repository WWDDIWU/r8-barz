"use strict";

const mocha = require('mocha');
const should = require('should');
const fs = require('fs');
const path = require('path');
const asyncjs = require('async');
const User = require('../lib/User');
const Business = require('../lib/Business');
const DatabaseConnector = require('../lib/DatabaseConnector');

describe('Test DatabaseConnector', function() {
    const dbpath = path.join(__dirname, '..', 'testdb.json');

    it('should create a new file', function(done) {
        const dbc = new DatabaseConnector();
        dbc.connect(dbpath, (err) => {
            if (err) {
                done(err);
            } else {
                const usr = new User('asdfgh1234', '', 'a@b.c', 'aasdasd', 'asdasd', []);
                dbc.setKey(usr.id, usr, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        dbc.close((err) => {
                            if (err) {
                                done(err);
                            } else {
                                fs.readFile(dbpath, 'utf-8', (err, data) => {
                                    if (err) {
                                        done(err);
                                    }
                                    (JSON.parse(data)).should.be.deepEqual({
                                        "master": "eyJ1c2VycyI6WyJhc2RmZ2gxMjM0Il0sImJhcnMiOltdfQ==",
                                        "asdfgh1234": "eyJpZCI6ImFzZGZnaDEyMzQiLCJuYW1lIjoiIiwiZW1haWwiOiJhQGIuYyIsInBhc3N3b3JkIjoiYWFzZGFzZCIsInNhbHQiOiJhc2Rhc2QiLCJjaGVja0lucyI6W119"
                                    });
                                    done();
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    it('should auto write file after 5 updates', function(done) {
        const dbc = new DatabaseConnector();
        dbc.connect(dbpath, (err) => {
            if (err) {
                done(err);
            } else {
                const usr = [
                    new User('asdfgh12342', '', 'a@b.c', 'aasdasd', 'asdasd', []),
                    new User('asdfgh12343', '', 'a@b.c', 'aasdasd', 'asdasd', []),
                    new User('asdfgh12344', '', 'a@b.c', 'aasdasd', 'asdasd', []),
                    new User('asdfgh12345', '', 'a@b.c', 'aasdasd', 'asdasd', []),
                    new User('asdfgh12346', '', 'a@b.c', 'aasdasd', 'asdasd', [])
                ];
                asyncjs.each(usr, (user, cb) => {
                    dbc.setKey(user.id, user, cb);
                }, (err) => {
                    if (err) {
                        done(err);
                    } else {
                        fs.readFile(dbpath, 'utf-8', (err, data) => {
                            if (err) {
                                done(err);
                            } else {
                                (JSON.parse(data)).should.be.deepEqual({
                                    "master": "eyJ1c2VycyI6WyJhc2RmZ2gxMjM0IiwiYXNkZmdoMTIzNDIiLCJhc2RmZ2gxMjM0MyIsImFzZGZnaDEyMzQ0IiwiYXNkZmdoMTIzNDUiLCJhc2RmZ2gxMjM0NiJdLCJiYXJzIjpbXX0=",
                                    "asdfgh1234": "eyJpZCI6ImFzZGZnaDEyMzQiLCJuYW1lIjoiIiwiZW1haWwiOiJhQGIuYyIsInBhc3N3b3JkIjoiYWFzZGFzZCIsInNhbHQiOiJhc2Rhc2QiLCJjaGVja0lucyI6W119",
                                    "asdfgh12342": "eyJpZCI6ImFzZGZnaDEyMzQyIiwibmFtZSI6IiIsImVtYWlsIjoiYUBiLmMiLCJwYXNzd29yZCI6ImFhc2Rhc2QiLCJzYWx0IjoiYXNkYXNkIiwiY2hlY2tJbnMiOltdfQ==",
                                    "asdfgh12343": "eyJpZCI6ImFzZGZnaDEyMzQzIiwibmFtZSI6IiIsImVtYWlsIjoiYUBiLmMiLCJwYXNzd29yZCI6ImFhc2Rhc2QiLCJzYWx0IjoiYXNkYXNkIiwiY2hlY2tJbnMiOltdfQ==",
                                    "asdfgh12344": "eyJpZCI6ImFzZGZnaDEyMzQ0IiwibmFtZSI6IiIsImVtYWlsIjoiYUBiLmMiLCJwYXNzd29yZCI6ImFhc2Rhc2QiLCJzYWx0IjoiYXNkYXNkIiwiY2hlY2tJbnMiOltdfQ==",
                                    "asdfgh12345": "eyJpZCI6ImFzZGZnaDEyMzQ1IiwibmFtZSI6IiIsImVtYWlsIjoiYUBiLmMiLCJwYXNzd29yZCI6ImFhc2Rhc2QiLCJzYWx0IjoiYXNkYXNkIiwiY2hlY2tJbnMiOltdfQ==",
                                    "asdfgh12346": "eyJpZCI6ImFzZGZnaDEyMzQ2IiwibmFtZSI6IiIsImVtYWlsIjoiYUBiLmMiLCJwYXNzd29yZCI6ImFhc2Rhc2QiLCJzYWx0IjoiYXNkYXNkIiwiY2hlY2tJbnMiOltdfQ=="
                                });
                                (dbc.cache.updateCounter%5).should.be.equal(0);
                                done();
                            }
                        });
                    }
                });
            }
        });
    });

    after((done) => {
        fs.unlink(dbpath, done);
    });
});
