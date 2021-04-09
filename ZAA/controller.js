function canAct() { return uiActivated && !auxOpen; }

function setGame(game, level) {
	console.log('...setGame! wieso sollte ich nicht hier als einziges G setzen?', game)

	cleanupOldGame();
	if (isdef(G) && G.id != game) Score.gameChange = true;

	console.log('game', game, 'o', DB.games[game]);
	G = new (classByName(capitalize(game)))(game, DB.games[game]);
	if (nundef(U.games[game]) && G.type == 'solitaire') {
		U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0 };
	}
	saveUser();
	if (isdef(level)) G.level = level; else { G.level = getUserStartLevel(game); }
	if (G.level > G.maxLevel) G.level = G.maxLevel;
	let x = getGameValues(Username, G.id, G.level); copyKeys(x, G);
	//console.log(jsCopy(G))
	updateSettings();
	return;
}

function stopGame() { resetState(); }
function startGame() {
	//console.log('___________startGame_', G);
	resetState(); pauseSound();

	G.successFunc = successPictureGoal;
	G.failFunc = failPictureGoal;
	G.correctionFunc = showCorrectWord;
	G.startGame();

	//G.instance = getInstance(G);
	//console.log('G',G)
	//G.instance.startGame();

	startLevel();

}
function startLevel() {

	let x = getGameValues(Username, G.id, G.level);
	//console.log('gameValues',x);
	copyKeys(x, G);

	updateLabelSettings();
	Speech.setLanguage(G.language);

	G.startGame();
	// G.instance.startLevel();

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
	G.startRound();
	// G.instance.startRound();
	TOMain = setTimeout(() => prompt(), 300);
}
function prompt() {
	QContextCounter += 1;
	//GroupCounter = 0;

	//console.log('prompt: G.pictureLabels',G.pictureLabels,'labels has been set to',G.showLabels)
	showStats();
	G.trialNumber = 0;

	//mStyleX(dTable,{bg:'red',w:'100%',h:200}); return
	G.prompt();
	//G.instance.prompt();
}
function promptNextTrial() {
	QContextCounter += 1;
	clearTimeout(TOTrial);
	uiActivated = false;
	let delay = G.trialPrompt(G.trialNumber); //G.instance.trialPrompt(G.trialNumber);
	TOMain = setTimeout(activateUi, delay);
}
function activateUi() {
	Selected = null;
	uiActivated = true;
	G.activate();
	//G.instance.activate();
}
function evaluate() {
	//console.log('evaluate!!!',arguments)
	if (!canAct()) return;
	uiActivated = false; clearTimeouts();

	IsAnswerCorrect = G.eval(...arguments); //G.instance.eval(...arguments);
	if (IsAnswerCorrect === undefined) { promptNextTrial(); return; }

	G.trialNumber += 1;
	if (!IsAnswerCorrect && G.trialNumber < G.trials) { promptNextTrial(); return; }

	//feedback
	if (IsAnswerCorrect) { DELAY = isdef(Selected.delay) ? Selected.delay : G.spokenFeedback ? 1500 : 300; G.successFunc(); }
	else { DELAY = G.correctionFunc(); G.failFunc(); }

	let nextLevel = scoring(IsAnswerCorrect);

	if (DELAY > 2000) showActiveMessage('click to continue...', () => gotoNext(nextLevel));
	TOMain = setTimeout(() => gotoNext(nextLevel), DELAY);
}
function gotoNext(nextLevel) {

	onclick = null;
	removeMarkers();
	clearTimeouts();

	if (Score.gameChange) {
		setNextGame();
		if (unitTimeUp()) { gameOver('Great job! Time for a break!'); } else { startGame(); }
	} else if (Score.levelChange && nextLevel <= G.maxLevel) {
		G.level = nextLevel;
		setBadgeLevel(G.level);
		startLevel();
	} else { startRound(); }

}














