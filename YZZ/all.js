function canAct() { return uiActivated && !auxOpen; }

function setGame(game) {
	cleanupOldGame();
	if (isdef(G) && G.id != game) Score.gameChange = true;

	G = new (classByName(capitalize(game)))(game, DB.games[game]);
	Settings = new SettingsClass(G, dAux);

	if (nundef(U.games[game])) {
		if (G.controllerType == 'solitaire') { U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0 }; }
		else U.games[game] = {};
	}

	if (isdef(G.maxLevel)) G.level = Math.min(getUserStartLevel(game), G.maxLevel);

	Settings.updateGameValues(U, G);
	saveUser();

	switch(G.controllerType){
		case 'solitaire': GC = new GCSolitaireClass(G); break;
		case 'solo': GC = new GC2PlayerClass(G); break;
	}
	G.controller = GC;
}
