var monitorZkill = require("./src/monitorZkill");

exports.handler = (event, context, callback) => {
	console.log(
		"Environment: " +
			JSON.stringify({
				channel: process.env.channel,
				queueID: process.env.queueID,
				slackHookURL: process.env.slackHookURL,
				watchFor: process.env.watchFor
					.split(",")
					.map(item => item.trim()),
			})
	);

	monitorZkill(callback);
};
