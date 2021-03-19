function changeUser(username) {
	saveUser();
	loadUser(username);
}
function loadUser(username) {
	U = DB.users[username];
	U.live = {};
	mInner('user: ' + username, dSubtitleLeft);
}


function menu() {
	//ich hab DB
	//ich will eine page auf der all die games gelistet werden
	//console.log(U);

	clearElement(dTable);
	let options = {}; _extendOptions(options); options.isRegular=false;
	let dParent = options.dArea;
	let list = U.solitaires; //favs
	let [rows, cols, w, h, lp] = _bestRowsColsSize(list, options);
	console.log('cols',cols)
	mStyleX(dParent, { layout: 'g_' + 4 });//display:'flex','justify-content':'center'})
	//console.log('options', options)
	for (const k of list) {
		let menuItem = DB.games[k];
		//console.log(menuItem);
		let styles = { bg: menuItem.color, w: 100, h: 100, margin: 20 };
		let item = getItem(menuItem.logo);
		item.label = menuItem.friendly;
		let d = makeItemDiv(item, options);
		iAdd(item, { div: d });
		mAppend(dParent, d);
		mStyleX(d, styles);
		//break;
	}

}
function saveUser() {
	//was muss von U.live uebernommen werden?
	delete U.live;
	dbSave('boardGames');
}
function temple(dParent) {
	let elem = createElementFromHTML(`<div id='dTemple' onclick='onClickTemple()'>🏛️</div>`);
	mAppend(dParent, elem);

}









