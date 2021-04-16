//maximizer={score:3,sym:plTurn.sym,isMax:true}
function prepMM(state){
	let maximizer = {score:3,sym:G.plTurn.sym,isMax:true};
	let minimizer = {score:2,sym:G.plOpp.sym,isMax:false};
	let maxDepth = 9;
	mmab4(state,0, -Infinity, +Infinity, maxDepth, maximizer, minimizer);
}

function mmab4(node, depth, alpha, beta, maxDepth, pl, opp) {
	if (depth >= maxDepth) return 1;
	if (checkBoardFull(node)||checkWinnerTTT(node)) return GameScore1(node, depth, pl, opp);
	depth += 1;
	var availableMoves = G.getAvailableMoves(node); 

	var move, result, possible_game;
	if (pl.isMax) {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = arrReplaceAtInPlace(node,move,pl.sym); //GetNewState(move, node);
			result = mmab4(possible_game, depth, alpha, beta, maxDepth, opp, pl);
			node = arrReplaceAtInPlace(node,move,' '); //UndoMove(node, move);
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
			possible_game = arrReplaceAtInPlace(node,move,pl.sym); //GetNewState(move, node);
			result = mmab4(possible_game, depth, alpha, beta, opp, pl);
			node = arrReplaceAtInPlace(node,move,' '); //UndoMove(node, move);
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

function mmab3(node, depth, alpha, beta, maxDepth = 9) {
	if (depth >= maxDepth) return 1;
	if (checkBoardFull(node)||checkWinnerTTT(node)) return GameScore(node, depth);
	depth += 1;
	var availableMoves = G.getAvailableMoves(node); 

	var move, result, possible_game;
	if (active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = mmab3(possible_game, depth, alpha, beta, maxDepth);
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
			result = mmab3(possible_game, depth, alpha, beta);
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
function mmab2(node, depth, alpha, beta, maxDepth = 9) {
	if (depth >= maxDepth) return 1;

	let y = checkBoardFull(node); // (checkWinnerTTT(node) || checkBoardFull(node));
	let z = checkWinnerTTT(node); //checkWinnerSpaces(node, 3, 3);
	if (y || z) return GameScore(node, depth);

	depth += 1;
	var availableMoves = G.getAvailableMoves(node); //GetAvailableMoves(node);
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

function printState(state) {
	//console.log('___________',state)
	let formattedString = '';
	state.forEach((cell, index) => {
		formattedString += isdef(cell) ? ` ${cell} |` : '   |';
		if ((index + 1) % 3 == 0) {
			formattedString = formattedString.slice(0, -1);
			if (index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
		}
	});
	console.log('%c' + formattedString, 'color: #6d4e42;font-size:10px');
	console.log();
}
