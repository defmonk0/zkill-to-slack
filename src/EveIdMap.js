class EveIdMap {
	constructor(map) {
		this.map = map;
	}

	getObject(id) {
		return this.map[id] ? this.map[id] : null;
	}

	getParameter(id, param) {
		return this.map[id] ? this.map[id][param] : null;
	}
}

module.exports = EveIdMap;
