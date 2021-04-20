function canAct() { return (aiActivated || uiActivated) && !auxOpen; }
function canHumanAct() { return uiActivated && !auxOpen; }
function canAIAct() { return aiActivated && !auxOpen; }
function setGame(game, immediate = false) {
	cleanupOldGame();
	if (isdef(G) && G.id != game) Score.gameChange = true;

	G = new (classByName(capitalize(game)))(game, DB.games[game]);
	Settings = new SettingsClass(G, dAux);

	if (nundef(U.games[game])) {
		if (G.controllerType == 'solitaire') { U.games[game] = { nTotal: 0, nCorrect: 0, nCorrect1: 0, startLevel: 0 }; }
		else U.games[game] = {};
	}

	if (isdef(G.maxLevel)) G.level = Math.min(getUserStartLevel(game), G.maxLevel);

	Settings.updateGameValues(U, G);
	saveUser();

	switch (G.controllerType) {
		case 'solitaire': GC = new ControllerSolitaire(G, U); break;
		case 'solo': GC = new ControllerTTT(G, U); break;
	}
	G.controller = GC;
	showGameTitle();
	if (immediate) GC.startGame();
}
class ItemViewerClass {
	constructor(dParent, dButtons, keys) {
		this.options = {
			n: 100, dParent: dParent,
			wper: 100, hper: 100, //dParent: dTable, is default!
			szPic: { w: 80, h: 80 }, padding: 0, fzPic: 40,
			showLabels: true, showPic: true, fixTextFont: true,
			isUniform: true, fillArea: true, isRegular: false, hugeFont: true,
			handler: _standardHandler(this.handSelectSpecialKeys.bind(this)),
		};
		_extendOptions(this.options);
		this.options.wLongest = 'alabama';

		//items
		//let keys = genKeys(options);	keys[0] = 'spiral shell';	let items = genItemsFromKeys(keys,options);
		let items = this.allItems = genItemsFromKeys(isdef(keys) ? keys : SymKeys, this.options);

		console.log(this.allItems.length);
		this.iStart = 0;

		dButtons = mDiv(dButtons, { display: 'flex', 'flex-direction': 'column', matop: -12 });
		mButton('download', this.saveSpecialKeys.bind(this), dButtons, { outline: 'none' });
		if (this.allItems.length > 100) mButton('next', this.itemViewerNext.bind(this), dButtons, { outline: 'none', mabottom: 6, matop: 10 });

		this.itemViewerNext(); //revealMain();

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

		items.map(x=>x.label = x.key);
		items.map(x => makeItemDiv(x, options));
		items.map(x => mAppend(options.dArea, iDiv(x)));

		// present00(items, options);
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






