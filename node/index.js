var monitorZkill = require("../src/monitorZkill");
var setEnvironmentVariables = require("./config/setEnvironmentVariables");

// Process our env json so its accessible
setEnvironmentVariables();

// Log the env for debugging
console.log(
	"Environment: " +
		JSON.stringify({
			channel: process.env.channel,
			queueID: process.env.queueID,
			slackHookURL: process.env.slackHookURL,
			watchFor: process.env.watchFor
				.split(",")
				.map(item => parseInt(item.trim())),
		})
);

// Timer function for executing on an interval
function watch() {
	setTimeout(function() {
		monitorZkill(watch);
	}, 10000);
}

// Start processing kills
monitorZkill(watch);
