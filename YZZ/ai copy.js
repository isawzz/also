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

	getBestMove(g) {
		this.g = g;
		let state = g.getState();

		this.move = null;

		this.minimax(state, 4, true);
		return GLOBALMOVE;
	}

	minimax(node, depth, maximizingPlayer) {
		//console.log(this.g.isFinalState(node))
		if (depth == 0 || this.g.isFinalState(node)) {
			let res = this.g.evaluateState(node);	//console.log('==>'); printState(node);console.log('=',res)
			return res;
		}

		//console.log('staying!')
		if (maximizingPlayer) {
			let value = -Infinity;
			let availableMoves = this.g.getAvailableMoves(node); //console.log(availableMoves)
			for (let i = 0; i < availableMoves.length; i++) {

				let child = replaceAtX(node, availableMoves[i], 'X');
				//printState(child); console.log(evaluateState(child)); 
				let v = this.minimax(child, depth - 1, false);
				//console.log('v', v);//return;
				if (v > value) { value = Math.max(value, v); GLOBALMOVE = availableMoves[i]; if (v==100) console.log('found',depth,v,GLOBALMOVE); }
			}
			return value;
		} else {//(* minimizing player *)
			let value = Infinity;
			let availableMoves = this.g.getAvailableMoves(node);
			for (let i = 0; i < availableMoves.length; i++) {
				let child = replaceAtX(node, availableMoves[i], 'O');

				// value = Math.min(value, minimax(child, depth - 1, true))
				let v = this.minimax(child, depth - 1, true);
				if (v < value) { value = Math.min(value, v);  }
			}
			return value;
		}
	}

}





function minimax(node, depth, maximizingPlayer) {
	if (depth == 0 || isFinalState(node)) {
		let res = evaluateState(node);	//console.log('==>'); printState(node);console.log('=',res)
		return res;
	}

	if (maximizingPlayer) {
		let value = -Infinity;
		let availableMoves = getAvailableMoves(node); console.log(availableMoves)
		for (let i = 0; i < availableMoves.length; i++) {

			let child = replaceAtX(node, availableMoves[i], 1);
			// printState(child); console.log(evaluateState(child)); return;
			let v = minimax(child, depth - 1, false);
			console.log('v', v)
			if (v > value) { value = Math.max(value, v); GLOBALMOVE = availableMoves[i]; }
		}
		return value;
	} else {//(* minimizing player *)
		let value = Infinity;
		let availableMoves = getAvailableMoves(node);
		for (let i = 0; i < availableMoves.length; i++) {
			let child = replaceAtX(node, availableMoves[i], 2);

			// value = Math.min(value, minimax(child, depth - 1, true))
			let v = minimax(child, depth - 1, true);
			if (v < value) { value = Math.min(value, v); GLOBALMOVE = availableMoves[i]; }
		}
		return value;
	}
}





