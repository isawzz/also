class ControllerTTT {
	constructor(g, user) {
		this.g = g;
		this.createPlayers(user);
	}
	createPlayers(user) {
		let players = this.players = this.g.players = [];
		let h = this.human = this.g.human = new SoloPlayer(user);
		let a = this.ai = this.g.ai = new AIPlayer();
		players.push(this.human);
		players.push(this.ai);
		this.ai.color = RED;
		//makeSurePlayerColorsAreContrasting(h,a);
	}
	startGame() {
		resetState();
		delete this.iPlayer;
		delete this.g.iPlayer;
		this.g.startGame();
		this.startRound();
		//this.bTest = mButton('step', () => { unitTest00(); }, dTable, { fz: 28, matop: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);

	}
	startRound() {
		this.deactivateUi();

		setPlayer(this.g, this.g.startingPlayer == 'random' && coin()? this.ai: this[this.g.startingPlayer]);
		//console.log('player is now:',this.plTurn)

		showStats();

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
		if (this.plTurn == this.ai) aiActivated = true; else uiActivated = true;
		//console.log('ui', uiActivated, 'ai', aiActivated);
		this.g.activate();
	}
	deactivateUi() { aiActivated = uiActivated = false; }
	evaluate() {
		this.deactivateUi();
		this.g.eval(...arguments);
		if (this.g.gameOver) {
			let msg;
			if (this.g.winner && this.g.winner == this.ai) { msg = 'AI wins'; this.ai.score += 1; }
			else if (this.g.winner) { msg = 'You win!!!'; this.human.score += 1; }
			else { msg = "It's a tie"; }

			Score.nTotal += 1;
			Score.nCorrect = this.human.score;

			showScore();
			showInstruction('', msg, dTitle, !this.g.silentMode, msg);

			this.bPlay = mButton('play again!', () => { resetRound(); this.startGame(); }, dTable, { fz: 28, matop: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);
			// this.bTest = mButton('test', () => { unitTest00(); }, dTable, { fz: 28, matop: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);
		}
		else this.startRound();
	}
}

var TestCounter = 0;
function unitTest00() {
	if (nundef(G.startPosition)) {
		let states = [
			['O', 'O', null, 'X', null, null, 'X', null, null],
			[null, 'O', null, 'O', null, 'X', null, 'X', null],
			[null, null, null, null, 'X', 'O', null, 'O', null]];
		let state = states[TestCounter]; TestCounter = (TestCounter + 1) % states.length;
		G.startPosition = state;
		G.board.clear();
		G.board.setState(state, { X: G.ai.color, O: G.human.color });
		GC.bTest.innerHTML = 'GO!';
		console.log('______ ready:');printState(state);
	} else {
		resetRound();
		GC.startGame();
	}

}
