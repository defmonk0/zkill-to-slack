var monitorZkill = require("../src/monitorZkill");
var setEnvironmentVariables = require("./config/setEnvironmentVariables");
var idsToNames = require("../src/idsToNames");

setEnvironmentVariables();

console.log(
	"Environment: " +
		JSON.stringify({
			channel: process.env.channel,
			queueID: process.env.queueID,
			slackHookURL: process.env.slackHookURL,
			watchFor: process.env.watchFor,
		})
);

function watch() {
	setTimeout(function() {
		monitorZkill(watch);
	}, 10000);
}

monitorZkill(watch);
