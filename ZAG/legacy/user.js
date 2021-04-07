class UserManager { }

function addScoreToUserSession() {
	//at end of level
	//adds Score to session
	//console.log('Score', Score)
	//console.assert(isdef(Score.nTotal) && Score.nTotal > 0)
	let sc = { nTotal: Score.nTotal, nCorrect: Score.nCorrect, nCorrect1: Score.nCorrect1 };
	let game = G.id;
	let level = G.level;
	let session = U.session;
	if (nundef(session)) {
		console.log('THERE WAS NO USER SESSION IN _addScoreToUserSession!!!!!!!!!!!!!!!!!!!!!')
		U.session = {};
	}

	let sGame = session[game];
	if (nundef(sGame)) {
		sGame = session[game] = jsCopy(sc);
		sGame.byLevel = {};
		sGame.byLevel[level] = jsCopy(sc);
	} else {
		addByKey(sc, sGame);
		let byLevel = lookupSet(sGame, ['byLevel', level], {});
		addByKey(sc, byLevel);
	}
	sGame.percentage = Math.round(100 * sGame.nCorrect / sGame.nTotal);

	saveUser();

}
function addSessionToUserGames() {
	// adds session to U.games and deletes session

	if (!isEmpty(U.session)) {
		for (const g in U.session) {
			let recOld = lookup(U, ['games', g]);
			let recNew = U.session[g];

			//console.assert(isdef(recOld));

			addByKey(recNew, recOld);
			recOld.percentage = Math.round(100 * recOld.nCorrect / recOld.nTotal);
			if (nundef(recOld.byLevel)) recOld.byLevel = {};
			for (const l in recNew.byLevel) {
				if (nundef(recOld.byLevel[l])) recOld.byLevel[l] = jsCopy(recNew.byLevel[l]);
				else addByKey(recNew.byLevel[l], recOld.byLevel[l]);
			}
		}
	}
	U.session = {};
}
function changeUserTo(name) {
	if (name != Username) { saveUser(); }
	mBy('spUser').innerHTML = name;
	loadUser(name);
	startUnit();
}
function editableUsernameUi(dParent) {
	//console.log('creating input elem for user', Username)
	let inp = mEditableInput(dParent, 'user: ', Username);
	inp.id = 'spUser';
	inp.addEventListener('focusout', () => { changeUserTo(inp.innerHTML.toLowerCase()); });
	return inp;
}
function getStartLevels(user) {
	let udata = lookup(DB, ['users', user]);
	if (!udata) return 'not available';
	let res = [];
	let res2 = {};
	for (const g in udata.games) {
		res2[g] = udata.games[g].startLevel;
		res.push(g + ': ' + udata.games[g].startLevel);
	}
	return res2; // res.join(',');

}
function getUserStartLevel(game) {
	gInfo = U.games[game];
	level = isdef(gInfo) && isdef(gInfo.startLevel) ? gInfo.startLevel : 0;
	return level;
}
function cleanupOldGame() {
	updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!

	//clear previous game (timeouts...)
	if (isdef(G) && isdef(G.instance)) {
		G.instance.clear();
	}

}
function loadUser(newUser) {

	//if (Username == newUser) return;
	//console.log('newUser', newUser)

	cleanupOldGame();

	Username = isdef(newUser) ? newUser : localStorage.getItem('user');

	if (nundef(Username)) Username = DEFAULTUSERNAME;

	//console.log('U anfang von loadUser', U, '\nDB', DB.users[Username]);

	let uData = lookupSet(DB, ['users', Username]);
	if (newUser == 'test') { uData = DB.users[Username] = jsCopy(DB.users.test0); uData.id = Username; }
	if (!uData) { uData = DB.users[Username] = jsCopy(DB.users.guest0); uData.id = Username; }

	U = new UserManager(Username);
	U = DB.users[Username];

	let uiName = 'spUser';
	let dUser = mBy(uiName);
	if (nundef(dUser)) { dUser = editableUsernameUi(dLineTopLeft); dUser.id = uiName; }

	let game = !window.navigator.onLine && U.lastGame == 'gSayPic' ? 'gTouchPic' : U.lastGame; //do NOT start in gSayPic if no internet!!!
	if (nundef(game)) game = U.avGames[0]; //chooseRandom(U.avGames);

	let gInfo = U.games[game];
	let level = isdef(gInfo) && isdef(gInfo.startLevel) ? gInfo.startLevel : 0;

	setGame(game, level);
}
function saveUnit() { saveUser(); }
function saveUser() {
	//console.log('saveUser:', Username,G.id,G.level); //_getFunctionsNameThatCalledThisFunction()); 
	U.lastGame = G.id;
	if (Username != 'test') localStorage.setItem('user', Username);
	DB.users[Username] = U;
	//console.log('...saving from saveUser called by', getFunctionsNameThatCalledThisFunction())
	dbSave('boardGames'); //saveSIMA();
}
function setGame(game, level) {
	cleanupOldGame();
	if (isdef(G) && G.id != game) Score.gameChange = true;
	//console.log(game)
	Settings = G = jsCopy(DB.games[game]); //jsCopy(DB.games[game]);
	G.color = getColorDictColor(G.color); //isdef(ColorDict[G.color]) ? ColorDict[G.color].c : G.color;
	G.id = game;
	if (nundef(U.games[game]) && G.type == 'solitaire') {
		U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0 };
	}
	saveUser();
	let levels = lookup(DB.games, [game, 'levels']);
	G.maxLevel = isdef(levels) ? Object.keys(levels).length - 1 : 0;
	if (isdef(level)) G.level = level;
	else { G.level = getUserStartLevel(game); }
	if (G.level > G.maxLevel) G.level = G.maxLevel;
	let x = getGameValues(Username, G.id, G.level);
	copyKeys(x, G);
	updateSettings();
	//console.log('game',game,'level',level)

}

function setNextGame() {
	let game = G.id;
	let i = U.avGames.indexOf(game);
	let iNew = (i + 1) % U.avGames.length;
	setGame(U.avGames[iNew]);
}
function updateStartLevelForUser(game, level, msg) {
	//console.log('updating startLevel for', Username, game, level, '(' + msg + ')')
	lookupSetOverride(U.games, [game, 'startLevel'], level);
	saveUser();
}
function updateUserScore() {
	if (nundef(Score.nTotal) || Score.nTotal <= 0) return;

	let sc = { nTotal: Score.nTotal, nCorrect: Score.nCorrect, nCorrect1: Score.nCorrect1 };
	let g = G.id;

	let recOld = lookupSet(U, ['games', g], { startLevel: 0, nTotal: 0, nCorrect: 0, nCorrect1: 0 });
	let recSession = lookupSet(U, ['session', g], { startLevel: 0, nTotal: 0, nCorrect: 0, nCorrect1: 0 });

	addByKey(sc, recSession);
	recSession.percentage = Math.round(100 * recSession.nCorrect / recSession.nTotal);

	addByKey(sc, recOld);
	recOld.percentage = Math.round(100 * recOld.nCorrect / recOld.nTotal);

	//console.log('updated user score for', g, sc, recOld);
	//console.log('updated user score session', recSession);
	Score.nTotal = Score.nCorrect = Score.nCorrect1 = 0;
	saveUser();
}
