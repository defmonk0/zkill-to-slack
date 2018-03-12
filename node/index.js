var monitorZkill = require("../src/monitorZkill");
var setEnvironmentVariables = require("./config/setEnvironmentVariables");

setEnvironmentVariables();

console.log("queueID: " + process.env.queueID);
console.log("slackHookURL: " + process.env.slackHookURL);
console.log("channel: " + process.env.channel);
console.log("watchForCorp: " + process.env.watchForCorp);
console.log("watchForAlliance: " + process.env.watchForAlliance);

function watch() {
	setTimeout(function() {
		monitorZkill(watch);
	}, 10000);
}

watch();
