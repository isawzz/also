class ControllerTTT {
	constructor(g, user) {
		this.g = g;
		this.createPlayers(user);
	}
	createPlayers(user) {
		let players = this.players = this.g.players = [];
		let h=this.human = this.g.human = new SoloPlayer(user);
		let a=this.ai = this.g.ai = new AIPlayer(); 
		players.push(this.human);
		players.push(this.ai);
		//makeSurePlayerColorsAreContrasting(h,a);
	}
	startGame() {
		resetState();
		this.iPlayer = this.g.iPlayer = -1;
		this.g.startGame();
		this.startRound();
	}
	startRound() {
		this.deactivateUi();
		showStats();
		let idx = this.iPlayer = this.g.iPlayer = (this.iPlayer + 1) % this.players.length;
		this.plTurn = this.g.plTurn = this.players[idx];

		this.g.startRound();
		//console.log('player is',this.plTurn);
		this.prompt();
	}
	prompt() {
		this.g.prompt();
	}
	uiInteract(ev) { if (canHumanAct()) this.g.interact(ev); }
	activateUi() {
		//console.log(this.plTurn)
		if (isAI(this.plTurn)) aiActivated = true; else uiActivated = true;
		//console.log('ui', uiActivated, 'ai', aiActivated);
		this.g.activate();
	}
	deactivateUi() { aiActivated = uiActivated = false; }
	evaluate() {
		this.deactivateUi();
		this.g.eval(...arguments);
		if (this.g.gameOver) {
			let msg;
			if (this.g.winner && this.g.winner.ai) { msg = 'AI wins'; this.ai.score += 1; }
			else if (this.g.winner) { msg = 'You win!!!'; this.human.score += 1;  }
			else { msg = "It's a tie"; }

			Score.nTotal +=1;
			Score.nCorrect = this.human.score;

			showScore();
			showInstruction('', msg, dTitle, !this.g.silentMode, msg);

			mButton('play again!', () => { resetRound(); this.startGame(); }, dTable, { fz: 28, matop: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);
		}
		else this.startRound();
	}
}