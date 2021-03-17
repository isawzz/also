class SolitaireClass{
	constructor(dParent){
		this.options = {
			n: 100, dParent: dParent,
			wper: 100, hper: 100, //dParent: dTable, is default!
			szPic: { w: 100, h: 70 }, padding: 0,
			showLabels: true, showPic: true, 
			isUniform: true, fillArea: true, isRegular: false, 
			handler: _standardHandler,
		};
		_extendOptions(this.options);
		this.options.wLongest = 'alabama';

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
		this.allItems = genItemsFromKeys(isdef(keys)?keys:KeySets.all, this.options);//genItems(options);
		this.iStart = 0;

		dButtons = mDiv(dButtons, { display: 'flex', 'flex-direction': 'column' });
		mButton('download', this.saveSpecialKeys.bind(this), dButtons, { outline: 'none' });
		if (this.allItems.length > 100)	mButton('next', this.itemViewerNext.bind(this), dButtons, { outline: 'none', mabottom: 6, matop: 10 });

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







