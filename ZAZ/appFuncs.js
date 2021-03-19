//#region game controller

//#region solitaire: categories:


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

//#region itemViewer
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
	Daaa.items = genItemsFromKeys(KeySets.all, options);
	Daaa.options = options;
	Daaa.iStart = 0;

	let dButtons = mDiv(dTitleLeft, { display: 'flex', 'flex-direction': 'column' });
	mButton('next', itemViewerNext, dButtons, { outline: 'none', mabottom: 6, matop: 10 });
	mButton('download', saveSpecialKeys, dButtons, { outline: 'none' });

	itemViewerNext(); revealMain();
}
function itemViewerNext() {
	let i = Daaa.iStart;
	let options = Daaa.options;
	let items = arrFromTo(Daaa.items, i, i + options.n);
	options.n = options.N = items.length;
	Daaa.iStart += options.n;
	// console.log('total',Daaa.items.length,'items from:', items[0].index, 'to', items[options.n - 1].index);
	clearElement(options.dArea);
	options.fzText = 20;
	present00(items, options);
}
function handSelectSpecialKeys(item) {
	if (nundef(Daaa.specialKeys)) Daaa.specialKeys = [];
	toggleItemSelection(item, Daaa.specialKeys);
	return Daaa.specialKeys.map(x => x.key);
	// Daaa.specialKeys.push(item);
	// mStyleX(lDiv(item),{border:'5px solid yellow'});
}
function saveSpecialKeys() {
	let items = Daaa.specialKeys;
	let dict = {};
	for (const item of items) {
		dict[item.key] = item.info;
	}
	downloadAsYaml(dict, 'specialKeys');
}
//#endregion


