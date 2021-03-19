function changeTableTo(id) {
	id = id.toLowerCase();
	if (isdef(id) && id == Tablename) return;
	if (id != Tablename && isdef(T)) { saveTable(); }
	loadTable(id);
}
function loadTable(id,dParent) {
	if (nundef(id)) id = localStorage.getItem('table');
	if (nundef(id)) id = findTable(true);

	T = lookup(DB, ['tables', id]);
	Tablename = id;
	logTable();

	//console.log(Tablename, U);
	updateTablenameUi(dParent,id, G.color);

}
function saveTable(sendToDB = false) { lookupSet(DB.tables, [Tablename], T); if (sendToDB) dbSave(); }
function updateTablenameUi(dParent,id, color) {
	let uiName = 'spTable';
	let ui = mBy(uiName);
	if (nundef(ui)) {
		//console.log('creating ui for username');
		ui = mEditableOnEdited(uiName, dParent, 'table: ', '', changeTableTo, ()=>{
			console.log('Tables',getTables());
		});
	}
	ui.innerHTML = id;
	//mStyleX(ui, { fg: color });
}

function getPlayersIncludingU() {
	if (!isList(G.numPlayers)) G.numPlayers = [G.numPlayers];
	let n = G.numPlayers[0];
	let ids = chooseKeys(DB.users, n,['guest0','test0']);
	if (!ids.includes(Username)) ids.splice(0, 1, Username);

	//ids sind jetzt die user ids fuer dieses table

	T.players = ids.map(x => new Player(x, DB.users[x].settings.color)); //for each of these make a player
	ids.map(x => lookupAddToList(DB.users, [x,'tables'], T.id)); //to each user, add this table id

	//console.log(T)

}
function logTable(){console.log('T: game',T.game,'\nplayers',T.players.map(x=>x.id), '\nstate',T.uiState)}
function getNextTableId() {
	let ids = nundef(DB.tables) ? [] : Object.keys(DB.tables);
	ids = ids.map(x => Number(x));
	let max = Math.max(ids);
	return '' + (max + 1);
}
function findTable(createNew = false) {
	let idTables = U.tables;
	if (isdef(idTables)) {

		for (const id of idTables) {
			let t = DB.tables[id];
			if (t.game == Gamename) return id;
		}
	}
	//create a new table for this user and this game
	return createNew ? createTable() : null;
}
function createTable() {
	// hier start ich ein neues spiel
	// have U,G
	let numPlayers = G.numPlayers; //first see how many players are needed
	//if no players involved, its a solitaire, just start it (eg. a unit in speechgames) 
	//otherwise, solo or passAndPlay
	//was ist einfacher? solo oder pp? keine ahnung!
	if (isdef(numPlayers)) {
		idTable = getNextTableId();

		//now have to create a game with these players
		//wo krieg ich die players her?
		T = { id: idTable, game:G.id };
		getPlayersIncludingU();
		lookupSet(DB, ['tables',idTable], T);
		return idTable;
	}
	return null;
}
