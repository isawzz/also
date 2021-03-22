
//#region game controller

//#region menu
function menu(list) {
	clearElement(dTable);
	mCenterFlex(dTable);
	if (nundef(list)) list = dict2list(DB.games); //U.games.map(x => DB.games[x]);

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
function menu_dep(list) {
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



//#region solitaire: categories: does not use grid layout, just individual divs!
function solCats() {
	function dropHandler(source, target, isCopy = true) {
		let dSource = getDiv(source);
		let dTarget = getDiv(target);

		if (!isCopy) {
			mAppend(dTarget, dSource);
		} else {
			let dNew = mText(dSource.innerHTML, dTarget, { wmin: 100, fz: 20, padding: 4, margin: 4, display: 'inline-block' });
			addDDSource(dNew, false);
		}

		//relayout sources in target
	}

	//OIL for category boxes
	clearElement(dTable);
	let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
	let containers = createContainers(['animals', 'sport', 'transport'], dArea);
	mLinebreak(dArea);


	//let options = {}; _extendOptions();
	let items = getItemsCat_dep(3,'anim');
	console.log(items)

	i = 0;
	let objects = [];
	for (const cat of ['horse', 'soccer', 'bird']) {
		// let o = mTitledDiv(cat, dArea, { bg: 'random', rounding: 12, display: 'inline-block', padding: 4, margin: 12 }, {}, 'i' + i);
		let o = mText(cat, dArea, { bg: 'orange', margin: 8, wmin: 70 }, 'i' + i);
		i += 1;
		objects.push({ label: cat, div: o }); //o.parentNode);
	}

	enableDD(objects, containers, dropHandler, false);

	//add a submit button that triggers evaluation
}
//#endregion

//#region itemViewer: uses grid layout present00
function itemViewer() {
	//options
	let options = {
		n: 100,
		wper: 100, hper: 100, //dParent: dTable, is default!
		szPic: { w: 100, h: 70 }, padding: 0,
		showLabels: true, showPic: true, fixTextFont: true,
		isUniform: true, fillArea: true, isRegular: false, hugeFont: true,
		handler: _standardHandler(handSelectSpecialKeys),
	};
	_extendOptions(options);
	options.wLongest = 'alabama';

	//items
	//let keys = genKeys(options);	keys[0] = 'spiral shell';	let items = genItemsFromKeys(keys,options);
	DA.items = genItemsFromKeys(KeySets.all, options);
	DA.options = options;
	DA.iStart = 0;

	let dButtons = mDiv(dTitleLeft, { display: 'flex', 'flex-direction': 'column' });
	mButton('next', itemViewerNext, dButtons, { outline: 'none', mabottom: 6, matop: 10 });
	mButton('download', saveSpecialKeys, dButtons, { outline: 'none' });

	itemViewerNext(); revealMain();
}
function itemViewerNext() {
	let i = DA.iStart;
	let options = DA.options;
	let items = arrFromTo(DA.items, i, i + options.n);
	options.n = options.N = items.length;
	DA.iStart += options.n;
	// console.log('total',DA.items.length,'items from:', items[0].index, 'to', items[options.n - 1].index);
	clearElement(options.dArea);
	options.fzText = 20;
	present00(items, options);
}
function handSelectSpecialKeys(item) {
	if (nundef(DA.specialKeys)) DA.specialKeys = [];
	toggleItemSelection(item, DA.specialKeys);
	return DA.specialKeys.map(x => x.key);
	// DA.specialKeys.push(item);
	// mStyleX(lDiv(item),{border:'5px solid yellow'});
}
function saveSpecialKeys() {
	let items = DA.specialKeys;
	let dict = {};
	for (const item of items) {
		dict[item.key] = item.info;
	}
	downloadAsYaml(dict, 'specialKeys');
}
//#endregion


