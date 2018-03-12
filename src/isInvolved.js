var isListed = require("./isListed");

var isInvolved = function(kill, ids) {
	console.log("Checking if we are involved in the kill");

	if (kill.victim && isListed(kill.victim, ids, true)) {
		return true;
	}

	for (var i in kill.attackers) {
		if (kill.attackers[i] && isListed(kill.attackers[i], ids, true)) {
			return true;
		}
	}

	return false;
};

module.exports = isInvolved;
