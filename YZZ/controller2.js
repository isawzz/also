class GC2PlayerClass {
	constructor(g) {
		this.g=g;
		let players = this.players = [];
		players.push(isdef(g.player1) ? g.player1 : U);
		players.push(isdef(g.player2) ? g.player2 : new AIPlayer());
		console.log('2 player controller');
	}
	stopGame() { resetState(); }
	startGame() {
		resetState();
		this.playerOnTurn = PlayerOnTurn = this.players[0];
		this.g.startGame(this.players);
		this.startRound();
	}
	startRound() {
		//resetRound();
		uiActivated = false;
		this.g.startRound();
		//TOMain = setTimeout(() => this.prompt(), 300);
		this.prompt();
	}
	prompt() {
		clearStats();
		this.g.prompt();
	}
	activateUi() {
		Selected = null;
		uiActivated = true;
		this.g.activate();
	}
	evaluate() {
		if (!canAct() && !isAI(PlayerOnTurn)) return;
		uiActivated = false; clearTimeouts();

		this.g.eval(...arguments);

		// if (DELAY > 2000) showActiveMessage('click to continue...', () => this.gotoNext(nextLevel));
		// TOMain = setTimeout(() => this.gotoNext(), DELAY);
		this.gotoNext();
	}
	gotoNext() {
		onclick = null;
		removeMarkers();
		clearTimeouts();

		if (this.g.endCondition) {
			showFleetingMessage('The winner is '+this.g.winner); 
		} else { 
			PlayerOnTurn = this.players[(this.players.indexOf(PlayerOnTurn)+1)%this.players.length];
			TOMain = setTimeout(this.startRound.bind(this),DELAY); 
		}

	}
}

function isAI(player){ return player != U; }