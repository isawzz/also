var CCC = 0;
function prepMM(state, algorithm, feval, maxDepth) {
	F_END = feval;
	F_MOVES = G.getAvailableMoves;
	F_APPLYMOVE = G.applyMove; //arrReplaceAtInPlace;
	F_UNDOMOVE = G.undoMove; //arrReplaceAtInPlace;
	//DMAX = 9;
	MAXIMIZER = G.plTurn; MINIMIZER = G.plOpp;
	choice = null; BestMinusScore = Infinity, BestPlusScore = -Infinity;
	//timit.show('*start ' + algorithm.name);
	let val = algorithm(state, 0, -Infinity, Infinity, maxDepth, true);
	//console.log('mm returned best val', val);

	//if (nundef(choice)) { console.log('choice has not been done!'); } else { console.log('choice: ', choice) }
	//timit.show('end');
	CCC = 0;
	return choice;

}

function mm13(node, depth, alpha, beta, maxDepth, maxim) {
	if (depth >= maxDepth) return 1;
	let ec = F_END(node, depth); if (ec.reached) return ec.val;
	depth += 1;
	var move, result;
	var availableMoves = F_MOVES(node);
	let player = maxim ? MAXIMIZER : MINIMIZER;
	for (var i = 0; i < availableMoves.length; i++) {
		move = availableMoves[i];
		F_APPLYMOVE(node, move, player);
		result = mm13(node, depth, alpha, beta, maxDepth, !maxim);
		F_UNDOMOVE(node, move, player);
		if (maxim) {
			if (result > alpha) {
				//console.log('new best', result, move);
				alpha = result;
				if (depth == 1) choice = move;
			} else if (alpha >= beta) { return alpha; }
		} else {
			if (result < beta) {
				beta = result;
				if (depth == 1) choice = move;
			} else if (beta <= alpha) { return beta; }
		}
	}
	return maxim ? alpha : beta;
}


async function mm14(node, depth, alpha, beta, maxDepth, maxim) {
	if (CCC > 1000) { CCC = 0; console.log('cancelai', CCC, CANCEL_AI); } else CCC += 1;
	if (depth >= maxDepth) return 1;
	let ec = F_END(node, depth); if (ec.reached) return ec.val;
	depth += 1;
	var move, result;
	var availableMoves = F_MOVES(node);
	let player = maxim ? MAXIMIZER : MINIMIZER;
	for (var i = 0; i < availableMoves.length; i++) {
		move = availableMoves[i];
		F_APPLYMOVE(node, move, player);
		result = await mm14(node, depth, alpha, beta, maxDepth, !maxim);
		F_UNDOMOVE(node, move, player);
		if (maxim) { if (result > alpha) { alpha = result; if (depth == 1) choice = move; } else if (alpha >= beta) { return alpha; } }
		else { if (result < beta) { beta = result; if (depth == 1) choice = move; } else if (beta <= alpha) { return beta; } }
	}
	return maxim ? alpha : beta;
}

function showCancelButton() {
	CANCEL_AI = false;
	let b = mBy('bCancelAI');
	if (nundef(b)) {
		let d = mButton('Stop!', () => { console.log('clik!'); CANCEL_AI = true; hide('bCancelAI') }, dLeiste, { bg: 'red' }, ['buttonClass']);
		d.id = 'bCancelAI';
	} else show(b);

}


function mm12(node, depth, alpha, beta, maxDepth = 9, maxim = true) {
	if (depth >= maxDepth) return 1;

	let ec = F_END(node, depth); if (ec.reached) return ec.val;

	depth += 1;
	var move, result;
	var availableMoves = F_MOVES(node);
	let player = maxim ? MAXIMIZER : MINIMIZER;
	for (var i = 0; i < availableMoves.length; i++) {
		move = availableMoves[i];
		F_APPLYMOVE(node, move, player);
		result = mm12(node, depth, alpha, beta, maxDepth, !maxim);
		F_UNDOMOVE(node, move, player);
		if (maxim && result > alpha) {
			alpha = result;
			if (depth == 1) choice = move;
		} else if (maxim && alpha >= beta) {
			return alpha;
		} else if (!maxim && result < beta) {
			beta = result;
			if (depth == 1) choice = move;
		} else if (!maxim && beta <= alpha) {
			return beta;
		}
	}
	return maxim ? alpha : beta;

}

