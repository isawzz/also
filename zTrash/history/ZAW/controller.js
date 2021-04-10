function startGame(item) {
	console.log('starting game', item);

	let game = G = createClassByName(item.o.id, item.o);
	G.startGame();
	//
	//if (isdef(item.info)) game=item.o.key;
}


class GameClass {
	constructor(info) {
		this.readonly = info;
		copyKeys(info, this);
		console.log('instantiating', info.id, this);

	}
}
class Trial0 extends GameClass {
	stopGame() { resetState(); }
	startGame() {
		console.log('___________startGame_', this);

		resetState(); pauseSound();

		this.successFunc = successPictureGoal;
		this.failFunc = failPictureGoal;
		this.correctionFunc = showCorrectWord;

		this.level = getUserStartLevel(this.id);

		this.startGame1();

	}
	startGame1() {
		console.log('___________startGame 1_', this);
		this.startLevel();
	}
	startLevel() {
		console.log('___________startLevel_', this);
		let settings = getGameValues();
		copyKeys(settings, this);

		this.startLevel1();
	}
	startLevel1() {
		console.log('___________startLevel 1_', this);
		this.keys = KeySets.lifePlus;
		// if (this.keys.length < this.numPics) { updateKeySettings(this.numPics + 5); }
		this.startRound();
	}
	startRound() {
		console.log('___________startRound_', this);
		// if (this.addonActive != true && isTimeForAddon()) {
		// 	this.addonActive = true;
		// 	//console.log('time for addon!!!')
		// 	exitToAddon(this.startRound.bind(this)); return;
		// } else this.addonActive = false;

		resetRound();
		uiActivated = false;
		this.startRound1();
	}
	startRound1() {
		console.log('___________startRound 1_', this);
		TOMain = setTimeout(this.prompt.bind(this), 300);
	}
	prompt() {
		console.log('___________prompt_', this);
		QContextCounter += 1;
		//GroupCounter = 0;

		showStats();
		this.trialNumber = 0;

		this.prompt1();
	}
	prompt1() {
		console.log('___________prompt 1_', this);
	}
	promptNextTrial() {
		QContextCounter += 1;
		clearTimeout(TOTrial);
		uiActivated = false;
		let delay = this.instance.trialPrompt(this.trialNumber);
		TOMain = setTimeout(activateUi, delay);
	}
	activateUi() {
		Selected = null;
		uiActivated = true;
		this.instance.activate();
	}
	evaluate() {
		//console.log('evaluate!!!',arguments)
		if (!canAct()) return;
		uiActivated = false; clearTimeouts();

		IsAnswerCorrect = this.instance.eval(...arguments);
		if (IsAnswerCorrect === undefined) { promptNextTrial(); return; }
		//console.log('answer is', IsAnswerCorrect ? 'correct' : 'WRONG!!!')

		this.trialNumber += 1;
		if (!IsAnswerCorrect && this.trialNumber < this.trials && !calibrating()) { promptNextTrial(); return; }

		//feedback
		if (calibrating()) { DELAY = 300; if (IsAnswerCorrect) this.successFunc(false); else this.failFunc(); }
		else if (IsAnswerCorrect) { DELAY = G.spokenFeedback ? 1500 : 300; this.successFunc(); }
		else { DELAY = this.correctionFunc(); this.failFunc(); }
		setTimeout(removeMarkers, 1500);

		let nextLevel = scoring(IsAnswerCorrect);
		//console.log('cscoring result:', Score)
		if (Score.gameChange) {
			//updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
			setNextGame();
			if (unitTimeUp()) {
				setTimeout(() => gameOver('Great job! Time for a break!'), DELAY);
			} else {
				TOMain = setTimeout(startGame, DELAY);
			}
		} else if (Score.levelChange && nextLevel <= this.maxLevel) {
			this.level = nextLevel;
			setBadgeLevel(this.level); //show the last level accomplished in opacity=1!!!
			TOMain = setTimeout(startLevel, DELAY); //soll ich da startGame machen???
		} else {
			TOMain = setTimeout(startRound, DELAY);
		}

	}

}
class gTouchPic extends Trial0 {

}


















