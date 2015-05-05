var logger = require("./util/logger"),
    configger = require("./util/configger"),
    packageJson = require('./package.json'),
    config;

config = configger.load();

logger.addTargets(config.loggingTargets);

logger.info(packageJson.name + ' ' + packageJson.version);
