var should = require('chai').should(),
    exec = require('child_process').exec,
    path = require('path'),
    packageJson = require('../package.json');

describe('server tests', function () {

    it('should not blow up when the server is invoked by \'require\'', function () {
        var server = require('../server');
    });

    it('should log an info message with the application version as the first message logged', function(done) {
        var cmd,
            opt,
            inspectOutput,
            parentDir;

        cmd = 'npm start';

        inspectOutput = (
            function (stderr, stdout) {
                var output, pattern, regExp;
                should.not.exist(stderr);
                should.exist(stdout);
                output = stdout.split('\n');
                output.length.should.be.at.least(5);

                pattern = packageJson.name + ' ' + packageJson.version + '$';
                regExp = new RegExp(pattern);
                output[4].should.match(regExp);
                done();
            }
        );

        exec(cmd, null, inspectOutput);
    });

});