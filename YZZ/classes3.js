class GTTT {
	constructor(name, o) {
		this.name = name;
		copyKeys(o, this);
		this.maxLevel = isdef(this.levels) ? Object.keys(this.levels).length - 1 : 0;
		this.id = name;
		this.color = getColorDictColor(this.color);

	}
	clear() { clearTimeout(this.TO); }
	startGame() {
		let board = this.board = new Board(3, 3, this.controller.uiInteract.bind(this.controller));
		this.human.sym = 'O';
		this.ai.sym = 'X';
	}
	startRound(){}
	interact(ev) {
		let tile = evToItemC(ev);
		if (isdef(tile.label)) return; //illegal move!
		let pl = this.plTurn;
		addLabel(tile, pl.sym, { fz: 60, fg: pl.color });
		this.controller.evaluate(tile);
	}
	prompt() {
		let msg = isAI(this.plTurn) ? 'Ai thinking...' : 'click an empty field!';
		showInstruction('', msg, dTitle, false);
		// if (isAI(this.plTurn)) clearElement(dTitle); else showInstruction('', 'click an empty field!', dTitle, false);
		this.controller.activateUi();
	}
	activate() {
		let pl = this.plTurn;
		if (isAI(pl)) {
			this.TO = setTimeout(() => {
				let state = this.getState();
				let m = this.availableMoves(state, pl);

				let move = chooseRandom(m);
				//console.log('AI move',move)
				
				let tile = this.board.items[move.index];
				this.interact({ target: iDiv(tile) });
			}, DELAY);
		}
	}
	eval(tile) {
		let state = this.getState();
		let sym = this.plTurn.sym;
		//console.log('eval: state',state,'sym',sym,'label',tile.label);
		let res = checkForWinner(state, this.human.sym, this.ai.sym); // returns a sym
		//console.log('result checkForWinner',res=='O'?'human':res =='X'?'ai':res==0?'tie':'undecided as of yet');
		this.gameOver = isdef(res);
		this.winner = this.gameOver && res!=0? this.getPlayer(res):null;
		//this.evalState(this.getState(),this.plTurn.sym);
		//muss eigentlich nur checken ob alle in row or alle in col or alle in diag (?) same sind
	}
	availableMoves(state, pl) {
		let moves = [];
		for (let i = 0; i < state.length; i++) {
			if (state[i] === undefined) moves.push({ index: i, sym: pl.sym });
		}
		return moves;
	}
	getState() { return this.board.getState(); }
	getPlayer(sym) { return firstCond(this.players, x => x.sym = sym); }
	applyMove(state, move) {
		//move should be of the form: i,sym
		this.lastMove = move;
		state[move.i] = move.sym;
	}
	applyState(state) {
		//move should be of the form: i,sym
		this.board.applyState(state);
		state[move.i] = move.sym;
	}
	evalState(state, sym) {
		let res = checkForWinner(state, this.human.sym, this.ai.sym); // returns a sym
		let plCheck = this.getPlayer(sym);
		let plWinner = isdef(res) && res != 0 ? this.getPlayer(res) : null;
		//console.log('state', state, 'check for', plCheck.id, 'winner', plWinner);
	}
	// isGameOver() {
	// 	let state = this.getState();

	// 	let moves = this.availableMoves(state, this.plTurn);
	// 	return isEmpty(moves);
	// }

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

class Board {
	constructor(rows, cols, handler) {
		let styles = { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		this.rows = rows;
		this.cols = cols;
		let items = this.items = iGrid(this.rows, this.cols, dTable, styles);
		items.map(x => {
			let d = iDiv(x);
			mCenterFlex(d);
			d.onclick = handler;
		});
		//console.log(this.items)
	}
	getState() {
		return this.items.map(x => x.label);
	}

}