function mm11(node, depth, alpha, beta, maxDepth = 9, maxim = true) {
	if (depth >= maxDepth) return 1;

	let ec = F_END(node, depth); if (ec.reached) return ec.val;

	depth += 1;
	var availableMoves = F_MOVES(node);

	var move, result;
	if (maxim) {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			F_APPLYMOVE(node, move, MAXIMIZER);
			result = mm11(node, depth, alpha, beta, maxDepth, !maxim);
			F_UNDOMOVE(node, move, MAXIMIZER);
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
			F_APPLYMOVE(node, move, MINIMIZER);
			result = mm11(node, depth, alpha, beta, maxDepth, !maxim);
			F_UNDOMOVE(node, move, MINIMIZER);
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

//geht!
function mm10(node, depth, alpha, beta, maxDepth = 9, maxim = true) {
	if (depth >= maxDepth) return 1;

	let ec = F_END(node, depth); if (ec.reached) return ec.val;

	depth += 1;
	var availableMoves = F_MOVES(node);

	var move, result;
	// console.assert(maxim || active_turn != "COMPUTER",'aaaaaaaaaaaaaaaaaaaaaaa')
	if (maxim) {//active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			F_APPLYMOVE(node, move, MAXIMIZER);
			result = mm10(node, depth, alpha, beta, maxDepth, !maxim);
			F_UNDOMOVE(node, move, MAXIMIZER);
			// arrReplaceAtInPlace(node, move, MAXIMIZER.sym);
			// result = mm10(node, depth, alpha, beta, maxDepth, !maxim);
			// arrReplaceAtInPlace(node, move, ' ');
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
			// arrReplaceAtInPlace(node, move, MINIMIZER.sym);
			// result = mm10(node, depth, alpha, beta, maxDepth, !maxim);
			// arrReplaceAtInPlace(node, move, ' ');
			F_APPLYMOVE(node, move, MINIMIZER);
			result = mm10(node, depth, alpha, beta, maxDepth, !maxim);
			F_UNDOMOVE(node, move, MINIMIZER);
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


function mmab9(node, depth, alpha, beta, maxDepth = 9, maxim = true) {
	if (CANCEL_AI) return 1;
	if (depth >= maxDepth) return 1;

	let ec = checkEndCondition(node, depth); if (ec.reached) return ec.val;

	depth += 1;
	var availableMoves = G.getAvailableMoves(node);

	var move, result;
	// console.assert(maxim || active_turn != "COMPUTER",'aaaaaaaaaaaaaaaaaaaaaaa')
	if (maxim) {//active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			arrReplaceAtInPlace(node, move, MAXIMIZER.sym);
			result = mmab9(node, depth, alpha, beta, maxDepth, !maxim);
			arrReplaceAtInPlace(node, move, ' ');
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
			arrReplaceAtInPlace(node, move, MINIMIZER.sym);
			result = mmab9(node, depth, alpha, beta, maxDepth, !maxim);
			arrReplaceAtInPlace(node, move, ' ');
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
		formattedString += isdef(cell) ? ` ${cell == '0' ? ' ' : cell} |` : '   |';
		if ((index + 1) % G.cols == 0) {
			formattedString = formattedString.slice(0, -1);
			if (index < G.rows * G.cols - 1) {
				let s = '\u2015\u2015\u2015 '.repeat(G.cols);
				formattedString += '\n' + s + '\n'; //\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
				// formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
			}
		}
	});
	console.log('%c' + formattedString, 'color: #6d4e42;font-size:10px');
	console.log();
}
function checkEndCondition(node, depth) {
	let x = checkWinnerTTT(node);
	if (checkBoardFull(node) || x) {
		//var score = x;
		return { reached: true, val: (!x ? 0 : (10 - depth) * (x == MAXIMIZER.sym ? 1 : -1)) };
		// return evalState8(node, depth);
	}
	return { reached: false };
}
