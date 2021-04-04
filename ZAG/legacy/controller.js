var pictureSize, TOMain, TOTrial;//, TOLong;
function canAct() {
	//console.log('uiActivated',uiActivated,'auxOpen',auxOpen)
	return uiActivated && !auxOpen; // && document.activeElement.id != 'spUser' && !isVisible('freezer2');
}

function stopGame() {
	resetState();
}
function startGame() {
	//console.log('___________startGame_', G);
	//console.log('TO',TO)

	resetState(); pauseSound();

	G.successFunc = successPictureGoal;
	G.failFunc = failPictureGoal;
	G.correctionFunc = showCorrectWord;

	G.instance = getInstance(G);
	//console.log('G',G)
	G.instance.startGame();

	startLevel();

}
function startLevel() {

	let x = getGameValues(Username, G.id, G.level);
	//console.log('gameValues',x);
	copyKeys(x, G);

	updateLabelSettings();
	Speech.setLanguage(G.language);
	G.instance.startLevel();

	//return;
	//console.log(G)
	if (G.keys.length < G.numPics) { updateKeySettings(G.numPics + 5); }
	startRound();
}
function startRound() {
	//console.log('...new round:',G.showLabels)
	//if (G.addonActive != true && isTimeForAddon()) { G.addonActive = true; exitToAddon(startRound); return; } else G.addonActive = false;

	resetRound();
	uiActivated = false;
	G.instance.startRound();
	TOMain = setTimeout(() => prompt(), 300);
}
function prompt() {
	QContextCounter += 1;
	//GroupCounter = 0;

	//console.log('prompt: G.pictureLabels',G.pictureLabels,'labels has been set to',G.showLabels)
	showStats();
	G.trialNumber = 0;

	//mStyleX(dTable,{bg:'red',w:'100%',h:200}); return

	G.instance.prompt();
}
function promptNextTrial() {
	QContextCounter += 1;
	clearTimeout(TOTrial);
	uiActivated = false;
	let delay = G.instance.trialPrompt(G.trialNumber);
	TOMain = setTimeout(activateUi, delay);
}
function activateUi() {
	Selected = null;
	uiActivated = true;
	G.instance.activate();
}
function evaluate() {
	//console.log('evaluate!!!',arguments)
	if (!canAct()) return;
	uiActivated = false; clearTimeouts();

	IsAnswerCorrect = G.instance.eval(...arguments);
	//console.log('Selected',Selected)
	if (IsAnswerCorrect === undefined) { promptNextTrial(); return; }

	G.trialNumber += 1;
	//console.log('answer is', IsAnswerCorrect ? 'correct' : 'WRONG!!!','trial#',G.trialNumber,'/',G.trials)
	if (!IsAnswerCorrect && G.trialNumber < G.trials) { promptNextTrial(); return; }

	//feedback
	//console.log(G)
	if (IsAnswerCorrect) { DELAY = isdef(Selected.delay) ? Selected.delay : G.spokenFeedback ? 1500 : 300; G.successFunc(); }
	else { DELAY = G.correctionFunc(); G.failFunc(); }
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
	} else if (Score.levelChange && nextLevel <= G.maxLevel) {
		G.level = nextLevel;
		setBadgeLevel(G.level); //show the last level accomplished in opacity=1!!!
		TOMain = setTimeout(startLevel, DELAY); //soll ich da startGame machen???
	} else {
		TOMain = setTimeout(startRound, DELAY);
	}

}















