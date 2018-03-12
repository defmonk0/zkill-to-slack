var environmentVariables = require("./environmentVariables.json");

var setEnvironmentVariables = function() {
	process.env.queueID = environmentVariables.queueID;
	process.env.slackHookURL = environmentVariables.slackHookURL;
	process.env.channel = environmentVariables.channel;
	process.env.watchForCorp = environmentVariables.watchForCorp;
	process.env.watchForAlliance = environmentVariables.watchForAlliance;
};

module.exports = setEnvironmentVariables;
