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
		this.moveCounter = 0;
		this.winner = null;
		//console.log('starting', this);
		this.setStartPlayer();
	}
	clear() { clearTimeout(this.TO); }
	changePlayer() {
		let idx = this.iPlayer = (this.iPlayer + 1) % this.players.length;
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
	startRound() { }

}
class GTTT extends G2Player {
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
		this.board.setState(state, { X: this.ai.color, O: this.human.color }); //AI wins! ok
		//console.log('state',state)
	}
	startGame() {
		super.startGame();
		this.createBoard();
		this.human.sym = 'O';
		this.ai.sym = 'X';
	}
	interact(ev) {
		let tile = evToItemC(ev);
		if (isdef(tile.label)) return; //illegal move!
		let pl = this.plTurn;

		addLabel(tile, pl.sym, { fz: 60, fg: pl.color });
		this.controller.evaluate(tile);
	}
	prompt() {
		let msg = this.plTurn == this.ai ? 'Ai thinking...' : 'click an empty field!';
		showInstruction('', msg, dTitle, false);
		// if (isAI(this.plTurn)) clearElement(dTitle); else showInstruction('', 'click an empty field!', dTitle, false);
		this.controller.activateUi();
	}
	computerMove_old() {
		let state = this.getState();
		state = boardToNode(state);
		let searchDepth = this.searchDepth;
		var iMove1 = prepMM(state, mmab9, this.evalState, searchDepth);
		var iMove2 = prepMM(state, mm13, this.evalStateL2, searchDepth);
		if (iMove1 != iMove2) { console.log('===>DIFFERENT VALUES!!!!! mmab1:' + iMove1, 'new:' + iMove2); }
		else { console.log('OK! mmab9 returned', iMove1, 'new returned', iMove2); }
		return iMove2;
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
	startGame() {
		super.startGame();
		this.setStartPosition();
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
		//console.log('capture:',iCapt);
		for (const i of iCapt) { state[i] = player.sym; }
		//console.log('=>')
		//printState(state)

	}

}

class GChess extends G2Player {
	createBoard() {
		this.board = new ChessBoard(this.rows, this.cols, this.controller.uiInteract.bind(this.controller));

	}
	setStartPosition() { this.board.setInitialPosition(); }
	startGame() {
		super.startGame();
		this.createBoard();
		this.setStartPosition();
		this.human.color = 'white';
		this.ai.color = 'black';
	}
	interact(ev) {
		let tile = evToItemC(ev);

		if (isdef(tile.label)) return; //illegal move!
		let pl = this.plTurn;

		addLabel(tile, pl.sym, { fz: 60, fg: pl.color });
		this.controller.evaluate(tile);
	}
	prompt() {
		let msg = this.plTurn == this.ai ? 'Ai thinking...' : 'Player on turn:';
		showInstruction(this.plTurn.color, msg, dTitle, false);


		this.controller.activateUi();
	}
	getPiece(state, idx) {
		let arr = state;
		let pieceKey = arr[idx];

	}
	getPlayerPieces(state, pl) {
		let pieces = [];
		for (let i = 0; i < state.length; i++) {
			if (state[i][0] == pl.color[0]) {
				//let [r,c]=
				pieces.push({ piece: state[i], idx: i });
				movesPerPiece[i] = Rook.getMoves(state, i, 8, 8);
				console.log('rook moves for piece', i, movesPerPiece[i]);
			}
		}
	}
	onSelect(ev) {
		let item = evToItemC(ev);
		if (item == this.selectedItem) return;
		else if (isdef(this.selectedItem)) unselectPreviousItemAndTargets(this.selectedItem);
		this.selectedItem = selectItemAndTargets(item);
	}
	activate() {
		let pl = this.plTurn;
		let opp = this.plOpp;
		let autoplay = false;
		let manual = true;
		if (!manual && (autoplay || pl == this.ai)) {
			if (this.ai == pl) uiActivated = false;
			//showCancelButton();

			//AIMinimax(this,this.afterComputerMove)		
			setTimeout(() => AIMinimax(this, this.afterComputerMove.bind(this)), 200);

			//console.log('halloooooooooooooooooo')

			// this.TO = setTimeout(() => {
			// 	AIMinimax(this,this.afterComputerMove.bind(this));
			// 	console.log('...sollte das gleich schreiben!!!')
			// }, 10); //DELAY
		} else {
			let state = this.getState();
			let [plPieces, avMoves] = this.getAvailableMoves(state, pl, opp);
			if (isEmpty(avMoves)) { this.controller.evaluate(true); }
			else this.activatePiecesThatCanMove(plPieces);
		}
	}
	getAvailableMoves(state, pl, opp) {
		let plPieces = getMovesPerPiece(state, pl, G.rows, G.cols);

		let rochadeMoves = getMoveRochade(state,pl,G.rows, G.cols);


		for (const p in plPieces) { plPieces[p].avMoves = []; }
		let avMoves = [];
		//clearChessPieces();
		for (const from in plPieces) {
			for (const to of plPieces[from].moves) {
				let move = { from: from, to: to };
				//console.log('checking move',move);
				let newState = G.applyMove(state, move, pl);
				//console.log('state',state,'newState',newState);
				//return;
				//check if in the new situation, king is in check or not!
				let isCheck = isKingInCheck(newState, pl, opp, G.rows, G.cols);
				if (to == 0) console.log('done!', to, isCheck)
				if (!isCheck) { avMoves.push(move); plPieces[from].avMoves.push(move.to); }
				//if yes, this move is discarded!
			}
		}
		console.log('avMoves', avMoves);
		return [plPieces, avMoves];
	}
	activateMoves(plPieces, avMoves) {
		for (const p in plPieces) { this.board.items[p].targets = []; }
		for (const m of avMoves) {
			let k = m.from;
			// let piece = plPieces[k];
			// piece.avMoves.push(m.to);
			let item = this.board.items[k];
			iEnableSelect(item, this.onSelect.bind(this));
			item.targets.push(m.to);
		}
	}
	activatePiecesThatCanMove(plPieces) {
		for (const k in plPieces) {
			let moves = plPieces[k].avMoves;
			if (isEmpty(moves)) continue;

			// show field bg in darker
			let item = this.board.items[k];
			iEnableSelect(item, this.onSelect.bind(this));
			item.targets = moves;
		}
	}
	afterComputerMove(iMove) {
		//console.log('CALLBACK!!!', iMove)
		//hide(mBy('bCancelAI'));
		let tile = this.board.items[iMove];
		this.interact({ target: iDiv(tile) });
	}
	eval(isEnd) {
		this.gameOver = isdef(isEnd);
		let state = this.getState();
		if (this.gameOver) {
			if (isKingInCheck(state, this.plTurn, this.plOpp, this.rows, this.cols)) {
				showFleetingMessage('CHECK MATE');
				this.winner = this.plOpp;
			} else {
				showFleetingMessage('' + this.plTurn.color + " can't move: draw!");
				this.tie = true;
			}
		}
	}
	applyMove(state, move, player) {
		state = jsCopy(state);
		let from = move.from;
		let to = move.to;
		state[to] = state[from];
		state[from] = null;
		return state;
	}
	heuristic(state){
		// einfach punkte zusammen zaehlen
		// aber schach sagen soll auch gut sein!
	}
	evalState(state, depth) {
		//soll draws ohne patt oder matt feststellen
		//zB wenn 3x hintereinander gleicher move : ignore
		//oder: wenn nur noch 2 kings da sind : ignore
		return { reached: false };
	}
	getState(){return this.board.getState();}
}


