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
function mmab2(node, depth, alpha, beta, maxDepth = 9) {
	//console.log('node', node, '\ndepth', depth, '\nalpha', alpha, '\nbeta', beta);
	if (depth >= maxDepth) return 1;

	// let x = (CheckForWinner(node) === 1 || CheckForWinner(node) === 2 || CheckForWinner(node) === 3);
	let y = checkBoardFull(node); // (checkWinnerTTT(node) || checkBoardFull(node));
	let z = checkWinnerSpaces(node, 3, 3);
	// console.assert(x==(y||z),'not true',node,'x',x,'y',y,'z',z)

	if (y || z) return GameScore(node, depth);
	// if (CheckForWinner(node) === 1 || CheckForWinner(node) === 2
	// || CheckForWinner(node) === 3)
	// return GameScore(node, depth);

	// if (checkWinnerTTT(node) || checkBoardFull(node)) return GameScore(node, depth);
	// let final = G.checkFinal(node);console.log('final',final);
	// if (G.checkFinal(node)) return GameScore(node,depth);

	depth += 1;
	var availableMoves = GetAvailableMoves(node);
	var move, result, possible_game;
	if (active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = mmab2(possible_game, depth, alpha, beta, maxDepth);
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
			result = mmab2(possible_game, depth, alpha, beta);
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

function mmab1(node, depth, alpha, beta, maxDepth = 9) {
	//console.log('node', node, '\ndepth', depth, '\nalpha', alpha, '\nbeta', beta);
	if (depth >= maxDepth) return 1;

	// let x = (CheckForWinner(node) === 1 || CheckForWinner(node) === 2 || CheckForWinner(node) === 3);
	let y = checkBoardFull(node); // (checkWinnerTTT(node) || checkBoardFull(node));
	let z = checkWinnerSpaces(node, 3, 3);
	// console.assert(x==(y||z),'not true',node,'x',x,'y',y,'z',z)

	if (y || z) return GameScore(node, depth);
	// if (CheckForWinner(node) === 1 || CheckForWinner(node) === 2
	// || CheckForWinner(node) === 3)
	// return GameScore(node, depth);

	// if (checkWinnerTTT(node) || checkBoardFull(node)) return GameScore(node, depth);
	// let final = G.checkFinal(node);console.log('final',final);
	// if (G.checkFinal(node)) return GameScore(node,depth);

	depth += 1;
	var availableMoves = GetAvailableMoves(node);
	var move, result, possible_game;
	if (active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = mmab1(possible_game, depth, alpha, beta, maxDepth);
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
			result = mmab1(possible_game, depth, alpha, beta);
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

