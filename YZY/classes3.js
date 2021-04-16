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
		let isWin = checkWinnerTTT(state, 3, 3);
		if (!isWin) { isTie = this.isBoardFull(state) || !checkPotentialTTT(state, 3, 3); }
		return isWin ? 2 : isTie ? 1 : 0;
	}

	checkFinal_dep(state) {
		if (nundef(state)) state = this.getState();
		let isTie = false;
		let isWin = checkWinnerTTT(state, 3, 3); //this.isWinningState(state,this.plTurn.sym);
		if (isWin) {
			this.winner = this.plTurn;
			//this.gameOver = true;
			//console.log('winner', isWin);
		} else {
			let partial = checkPotentialTTT(state, 3, 3);
			isTie = !partial;
			if (!isTie) {
				isTie = this.isBoardFull(state);
				// let moves = this.getAvailableMoves(state);
				// isTie = isEmpty(moves);
			}
			//console.log('tie?', isTie);//, '(partial', partial,')');
			//this.gameOver = isTie;
		}
		return isWin || isTie;
	}

	isBoardFull(state) { for (const s of state) if (nundef(s)) return false; return true; }
	getAvailableMoves(state) {
		let moves = [];
		for (let i = 0; i < state.length; i++) {
			if (nundef(state[i]) || state[i] == ' ') moves.push(i);
		}
		return moves;
	}
	getState() { return this.board.getState(); }
	isWinningState(state, sym) {
		for (let i = 0; i <= 6; i += 3) { if (state[i] === sym && state[i + 1] === sym && state[i + 2] === sym) return true; }

		// Check for vertical wins
		for (let i = 0; i <= 2; i++) { if (state[i] === sym && state[i + 3] === sym && state[i + 6] === sym) return true; }

		// Check for diagonal wins
		if ((state[0] === sym && state[4] === sym && state[8] === sym) || (state[2] === sym && state[4] === sym && state[6] === sym)) return true;

		return false;
	}
	isFinalState(state) { return isWinningState(state, 'X') || isWinningState(state, 'O') || isEmpty(this.getAvailableMoves(state)); }
	evaluateState(state) { return isWinningState(state, 'X') ? 100 : isWinningState(state, 'O') ? -100 : 0; }
}
