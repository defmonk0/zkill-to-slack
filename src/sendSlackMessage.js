var Slack = require("slack-node");

var sendSlackMessage = function(data, callback) {
	console.log("Attempting to send a slack message");

	// Create a shortcut to accessing our victim
	var victim = data.killInfo.killmail.victim;

	// Create the formatted slack post using the data
	var formattedKillInfo = {
		fields: [
			{
				title: "Ship",
				value:
					"<https://zkillboard.com/ship/" +
					victim.ship_type_id +
					"/|" +
					data.map.getParameter(victim.ship_type_id, "name") +
					">",
				short: true,
			},
			{
				title: "System",
				value:
					"<https://zkillboard.com/system/" +
					data.killInfo.killmail.solar_system_id +
					"/|" +
					data.map.getParameter(
						data.killInfo.killmail.solar_system_id,
						"name"
					) +
					">",
				short: true,
			},
			{
				title: "Total Damage",
				value: victim.damage_taken,
				short: true,
			},
			{
				title: "Pilots Involved",
				value: data.killInfo.killmail.attackers.length,
				short: true,
			},
			{
				title: "Value",
				value:
					data.killInfo.zkb.totalValue.toLocaleString(undefined, {
						minimumFractionDigits: "2",
					}) + " ISK",
				short: true,
			},
			{
				title: "Zkill Points",
				value: data.killInfo.zkb.points,
				short: true,
			},
		],
		title:
			data.finalBlow +
			" killed " +
			data.map.getParameter(victim.character_id, "name") +
			" (" +
			data.map.getParameter(victim.corporation_id, "name") +
			")",
		title_link: "https://zkillboard.com/kill/" + killInfo.killID,
		thumb_url:
			"https://imageserver.eveonline.com/Render/" +
			victim.ship_type_id +
			"_128.png",
		fallback:
			data.finalBlow +
			" killed " +
			data.map.getParameter(victim.character_id, "name") +
			" (" +
			data.map.getParameter(victim.corporation_id, "name") +
			")",
		color: data.color,
		footer: "zKill-to-Slack, github@defmonk0 | github@MattCopenhaver",
	};

	// Fill in our involved pilots if need be
	if (data.alliedPilots.length > 0) {
		formattedKillInfo.fields.push({
			title: data.involvedPilotsMessage,
			value: data.alliedPilots.join(", "),
			short: false,
		});
	}

	// Prep the attachments container - Slack can be a bit weird
	var attachments = [];
	attachments.push(formattedKillInfo);
	console.log("Sending attachments to Slack: " + JSON.stringify(attachments));

	// Actually send the data off, and use our callback when finished
	slack = new Slack();
	slack.setWebhook(process.env.slackHookURL);
	slack.webhook(
		{
			attachments: attachments,
			channel: process.env.channel,
		},
		callback
	);
};

module.exports = sendSlackMessage;
