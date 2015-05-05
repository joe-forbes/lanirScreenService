// based on http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
var winston = require('winston'),
    defaultConsoleConfig = {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    },
    defaultFileConfig = {
        level: 'info',
        filename: './app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
    },
    winstonLogger = new winston.Logger({
        exitOnError: false
    }),
    logger = {

        removeTarget: function (targetSpec) {
            switch (targetSpec) {
                case "file":
                    winstonLogger.remove(winston.transports.File);
                    break;
                case "console":
                    winstonLogger.remove(winston.transports.Console);
                    break;
                default:
                    throw new Error("Invalid targetSpec \"" + targetSpec + "\"")
            }
        },

        /**
         * @param {{targetType: string, targetConfig: {}}}config
         */
        addTarget: function (config) {
            if (null == config) {
                winstonLogger.add(winston.transports.File, defaultFileConfig);
            } else {
                switch (config.targetType) {
                    case "file":
                        winstonLogger.add(winston.transports.File, config.targetConfig
                        || defaultFileConfig);
                        break;
                    case "console":
                        winstonLogger.add(winston.transports.Console, config.targetConfig
                        || defaultConsoleConfig);
                        break;
                    default:
                        throw new Error("Invalid targetType \"" + config.targetType + "\"");
                }
            }
        },

        addTargets: function (targets) {
            if (targets == null) {
                return;
            }

            if (targets.constructor === Array) {
                for (var i = 0; i < targets.length; i++) {
                    this.addTarget(targets[i]);
                }
            } else {
                this.addTarget(targets);
            }
        },

        debug: function (args) {
            winstonLogger.debug.apply(this, arguments);
        },

        info: function (args) {
            winstonLogger.info.apply(this, arguments);
        },

        warn: function (args) {
            winstonLogger.warn.apply(this, arguments);
        },

        error: function (args) {
            winstonLogger.error.apply(this, arguments);
        },

        stream: {
            write: function (message) {
                winstonLogger.info(message);
            }
        }
    };

winston.emitErrs = true;
module.exports = logger;

