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
		this.type = 'ai';
		this.score = 0;
		// this.max_depth = max_depth;
		// this.nodes_map = new Map();
	}
	setData(o) { copyKeys(o, this); }
}

var CCC = 0;
function AIMinimax(g, callback) {
	let state = g.getState();
	state = boardToNode(state);
	console.log('==>AI search: minimax (maxDepth', g.searchDepth + ')');
	F_END = g.evalState;
	F_MOVES = g.getAvailableMoves;
	F_APPLYMOVE = g.applyMove;
	F_UNDOMOVE = g.undoMove;
	MAXIMIZER = g.plTurn; 
	MINIMIZER = g.plOpp; 
	SelectedMove = null; 
	let val = minimax(state, 0, -Infinity, Infinity, g.searchDepth, true);
	console.log('chosen move has value', val, 'nodes inspected:',CCC);
	CCC = 0;

	callback(SelectedMove);
}
function minimax(node, depth, alpha, beta, maxDepth, maxim) {
	CCC+=1;
	if (depth >= maxDepth) return 1;
	let ec = F_END(node, depth); if (ec.reached) return ec.val;
	depth += 1;
	var move, result;
	var availableMoves = F_MOVES(node);
	let player = maxim ? MAXIMIZER : MINIMIZER;
	for (var i = 0; i < availableMoves.length; i++) {
		move = availableMoves[i];
		F_APPLYMOVE(node, move, player);
		result = minimax(node, depth, alpha, beta, maxDepth, !maxim);
		F_UNDOMOVE(node, move, player);
		if (maxim) {
			if (result > alpha) {
				//console.log('new best', result, move);
				alpha = result;
				if (depth == 1) SelectedMove = move;
			} else if (alpha >= beta) { return alpha; }
		} else {
			if (result < beta) {
				beta = result;
				if (depth == 1) SelectedMove = move;
			} else if (beta <= alpha) { return beta; }
		}
	}
	return maxim ? alpha : beta;
}



