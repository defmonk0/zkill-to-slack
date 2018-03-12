var isListed = function(participant, ids, allowWildcard = false) {
	if (allowWildcard && ids.indexOf("*") >= 0) {
		return true;
	}

	if (
		participant.character_id &&
		ids.indexOf(participant.character_id) >= 0
	) {
		return true;
	}

	if (
		participant.corporation_id &&
		ids.indexOf(participant.corporation_id) >= 0
	) {
		return true;
	}

	if (participant.alliance_id && ids.indexOf(participant.alliance_id) >= 0) {
		return true;
	}

	return false;
};

module.exports = isListed;
