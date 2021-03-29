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

function menu(dParent, list, handler) {
	//console.log('hallo menu!', dParent)
	show(dParent);
	clearElement(dParent);
	mCenterFlex(dParent);
	if (nundef(list)) list = dict2list(DB.games); //U.games.map(x => DB.games[x]);

	let options = {
		margin: 8, wArea: 800, hArea: 500, dParent: dParent,
		ifs: { bg: (i, item) => { return getColorDictColor(item.o.color); } },
		outerStyles: { 'justify-content': 'center', 'align-items': 'center' }
	}; _extendOptions(options);
	let items = genItemsFromObjects(list, 'logo', 'friendly', options);
	options.handler = handler;
	//_standardHandler(x => newItemSelection(x, items, startGame));
	//  x=>{
	// 	let item=evToItemC(x);
	// 	console.log(x,item); 
	// 	newItemSelection(item,items,startGame);

	// 	// _standardHandler(x => newItemSelection(x, items, startGame))
	// }
	makeItemDivs(items, options);
	let dArea = options.dArea;
	mCenterFlex(dArea);
	items.map(x => mAppend(dArea, iDiv(x)))
	return items;
}


















