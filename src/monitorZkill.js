var request = require("request");
var Slack = require("slack-node");

slack = new Slack();

var monitorZkill = function(finishingCallback) {
	console.log("Starting to pull data from Zkill RedisQ");
	slack.setWebhook(process.env.slackHookURL);

	var headers = {
		"accept-encoding": "null",
		Accept: "application/json",
		authority: "redisq.zkillboard.com",
		"Content-Type": "application/json",
	};

	var options = {
		url:
			"https://redisq.zkillboard.com/listen.php?ttw=1&queueID=" +
			process.env.queueID,
		headers: headers,
	};

	var relatedCount = 0;
	var unrelatedCount = 0;

	function callback(error, response, body) {
		if (!error && response.statusCode == 200 && JSON.parse(body).package) {
			killInfo = JSON.parse(body).package;

			var killingPilot = "Unknown";
			var alliedPilots = [];
			var pushToSlack = false;
			var color = "good";
			var involvedPilotsMessage = "Friendly Pilots Involved";

			killInfo.killmail.attackers.forEach(function(attacker) {
				if (attacker.finalBlow) {
					if (attacker.character) {
						killingPilot =
							attacker.character.name +
							" (" +
							attacker.corporation.name +
							")";
					} else if (attacker.shipType) {
						killingPilot = attacker.shipType.name;
					}
				}
				if (
					(attacker.corporation &&
						attacker.corporation.name ===
							process.env.watchForCorp) ||
					(attacker.alliance &&
						process.env.watchForAlliance &&
						attacker.alliance.name === process.env.watchForAlliance)
				) {
					pushToSlack = true;
					console.log(
						"Found a kill (Attacking Corp/Alliance): " +
							JSON.stringify(killInfo)
					);
					alliedPilots.push(
						"<https://zkillboard.com/character/" +
							attacker.character.id +
							"/|" +
							attacker.character.name +
							">"
					);
				}
			});

			if (
				(killInfo.killmail.victim.corporation &&
					killInfo.killmail.victim.corporation.name ===
						process.env.watchForCorp) ||
				(killInfo.killmail.victim.alliance &&
					process.env.watchForAlliance &&
					killInfo.killmail.victim.alliance.name ===
						process.env.watchForAlliance)
			) {
				color = "danger";
				involvedPilotsMessage = "Friendly Fire";
				pushToSlack = true;
				console.log(
					"Found a kill (Victim Corp/Alliance): " +
						JSON.stringify(killInfo)
				);
			}

			if (pushToSlack) {
				var formattedKillInfo = {
					fields: [
						{
							title: "Ship",
							value:
								"<https://zkillboard.com/ship/" +
								killInfo.killmail.victim.shipType.id +
								"/|" +
								killInfo.killmail.victim.shipType.name +
								">",
							short: true,
						},
						{
							title: "System",
							value:
								"<https://zkillboard.com/system/" +
								killInfo.killmail.solarSystem.id +
								"/|" +
								killInfo.killmail.solarSystem.name +
								">",
							short: true,
						},
						{
							title: "Total Damage",
							value: killInfo.killmail.victim.damageTaken,
							short: true,
						},
						{
							title: "Pilots Involved",
							value: killInfo.killmail.attackerCount,
							short: true,
						},
						{
							title: "Value",
							value:
								killInfo.zkb.totalValue.toLocaleString(
									undefined,
									{
										minimumFractionDigits: "2",
									}
								) + " ISK",
							short: true,
						},
						{
							title: "Zkill Points",
							value: killInfo.zkb.points,
							short: true,
						},
					],
					title:
						killingPilot +
						" killed " +
						killInfo.killmail.victim.character.name +
						" (" +
						killInfo.killmail.victim.corporation.name +
						")",
					title_link:
						"https://zkillboard.com/kill/" + killInfo.killID,
					thumb_url:
						"https://imageserver.eveonline.com/Render/" +
						killInfo.killmail.victim.shipType.id +
						"_128.png",
					fallback:
						killingPilot +
						" killed " +
						killInfo.killmail.victim.character.name +
						" (" +
						killInfo.killmail.victim.corporation.name +
						")",
					color: color,
					footer:
						"Zkill-to-Slack - https://github.com/MattCopenhaver/zkill-to-slack",
				};

				if (alliedPilots.length > 0) {
					formattedKillInfo.fields.push({
						title: involvedPilotsMessage,
						value: alliedPilots.join(", "),
						short: false,
					});
				}

				attachments = [];
				attachments.push(formattedKillInfo);

				console.log(
					"Attachments to Slack: " + JSON.stringify(attachments)
				);

				slack.webhook(
					{
						channel: process.env.channel,
						username: "ZkillBot",
						attachments: attachments,
					},
					function(error, response, body) {
						console.log(error, response, body);

						relatedCount++;
						request(options, callback);
					}
				);
			} else {
				unrelatedCount++;
				request(options, callback);
			}
		} else {
			console.log("No more kills on Zkill RedisQ");
			console.log("Related kills: " + relatedCount);
			console.log("Unrelated kills: " + unrelatedCount);
			finishingCallback(null, "Finished");
		}
	}
	request(options, callback);
};

module.exports = monitorZkill;
