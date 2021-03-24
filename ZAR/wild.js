function changeUser(username, dParent) {
	saveUser();
	loadUser(username, dParent);
}
function loadUser(username, dParent) {
	U = DB.users[username];
	U.live = {};
	mInner('user: ' + username, dParent);
	//console.log('User', U)
}
function userUpdate(proplist, val) {
	lookupSetOverride(U, proplist, val);
	saveUser();
}
function saveUser() {
	//was muss von U.live uebernommen werden?
	delete U.live;
	dbSave('boardGames');
}
function temple(dParent) {
	let elem = createElementFromHTML(`<span id='dTemple' onclick='onClickTemple()'>🏛️</div>`);
	mAppend(dParent, elem);

}
function menu(dParent, list, handler) {
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

function _simpleOptions(options) {
	//_simpleOptions({w:sz,h:sz,fz:sz/4,fzPic:sz/2,bg:levelColors[i], fg: textColor});	
	options.showPic = isdef(options.fzPic);
	options.showLabels = isdef(options.fz);
	options.szPic = { w: options.w, h: options.h };
	//options.ifs = { bg: options.bg, fg: options.fg };
	options.fzText = options.fz;

	if (nundef(options.rounding)) options.rounding = 4;
	if (nundef(options.margin)) options.margin = 4;
	if (nundef(options.padding)) options.padding = 0;

	if (nundef(options.labelStyles)) options.labelStyles = {};

	if (options.showLabels) { if (nundef(options.labelPos)) options.labelBottom = true; options.labelStyles.fz = options.fzText; }

	options.picStyles = { fz: options.fzPic };

	let [w, h] = [options.szPic.w, options.szPic.h];
	options.outerStyles = {
		w: w, h: h, bg: options.bg, fg: options.fg,
		display: 'inline-flex', 'flex-direction': 'column',
		'justify-content': 'center', 'align-items': 'center',
		padding: 0, box: true, margin: options.margin, rounding: options.rounding,
	};

	return options;
}







