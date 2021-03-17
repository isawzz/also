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
	let items = getItemsCat(3,'anim');
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
	Daat.items = genItemsFromKeys(KeySets.all, options);//genItems(options);
	Daat.options = options;
	Daat.iStart = 0;

	let dButtons = mDiv(dTitleLeft, { display: 'flex', 'flex-direction': 'column' });
	mButton('next', itemViewerNext, dButtons, { outline: 'none', mabottom: 6, matop: 10 });
	mButton('download', saveSpecialKeys, dButtons, { outline: 'none' });

	itemViewerNext(); revealMain();
}
function itemViewerNext() {
	let i = Daat.iStart;
	let options = Daat.options;
	let items = arrFromTo(Daat.items, i, i + options.n);
	options.n = options.N = items.length;
	Daat.iStart += options.n;
	// console.log('total',Daat.items.length,'items from:', items[0].index, 'to', items[options.n - 1].index);
	clearElement(options.dArea);
	options.fzText = 20;
	present00(items, options);
}
function handSelectSpecialKeys(item) {
	if (nundef(Daat.specialKeys)) Daat.specialKeys = [];
	toggleItemSelection(item, Daat.specialKeys);
	return Daat.specialKeys.map(x => x.key);
	// Daat.specialKeys.push(item);
	// mStyleX(lDiv(item),{border:'5px solid yellow'});
}
function saveSpecialKeys() {
	let items = Daat.specialKeys;
	let dict = {};
	for (const item of items) {
		dict[item.key] = item.info;
	}
	downloadAsYaml(dict, 'specialKeys');
}
//#endregion


