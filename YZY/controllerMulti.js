class ControllerMulti {
	constructor(g, user) {
		console.log('haaaaaaaaaaaaaallllllllllllooooooooooooo')
		this.g = g;
		//lade erstmal vom server wer da ist!
		this.createPlayers(user);
		GameCounter = 0;
	}
	write() { write('gc', ...arguments); }
	createPlayers(user) {
		this.write('create players')
		let players = this.players = this.g.players = [];
		for (const id of DB.settings.loggedIn) {
			let pl = new MultiPlayer(id,user);
			players.push(pl);
		}
	}
	startGame() {
		this.write('start game..................');
		return;
		GameCounter += 1;
		resetState();
		//await this.g.startGame();
		this.startRound();
	}
	startRound() {
		this.write('start round')
		this.deactivateUi();
		this.g.startRound();
		showStats();
		this.prompt();
	}
	prompt() {
		this.write('prompt')
		this.g.prompt();
	}
	uiInteract(ev) { if (canHumanAct()) this.g.interact(ev); }
	activateUi() {
		this.write('activate');
		if (this.g.plTurn == this.g.ai) aiActivated = true; else uiActivated = true;
		this.g.activate();
	}
	deactivateUi() { aiActivated = uiActivated = false; }
	evaluate() {
		this.write('evaluate')
		this.deactivateUi();
		this.g.eval(...arguments);
		//console.log('back from game eval',G.gameOver)
		this.write('gameOver', this.g.gameOver)
		if (this.g.gameOver) {
			//console.log('game over!!!');
			let msg, sp;
			//console.log('winner', this.g.winner)
			if (this.g.winner && this.g.winner == this.ai) { msg = 'AI wins!'; sp = 'A.I. wins!'; this.ai.score += 1; }
			else if (this.g.winner) { msg = sp = 'You win!!!'; this.human.score += 1; }
			else { msg = "It's a tie"; sp = 'tie: no one wins'; if (nundef(this.tie)) this.tie = 1; else this.tie += 1; }

			if (this.g.info) msg += ' ' + this.g.info;

			Score.nTotal += 1;
			Score.nCorrect = Score.nWins = this.human.score;
			Score.nLoses = this.ai.score;
			Score.nTied = this.tie;
			showScore();
			showInstruction('', msg, dTitle, !this.g.silentMode, sp);

			//hier koennte auch banner display! und die buttons kommen auf das banner!
			TOMain = setTimeout(() => {
				//new Banner(this.g.bannerPos).message(['Winner:', capitalize(this.g.winner.id)]);
				if (GameCounter <= 3) this.bPlay = mButton('play again', () => { resetRound(); this.startGame(); }, dTable, { fz: 28, margin: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);
				this.bPlay = mButton('next game', () => { setNextGame(); GC.startGame(); }, dTable, { fz: 28, margin: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);
			}, 1500);

			// this.bTest = mButton('test', () => { unitTest00(); }, dTable, { fz: 28, matop: 20, rounding: 10, vpadding: 6, hpadding: 12, border: 8 }, ['buttonClass']);
		} else {

			this.g.changePlayer();
			this.startRound();
			//TOMain=setTimeout(()=>this.startRound(),1500);
		}
	}
}

