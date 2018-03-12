var monitorZkill = require("../src/monitorZkill");
var setEnvironmentVariables = require("./config/setEnvironmentVariables");

setEnvironmentVariables();

console.log(
	"Environment: " +
		JSON.stringify({
			channel: process.env.channel,
			queueID: process.env.queueID,
			slackHookURL: process.env.slackHookURL,
			watchForAlliance: process.env.watchForAlliance,
			watchForCorp: process.env.watchForCorp,
		})
);

function watch() {
	setTimeout(function() {
		monitorZkill(watch);
	}, 10000);
}

watch();
