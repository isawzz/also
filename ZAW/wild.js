function changeUser(username) {
	saveUser();
	loadUser(username);
}
function loadUser(username) {
	U = DB.users[username];
	U.live = {};
	mInner('user: ' + username, dSubtitleLeft);
}

function menuOIL(list) {
	clearElement(dTable);
	mCenterFlex(dTable);
	if (nundef(list)) list = Object.values(DB.games); //U.games.map(x => DB.games[x]);
	let options = {
		margin: 8, wArea: 800, hArea: 500,
		ifs: { bg: (i, item) => { return getColorDictColor(item.o.color); } },
	}; _extendOptions(options);
	let items = genItemsFromObjects(list, 'logo', 'friendly', options);
	options.handler = _standardHandler(x => newItemSelection(x, items, startGame))
	makeItemDivs(items, options);
	let dArea = options.dArea;
	mCenterFlex(dArea);
	items.map(x => mAppend(dArea, iDiv(x)))
}

function saveUser() {
	//was muss von U.live uebernommen werden?
	delete U.live;
	dbSave('boardGames');
}
function startGame(item) {
	console.log('starting game', item);
	//if (isdef(item.info)) game=item.o.key;
}
function temple(dParent) {
	let elem = createElementFromHTML(`<div id='dTemple' onclick='onClickTemple()'>🏛️</div>`);
	mAppend(dParent, elem);

}









