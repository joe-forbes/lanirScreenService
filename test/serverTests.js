var should = require('chai').should(),
    stdout = require('test-console').stdout,
    server;

describe('server tests', function () {

    it('should not blow up when the server is invoked by \'require\'', function () {
        server = require('../server');
    });

});

