class G2Player {
	constructor(name, o) {
		this.name = name;
		copyKeys(o, this);
		this.maxLevel = isdef(this.levels) ? Object.keys(this.levels).length - 1 : 0;
		this.id = name;
		this.color = getColorDictColor(this.color);
		this.moveCounter = 0;
	}
	startGame() {
		//console.log('starting', this.name);
		this.moveCounter = 0;
		this.winner = null;
		this.setStartPlayer();
	}
	clear() { clearTimeout(this.TO); }
	changePlayer() {
		let idx = this.iPlayer = (this.iPlayer + 1) % this.players.length;
		//console.log('changePlayer to', this.players[idx].id);
		this.setPlayers();
	}
	heuristic(state) { return 1; }
	setPlayers() {
		this.plTurn = this.playerOrder[this.iPlayer];
		this.plOpp = this.plTurn == this.ai ? this.human : this.ai;
	}
	setStartPlayer() {
		//console.log('starting player:', this.startPlayer)
		if (this.startPlayer == 'human') this.playerOrder = [this.human, this.ai];
		else if (this.startPlayer == 'ai') this.playerOrder = [this.ai, this.human];
		else this.playerOrder = chooseRandom([[this.human, this.ai], [this.ai, this.human]]);
		this.iPlayer = 0;
		this.setPlayers();
	}
	startRound() { }//console.log('startRound', this.name); }
	prompt() { }
}
class GTTT extends G2Player {
	startGame() {
		super.startGame();
		this.createBoard();
		this.human.sym = 'O';
		this.ai.sym = 'X';
	}
	createBoard() {
		this.rows = this.cols = this.boardSize;
		this.board = new Board(this.rows, this.cols, this.controller.uiInteract.bind(this.controller));
	}
	setStartPosition() {
		let positions = [
			new Array(9).fill(null),
			['X', 'X', null, 'O', null, null, 'O', null, null],
			[null, 'X', null, 'X', null, 'O', null, 'O', null],
			[null, null, null, null, 'X', 'O', null, 'O', null],
		];
		if (isdef(this.iPosition)) {
			let idx = this.iPosition + 1; idx = idx % positions.length; this.iPosition = idx;
		} else this.iPosition = 0;

		let state = nundef(this.startPosition) || this.startPosition == 'empty' ? positions[0]
			: this.startPosition == 'random' ? chooseRandom(positions)
				: positions[this.iPosition];
		//state =['X', 'X', null, 'O', null, null, 'O', null, null];
		//state =[null, 'X', null, 'X', null, 'O', null, 'O', null];
		//state=[null, null, null, null, 'X', 'O', null, 'O', null];
		this.board.setState(state, { X: this.ai.color, O: this.human.color });
		//console.log('state',state)
	}
	prompt() {
		let msg = this.plTurn == this.ai ? 'Ai thinking...' : 'click an empty field!';
		showInstruction('', msg, dTitle, false);
		this.controller.activateUi();
	}
	activate() {
		let pl = this.plTurn;
		let autoplay = false;
		if (autoplay || pl == this.ai) {
			if (this.ai == pl) uiActivated = false;
			//showCancelButton();

			//AIMinimax(this,this.afterComputerMove)		
			setTimeout(() => AIMinimax(this, this.afterComputerMove.bind(this)), 200);

			//console.log('halloooooooooooooooooo')

			// this.TO = setTimeout(() => {
			// 	AIMinimax(this,this.afterComputerMove.bind(this));
			// 	console.log('...sollte das gleich schreiben!!!')
			// }, 10); //DELAY
		}
	}
	interact(ev) {
		let tile = evToItemC(ev);
		if (isdef(tile.label)) return; //illegal move!
		let pl = this.plTurn;

		addLabel(tile, pl.sym, { fz: 60, fg: pl.color });
		this.controller.evaluate(tile);
	}
	afterComputerMove(iMove) {
		//console.log('CALLBACK!!!', iMove)
		//hide(mBy('bCancelAI'));
		let tile = this.board.items[iMove];
		this.interact({ target: iDiv(tile) });
	}
	eval() {
		//let sym = this.plTurn.sym;
		//console.log('eval: state',state,'sym',sym,'label',tile.label);
		let done = this.checkFinal();
		this.gameOver = done > 0;
		if (this.gameOver) { this.winner = done > 1 ? this.plTurn : null; this.tie = done == 1; }
	}

