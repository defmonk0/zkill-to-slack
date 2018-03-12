// While this is not the correct relative location in the codebase
// During creation of Lambda zip file, this will become the correct relative location
// This is so that we can leave the devault Lambda configuration of index.handler
// (index.js must be at the rool level of the zip file)
var monitorZkill = require("./src/monitorZkill");

exports.handler = (event, context, callback) => {
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

	monitorZkill(callback);
};
