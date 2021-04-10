function canAct() { return uiActivated && !auxOpen; }

function setGame(game) {
	cleanupOldGame();

	if (isdef(G) && G.id != game) Score.gameChange = true;

	G = new (classByName(capitalize(game)))(game, DB.games[game]);
	Settings = new SettingsClass(G,dAux);

	if (nundef(U.games[game]) && G.type == 'solitaire') { U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0 }; }
	G.level = Math.min(getUserStartLevel(game), G.maxLevel);

	//updateGameValues(U,G);//Username, G.id, G.level); copyKeys(x, G);	updateSettings(); // muss hier sein weil es gewisse additional settings setzt und consistence (eg., silentMode/spokenFeedback)
	saveUser();
}

function stopGame() { resetState(); }
function startGame() {
	resetState(); pauseSound();
	G.successFunc = successPictureGoal;
	G.failFunc = failPictureGoal;
	G.correctionFunc = showCorrectWord;

	G.startGame();
	startLevel();
}
function startLevel() {
	updateGameValues(U, G);
	Speech.setLanguage(G.language);

	G.start_Level();

	if (isdef(G.keys) && G.keys.length < G.numPics) { G.keys = setKeys({ nMin: G.numPics + 5, lang: G.language, keySets: KeySets, key: G.vocab }); }
	startRound();
}
function startRound() {
	resetRound();
	uiActivated = false;
	G.startRound();
	TOMain = setTimeout(() => prompt(), 300);
}
function prompt() {
	QContextCounter += 1;
	showStats();
	G.trialNumber = 0;
	G.prompt();
}
function promptNextTrial() {
	QContextCounter += 1;
	clearTimeout(TOTrial);
	uiActivated = false;
	let delay = G.trialPrompt(G.trialNumber);
	TOMain = setTimeout(activateUi, delay);
}
function activateUi() {
	Selected = null;
	uiActivated = true;
	G.activate();
}
function evaluate() {
	if (!canAct()) return;
	uiActivated = false; clearTimeouts();

	IsAnswerCorrect = G.eval(...arguments);
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














