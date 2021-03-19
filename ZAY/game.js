function changeGameTo(id) {
	if (isdef(id) && (isdef(G) && G.friendly == id || id == Gamename)) return;
	if (isdef(T)) { saveTable(); }
	loadGame(Daaa.gameKeyByFriendly[id]);
	loadTable();
}
function loadGame(id,dParent) {
	//console.log('________ id', id, 'Gamename', Gamename, 'DEF', DEFAULTUSERNAME)
	if (nundef(id)) id = localStorage.getItem('game');
	if (nundef(id)) id = Object.keys(DB.games)[0];

	G = lookup(DB, ['games', id]);
	G.color = getColorDictColor(G.color);
	G.id = Gamename = id;

	if (nundef(Daaa.gameKeyByFriendly)){Daaa.gameKeyByFriendly=createKeyIndex(DB.games,'friendly');}

	//console.log(Gamename, U);
	updateGamenameUi(dParent, G.friendly);//, G.color);//change bg instead!!!!
	setPageBackground(G.color);


	//Settings = DB.settings; //TODO: add to that user and game settings

}
function updateGamenameUi(dParent, id, color) {
	let uiName = 'spGame';
	let ui = mBy(uiName);
	if (nundef(ui)) {
		clearElement(dParent);
		ui = mEditableOnEdited(uiName, dParent, '', '', changeGameTo, () => {
			console.log('Games', getGames());
		});
	}
	ui.innerHTML = id;
	mStyleX(ui, { fg: color });
}

