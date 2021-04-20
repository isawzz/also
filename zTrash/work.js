










function mmab4_(node, depth, alpha, beta, maxDepth = 9, maxim=true) {
	if (depth >= maxDepth) return 1;
	if (checkBoardFull(node) || checkWinnerTTT(node)) return evalState5(node, depth, maxim);
	depth += 1;
	var availableMoves = G.getAvailableMoves(node);

	var move, result, possible_game;
	if (maxim) {
		console.assert(maxim == true,'NOOOOOOOOOO')
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = arrReplaceAtCopy(move); //GetNewState(move, node);
			result = mmab4(possible_game, depth, alpha, beta, maxDepth, false);
			//node = UndoMove(node, move);
			if (result > alpha) {
				alpha = result;
				if (depth == 1) choice = move;
			} else if (alpha >= beta) {
				return alpha;
			}
		}
		return alpha;
	} else {
		console.assert(maxim == false,'NOOOOOOOOOO')
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = arrReplaceAtCopy(move); //GetNewState(move, node);
			result = -mmab4(possible_game, depth, alpha, beta, true);
			// node = UndoMove(node, move);
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


//maximizer={score:3,sym:plTurn.sym,isMax:true}
function prepMM(state) {
	let maximizer = { score: 3, sym: G.plTurn.sym, isMax: true };
	let minimizer = { score: 2, sym: G.plOpp.sym, isMax: false };
	let maxDepth = 9;
	console.log('state', state)
	mmab4(state, 0, -Infinity, +Infinity, maxDepth, maximizer, minimizer);
}

function mmab4_(node, depth, alpha, beta, maxDepth, pl, opp) {
	if (depth >= maxDepth) return 1;
	if (checkBoardFull(node) || checkWinnerTTT(node)) return GameScore1(node, depth, pl, opp);
	depth += 1;
	var availableMoves = G.getAvailableMoves(node);

	var move, result;
	if (pl.isMax) {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			arrReplaceAtInPlace(node, move, pl.sym); //GetNewState(move, node);
			result = mmab4(node, depth, alpha, beta, maxDepth, opp, pl);
			arrReplaceAtInPlace(node, move, ' '); //UndoMove(node, move);
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
			arrReplaceAtInPlace(node, move, pl.sym); //GetNewState(move, node);
			result = mmab4(node, depth, alpha, beta, maxDepth, opp, pl);
			arrReplaceAtInPlace(node, move, ' '); //UndoMove(node, move);
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


function mmab1_orig(node, depth, alpha, beta, maxDepth = 9) {
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












//#region old mm trials alles mist
var sss = { 'O': 2, 'X': 3, 0: 0 };
var sssNumber = 0;
function test10() {
	// minimax([1, 1, null, 0, null, null, null, null, 0], 0, 0, 2);
	// minimax([1, 1, 0, 0, null, null, null, null, 0], 1, 0, 2);
	// minimax([1, 1, 0, 0, null, null, null, 1, 2], 1, 0, 2);
	// minimax([1, 1, 0, 0, 0, 1, null, 1, 0], 1, 0, 2);
	let state = [1, 0, null, null, 0, 1, null, null, null];
	let pl = 0;
	[v, m] = minimax(state, pl, 0, 3);
	console.log('____________ state:')
	printState(state);
	console.log('player', pl, 'should choose', m, '(val=' + v + ')');
}
var GLOBALMOVE = null;




function test11() {
	let state = [1, 1, null, 2, 2, 1, null, 2, null];
	let pl = 1;
	GLOBALMOVE = null;
	//let x = minimax1(state, 1, true);
	let x = minimax1(state, 2, false);
	//console.log('____________ state:')
	printState(state);
	console.log('player', pl, 'should choose', GLOBALMOVE, '(val=' + x + ')');
}
function test12() {
	let state = [null, 1, null, 2, 1, 1, null, 2, null];
	let pl = 2;
	GLOBALMOVE = null;
	//let x = minimax1(state, 1, true);
	let D = 3;
	let x = minimax1(state, D, pl == 1);
	//console.log('____________ state:')
	printState(state);
	console.log('player', pl, 'should choose', GLOBALMOVE, '(val=' + x + ')');
}
function test13() {
	let state = [null, null, null, null, 1, 2, null, 2, null];
	let pl = 1;
	GLOBALMOVE = null;
	//let x = minimax1(state, 1, true);
	let D = 4;
	let x = minimax1(state, D, pl == 1);
	//console.log('____________ state:')
	printState(state);
	console.log('player', pl, 'should choose', GLOBALMOVE, '(val=' + x + ')');
}
function test14() {
	let state = [1, null, null, null, 1, 2, null, 2, null];
	let pl = 2;
	GLOBALMOVE = null;
	//let x = minimax1(state, 1, true);
	let D = 4;
	let x = minimax1(state, D, pl == 1);
	//console.log('____________ state:')
	printState(state);
	console.log('player', pl, 'should choose', GLOBALMOVE, '(val=' + x + ')');
}
function test15() {
	let state = [1, null, null, null, 1, 2, null, 2, null];
	let pl = 2;
	GLOBALMOVE = null;
	//let x = minimax1(state, 1, true);
	let D = 5;
	//let x = minimax1(state, D, pl == 1);
	let x = nega(state, D, -Infinity, Infinity, 1)
	//console.log('____________ state:')
	printState(state);
	console.log('player', pl, 'should choose', GLOBALMOVE, '(val=' + x + ')');
}


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

function otherPlayer(pl) { return pl == 1 ? 2 : 1; }
function isFinalState(state) { return isWinningState(state, 1) || isWinningState(state, 2) || isEmpty(getAvailableMoves(state)); }
function evaluateState(state) { return isWinningState(state, 1) ? 100 : isWinningState(state, 2) ? 100 : 0; }

function nega(node, depth, a, b, sign) {
	if (depth == 0 || isFinalState(node)) {
		//console.log('==>')
		printState(node);
		let res = evaluateState(node); console.log('=',res)
		return res;
	}
	let availableMoves = getAvailableMoves(node);
	let value = -Infinity;
	for (const m of availableMoves) {
		let ch = arrReplaceAtCopy(node, m, sign > 0 ? 1 : 2);
		let rec = -nega(ch, depth - 1, -b, -a, -sign);
		if (rec > value) { value = rec; GLOBALMOVE = m; }
		a = Math.max(a, value);
		if (a > b) break;
	}
	return value
}
function minimax1(node, depth, maximizingPlayer) {
	if (depth == 0 || isFinalState(node)) {
		//console.log('==>')
		printState(node);
		let res = evaluateState(node); //console.log('=',res)
		return res;
	}

	if (maximizingPlayer) {
		let value = -Infinity;
		let availableMoves = getAvailableMoves(node); //console.log(availableMoves)
		for (let i = 0; i < availableMoves.length; i++) {

			let child = arrReplaceAtCopy(node, availableMoves[i], 1);
			// printState(child);
			// console.log(evaluateState(child))
			// return;
			let v = minimax1(child, depth - 1, false);
			//console.log('v',v)
			if (v > value) { value = Math.max(value, v); GLOBALMOVE = availableMoves[i]; }
		}
		return value;
	} else {//(* minimizing player *)
		let value = Infinity;
		let availableMoves = getAvailableMoves(node);
		for (let i = 0; i < availableMoves.length; i++) {
			let child = arrReplaceAtCopy(node, availableMoves[i], 2);

			// value = Math.min(value, minimax1(child, depth - 1, true))
			let v = minimax1(child, depth - 1, true);
			if (v < value) { value = Math.min(value, v); GLOBALMOVE = availableMoves[i]; }
		}
		return value;
	}
}
function minimax0(state, pl, depth, maxDepth) {

	if (isWinningState(state, pl) || isWinningState(state, (pl == 1 ? 2 : 1))) {
		printState(state);
		return [100, null];
	}
	if (depth > maxDepth) return [0, null];
	var availableMoves = getAvailableMoves(state); if (isEmpty(availableMoves)) return [0, null];

	//console.log('____________ depth:', depth); printState(state); console.log('moves', availableMoves);

	let bestVal = (pl == 1 ? -1000 : 1000), bestMove = null;
	for (let i = 0; i < availableMoves.length; i++) {
		let index = availableMoves[i];
		arrReplaceAtInPlace(state, index, pl);
		let [v, m] = minimax(state, (pl == 1 ? 2 : 1), depth + 1, maxDepth);
		arrReplaceAtInPlace(state, index, null);
		if (pl == 1 && v > bestVal) { bestVal = v; bestMove = index; }
		else if (pl == 2 && -v < bestVal) { bestVal = -v; bestMove = index; }
	}
	return [bestVal, bestMove];
}
function checkForWinner(state, sym1, sym2) {
	//console.log(state,sym1,sym2)
	// Check for horizontal wins
	for (i = 0; i <= 6; i += 3) {
		if (state[i] === sym1 && state[i + 1] === sym1 && state[i + 2] === sym1)
			return sym1;
		if (state[i] === sym2 && state[i + 1] === sym2 && state[i + 2] === sym2)
			return sym2;
	}

	// Check for vertical wins
	for (i = 0; i <= 2; i++) {
		if (state[i] === sym1 && state[i + 3] === sym1 && state[i + 6] === sym1)
			return sym1;
		if (state[i] === sym2 && state[i + 3] === sym2 && state[i + 6] === sym2)
			return sym2;
	}

	// Check for diagonal wins
	if ((state[0] === sym1 && state[4] === sym1 && state[8] === sym1) ||
		(state[2] === sym1 && state[4] === sym1 && state[6] === sym1))
		return sym1;

	if ((state[0] === sym2 && state[4] === sym2 && state[8] === sym2) ||
		(state[2] === sym2 && state[4] === sym2 && state[6] === sym2))
		return sym2;

	// Check for tie
	for (i = 0; i < state.length; i++) {
		if (state[i] !== sym1 && state[i] !== sym2)
			return undefined;
	}
	return 0;
}
function getAvailableMoves(state) {
	let moves = [];
	for (let i = 0; i < state.length; i++) {
		if (nundef(state[i])) moves.push(i);
	}
	return moves;
}
function undoReplace(arr, index) {
	arr[index] = null;
}
function isWinningState(state, pl) {
	for (i = 0; i <= 6; i += 3) { if (state[i] === pl && state[i + 1] === pl && state[i + 2] === pl) return true; }

	// Check for vertical wins
	for (i = 0; i <= 2; i++) { if (state[i] === pl && state[i + 3] === pl && state[i + 6] === pl) return true; }

	// Check for diagonal wins
	if ((state[0] === pl && state[4] === pl && state[8] === pl) || (state[2] === pl && state[4] === pl && state[6] === pl)) return true;

	return false;
}

function wp00() {

	let wp = getRandomWP(1, 5);
	console.log('wp', wp);

	let text = wp.text;

	instantiateNames(wp);
	console.log(wp.text)

	instantiateNumbers(wp);
	console.log(wp.text);
	console.log('ergebnis:', wp.result);
}
function wp01_alle() {
	for (const wp of WordP) {
		instantiateNames(wp);
		console.log('______________', wp.index);//,'\n',wp.text)

		instantiateNumbers(wp);
		console.log('text:', wp.text);
		console.log('ergebnis:', wp.result);
	}
	console.log(WordP)
}
function wp02_checkMinus() {
	let results = [];
	for (let i = 34; i < 56; i++) {

		let wp = jsCopy(WordP[i]);

		instantiateNames(wp);

		let [diop, eq] = instantiateNumbers(wp);
		console.log('______________', wp.index);//,'\n',wp.text)
		console.log('text:', wp.text);
		console.log('diop:', diop);
		console.log('eq:', eq);
		//console.log('ergebnis:', wp.result);
		results.push(wp.result);
		//console.assert(wp.result.number>0,'!!!!!!!!!!!!!!!NEG!!!')
		break;
	}
	console.log('result', results.map(x => '' + x.number + ' text:' + x.text))
	//console.log(WordP)
}


//#endregion








