class SoloPlayer {
	constructor(user) {
		this.color = getColorDictColor(user.settings.userColor);
		this.id = user.id;
		this.score = 0;
	}
}
class AIPlayer {
	constructor(max_depth = -1) {
		this.id = getUID('AI');
		this.color = randomColor();
		this.max_depth = max_depth;
		this.nodes_map = new Map();
		this.type = 'ai';
		this.score = 0;
	}
	setData(o) { copyKeys(o, this); }
}



