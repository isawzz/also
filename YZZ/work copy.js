
var sss={'O':2,'X':3,0:0};
var sssNumber=0;

function alphaBetaMinimax(node, depth, alpha, beta, plSym, maxDepth = 6) {
	sssNumber+=1;
	
	//console.log(node)
	//console.log('node', node, '\ndepth', depth, '\nalpha', alpha, '\nbeta', beta, '\npl',plSym);
	if (depth >= maxDepth) return 1;

	let over = checkForWinner(node, 'O', 'X');
	//console.log('over',over)
	if (isdef(over)) {let res=isdef(over)?sss[over]:1;console.log('res',res,alpha,beta);return res;}
	else console.log('recurse')
	// if (CheckForWinner(node) === 1 || CheckForWinner(node) === 2
	// 	|| CheckForWinner(node) === 3)
	// 	return GameScore(node, depth);

	depth += 1;
	var availableMoves = G.availableMoves(node, plSym);
	var move, result, possible_game;
	if (plSym == 'X') {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = G.applyMove(node, move);
			//console.log('move',move,'new state',possible_game)
			result = alphaBetaMinimax(possible_game, depth, alpha, beta, G.human.sym, maxDepth);
			printState(possible_game);console.log('=>',result)
			node = G.undoMove(node, move);
			if (result > alpha) {
				alpha = result;
				if (depth == 1) Goal = move;
			} else if (alpha >= beta) {
				return alpha;
			}
		}
		return alpha;
	} else {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = G.applyMove(node, move);
			result = -alphaBetaMinimax(possible_game, depth, alpha, beta, G.ai.sym, maxDepth);
			printState(possible_game);console.log('=>',result)
			node = G.undoMove(node, move);
			if (result < beta) {
				beta = result;
				if (depth == 1) Goal = move;
			} else if (beta <= alpha) {
				return beta;
			}
		}
		return beta;
	}
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











