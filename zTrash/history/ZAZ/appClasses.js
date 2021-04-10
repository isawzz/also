class SolCatsClass {
	constructor(data, options={}) {
		this.keysByCat = data; 
		this.cats = Object.keys(this.keysByCat);
		this.keylists = Object.values(this.keysByCat);
		this.options = options;_extendOptions(options);
	}
	dropHandler(source, target, isCopy = true) {
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

	prompt() {
		//OIL for category boxes
		clearElement(dTable);
		let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
		let containers = createContainers(this.cats, dArea); //['animals', 'sport', 'transport'], dArea);
		mLinebreak(dArea);
		let items = getNItemsPerKeylist(2,this.keylists,this.options);
		shuffle(items);
		for (const item of items){ // ['horse', 'soccer', 'bird']) {
			let label = item.label;
			let d = mText(item.label, dArea, { bg: 'orange', rounding: 4, margin: 8, wmin: 70, padding: 2 });
			lAdd(item,{div:d});
		}

		enableDD(items, containers, this.dropHandler.bind(this), false);

		//add a submit button that triggers evaluation
	}
}

class ItemViewerClass {
	constructor(dParent, dButtons, keys) {
		this.options = {
			n: 100, dParent: dParent,
			wper: 100, hper: 100, //dParent: dTable, is default!
			szPic: { w: 100, h: 70 }, padding: 0,
			showLabels: true, showPic: true, fixTextFont: true,
			isUniform: true, fillArea: true, isRegular: false, hugeFont: true,
			handler: _standardHandler(this.handSelectSpecialKeys.bind(this)),
		};
		_extendOptions(this.options);
		this.options.wLongest = 'alabama';

		//items
		//let keys = genKeys(options);	keys[0] = 'spiral shell';	let items = genItemsFromKeys(keys,options);
		this.allItems = genItemsFromKeys(isdef(keys) ? keys : SymKeys, this.options);
		console.log(this.allItems.length);
		this.iStart = 0;

		dButtons = mDiv(dButtons, { display: 'flex', 'flex-direction': 'column', matop:-12 });
		mButton('download', this.saveSpecialKeys.bind(this), dButtons, { outline: 'none' });
		if (this.allItems.length > 100) mButton('next', this.itemViewerNext.bind(this), dButtons, { outline: 'none', mabottom: 6, matop: 10 });

		this.itemViewerNext(); revealMain();

	}
	itemViewerNext() {
		let i = this.iStart;
		let options = this.options;
		let items = arrFromTo(this.allItems, i, i + options.n);
		options.n = options.N = items.length;
		this.iStart += options.n;
		// console.log('total',this.items.length,'items from:', items[0].index, 'to', items[options.n - 1].index);
		clearElement(options.dArea);
		options.fzText = 20;
		present00(items, options);
	}
	handSelectSpecialKeys(item) {
		if (nundef(this.specialKeys)) this.specialKeys = [];
		toggleItemSelection(item, this.specialKeys);
		return this.specialKeys.map(x => x.key);
	}
	saveSpecialKeys() {
		let items = this.specialKeys;
		let dict = {};
		for (const item of items) {
			dict[item.key] = item.info;
		}
		downloadAsYaml(dict, 'specialKeys');
	}
}







