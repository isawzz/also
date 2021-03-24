var SelectedMenuKey, SelectedMenuItem, MenuItems;

function createMenuUi(dParent) {
	clearElement(dParent);
	mAppend(dParent, createElementFromHTML(`<h1>Choose Game:</h1>`));
	let dMenuItems = mDiv(dParent);

	let games = U.avGames;
	if (!navigator.onLine) { removeInPlace(games, 'gSayPic'); }
	let list = games.map(x => { let item = DB.games[x]; item.id = x; return item; });	//console.log('', games, list, '\n_______________')

	MenuItems = menu(dMenuItems, list, onClickMenuItem);	//console.log('MenuItems', MenuItems)

	if (nundef(G)) return;

	//select the current game
	SelectedMenuKey = G.id;
	let selItem = SelectedMenuItem = firstCond(MenuItems, x => x.o.id == SelectedMenuKey);	//console.log(selItem)
	toggleItemSelection(selItem);
}



















