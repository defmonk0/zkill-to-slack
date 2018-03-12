var monitorZkill = require("./src/monitorZkill");

exports.handler = (event, context, callback) => {
	process.env.watchFor = JSON.parse(process.env.watchFor);

	console.log(
		"Environment: " +
			JSON.stringify({
				channel: process.env.channel,
				queueID: process.env.queueID,
				slackHookURL: process.env.slackHookURL,
				watchFor: process.env.watchFor,
			})
	);

	monitorZkill(callback);
};