	checkFinal(state) {
		if (nundef(state)) state = this.getState();
		let isTie = false;
		let isWin = checkWinnerTTT(state);
		if (!isWin) { isTie = checkBoardFull(state) || !checkPotentialTTT(state); }
		return isWin ? 2 : isTie ? 1 : 0;
	}
	getState() { return this.board.getState(); }

	//static mm functions
	//state is modified by player doing move
	applyMove(state, move, player) { arrReplaceAtInPlace(state, move, player.sym); }
	undoMove(state, move, player) { arrReplaceAtInPlace(state, move, ' '); }
	getAvailableMoves(state) {
		let moves = [];
		for (let i = 0; i < state.length; i++) {
			if (EmptyFunc(state[i])) moves.push(i);
		}
		shuffle(moves);
		return moves;
	}
	heuristic1(node, depth) { }
	evalState(node, depth) {
		let x = checkWinnerTTT(node);
		if (checkBoardFull(node) || x) {
			//var score = x;
			return { reached: true, val: (!x ? 0 : (10 - depth) * (x == MAXIMIZER.sym ? 1 : -1)) };
			// return evalState8(node, depth);
		}
		return { reached: false };
	}
	evalStateL(node, depth) {
		let key = node.join('');
		let val = DMM[key];
		let x = isdef(val) ? val : checkWinnerTTT(node);
		DMM[key] = x;
		if (checkBoardFull(node) || x) {
			return { reached: true, val: (!x ? 0 : (10 - depth) * (x == MAXIMIZER.sym ? 1 : -1)) };
		}
		return { reached: false };
	}
	evalStateL2(node, depth) {
		let full = checkBoardFull(node);
		if (full) {
			let key = JSON.stringify(node);
			let x = DMM[key];
			if (nundef(x)) DMM[key] = x = checkWinnerTTT(node);
			return { reached: true, val: (!x ? 0 : (10 - depth) * (x == MAXIMIZER.sym ? 1 : -1)) };
		} else {
			let x = checkWinnerTTT(node);
			if (x) return { reached: true, val: (!x ? 0 : (10 - depth) * (x == MAXIMIZER.sym ? 1 : -1)) };
			return { reached: false };
		}
	}
}
class GC4 extends GTTT {
	startGame() {
		super.startGame();
		this.setStartPosition();
	}
	createBoard() {
		this.board = new Board(this.rows, this.cols, this.controller.uiInteract.bind(this.controller), { margin: 6, w: 60, h: 60, bg: 'white', fg: 'black', rounding: '50%' });
		// this.board = new Board(this.rows, this.cols, justClick, { margin: 6, w: 60, h: 60, bg: 'white', fg: 'black', rounding:'50%' });
	}
	setStartPosition() {
		let positions = [
			//0
			[[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]],
			//1
			[[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			['O', 'X', 0, 0, 0, 0, 0],
			['O', 'X', 0, 0, 0, 0, 0]],
			//2
			[[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			['O', 'X', 0, 0, 0, 0, 0],
			['O', 'X', 0, 0, 0, 0, 0],
			['O', 'X', 0, 0, 0, 0, 0]],
			//3
			[[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 'O', 0, 0, 0],
			['O', 'X', 0, 'O', 0, 0, 0],
			['O', 'X', 0, 'O', 0, 0, 0]],
			//4
			[[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, "X", 0, 0, 0],
			["X", 0, 0, "O", 0, 0, 0],
			["O", "X", 0, "O", 0, 0, 0],
			["O", "X", "O", "O", 0, 0, 0]],
			//5
			[[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			["X", 0, 0, 0, 0, 0, 0],
			["X", 0, 0, 0, "O", "O", 0]],
		];
		this.iPosition = 4;
		//this.startPosition = 'seq';
		if (isdef(this.iPosition)) {
			let idx = this.iPosition + 1; idx = idx % positions.length; this.iPosition = idx;
		} else this.iPosition = 0;

		let state = nundef(this.startPosition) || this.startPosition == 'empty' ? positions[0]
			: this.startPosition == 'random' ? chooseRandom(positions)
				: positions[this.iPosition];
		this.board.setState(state, { X: this.ai.color, O: this.human.color });
	}
	checkFinal(state) {
		if (nundef(state)) state = this.getState();
		let isTie = false;
		let isWin = checkWinnerC4(state, this.rows, this.cols, this.stride);
		//console.log('winner', isWin, state)
		if (!isWin) { isTie = checkBoardFull(state); }// || !checkPotentialC4(state); }
		return isWin ? 2 : isTie ? 1 : 0;
	}
	checkLegal(tile) {
		//need to check if topmost tile with tile.col (=tile with index col) is empty. if so, this move is legal!
		let col = tile.col;
		//console.log('col', col);
		let topmost = this.board.items[col];
		if (EmptyFunc(topmost.label)) return true; else return false;

	}
	findBottomEmptyTileInColumn(col) {
		let x = lastCond(this.board.items, x => x.col == col && EmptyFunc(x.label));
		return x;
	}
	interact(ev) {
		let tile = evToItemC(ev);
		let legal = this.checkLegal(tile);
		if (!legal) { console.log('illegal move!'); return; } //illegal move!
		// if (!EmptyFunc(tile.label)) {console.log('illegal move!');return;} //illegal move!
		let pl = this.plTurn;
		let bottomMost = this.findBottomEmptyTileInColumn(tile.col);
		addLabel(bottomMost, pl.sym, { fz: 60, fg: pl.color });
		//console.log('move COMPLETED for', pl.id)
		this.controller.evaluate(tile);
	}

	getAvailableMoves(state) {
		let moves = [];
		for (let c = 0; c < G.cols; c++) {
			for (let r = G.rows - 1; r >= 0; r--) {
				let i = r * G.cols + c;
				if (EmptyFunc(state[i])) { moves.push(i); break; }
			}
		}
		shuffle(moves)
		return moves;
	}
	evalState(node, depth) {
		let x = checkWinnerC4(node);

		if (checkBoardFull(node) || x) {
			//console.log('found end condition!!!! winner',x)
			let res = { reached: true, val: (!x ? 0 : (10 - depth) * (x == MAXIMIZER.sym ? 1 : -1)) };
			//console.log(res)
			// console.log('__________________',depth); printState(node)
			if (x) console.log('_____winning move', x, 'd=' + depth, '\n', res);

			return res;
			//return { reached: true, val: (!x ? 0 : x == MAXIMIZER.sym ? (10 - depth) : (depth - 10)) };
		}
		return { reached: false };
	}

}
class GReversi extends GTTT {
	createBoard() {
		this.board = new Board(this.rows, this.cols, this.controller.uiInteract.bind(this.controller), { margin: 6, w: 60, h: 60, bg: 'white', fg: 'black', rounding: '50%' });
		// this.board = new Board(this.rows, this.cols, justClick, { margin: 6, w: 60, h: 60, bg: 'white', fg: 'black', rounding:'50%' });
	}
	setStartPosition() {
		let positions = [
			//0
			[[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 'O', 'X', 0, 0],
			[0, 0, 'X', 'O', 0, 0],
			[0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0]],
		];
		//this.startPosition = 'seq';
		if (isdef(this.iPosition)) {
			let idx = this.iPosition + 1; idx = idx % positions.length; this.iPosition = idx;
		} else this.iPosition = 0;

		if (this.startPosition == 'empty' || this.rows != 6 || this.cols != 6) {
			//in der mitte muss o,x und x,o haben!
			//board braucht  even*even
			let pos = bCreateEmpty(this.rows, this.cols);
			let r1 = this.rows / 2 - 1, r2 = this.rows / 2, c1 = this.cols / 2 - 1, c2 = this.cols / 2;
			pos[r1 * this.cols + c1] = pos[r2 * this.cols + c2] = 'O';
			pos[r1 * this.cols + c2] = pos[r2 * this.cols + c1] = 'X';
			positions[0] = pos;
		}
		let state = nundef(this.startPosition) || this.startPosition == 'empty' ? positions[0]
			: this.startPosition == 'random' ? chooseRandom(positions)
				: positions[this.iPosition];

		//state = [['X', 0, 0, 'X'], [0, 'O', 'X', 0], [0, 'O', 'O', 0], [0, 'O', 0, 'O']]; //tricky test!
		this.board.setState(state, { X: this.ai.color, O: this.human.color });
	}
	startGame() {
		super.startGame();
		this.setStartPosition();
	}
	checkLegal(tile) {
		//tile must be empty
		let state = this.getState();
		if (!EmptyFunc(tile.label)) return false;
		let nei = bNei(state, tile.index, this.rows, this.cols, true);
		for (const n of nei) {
			if (!n) continue;
			let t = state[n];
			if (!EmptyFunc(t)) return true;
		}
		console.log('ILLEGAL MOVE! tile', tile.index, 'does not have neighbor!')
		return false;
	}
	interact(ev) {
		let tile = evToItemC(ev);
		//console.log(isdef(tile.label))
		if (!this.checkLegal(tile)) return; //illegal move!
		let pl = this.plTurn;

		addLabel(tile, pl.sym, { fz: 60, fg: pl.color });

		let state = this.getState();
		let iCapt = bCapturedPieces(pl.sym, state, tile.index, this.rows, this.cols);
		//console.log('captured', iCapt);
		for (const i of iCapt) {
			let item = this.board.get(i);
			//console.log('item', item);
			modLabel(item, this.plTurn.sym, { fg: this.plTurn.color });
		}

		this.controller.evaluate(tile);
	}
	activate() {
		let pl = this.plTurn;

		// let m = this.getAvailableMoves(this.getState()); m.sort((a, b) => a - b);
		// console.log('possible moves', m);

		// return;
		let autoplay = false;
		if (autoplay || pl == this.ai) {
			if (this.ai == pl) uiActivated = false;
			setTimeout(() => AIMinimax(this, this.afterComputerMove.bind(this)), 200);
		}
	}
	checkFinal(state, pl1, pl2) {
		if (nundef(state)) state = this.getState();
		if (nundef(pl1)) pl1 = this.plTurn;
		if (nundef(pl2)) pl2 = this.plOpp;
		return GReversi.checkEnd(state, pl1, pl2);
	}
	static checkEnd(state, pl1, pl2) {
		let hasPl1 = false, hasPl2 = false, s1 = pl1.sym, s2 = pl2.sym, hasEmpty = false;
		for (const s of state) {
			if (!hasPl1 && s == s1) hasPl1 = true;
			else if (!hasPl2 && s == s2) hasPl2 = true;
			else if (!hasEmpty && EmptyFunc(s)) hasEmpty = true;
			if (hasPl1 && hasPl2 && hasEmpty) return false;
		}
		let winner = !hasPl2 ? pl1 : !hasPl1 ? pl2 : 0;
		let full = !hasEmpty;
		if (full) {
			let n1 = arrCount(state, x => x == s1);
			let n2 = arrCount(state, x => x == s2);
			if (!winner && n1 != n2) {
				if (n1 > n2) winner = pl1; else winner = pl2;
			}
		}
		return winner ? { reached: true, winner: winner } : full ? { reached: true, winner: null } : { reached: false };
	}
	heuristic(state, plMax, plMin) {
		let vmax = 0, vmin = 0;
		// let corners = [0, G.cols, G.cols * (G.rows - 1), G.cols * G.rows - 1];
		// let vmax = 0, vmin = 0;
		// for (const i of corners) {
		// 	if (state[i] == pl1.sym) vmax += 4;
		// 	else if (state[i] == pl2.sym) vmin += 4;
		// }
		vmax = vmax + arrCount(state, x => x == plMax.sym);
		vmin = vmin + arrCount(state, x => x == plMin.sym);

		return vmax - vmin;
	}
	heureval(state) {
		let heurinfo = GReversi.heuristic(state, MAXIMIZER, MINIMIZER);
		let val = heurinfo.val; //* (info.winner == MAXIMIZER ? 1 : -1)
		return val;
	}
	eval() {
		this.moveCounter += 1;
		let info = this.checkFinal();
		this.gameOver = info.reached;
		if (this.gameOver) {
			this.winner = info.winner;
			this.tie = !info.winner;
			if (this.winner) {
				this.loser = this.winner == this.ai ? this.human : this.ai;
				let state = this.getState();
				let nWinner = arrCount(state, x => x == this.winner.sym);
				let nLoser = arrCount(state, x => x == this.loser.sym);
				this.info = '(' + nWinner + ':' + nLoser + ')';
			}


		}

	}

	getAvailableMoves(state) {
		let moves = [];
		for (let i = 0; i < state.length; i++) {
			if (EmptyFunc(state[i])) {
				let nei = bNei(state, i, G.rows, G.cols, true);
				let iFull = firstCond(nei, x => !EmptyFunc(state[x]));
				//if (i==4) console.log('nei',nei,'iFull',iFull);
				if (iFull != null) moves.push(i);
			}
		}
		//console.log(moves)
		//shuffle(moves);
		return moves;
	}
	evalState(state, depth) {
		let info = GReversi.checkEnd(state, MAXIMIZER, MINIMIZER);

		let val = info.reached && info.winner ? (100 - depth) * (info.winner == MAXIMIZER ? 1 : -1) : 0;

		return { reached: info.reached, val: val };
	}
	applyMove(state, move, player) {
		//console.log('______________\nmove',move,'by player',player.sym);
		//printState(state);
		arrReplaceAtInPlace(state, move, player.sym);
		let iCapt = bCapturedPieces(player.sym, state, move, G.rows, G.cols);
		for (const i of iCapt) { state[i] = player.sym; }
	}

}
class GChess extends G2Player {
	clear() { super.clear(); if (isdef(this.game)) { this.game.reset(); } }
	startGame() {
		super.startGame();
		this.createBoard();
		this.game = new Chess();
		this.setStartPosition();
		let c = this.game.turn();
		if (c == 'b') { this.plTurn.color = 'black'; this.plOpp.color = 'white'; } else { this.plTurn.color = 'white'; this.plOpp.color = 'black'; }
		showFleetingMessage(`You play ${this.human.color}`)
	}
	createBoard() {
		let d = mDiv(dTable, { h: 500, w: 500 }, 'dChessBoard');
		let config = {
			pieceTheme: '../alibs/chessBoard/img/chesspieces/wikipedia/{piece}.png',
			draggable: true,
			onDragStart: this.onDragStart.bind(this),
			onDrop: this.onDrop.bind(this),
			onSnapEnd: this.onSnapEnd.bind(this),

		}
		this.board = ChessBoard('dChessBoard', config);
		mLinebreak(dTable);
	}
	setStartPosition() {
		//this code works!!!
		// this.game.load('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1');
		// this.board.position(this.game.fen());
		// return;
		let positions = [
			'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', //default start pos
			'8/8/8/8/8/8/8/8 w KQkq - 0 1', //empty board
			'8/8/8/8/8/8/8/8 b KQkq - 0 1', //black starts
			'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e3 0 2',
			{
				arr: [
					['em', 'em', 'bk', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'wq', 'em', 'em'],
					['em', 'em', 'wk', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'wp', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
				], plStart: 'w'
			},
			{
				arr: [
					['em', 'em', 'bk', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'wq', 'em', 'em', 'em', 'em'],
					['em', 'em', 'wk', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'wp', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
				], plStart: 'w'
			},
			{
				arr: [
					['em', 'em', 'bk', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'wq', 'em', 'em', 'em', 'em'],
					['em', 'em', 'wk', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'bp', 'em'],
					['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
				], plStart: 'b'
			},

		];
		if (nundef(this.iPosition)) this.iPosition = 0;

		let state = nundef(this.startPosition) || this.startPosition == 'empty' ? positions[0] : this.startPosition == 'random' ? chooseRandom(positions) : positions[this.iPosition];
		if (!isString(state)) state = arrToFen(state.arr, state.plStart);

		this.game.load(state); //'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1');
		this.board.position(this.game.fen());

		let idx = this.iPosition + 1; idx = idx % positions.length; this.iPosition = idx;//advance iPosition for next time!
	}
	prompt() {
		let msg = this.plTurn == this.ai && !this.manual ? `Ai (${this.ai.color.toUpperCase()}) thinking...`
			: `player: ${this.plTurn.color.toUpperCase()}`;

		showInstruction(this.game.in_check() ? '- CHECK!!!' : '', msg, dTitle, false);
		this.controller.activateUi();
	}
	activate() {
		let pl = this.plTurn;
		let autoplay = false;
		if (autoplay || pl == this.ai) {
			if (this.ai == pl) { uiActivated = false; aiActivated = true; }
			this.TO = setTimeout(() => {
				//wenn er da reingeht, dann kann er nicht mehr unterbrochen werden!!!
				// let x = makeBestMove('b'); console.log('x', x);
				//if (!this.game) return;
				let color = this.game.turn();
				if (color === 'b') { var move = getBestMove(this.game, color, globalSum)[0]; }
				else { var move = getBestMove(this.game, color, -globalSum)[0]; }
				globalSum = evaluateBoard(move, globalSum, 'b');
				this.game.move(move);
				this.board.position(this.game.fen());
				this.controller.evaluate();
			}, 100);
		} else { aiActivated = false; uiActivated = true; }
	}
	getTurnColor() { return this.getPlayer(this.game.turn() == 'b' ? 'black' : 'white'); }
	getOppColor() { return this.getPlayer(this.game.turn() == 'b' ? 'white' : 'black'); }
	getPlayer(color) { return firstCond(this.players, x => x.color == color); }
	changePlayer() { this.plTurn = this.game.turn() == 'b' ? this.getPlayer('black') : this.getPlayer('white'); }
	onDragStart(source, piece, position, orientation) {
		// do not pick up pieces if the this.game is over
		if (this.game.game_over() || !uiActivated) return false;

		// only pick up pieces for the side to move
		if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
			(this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
			return false
		}
	}
	onDrop(source, target) {
		// see if the move is legal
		var move = this.game.move({
			from: source,
			to: target,
			promotion: 'q' // NOTE: always promote to a queen for example simplicity
		});
		if (move === null) return 'snapback';
		this.controller.evaluate();
	}
	onSnapEnd() { this.board.position(this.game.fen()) }

	eval() {
		this.info = null;
		let over = this.gameOver = this.game.game_over();
		if (this.game.in_draw()) { this.tie = true; console.log('in_draw'); this.info = '(draw)'; }
		if (this.game.in_stalemate()) { this.tie = true; console.log('in_stalemate'); this.info = '(stalemate)'; }
		if (this.game.in_threefold_repetition()) { this.tie = true; console.log('in_threefold_repetition'); this.info = '(threefold repetition)'; }
		if (this.game.in_checkmate()) {
			this.tie = false;
			this.winner = this.getOppColor();
			console.log('in_checkmate');
			this.info = `(${this.winner.color.toUpperCase()})`;
		}
	}
}
class GKrieg extends G2Player {
	startGame() {
		super.startGame();
		this.game = new GKriegBack();
		this.setStartPosition();
	}
	setStartPosition() {
		let positions = [
			null,
			{
				pl1: { hand: ['TH', 'QH'], trick: [['QH']] },
				pl2: { hand: ['TC', 'QC'], trick: [['KC']] },
			},

			//old state reps:
			[
				[['2S', '3S', 'TS', 'QH'], ['4S', '5S', 'JS', 'QC']], //hands pl1,pl2
				[[['QD'], ['AH', '2D', 'JH']], [['QS'], ['AD', '8D', 'KD']]], // trick / war on table
			],
			//more compressed state reps:
			[['2S,3S,TS,QH', '4S,5S,JS,QC'], [['QD', 'AH,2D,JH'], ['QS', 'AD,8D,KD']]], // hands, trick/war on table per player
			'2S,3S,TS,QH/4S,5S,JS,QC - QD.AH,2D,JH/QS.AD,8D,KD', // hands, trick/war on table per player
		];
		if (nundef(this.iPosition)) this.iPosition = 0;
		let state = nundef(this.startPosition) || this.startPosition == 'empty' ? positions[0] : this.startPosition == 'random' ? chooseRandom(positions) : positions[this.iPosition];
		this.game.load(state);
		// console.log('players', this.game.pl1, this.game.pl2, 'rest of deck', this.game.deck.data);
		let idx = this.iPosition + 1; idx = idx % positions.length; this.iPosition = idx;//advance iPosition for next time!
	}

	getState() { return this.game.fen(); }
	prompt() {
		// wo sind die cards?

	}
}

class GKriegBack {
	fen() { return }
	load(state) {
		let deck = this.deck = new Deck('52');
		this.pl1 = { hand: null, trick: [], index: 0 };
		this.pl2 = { hand: null, trick: [], index: 1 };
		if (nundef(state)) {
			let n = 5;
			let h1 = this.pl1.hand = deck.deal(n);
			let h2 = this.pl2.hand = deck.deal(n);
		} else {
			/* example of a state:
			{
				pl1: { hand: ['TH', 'QH'], trick: [['QH']] },
				pl2: { hand: ['TC', 'QC'], trick: [['KC']] },
			},
			*/
			if (isdef(state.pl1.hand)) this.pl1.hand = parseHand(state.pl1.hand, deck);
			if (isdef(state.pl2.hand)) this.pl2.hand = parseHand(state.pl2.hand, deck);
			if (isdef(state.pl1.trick)) state.pl1.trick.map(x => this.pl1.trick.push(parseHand(x, deck)));
			if (isdef(state.pl2.trick)) state.pl2.trick.map(x => this.pl2.trick.push(parseHand(x, deck)));
			if (isdef(state.deck)) this.deck.setData(parseHand(state.deck));
		}
		this.players = [this.pl1, this.pl2];
		this.iturn = 0;
	}
	get_state() { return { pl1: this.pl1, pl2: this.pl2, deck: this.deck } };
	turn() { return this.iturn; }
	swap_turn() { this.iturn = this.iturn == 0 ? 1 : 0; }
	top(pl) {
		let l = arrLastOfLast(pl.trick);
		if (isdef(l)) {
			//console.log('card', l, 'is', Card52._getKey(l));
			l = l % 13;
			if (l == 0) l = 13;
			return l;
		} //else { console.log('top undefined!', l, pl) }
		return null;
	}
	get_moves() {
		let pl = this.player()
		let moves = [];
		if (this.in_trick()) { moves.push([arrLast(pl.hand)]); }//console.log('in_trick') }
		else if (this.is_war()) { moves.push(arrTakeFromEnd(pl.hand, 3)); }//console.log('is_war') }
		else if (this.in_war()) { moves.push(arrTakeFromEnd(pl.hand, 3)); }//console.log('in_war') }
		else { moves.push([arrLast(pl.hand)]); } //console.log('first!') }
		return moves;
	}
	make_random_move() {
		let moves = this.get_moves();
		let move = chooseRandom(moves);
		this.make_move(move);
	}
	make_move(move) {
		// a move is a list of integers (=cards)
		let pl = this.player();
		pl.trick.push(move);
		move.map(x => removeInPlace(pl.hand, x));
		//this.print_state();
		let result = this.resolve();
		this.push_history(this.iturn, move, result);
		this.swap_turn();
		//add move to history!
	}
	resolve() {
		//console.log('...resolve')
		let pl = this.player(), opp = this.opponent();
		if (pl == this.pl1) return null;
		let t1 = this.top(pl); let t2 = this.top(opp);
		//console.log('t1', t1, 't2', t2)
		if (isdef(t1) && isdef(t2)) {
			if (t1 > t2) { return this.add_trick_from_to(opp, pl); }
			else if (t2 > t1) { return this.add_trick_from_to(pl, opp); }
			else return null;
		}
		return null;
	}
	add_trick_from_to(plFrom, plTo) {
		let t1 = plFrom.trick;
		let t2 = plTo.trick;
		let iLoser = plFrom.index;
		let iWinner = plTo.index;
		let cards1 = arrFlatten(plFrom.trick); console.log('cards from loser:', cards1);//, plFrom);
		let cards2 = arrFlatten(plTo.trick); console.log('cards from winner:', cards2);//, plTo);
		let cards = cards1.concat(cards2);
		//console.log('cards', cards)
		plTo.hand = cards.concat(plTo.hand);
		plFrom.trick = [];
		plTo.trick = [];
		return { iWinner: iWinner, winnerTrick: t2, iLoser: iLoser, loserTrick: t1, cards: cards };
	}
	undo() {
		let hist = this.pop_history();
		if (hist == null) { return null; }
		let move = hist.move;
		this.iturn = hist.iturn;
		// console.log('move is',hist,'this.iturn',this.iturn)
		let pl = this.player();
		pl.hand.push(move);
		move.map(x => removeInPlace(pl.trick, x));

		if (isdef(hist.result)) {
			let plWin = this.players[hist.iWinner];
			let plLose = this.players[hist.iLoser];
			plWin.trick = hist.winnerTrick;
			plLose.trick = hist.loserTrick;
			plWin.hand = arrTake(plWin.hand, plWin.hand.length - hist.cards.length);
		}

		//this.print_state();
	}
	print_state() {
		if (nundef(this.history)) this.history = [];
		console.log('________ #' + this.history.length, 'turn', this.turn(), '\npl1', this.pl1.hand, 'played', arrFlatten(this.pl1.trick), '\npl2', this.pl2.hand, 'played', arrFlatten(this.pl2.trick), '\ndeck', this.deck.data);
	}
	player() { return this.players[this.iturn]; }
	opponent() { return this.players[(this.iturn + 1) % this.players.length]; }
	push_history(iturn, move, result) { if (nundef(this.history)) this.history = []; this.history.push({ iturn: iturn, move: move, result: result }); return this.history; }
	pop_history() { if (nundef(this.history)) this.history = []; return this.history.pop(); }
	is_war() { let pl = this.player(), opp = this.opponent(); return pl.trick.length > 0 && pl.trick.length == opp.trick.length && this.top(pl) == this.top(opp); }
	in_war() { let pl = this.player(), opp = this.opponent(); return pl.trick.length == opp.trick.length - 1 && pl.trick.length >= 1; }
	in_trick() { let pl = this.player(), opp = this.opponent(); return pl.trick.length == 0 && opp.trick.length == 1; }
	is_out_of_cards() { let pl = this.player(), opp = this.opponent(); return (isEmpty(pl.hand.length) || isEmpty(opp.hand)); }
}

function parseHand(keys, deck) {
	let h1 = keys.map(x => Card52._fromKey(x));
	//console.log('h1', h1)
	if (isdef(deck)) h1.map(x => deck.remove(x));
	return h1;
}
