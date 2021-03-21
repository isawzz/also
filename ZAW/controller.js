function menu(list) {
	clearElement(dTable);
	mCenterFlex(dTable);
	if (nundef(list)) list = Object.values(DB.games); //U.games.map(x => DB.games[x]);
	let options = {
		margin: 8, wArea: 800, hArea: 500,
	}; _extendOptions(options);
	let dParent = options.dArea;
	let [rows, cols, w, h, lp] = _bestRowsColsSize(list, options);
	console.log('cols', cols, '\nlist', list)
	mStyleX(dParent, { layout: 'g_' + cols });
	let items = list.map(x => getItem(x.logo));
	let i = 0;
	for (const menuItem of list) {
		//let menuItem = DB.games[k];
		//console.log(menuItem)
		let styles = { bg: getColorDictColor(menuItem.color), w: 100, h: 100, margin: 20 };
		let item = items[i]; i += 1;
		item.o = menuItem;
		item.label = menuItem.friendly;
		let d = makeItemDiv(item, options);
		d.onclick = _standardHandler(x => newItemSelection(x, items, startGame))
		iAdd(item, { div: d });
		mAppend(dParent, d);
		mStyleX(d, styles);
	}
}























