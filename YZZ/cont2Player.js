class GC2PlayerClass {

	constructor(player1, player2) {
		let players = this.players = [];
		players.push(isdef(player1) ? player1 : U);
		players.push(isdef(player2) ? player2 : new AIPlayer());
		console.log('2 player controller');

	}
	stopGame() { resetState(); }
	startGame() {

		resetState();

		G.startGame();
		// this.startLevel();
	}
	startLevel() {
		Settings.updateGameValues(U, G);

		G.start_Level();

		this.startRound();
	}
	startRound() {
		resetRound();
		uiActivated = false;
		G.startRound();
		TOMain = setTimeout(() => this.prompt(), 300);

		//if (isdef(G.keys)) console.log('words',G.maxWordLength,G.keys.map(x=>Syms[x][G.language])); else console.log('no keys!');

	}
	prompt() {
		QContextCounter += 1;
		showStats();
		G.trialNumber = 0;
		G.prompt();
	}
	promptNextTrial() {
		QContextCounter += 1;
		clearTimeout(TOTrial);
		uiActivated = false;
		let delay = G.trialPrompt(G.trialNumber);
		TOMain = setTimeout(this.activateUi, delay);
	}
	activateUi() {
		Selected = null;
		uiActivated = true;
		G.activate();
	}
	evaluate() {
		if (!canAct()) return;
		uiActivated = false; clearTimeouts();

		IsAnswerCorrect = G.eval(...arguments);
		if (IsAnswerCorrect === undefined) { this.promptNextTrial(); return; }

		G.trialNumber += 1;
		if (!IsAnswerCorrect && G.trialNumber < G.trials) { this.promptNextTrial(); return; }

		//feedback
		if (IsAnswerCorrect) { DELAY = isdef(Selected.delay) ? Selected.delay : G.spokenFeedback ? 1500 : 300; G.successFunc(); }
		else { DELAY = G.correctionFunc(); G.failFunc(); }

		let nextLevel = scoring(IsAnswerCorrect);

		if (DELAY > 2000) showActiveMessage('click to continue...', () => this.gotoNext(nextLevel));
		//console.log('gotoNext',this.gotoNext)
		TOMain = setTimeout(() => this.gotoNext(nextLevel), DELAY);
	}
	gotoNext(nextLevel) {
		onclick = null;
		removeMarkers();
		clearTimeouts();

		if (Score.gameChange) {
			setNextGame();
			if (GameTimer.unitTimeUp()) { gameOver('Great job! Time for a break!'); } else { this.startGame(); }
		} else if (Score.levelChange && nextLevel <= G.maxLevel) {
			G.level = nextLevel;
			setBadgeLevel(G.level);
			this.startLevel();
		} else { this.startRound(); }

	}
}
