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
		this.board = new Board(3, 3, this.controller.uiInteract.bind(this.controller));
		this.winner = null;

		this.human.sym = 'O';
		this.ai.sym = 'X';

		let state = isdef(this.startPosition) ? this.startPosition : new Array(9).fill(null);//['X', 'X', null, 'O', null, null, 'O', null, null];
		//console.log('state',state)
		//let state =['X', 'X', null, 'O', null, null, 'O', null, null];
		// state =[null, 'X', null, 'X', null, 'O', null, 'O', null];
		// state=[null, null, null, null, 'X', 'O', null, 'O', null];
		this.board.setState(state, { X: this.ai.color, O: this.human.color }); //AI wins! ok
		//state = this.getState();
		//console.log('state',state)
		//this.plTurn = this.ai;

	}
	startRound() { delete this.startPosition; }
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
	computerMove() {
		let state = this.getState();
		state = boardToNode(state);
		mmab1(state, 0, -Infinity, +Infinity);
		var iMove1 = choice;
		choice = [];

		//experimental algo:
		mmab2(state, 0, -Infinity, +Infinity);
		var iMove2 = choice;
		if (iMove1 != iMove2) {
			console.log('correct:' + iMove1, 'ERR:' + iMove2);
		}

		return iMove1;
	}
	activate() {
		let pl = this.plTurn;
		let autoplay = false;
		if (autoplay || pl == this.ai) {
			this.TO = setTimeout(() => {
				let iMove = this.computerMove();
				let tile = this.board.items[iMove];
				this.interact({ target: iDiv(tile) });
			}, 300); //DELAY
		}
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
	getAvailableMoves(state) {
		let moves = [];
		for (let i = 0; i < state.length; i++) {
			if (nundef(state[i]) || state[i] == ' ') moves.push(i);
		}
		return moves;
	}
	getState() { return this.board.getState(); }
}
