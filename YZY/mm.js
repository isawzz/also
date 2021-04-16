function simpleScoreTTT(game) {
	var score = CheckForWinner(game);
	if (score === 1) return 0;
	else if (score === 2) return -10; //depth - 10;
	else if (score === 3) return 10; // 10 - depth;
}
function evalBoard(node, depth, chWin, symax) {
	if (chWin == symax) return 20 - depth;
	else if (chWin) return depth - 10;
	else return 0;
}

function mmab3(node, depth, alpha, beta, maxDepth, isMax) {
	//console.log('node', node, '\ndepth', depth, '\nalpha', alpha, '\nbeta', beta);
	if (depth >= maxDepth) return 1;

	if (checkBoardFull(node) || checkWinnerSpaces(node, 3, 3)) return GameScore(node, depth);// simpleScoreTTT(node);

	depth += 1;
	var availableMoves = G.getAvailableMoves(node);
	var move, result, possible_game;
	if (isMax) {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = mmab3(possible_game, depth, alpha, beta, maxDepth, !isMax);
			node = UndoMove(node, move);
			if (result > alpha) {
				alpha = result;
				if (depth == 1) choice = move;
			} else if (alpha >= beta) {
				return alpha;
			}
		}
		return alpha;
	} else {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = mmab3(possible_game, depth, alpha, beta, maxDepth, !isMax);
			node = UndoMove(node, move);
			if (result < beta) {
				beta = result;
				if (depth == 1) choice = move;
			} else if (beta <= alpha) {
				return beta;
			}
		}
		return beta;
	}
}
