// While this is not the correct relative location in the codebase
// During creation of Lambda zip file, this will become the correct relative location
// This is so that we can leave the devault Lambda configuration of index.handler
// (index.js must be at the rool level of the zip file)
var monitorZkill = require("./src/monitorZkill");

exports.handler = (event, context, callback) => {
	console.log("queueID: " + process.env.queueID);
	console.log("slackHookURL: " + process.env.slackHookURL);
	console.log("channel: " + process.env.channel);
	console.log("watchForCorp: " + process.env.watchForCorp);
	console.log("watchForAlliance: " + process.env.watchForAlliance);

	monitorZkill(callback);
};
