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

		this.setStartPosition();
		this.setStartPlayer();
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
	setStartPlayer() {
		console.log('starting player:', this.startPlayer)
		if (this.startPlayer == 'human') this.playerOrder = [this.human, this.ai];
		else if (this.startPlayer == 'ai') this.playerOrder = [this.ai, this.human];
		else this.playerOrder = chooseRandom([[this.human, this.ai], [this.ai, this.human]]);
		this.iPlayer = 0;
		this.setPlayers();
	}
	setPlayers() {
		this.plTurn = this.playerOrder[this.iPlayer];
		this.plOpp = this.plTurn == this.ai ? this.human : this.ai;
	}
	changePlayer() {
		let idx = this.iPlayer = (this.iPlayer + 1) % this.players.length;
		this.setPlayers();
	}
	startRound() { }

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
		prepMM(state);
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
			if (EmptyFunc(state[i])) moves.push(i);
		}
		return moves;
	}
	getState() { return this.board.getState(); }
}
