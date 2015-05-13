var chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    exec = require('child_process').exec,
    packageJson = require('../package.json'),
    fs = require('fs'),
    LineByLine = require('line-by-line');

describe('server tests', function () {

    it('should not blow up when the server is invoked by \'require\'', function () {
        require('../server');
    });

    it('should log a debug message with the application package.json', function (done) {

        if (fs.existsSync('./test-log.json')) {
            fs.unlinkSync('./test-log.json');
        }

        var cmd,
            inspectOutput,
            programStartTime;

        cmd = 'configFile=test/resources/debugConfig.json npm start';

        inspectOutput = (
            function (stderr) {
                var logReader, found;
                should.not.exist(stderr);
                logReader = new LineByLine('./test-log.json');
                logReader.on('error', function (err) {
                    throw new Error('Error raised by logReader: ' + err);
                });
                logReader.on('line', function (line) {
                    var logEntry = JSON.parse(line);
                    logEntry.date = new Date(logEntry.timestamp);
                    if (logEntry.level = 'debug' && logEntry.date > programStartTime) {
                        if (logEntry.hasOwnProperty('package.json')) {
                            logEntry['package.json'].should.eql(packageJson);
                            logReader.close();
                            found = true;
                            done();
                        }
                    }
                });
                logReader.on('end', function () {
                    if (!found) {
                        assert.fail('log end reached without finding expected message', 'log message searched for found');
                    }
                });
            }
        );

        programStartTime = new Date();
        exec(cmd, null, inspectOutput);
    });

    it('should log a debug message with the application config', function (done) {

        if (fs.existsSync('./test-log.json')) {
            fs.unlinkSync('./test-log.json');
        }

        var cmd,
            inspectOutput,
            programStartTime;

        cmd = 'configFile=test/resources/debugConfig.json npm start';

        inspectOutput = (
            function (stderr) {
                var logReader, found,
                    config = require('./resources/debugConfig.json');
                config.configFile = 'test/resources/debugConfig.json';
                config.type = 'literal';
                config.$0 = 'node ./server.js';
                config._ = [];
                should.not.exist(stderr);
                logReader = new LineByLine('./test-log.json');
                logReader.on('error', function (err) {
                    throw new Error('Error raised by logReader: ' + err);
                });
                logReader.on('line', function (line) {
                    var logEntry = JSON.parse(line);
                    logEntry.date = new Date(logEntry.timestamp);
                    if (logEntry.level = 'debug' && logEntry.date > programStartTime) {
                        if (logEntry.hasOwnProperty('config')) {
                            logEntry.config.should.eql(config);
                            logReader.close();
                            found = true;
                            done();
                        }
                    }
                });
                logReader.on('end', function () {
                    if (!found) {
                        assert.fail('log end reached without finding expected message', 'log message searched for found');
                    }
                });
            }
        );

        programStartTime = new Date();
        exec(cmd, null, inspectOutput);
    });

    it('should log an info message with the application name and version', function (done) {

        if (fs.existsSync('./test-log.json')) {
            fs.unlinkSync('./test-log.json');
        }

        var cmd,
            inspectOutput,
            programStartTime;

        cmd = 'configFile=test/resources/debugConfig.json npm start';

        inspectOutput = (
            function (stderr) {
                var logReader, found,
                    config = require('./resources/debugConfig.json');
                config.configFile = 'test/resources/debugConfig.json';
                config.type = 'literal';
                config.$0 = 'node ./server.js';
                config._ = [];
                should.not.exist(stderr);
                logReader = new LineByLine('./test-log.json');
                logReader.on('error', function (err) {
                    throw new Error('Error raised by logReader: ' + err);
                });
                logReader.on('line', function (line) {
                    var logEntry = JSON.parse(line);
                    logEntry.date = new Date(logEntry.timestamp);
                    if (logEntry.level = 'info' && logEntry.date > programStartTime) {
                        if (logEntry.message === packageJson.name + ' ' + packageJson.version) {
                            logReader.close();
                            found = true;
                            done();
                        }
                    }
                });
                logReader.on('end', function () {
                    if (!found) {
                        assert.fail('log end reached without finding expected message', 'log message searched for found');
                    }
                });
            }
        );

        programStartTime = new Date();
        exec(cmd, null, inspectOutput);
    });

    it('should write the application version to stdout when started without arguments', function (done) {
        var cmd,
            inspectOutput;

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