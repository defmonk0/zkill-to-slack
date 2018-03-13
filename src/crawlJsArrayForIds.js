var valid = [
	"alliance_id",
	"character_id",
	"corporation_id",
	"item_type_id",
	"ship_type_id",
	"solar_system_id",
	"weapon_type_id",
];

var traverse = function(o, fn) {
	for (var i in o) {
		fn.apply(this, [i, o[i]]);
		if (o[i] !== null && typeof o[i] == "object") {
			traverse(o[i], fn);
		}
	}
};

var crawlJsArrayForIds = function(kill) {
	var list = [];

	// Recursively crawl through the object to get the ids we need
	traverse(kill, function(k, v) {
		if (valid.indexOf(k) >= 0) {
			list.push(v);
		}
	});

	// Filter the list to remove duplicates
	list = list.filter(function(value, index, self) {
		return self.indexOf(value) === index;
	});

	return list;
};

module.exports = crawlJsArrayForIds;
