class GCats extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }

	dropHandler(source, target, isCopy = true) {
		let dSource = iDiv(source);
		let dTarget = iDiv(target);

		if (!isCopy) {
			mAppend(dTarget, dSource);
		} else {
			let dNew = mText(dSource.innerHTML, dTarget, { wmin: 100, fz: 20, padding: 4, margin: 4, display: 'inline-block' });
			addDDSource(dNew, false);
		}

		if (isOverflown(dTarget)) {
			let d = dTarget.parentNode;
			let r = getRect(d);
			let w = r.w + 100;

			mSize(d, w, r.h);
			console.log('overflow!!!!', r.w, '=>', w)
		}
	}

	prompt() {
		let items;

		// pick categories
		let data = this.keysByCat = genCats(G.numCats);
		this.keylists = [], this.catsByKey = {};
		for (const cat in data) {
			this.keylists.push({ keys: data[cat], cat: cat });
			for (const k of data[cat]) {
				this.catsByKey[k] = cat;
			}
		}
		this.cats = Object.keys(this.keysByCat);
		this.allKeys = Object.keys(this.catsByKey);
		this.options = {}; _extendOptions(this.options);

		// pick items
		if (G.pickRandom == false) {
			// let n = G.numPics;
			// if (n == 1 || n == 2 || n == 3) console.log('n', n); else n = 4;
			items = Pictures = getNItemsPerKeylist(G.numPics, this.keylists, this.options);
		} else {
			//console.log(this.allKeys);
			let keys = choose(this.allKeys, G.numPics * G.numCats);
			items = Pictures = genItemsFromKeys(keys, this.options);
			items.map(x => x.cat = this.catsByKey[x.key]);
			//for(let i=0;i<items.length;i++){items[i].cat=keysPlus[i].cat;}
			//console.log('items', items)
		}
		shuffle(items);

		//OIL for category boxes
		showInstruction('', G.language == 'E' ? 'drag words to categories' : "ordne die texte in kategorien", dTitle, true);
		mLinebreak(dTable);

		//show categories:
		let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap' });//, layout: 'fhcc' });
		let containers, dWordArea;
		containers = this.containers = createContainers(this.cats, dArea, { w: 'auto', wmin: 150, wmax: 300, hmin: 250, fz: 24, fg: 'contrast' }); //['animals', 'sport', 'transport'], dArea);
		mLinebreak(dTable);

		//show words:
		dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		for (const item of items) { let d = miPic(item, dWordArea); iAdd(item, { div: d }); }

		enableDD(items, containers, this.dropHandler.bind(this), false);
		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);

		activateUi();
	}
	trialPrompt() {
		sayTryAgain();
		TOMain = setTimeout(() => {
			for (const p of Pictures) {
				if (!p.isCorrect) {
					mAppend(this.dWordArea, iDiv(p));
					if (G.trialNumber == 1) miAddLabel(p, { bg: '#00000080', margin: 4, fz: 20 });
				}
			}
		}, 1000);
		return 1200;
	}
	trialPrompt_dep() {
		sayTryAgain();
		if (G.trialNumber == 1) {
			for (const p of Pictures) {
				if (!p.isCorrect) {
					miAddLabel(p, { bg: '#00000080', margin: 4, fz: 20 });
				}
			}
		}
		TOMain = setTimeout(() => {
			Pictures.map(x => mAppend(this.dWordArea, iDiv(x)))
		}, 1200);
		return 1500;
	}
	eval() {
		this.piclist = Pictures;
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => iDiv(x)), sz: getRect(iDiv(this.piclist[0])).h };
		let isCorrect = true;
		for (const p of Pictures) {
			let label = p.label;
			let d = iDiv(p);
			let cont = d.parentNode;
			for (const c of this.containers) {
				if (iDiv(c) == cont) {
					p.classified = true;
					if (p.cat == c.label) p.isCorrect = true;
					else { p.isCorrect = isCorrect = false; }
					break;
				}
			}
			if (!p.classified) p.isCorrect = isCorrect = false;
		}
		//Pictures.map(x => console.log(x.label, x.isCorrect));
		return isCorrect;
	}
	eval_dep1() {
		//console.log('containers', this.containers);
		let isCorrect = true;
		let correctList = [], incorrectList = [];
		for (const p of Pictures) {
			//console.log('item', p)
			//console.log('parent', iDiv(p).parentNode);
			let cont = iDiv(p).parentNode;
			p.classified = false;
			for (const c of this.containers) {
				if (iDiv(c) == cont) {
					p.classified = true;
					if (p.cat == c.label) correctList.push(p);
					else { isCorrect = false; incorrectList.push(p); }
					break;
				}
			}
			if (!p.classified) isCorrect = false;
		}
		console.log('correct', correctList.map(x => x.label));
		console.log('incorrect', incorrectList.map(x => x.label));
		console.log('isCorrect', isCorrect);
		// console.log('items', Pictures);
		return isCorrect;
	}
	eval_dep() {
		console.log('containers', this.containers);
		let isCorrect = true;
		let correctList = [], incorrectList = [];
		for (const p of Pictures) {
			console.log('item', p)
			console.log('parent', iDiv(p).parentNode);
			let cont = iDiv(p).parentNode;
			for (const c of this.containers) {
				if (iDiv(c) == cont) {
					if (!belongsToCategory(p, c.label)) {
						isCorrect = false;
						incorrectList.push(p);
						//p is in container c
						//how can I find out if this picture belongs to this category?
					} else correctList.push(p);
					break;
				}
			}
			//break;
		}
		console.log('correct', correctList.map(x => x.label));
		console.log('incorrect', incorrectList.map(x => x.label));
		console.log('isCorrect', isCorrect);
		return isCorrect;
	}
	prompt_dep() {
		let items;

		// pick categories
		let data = this.keysByCat = genCats(G.numCats);
		this.keylists = [], this.catsByKey = {};
		for (const cat in data) {
			this.keylists.push({ keys: data[cat], cat: cat });
			for (const k of data[cat]) {
				this.catsByKey[k] = cat;
			}
		}
		this.cats = Object.keys(this.keysByCat);
		this.allKeys = Object.keys(this.catsByKey);
		this.options = {}; _extendOptions(this.options);

		// pick items
		if (G.pickRandom == false) {
			// let n = G.numPics;
			// if (n == 1 || n == 2 || n == 3) console.log('n', n); else n = 4;
			items = Pictures = getNItemsPerKeylist(G.numPics, this.keylists, this.options);
		} else {
			//console.log(this.allKeys);
			let keys = choose(this.allKeys, G.numPics * G.numCats);
			items = Pictures = genItemsFromKeys(keys, this.options);
			items.map(x => x.cat = this.catsByKey[x.key]);
			//for(let i=0;i<items.length;i++){items[i].cat=keysPlus[i].cat;}
			//console.log('items', items)
		}
		shuffle(items);

		//find longest word in Pictures and also in cats
		let wLongest = findLongestWord(this.cats.concat(items.map(x => x.label))); wLongest = extendWidth(wLongest);
		//console.log('the longest word is', wLongest);

		//OIL for category boxes
		showInstruction('', G.language == 'E' ? 'drag words to categories' : "ordne die texte in kategorien", dTitle, true);
		mLinebreak(dTable);

		let fz = 24, padding = 4;
		let wmin = measureWord(wLongest, fz).w;
		let wWin = window.innerWidth * .75;
		let hWin = window.innerHeight * .3;
		//console.log('wLongest',wLongest,'wmin',wmin)

		//show categories:
		let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap' });//, layout: 'fhcc' });
		let containers, dWordArea;
		if (G.showPic) {
			if (this.cats.includes('music') || !G.showLabels) { this.options.showLabels = false; }
			let wCont = wWin / G.numCats; //Math.max(150, wmin + 2 * padding);
			let hCont = hWin;
			containers = this.containers = createContainers(this.cats, dArea, { w: 'auto', wmin: 150, wmax: 300, hmin: 250, fz: 24, fg: 'contrast' }); //['animals', 'sport', 'transport'], dArea);
		} else {
			containers = this.containers = createContainers(this.cats, dArea, { hmin: 250, fg: 'contrast', wmin: Math.max(150, wmin + 2 * padding) }); //['animals', 'sport', 'transport'], dArea);
		}
		mLinebreak(dTable);

		//show words:
		dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
		if (G.showPic) {
			let w = this.options.w = window.innerWidth - 100;
			let h = this.options.h = 'auto';
			mStyleX(dWordArea, { h: h });
			this.options.rows = 1;
			//this.options.outerStyles.padding=12;
			let rect = myPresent(dWordArea, items, this.options);
			// items.map(x => mStyleX(iDiv(x), { w: 'auto', padding: 8 }))
			items.map(x => iStyle(x, { w: 'auto', padding: 8, fzPic: 40, fz: 20 }));
		} else {
			for (const item of items) { // ['horse', 'soccer', 'bird']) {

				let d = mText(item.label, dWordArea, { fz: fz, bg: 'orange', fg: 'contrast', rounding: 4, margin: 8, wmin: 70, hpadding: padding });
				iAdd(item, { div: d });
			}
		}

		enableDD(items, containers, this.dropHandler.bind(this), false);

		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		activateUi();
		//add a submit button that triggers evaluation
	}
	prompt_complex() {
		let items;

		// pick categories
		let data = this.keysByCat = genCats(G.numCats);
		this.keylists = [], this.catsByKey = {};
		for (const cat in data) {
			this.keylists.push({ keys: data[cat], cat: cat });
			for (const k of data[cat]) {
				this.catsByKey[k] = cat;
			}
		}
		this.cats = Object.keys(this.keysByCat);
		this.allKeys = Object.keys(this.catsByKey);
		this.options = {}; _extendOptions(this.options);

		// pick items
		if (G.pickRandom == false) {
			// let n = G.numPics;
			// if (n == 1 || n == 2 || n == 3) console.log('n', n); else n = 4;
			items = Pictures = getNItemsPerKeylist(G.numPics, this.keylists, this.options);
		} else {
			//console.log(this.allKeys);
			let keys = choose(this.allKeys, G.numPics * G.numCats);
			items = Pictures = genItemsFromKeys(keys, this.options);
			items.map(x => x.cat = this.catsByKey[x.key]);
			//for(let i=0;i<items.length;i++){items[i].cat=keysPlus[i].cat;}
			//console.log('items', items)
		}
		shuffle(items);

		//find longest word in Pictures and also in cats
		let wLongest = findLongestWord(this.cats.concat(items.map(x => x.label))); wLongest = extendWidth(wLongest);
		//console.log('the longest word is', wLongest);

		//OIL for category boxes
		showInstruction('', G.language == 'E' ? 'drag words to categories' : "ordne die texte in kategorien", dTitle, true);
		mLinebreak(dTable);

		let fz = 24, padding = 4;
		let wmin = measureWord(wLongest, fz).w;
		let wWin = window.innerWidth * .75;
		let hWin = window.innerHeight * .3;
		//console.log('wLongest',wLongest,'wmin',wmin)

		//show categories:
		let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap' });//, layout: 'fhcc' });
		let containers, dWordArea;
		if (G.showPic) {
			if (this.cats.includes('music') || !G.showLabels) { this.options.showLabels = false; }
			let wCont = wWin / G.numCats; //Math.max(150, wmin + 2 * padding);
			let hCont = hWin;
			containers = this.containers = createContainers(this.cats, dArea, { w: 'auto', wmin: 150, wmax: 300, hmin: 250, fz: 24, fg: 'contrast' }); //['animals', 'sport', 'transport'], dArea);
		} else {
			containers = this.containers = createContainers(this.cats, dArea, { hmin: 250, fg: 'contrast', wmin: Math.max(150, wmin + 2 * padding) }); //['animals', 'sport', 'transport'], dArea);
		}
		mLinebreak(dTable);

		//show words:
		dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		for (const item of items) {
			let d = miPic(item, dWordArea);
			iAdd(item, { div: d });
			//console.log('d', d);
			//miAddLabel(item, { margin: 10, fz: 20 });
		}

		enableDD(items, containers, this.dropHandler.bind(this), false);

		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		activateUi();
		//add a submit button that triggers evaluation
	}
}


