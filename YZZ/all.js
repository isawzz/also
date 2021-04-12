function canAct() { return uiActivated && !auxOpen; }

function setGame(game) {
	cleanupOldGame();
	if (isdef(G) && G.id != game) Score.gameChange = true;

	G = new (classByName(capitalize(game)))(game, DB.games[game]);
	Settings = new SettingsClass(G, dAux);

	if (nundef(U.games[game])) {
		if (G.type == 'solitaire') { U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0 }; }
		else U.games[game] = {};
	}

	if (isdef(G.maxLevel)) G.level = Math.min(getUserStartLevel(game), G.maxLevel);

	Settings.updateGameValues(U, G);
	saveUser();

	GC = G.type == 'solitaire' ? new GCSolitaireClass() : new GC2PlayerClass();
}
