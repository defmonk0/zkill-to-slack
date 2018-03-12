var crawlJsArrayForIds = require("./crawlJsArrayForIds");
var idsToNames = require("./idsToNames");
var isInvolved = require("./isInvolved");
var isListed = require("./isListed");
var request = require("request");
var sendSlackMessage = require("./sendSlackMessage");

var monitorZkill = function(finishingCallback) {
	console.log("Starting to pull data from zKill RedisQ");

	// Set up our headers and options used to hit zKill's RedisQ
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

	// Variables to track how many kills we process this round
	var relatedCount = 0;
	var unrelatedCount = 0;

	// Function used every time we grab a kill from RedisQ
	function redisCallback(error, response, body) {
		if (!error && response && response.statusCode === 200) {
			// We have a kill, so we should continue
			killInfo = JSON.parse(body).package;

			if (isInvolved(killInfo.killmail, process.env.watchFor)) {
				// We were involved with the kill, so process it
				// Crawl and receive our ids as needed
				var ids = crawlJsArrayForIds(killInfo.killmail);

				// Get the types and names for those IDs
				idsToNames(ids, function(map) {
					// Set up basic data we need to discover
					var finalBlow = "Unknown";
					var alliedPilots = [];
					var color = "#AAAAAA";
					var involvedPilotsMessage = "Friendly Pilots Involved";

					// Iterate through attackers, extracting data
					killInfo.killmail.attackers.forEach(function(attacker) {
						// Check if this attacker got the final blow
						if (attacker.final_blow) {
							if (attacker.character_id) {
								finalBlow =
									map.getParameter(
										attacker.character_id,
										"name"
									) +
									" (" +
									map.getParameter(
										attacker.corporation_id,
										"name"
									) +
									")";
							} else if (attacker.ship_type_id) {
								finalBlow = map.getParameter(
									attacker.ship_type_id,
									"name"
								);
							}
						}

						// Check if this attacker is friendly
						if (isListed(attacker, process.env.watchFor)) {
							console.log(
								"Found friendly as attacker: " +
									attacker.character_id
							);

							// Add them to the list of friendlies involved
							alliedPilots.push(
								"<https://zkillboard.com/character/" +
									attacker.character_id +
									"/|" +
									map.getParameter(
										attacker.character_id,
										"name"
									) +
									">"
							);

							// We have friends on the kill, so mark it green
							color = "good";
						}
					});

					// Check if the victim was friendly
					var victim = killInfo.killmail.victim;
					if (isListed(victim, process.env.watchFor)) {
						console.log(
							"Found friendly as victim: " + victim.character_id
						);

						// A friend is the victim, so mark it red
						color = "danger";

						// Override the involved message, in case someone shot a friend
						involvedPilotsMessage = "Friendly Fire";
					}

					// Actually prep and send our data to slack
					sendSlackMessage(
						{
							alliedPilots: alliedPilots,
							color: color,
							finalBlow: finalBlow,
							map: map,
							ids: ids,
							involvedPilotsMessage: involvedPilotsMessage,
							killInfo: killInfo,
						},
						function(error, response, body) {
							console.log(
								"Message sent to slack:",
								error,
								response.statusCode
							);

							// Increment our counter and continue asking for kills
							relatedCount++;
							// request(options, redisCallback);
						}
					);
				});
			} else {
				// We were not involved, so we can early out of this one
				console.log("Not involved in kill");

				// Increment our counter and continue asking for kills
				unrelatedCount++;
				// request(options, redisCallback);
			}
		} else {
			// RedisQ didn't return us a kill, so we're done
			console.log("No additional kills in zKill RedisQ");
			console.log(
				"Kills processed (related / total): " +
					relatedCount +
					" / " +
					(relatedCount + unrelatedCount)
			);
			finishingCallback(null, "Finished");
		}
	}

	// Start the requests
	request(options, redisCallback);
};

module.exports = monitorZkill;
