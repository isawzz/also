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

		items.map(x => x.label = x.key);
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

//fraction helpers
function all2DigitFractions() {
	let fr = {
		1: [2, 3, 4, 5, 6, 7, 8, 9],
		2: [3, 5, 7, 9],
		3: [2, 4, 5, 7, 8],
		4: [3, 5, 7, 9],
		5: [2, 3, 4, 6, 7, 8, 9],
		6: [5, 7],
		7: [2, 3, 4, 5, 6, 8, 9],
		8: [3, 5, 7, 9],
		9: [2, 4, 5, 7, 8],
	};
	return fr;
}
function all2DigitFractionsExpanded() {
	let f = all2DigitFractions();
	let res = [];
	for (const i in f) {
		for (const j of f[i]) {
			res.push({ numer: i, denom: j });
		}
	}
	return res;
}
function all2DigitFractionsUnder1() {
	let fr = {
		1: [2, 3, 4, 5, 6, 7, 8, 9],
		2: [3, 5, 7, 9],
		3: [4, 5, 7, 8],
		4: [5, 7, 9],
		5: [6, 7, 8, 9],
		6: [7],
		7: [8, 9],
		8: [9],
	};
	return fr;
}
function all2DigitFractionsUnder1Expanded() {
	let f = all2DigitFractionsUnder1();
	let res = [];
	for (const i in f) {
		for (const j of f[i]) {
			res.push({ numer: i, denom: j });
		}
	}
	return res;
}
function fractionsUnder1ByDenominator() {
	let fr = {
		2: [1],
		3: [1, 2],
		4: [1, 3],
		5: [1, 2, 3, 4],
		6: [1, 5],
		7: [1, 2, 3, 4, 5, 6],
		8: [1, 3, 5, 7],
		9: [1, 2, 4, 5, 7, 8],
	};
	return fr;
}
function getTextForFraction(num, denom) {
	let s = '' + num + '&frasl;' + denom;
	// s = '1&frasl;16';
	return s;
}
function getTextForFraction_dep1(num, denom) {
	// num=5,denom=7;
	const remainder = {
		"1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾",
		"1/5": "⅕", "2/5": "⅖", "3/5": "⅗", "4/5": "⅘",
		"1/6": "⅙", "5/6": "⅚", "1/7": "⅐", "1/8": "⅛",
		"3/8": "⅜", "5/8": "⅝", "7/8": "⅞", "1/9": "⅑", "1/10": "⅒"
	};
	let s = remainder['' + num + '/' + denom];
	if (isdef(s)) return s;
	//console.log('hallo!!!!', num, denom)
	s = '' + num + '&frasl;' + denom;
	// s = '1&frasl;16';
	return s;
}
function getTextForFraction_dep(num, denom) { return '&frac' + num + denom + ';'; }
function getRandomFraction(num, denom) {

	if (isdef(denom)) {
		if (nundef(num)) num=randomNumber(1,denom-1);
		return math.fraction(num,denom);
	}else if (isdef(num)){
		//num defined but denom not
		denom=randomNumber(2,9);
		return math.fraction(num,denom);
	}

	let flist = all2DigitFractionsUnder1Expanded();
	// if (isdef(num)) flist = flist.filter(x => x.numer == num);
	// if (isdef(denom)) flist = flist.filter(x => x.denom == num);
	
	//console.log('flist', flist);
	let fr = chooseRandom(flist);
	return math.fraction(Number(fr.numer), Number(fr.denom));
}
function getRandomFractions(n) {
	let flist = all2DigitFractionsUnder1Expanded();
	let frlist = choose(flist, n);
	//console.log('frlist',frlist)
	return frlist.map(x => math.fraction(Number(x.numer), Number(x.denom)));
}


function simplifyFraction(numerator, denominator) {
	var gcd = function gcd(a, b) {
		return b ? gcd(b, a % b) : a;
	};
	gcd = gcd(numerator, denominator);
	return [numerator / gcd, denominator / gcd];
}





