function updateStartLevelForUser(game, level, msg) {
	//console.log('updating startLevel for', Username, game, level, '(' + msg + ')')
	lookupSetOverride(U.games, [game, 'startLevel'], level);
	saveUser();
}


function evaluate_dep() {
	//console.log('evaluate!!!',arguments)
	if (!canAct()) return;
	uiActivated = false; clearTimeouts();

	IsAnswerCorrect = G.instance.eval(...arguments);
	if (IsAnswerCorrect === undefined) { promptNextTrial(); return; }

	G.trialNumber += 1;
	if (!IsAnswerCorrect && G.trialNumber < G.trials) { promptNextTrial(); return; }

	//feedback
	if (IsAnswerCorrect) { DELAY = isdef(Selected.delay) ? Selected.delay : G.spokenFeedback ? 1500 : 300; G.successFunc(); }
	else { DELAY = G.correctionFunc(); G.failFunc(); }

	let nextLevel = scoring(IsAnswerCorrect);

	//TOMain = setTimeout(gotoNext,DELAY);

	setTimeout(removeMarkers, 1500);

	//console.log('cscoring result:', Score)
	if (Score.gameChange) {
		//updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
		setNextGame();
		if (unitTimeUp()) {
			setTimeout(() => gameOver('Great job! Time for a break!'), DELAY);
		} else {
			TOMain = setTimeout(startGame, DELAY);
		}
	} else if (Score.levelChange && nextLevel <= G.maxLevel) {
		G.level = nextLevel;
		setBadgeLevel(G.level); //show the last level accomplished in opacity=1!!!
		TOMain = setTimeout(startLevel, DELAY); //soll ich da startGame machen???
	} else {
		TOMain = setTimeout(startRound, DELAY);
	}

}


function saveUnit() { saveUser(); }

function addScoreToUserSession() {
	//at end of level
	//adds Score to session
	//console.log('Score', Score)
	//console.assert(isdef(Score.nTotal) && Score.nTotal > 0)
	let sc = { nTotal: Score.nTotal, nCorrect: Score.nCorrect, nCorrect1: Score.nCorrect1 };
	let game = G.id;
	let level = G.level;
	let session = U.session;
	if (nundef(session)) {
		console.log('THERE WAS NO USER SESSION IN _addScoreToUserSession!!!!!!!!!!!!!!!!!!!!!')
		U.session = {};
	}

	let sGame = session[game];
	if (nundef(sGame)) {
		sGame = session[game] = jsCopy(sc);
		sGame.byLevel = {};
		sGame.byLevel[level] = jsCopy(sc);
	} else {
		addByKey(sc, sGame);
		let byLevel = lookupSet(sGame, ['byLevel', level], {});
		addByKey(sc, byLevel);
	}
	sGame.percentage = Math.round(100 * sGame.nCorrect / sGame.nTotal);

	saveUser();

}
function addSessionToUserGames() {
	// adds session to U.games and deletes session

	if (!isEmpty(U.session)) {
		for (const g in U.session) {
			let recOld = lookup(U, ['games', g]);
			let recNew = U.session[g];

			//console.assert(isdef(recOld));

			addByKey(recNew, recOld);
			recOld.percentage = Math.round(100 * recOld.nCorrect / recOld.nTotal);
			if (nundef(recOld.byLevel)) recOld.byLevel = {};
			for (const l in recNew.byLevel) {
				if (nundef(recOld.byLevel[l])) recOld.byLevel[l] = jsCopy(recNew.byLevel[l]);
				else addByKey(recNew.byLevel[l], recOld.byLevel[l]);
			}
		}
	}
	U.session = {};
}
function getStartLevels(user) {
	let udata = lookup(DB, ['users', user]);
	if (!udata) return 'not available';
	let res = [];
	let res2 = {};
	for (const g in udata.games) {
		res2[g] = udata.games[g].startLevel;
		res.push(g + ': ' + udata.games[g].startLevel);
	}
	return res2; // res.join(',');

}


function showHiddenThumbsUpDown(sz=100) {
	let d=mDiv(dTable,{hmin:sz*1.5});
	mCenterFlex(d);
	let keys = ['thumbs up', 'thumbs down'];
	let options = getOptionsMinimalistic(d,null,300,100,{bg:'transparent',display:'inline'});//,{fzPic:50,w:60,h:60});
	let items = Pictures = genItemsFromKeys(keys,options);
	for(const item of items){
		let d1=makeItemDiv(item,options);
		mAppend(d,d1);
		mStyleX(d1.firstChild,{fz:sz, mabottom:12});
		mStyleX(d1,{opacity:0});
	}
	//console.log('items',items);

	// styles.bg = ['transparent', 'transparent'];
	// mLinebreak(dTable);
	// Pictures = showPictures(dTable, null, styles, { szPic:styles.sz, showLabels: false }, ['thumbs up', 'thumbs down']);
	// console.log('Pictures',Pictures)
	// Pictures = showPics(null, styles, { sz: styles.sz, showLabels: false }, ['thumbs up', 'thumbs down']); //, ['bravo!', 'nope']);
	//for (const p of Pictures) { let d = iDiv(p); d.style.padding = d.style.margin = '6px 0px 0px 0px'; d.style.opacity = 0; }

}

function showCorrectPictureLabels(sayit = true) {
	return 1000;
	for (const p of Pictures) { replacePicAndLabel(p, p.key); }
	Goal = { pics: Pictures };

	let anim = G.spokenFeedback ? 'onPulse' : 'onPulse1';
	let div = Selected.feedbackUI;
	mClass(div, anim);

	if (!sayit || !G.spokenFeedback) G.spokenFeedback ? 3000 : 300;

	let correctionPhrase = isdef(Goal.correctionPhrase) ? Goal.correctionPhrase : Goal.label;
	sayRandomVoice(correctionPhrase);
	return G.spokenFeedback ? 3000 : 300;
}


//GCats final mit old code!!!
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


class GCats_1 {
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
		for (const item of items) {
			let d = mPic(item, dWordArea, { display: 'inline-block' });
			iAdd(item, { div: d });
			console.log('d', d)
		}
		// if (G.showPic) {
		// 	let w = this.options.w = window.innerWidth - 100;
		// 	let h = this.options.h = 'auto';
		// 	mStyleX(dWordArea, { h: h });
		// 	this.options.rows = 1;
		// 	//this.options.outerStyles.padding=12;
		// 	let rect = myPresent(dWordArea, items, this.options);
		// 	// items.map(x => mStyleX(iDiv(x), { w: 'auto', padding: 8 }))
		// 	items.map(x => iStyle(x, { w: 'auto', padding: 8, fzPic:40, fz:20 }));
		// } else {
		// 	for (const item of items) { // ['horse', 'soccer', 'bird']) {
		// 		let d = mText(item.label, dWordArea, { fz: fz, bg: 'orange', fg: 'contrast', rounding: 4, margin: 8, wmin: 70, hpadding: padding });
		// 		iAdd(item, { div: d });
		// 	}
		// }

		enableDD(items, containers, this.dropHandler.bind(this), false);

		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		activateUi();
		//add a submit button that triggers evaluation
	}
}


function myPresent(dArea, items, options) {
	let showLabels = options.showLabels;
	//console.log(options, items)
	let w = options.w * valf(options.fw, .9); //window.innerWidth-70;
	let h = options.h * valf(options.fh, .7); //window.innerHeight-150;

	//console.log('rows are',options.rows)

	let wi, hi, rows, cols;
	if (isdef(options.rows) || isdef(options.cols)) {
		[wi, hi, rows, cols] = calcSizeAbWo(items.length, options.rows, options.cols, w, h, options.wimax, options.himax);
	} else[wi, hi, rows, cols] = calcRowsColsSizeAbWo(items.length, w, h, showLabels, options.wimax, options.himax);

	// let gap = valf(options.gap,Math.min(wi,hi) * .1); wi -= gap; hi -= gap;
	//console.log(options.gap)
	let gap = wi * .1; if (cols > 1) wi -= gap; if (rows > 1) hi -= gap;
	let fzPic = options.fzPic = getStandardFzPic(wi, hi, showLabels);
	//console.log('fzPic',fzPic,showLabels)

	let fz = getStandardFz(wi, hi, options.showPic, options.showLabels, options.wLongest);
	// let hText = options.showPic ? hi / 3 : hi;
	// let fz = options.fz = showLabels ? idealFontSize(options.wLongest, wi, hText) : 0;
	options.szPic = { w: wi, h: hi };
	//console.log(items[0]);
	//console.log('N=' + items.length, 'showLabels', showLabels, showLabels, '\ndims', 'wWin', w, 'hWin', h, '\nwnet', wi, 'hnet', hi, '\nrows,cols', rows, cols, '\nfzPic', fzPic, 'fz', fz);
	if (nundef(options.ifs)) options.ifs = {};
	let outerStyles = {
		w: wi, h: hi, margin: gap / 2, rounding: 6,
		bg: valf(options.ifs.bg, 'random'), fg: 'contrast', display: 'inline-flex', 'flex-direction': 'column',
		'justify-content': 'center', 'align-items': 'center', 'vertical-align': 'top',
	};
	let picStyles = { fz: fzPic };
	let labelStyles = { fz: fz };
	for (const item of items) {
		for (const k in options.ifs) if (isdef(item[k])) outerStyles[k] = item[k];
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPic) {
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			} else {
				labelStyles['text-shadow'] = sShade;
				labelStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			}
		}
		let dOuter = mCreate('div', outerStyles, item.id);
		dOuter.onclick = options.handler;
		picStyles.family = item.info.family;
		let dLabel, dPic;
		if (options.showPic) { dPic = mDiv(dOuter, picStyles); dPic.innerHTML = item.info.text; }
		//console.log('showLabels ',showLabels)
		//console.log('labelStyles', labelStyles)
		if (showLabels) dLabel = mText(item.label, dOuter, labelStyles);
		if (options.showRepeat) addRepeatInfo(dOuter, item.iRepeat, wi);
		iAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });
	}

	if (isdef(options.numColors) && options.numColors > 1) {
		mStyleX(dArea, { display: 'inline-grid', gap: gap, 'grid-template-columns': `repeat(${cols},${wi}px)` });
	}
	//mStyleX(dArea, { w:w, display: 'inline-grid'});
	items.map(x => mAppend(dArea, iDiv(x)));
	//console.log('rows',rows,cols)
	return getRect(dArea);
}


function trash() {

	let item0 = Pictures[0];
	let label0 = item0.label;
	let hLetter = label0[item0.iLetter];
	// let hLetter = Pictures[0].label[indices[0]];
	//console.log('hLetter', hLetter);
	for (let i = 0; i < n - 1; i++) {
		let item1 = Pictures[i];
		let item2 = Pictures[i + 1];

		let i1 = item1.iLetter; //indices[i];
		let i2 = item2.iLetter; //indices[i + 1];

		//console.log('______', i1, i2)

		//item1 must get letter that is currently at position i2 in item2.label
		let test = item1.testLabel = replaceAt(item1.label, i1, item2.label[i2]);
		//console.log('test', test);
	}
	let item = Pictures[n - 1];
	item.testLabel = replaceAt(item.label, item.iLetter, hLetter);


	//console.log('test', item.testLabel); //false, 'und was jetzt???????????')

	//console.assert(false,'END')
	for (const p of Pictures) {
		if (p.testLabel != p.origLabel) {
			//console.log('fehler:', p.origLabel, p.testLabel);
			isCorrect = false;
		}
	}

	let feedbackList = [];
	for (let i = 0; i < n; i++) {
		let item = Pictures[i];
		let d = item.letters[item.iLetter].div;
		feedbackList.push(d);
	}
	Selected = { piclist: Pictures, feedbackUI: feedbackList, sz: getRect(iDiv(Pictures[0])).h };
	return isCorrect;

}

class GSwap extends Game {
	constructor(name) {
		super(name);
		if (G.language == 'C') { this.prevLanguage = G.language; G.language = chooseRandom('E', 'D'); }
		if (nundef(Dictionary)) { Dictionary = { E: {}, S: {}, F: {}, C: {}, D: {} } };
		for (const k in Syms) {
			for (const lang of ['E', 'D', 'F', 'C', 'S']) {
				let w = Syms[k][lang];
				if (nundef(w)) continue;
				Dictionary[lang][w.toLowerCase()] = Dictionary[lang][w.toUpperCase()] = k;
			}
		}
		//console.log('dict', Dictionary);
	}
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }
	clear() { super.clear(); if (isdef(this.prevLanguage)) G.language = this.prevLanguage; }
	startLevel() {
		G.keys = setKeysG(G, filterWordByLength, 25);
		if (G.keys.length < 25) { G.keys = setKeysG(G, filterWordByLength, 25, 'all'); }
		//console.log('keys', G.keys.length);
		//console.log('words', G.keys.map(x => Syms[x].E))
	}
	dropHandler(source, target, isCopy = false, clearTarget = false) {
		let prevTarget = source.target;
		source.target = target;
		let dSource = iDiv(source);
		let dTarget = iDiv(target);

		if (clearTarget) {
			//if this target is empty, remove _
			let ch = dTarget.children[0];
			let chSource = firstCond(Pictures, x => iDiv(x) == ch);
			if (chSource) {
				if (isdef(prevTarget)) {
					mAppend(iDiv(prevTarget), ch);
					chSource.target = prevTarget;
				} else {
					mAppend(this.dWordArea, ch);
					delete chSource.target;
				}
			}
			clearElement(dTarget);

			//find out previous target! (parentNode of dSource in a drop target?)
		}
		if (isCopy) {
			let dNew = mText(dSource.innerHTML, dTarget, { wmin: 100, fz: 20, padding: 4, margin: 4, display: 'inline-block' });
			addDDSource(dNew, isCopy, clearTarget);
		} else {
			mAppend(dTarget, dSource);
		}

		//evaluate();
		//relayout sources in target
	}
	prompt() {
		showInstruction('', 'swap letter to form words', dTitle, true);
		mLinebreak(dTable);

		this.dHintArea = mDiv(dTable, { display: 'flex' });//, { w: 500, h: 150, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		mLinebreak(dTable);

		let fz = 32;
		// let fzPic = fz * 3, h = fz * 1.25, wmin = fz * 1.25;
		let options = _simpleOptions({ w: 200, h: 200, keySet: G.keys, luc: 'u', fz: fz, bg: 'random', fg: 'white', showLabels: true });
		// console.log(options)

		let n = 2;
		let items = gatherItems(n, options);
		console.log('items', items);

		//schreibe beide bilder auf (ohne pic)
		let dArea = mDiv(dTable, { display: 'flex' });//, { w: 500, h: 150, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });

		let style = { margin: 3, fg: 'white', display: 'inline', bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 80 };
		for (const item of items) {
			let d1 = item.container = mDiv(dTable, { hmin: 250 });
			let d = createLetterInputs(item.label, d1, style);
			//let dHint=mText(item.info.subgroup,d1);
			// let dHint = mPic(item, d1);
			mStyleX(d, { margin: 25 })
		}


		// items.map(x => { let d = makeItemDiv(x, options); mStyleX(d, { hpadding: 12, margin: 20 }); mAppend(dArea, d); });

		mLinebreak(dTable);
		//myPresent(dArea, items, options);

		// enableDD(items, containers, this.dropHandler.bind(this), false, true);
		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		activateUi();

	}
	trialPrompt() {
		sayTryAgain();
		TOMain = setTimeout(() => { Pictures.map(x => mAppend(this.dWordArea, iDiv(x))); }, 1200);
		return 1500;
	}
	eval() {

		let i = 0;
		let isCorrect = true;
		for (const p of Pictures) {
			let cont = p.target;
			if (nundef(cont)) p.isCorrect = isCorrect = false;
			else if (p.index != cont.index) p.isCorrect = isCorrect = false;
			else p.isCorrect = true;
		}

		Selected = { piclist: Pictures, feedbackUI: Pictures.map(x => iDiv(x)), sz: getRect(iDiv(Pictures[0])).h + 10 };
		return isCorrect;
	}

}


function belongsToCategory(item, cat) {
	let info = item.info;
	cat = cat.toLowerCase();
	if (isdef(info.cats) && info.cats.includes(cat)) return true;
	if (isdef(info.group) && info.group.toLowerCase().includes(cat)) return true;
	if (isdef(info.subgroup) && info.group.toLowerCase().includes(cat)) return true;
	return false;

}

const GSG = {
	sport: { f: x => x.group == 'Activities' && x.subgroup == 'sport', ov: ['object', 'clothing'] },
	animal: { f: x => startsWith(x.subgroup, 'anim'), ov: ['nature'] },
	nature: { f: x => startsWith(x.group, 'Anim'), ov: ['animal', 'food'] },
	plant: { f: x => startsWith(x.subgroup, 'plant'), ov: ['nature', 'food'] },
	food: { f: x => startsWith(x.subgroup, 'food'), ov: ['nature', 'plant', 'animal'] }

}
function getGSG(k) {
	let set = [];
	let gsg = GSG[k];
	for (const k in Syms) {
		let info = Syms[k];
		//console.log(info.group)
		if (gsg.f(info)) set.push(k);
	}
	return set;
}

function genCategories(n) {

	console.log('hallo!!!!!!!!!!!!!!', ByGroupSubgroup)
	let gsg = ByGroupSubgroup;
	let groups = Object.keys(gsg);
	console.log(groups)
	let gs = choose(groups, n);
	console.log('groups', gs); //return;
	let di = {};
	for (const g of gs) {
		let sgs = Object.keys(gsg[g]);
		let sg = chooseRandom(sgs);
		let title = stringAfter(sg, '-');
		let keys = lookup(gsg, [g, sg]);
		di[title] = keys;
		console.log('group', g, 'subgroups', sgs, 'title', title, 'keys', gsg[g][sg])
	}
	return di;
}


function calcLongestLabel(items, options) {
	let mimi = arrMinMax(items, x => x.label.length);
	let max = options.longestLabelLen = mimi.max;
	let longest = items.filter(x => x.label.length == max);

	options.labelSum = arrSum(items, ['label', 'length']);
	if (options.hugeFont) {
		let item = longest[0];
		options.longestLabel = item.label;
		options.indexOfLongestLabelItem = item.index;
		options.wLongest = item.label + 'n';
		return;
	}

	//console.log('longest items:', longest)
	let bestItem = longest[0], maxmw = 0;
	for (const item of longest) {
		let w = item.label.toLowerCase();
		let cntmw = 0;
		for (let i = 0; i < w.length; i++) if (w == 'm' || w == 'w') cntmw += 1;
		if (cntmw > maxmw) { cntmw = maxmw; bestItem = item; }
	}

	options.longestLabel = bestItem.label; // items[mimi.imax].label;

	options.wLongest = replaceAll(options.longestLabel, 'i', 'w');
	options.wLongest = replaceAll(options.wLongest, 'l', 'w');
	options.wLongest = replaceAll(options.wLongest, 't', 'n');
	options.wLongest = replaceAll(options.wLongest, 'r', 'n');
	options.indexOfLongestLabelItem = bestItem.index;
	//console.log('longest item label is', options.longestLabel)
	// items.map(x=>console.log(x.label,x.label.length));
	options.labelSum = arrSum(items, ['label', 'length']);
}

class CatsApp {
	constructor(data, options = {}) {
		this.keysByCat = data;
		this.cats = Object.keys(this.keysByCat);
		this.lists = Object.values(this.keysByCat);
		this.keylists = [];
		for (const k in keysByCat) { this.keylists.push({ keys: data[k], cat: k }); }

		this.options = options; _extendOptions(options);
	}
	dropHandler(source, target, isCopy = true) {
		let dSource = iDiv(source);
		let dTarget = iDiv(target);

		if (!isCopy) {
			mAppend(dTarget, dSource);
		} else {
			let dNew = mText(dSource.innerHTML, dTarget, { wmin: 100, fz: 20, padding: 4, margin: 4, display: 'inline-block' });
			addDDSource(dNew, false);
		}

		//relayout sources in target
	}

	prompt(dParent) {
		//OIL for category boxes
		clearElement(dParent);
		let dArea = mDiv(dParent, { display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
		let containers = createContainers(this.cats, dArea); //['animals', 'sport', 'transport'], dArea);
		mLinebreak(dArea);
		let items = getNItemsPerKeylist(2, this.keylists, this.options);
		shuffle(items);
		for (const item of items) { // ['horse', 'soccer', 'bird']) {
			let d = mText(item.label, dArea, { bg: 'orange', rounding: 4, margin: 8, wmin: 70, padding: 2 });
			iAdd(item, { div: d });
		}

		enableDD(items, containers, this.dropHandler.bind(this), false);

		//add a submit button that triggers evaluation
	}
}



class GCatsOld extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }
	prompt() {

		G.Categories = {};

		myShowPics(null, {}, { rows: 1, showLabels: false });

		Goal = { pics: Pictures };

		showInstruction('', G.language == 'E' ? 'drag pictures into categories' : "ordne die bilder den kategorien zu", dTitle, true);
		mLinebreak(dTable);

		setDropZones(Pictures, () => { });
		mLinebreak(dTable, 50);

		this.letters = createDragWords(Pictures, evaluate);
		mLinebreak(dTable, 50);

		mButton('Done!', evaluate, dTable, { fz: 32, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);

		activateUi();
	}
	trialPrompt() {
		sayTryAgain();
		setTimeout(() => { Pictures.map(x => removeLabel(x)) }, 1500);
		return 10;
	}
	eval() {
		this.piclist = Pictures;
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => iDiv(x)), sz: getRect(iDiv(this.piclist[0])).height };
		let isCorrect = true;
		for (const p of Pictures) {
			let label = p.label;
			if (nundef(p.div.children[1])) {
				p.isCorrect = isCorrect = false;
			} else {
				let text = getActualText(p);
				if (text != label) { p.isCorrect = isCorrect = false; } else p.isCorrect = true;
			}
		}
		return isCorrect;
	}

}

function addLabel3(item, label, replaceOld = true) {
	//console.log(item);
	item.label = label;
	item.live.options.showLabels = true;
	let newItem = makeItemDiv(item, item.live.options); //getPic(key, item.sz, item.bg, label);
	clearElement(div);
	let d = iDiv(newItem);
	mAppend(div, d.children[0]);
	//mAppend(div, d.children[0]);
	item.live.dPic = newItem.pic;
	item.live.dLabel = newItem.text;
	return div;
}
function addLabel2(item, label) {

	let dLabel = item.live.dLabel;
	if (nundef(dLabel)) {
		dLabel = item.live.dLabel = mDiv(iDiv(item), { fz: 20 });
		dLabel.innerHTML = label


	} else console.log('dLabel', dLabel);

	return dLabel;
	if (isdef(item.live.dLabel)) { removeLabel(item); }
	item.label = label;
	let div = iDiv(item);
	let rect = getRect(div);
	dLabel = item.live.dLabel = mText(item.label, div, item.live.options.labelStyles);
	let fzPic = getStandardFzPic(rect.w, rect.h, true);
	let opt = item.live.options;
	let fz = getStandardFz(rect.w, rect.h, opt.showPic, opt.showLabels, opt.wLongest);

	//wie wird
	mStyleX(item.live.dPic, { fz, fzPic });
	mStyleX(item.live.dLabel, { fz, fz });
	return dLabel;
}

function makeItemDivs_dep(items, options) {
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		if (isdef(options.outerStyles)) copyKeys(item, options.outerStyles, {}, Object.keys(options.ifs)); //options.ifs contains per item dynamic styles!!!!!
		let dOuter = mCreate('div', options.outerStyles, getUID());

		if (isdef(item.textShadowColor)) {
			//console.log('halllllllllllll')
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPic) {
				options.picStyles['text-shadow'] = sShade;
				options.picStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			} else {
				options.labelStyles['text-shadow'] = sShade;
				options.labelStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			}
		}

		let dLabel;
		if (options.showLabels && options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic;
		if (options.showPic) {
			dPic = mDiv(dOuter, { family: item.info.family });
			dPic.innerHTML = item.info.text;
			if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);
		}

		if (options.showLabels && options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });

		if (isdef(item.textShadowColor)) { applyColorkey(item, options); }


	}

}

function myShowPics_orig(handler, ifs = {}, options = {}, keys, labels) {
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	// keys=['house','socks','hammer'];
	console.log(keys);
	Pictures = showPics(handler, ifs, options, keys, labels);
}
function myShowPics1(handler, ifs = {}, options = {}, keys, labels) {
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys[0]='tamale';	//keys[1]='safety pin';	//keys[2]='beaver';	//keys=['eye'];//['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];	// keys=['house','socks','hammer'];
	//console.log('keys',keys);

	options.ifs = ifs; options.handler = handler; _extendOptions(options); //console.log(options);

	let items = genItemsFromKeys(keys, options); items.map(x => makeItemDiv(x, options));

	items.map(x => mAppend(dTable, iDiv(x)));
	return items;

	//Pictures = showPics(handler, ifs, options, keys, labels);

}
function myShowPics2(handler, ifs = {}, options = {}, keys, labels) {
	if (nundef(keys)) keys = choose(G.keys, G.numPics);

	let w = window.innerWidth * .82;
	let h = window.innerHeight * .6;
	let dArea = getArea(dTable, { w: w, h: h });

	let defOptions = { isRegular: true, hugeFont: true, szPic: { w: 200, h: 200 }, gap: 15, dArea: dArea, fzText: 24, fzPic: 96, ifs: ifs, handler: handler };

	copyKeys(defOptions, options);
	_extendOptions(options); console.log(options);

	let items = Pictures = genItemsFromKeys(keys, options); console.log('items', items, 'rect', w, h);
	if (isdef(labels)) {
		options.showLabels = true;
		for (let i = 0; i < items.length; i++) item[i].label = labels[i % labels.length];
	}
	//items.map(x => makeItemDiv(x, options));	

	present00(items, options);
	dArea.style.height = null;

	// [options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSizeWH(items, w, h, options);
	// console.log('present00: rows', options.rows, 'cols', options.cols);

	// _setRowsColsSize(options);
	// makeItemDivs(items, options);
	// let dGrid = mDiv(options.dArea, { gap: options.gap, layout: 'g_' + options.cols, fz: 2, padding: options.gap }, getUID());
	// for (const item of items) { mAppend(dGrid, iDiv(item)); }

	// // items.map(x => mAppend(dTable, iDiv(x)));

	return items;
}
function myPresent2(dArea, items, options) {
	present00(items, options);	//dArea.style.height = null;
	mStyleX(dArea, { h: 'auto', bg: 'red' });
}
function myShowPics3(handler, ifs = {}, options = {}, keys, labels) {
	//O
	options = getOptionsNoArea(dTable, handler, window.innerWidth - 180, window.innerHeight - 220);
	//I
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	let items = Pictures = genItemsFromKeys(keys, options);
	if (isdef(labels)) {
		options.showLabels = true;
		for (let i = 0; i < items.length; i++) item[i].label = labels[i % labels.length];
	}
	//A
	mRemove(options.dArea)
	let dArea = dTable; //options.dArea; //let rect = getRect(dArea); console.log('items', items, 'rect', rect.w, rect.h);
	//L
	//myPresent2(dArea,items,options);
	myPresent(dArea, items, options);


	return items;

}



function getGameValues(user, game, level) {
	//console.log(user,game,level)
	let di = { numColors: 1, numRepeat: 1, numPics: 1, numSteps: 1, trials: G.trials, colors: ColorList }; // general defaults
	let oGame = lookup(DB.games, [game]);
	if (isDict(oGame)) {
		di = mergeOverride(di, oGame); //das ist die entry in settings.yaml
		let levelInfo = lookup(di, ['levels', level]); //das sind specific values for this level
		if (isdef(levelInfo)) { di = mergeOverride(di, levelInfo); }
	}
	if (nundef(di.numLabels)) di.numLabels = di.numPics * di.numRepeat * di.numColors;
	delete di.levels;
	delete di.color;
	copyKeys(di, G);
	//console.log('di', di, '\nlevelInfo', levelInfo, '\nG', G);
	//console.log(di,G)

}
function makeItemDiv_Copy(item, options) {

	//console.log('item',item,'options',options)

	if (isdef(options.outerStyles) && isdef(options.ifs)) copyKeys(item, options.outerStyles, {}, Object.keys(options.ifs)); //options.ifs contains per item dynamic styles!!!!!
	//console.log('item.id',item.id,item)
	let dOuter = mCreate('div', options.outerStyles, item.id);

	if (isdef(item.textShadowColor)) {
		let sShade = '0 0 0 ' + item.textShadowColor;
		if (options.showPic) {
			options.picStyles['text-shadow'] = sShade;
			options.picStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
		} else {
			options.labelStyles['text-shadow'] = sShade;
			options.labelStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
		}
	}

	let dLabel;
	if (options.showLabels && options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

	let dPic;
	if (options.showPic) {
		dPic = mDiv(dOuter, { family: item.info.family });
		dPic.innerHTML = item.info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);
	}

	if (options.showLabels && options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

	if (isdef(options.handler)) dOuter.onclick = options.handler;

	iAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });

	if (isdef(item.textShadowColor)) { applyColorkey(item, options); } //brauch ich garnicht?!?!?!?!?
	return dOuter;

}


//#region refactor settings
function initSettings(game) {
	Settings = mergeOverride(DB.settings, U.settings);
	delete Settings.games;
	let gsSettings = lookup(U, ['games', game, 'settings']);
	if (isdef(gsSettings)) Settings = mergeOverride(Settings, gsSettings);
	updateSettings();

}



//#region vorher
function getItemsCat_dep(n, cat) {
	let keys = KeySets.all;
	keys = KeySets.all.filter(x => firstCond(Syms[x].cats, x => x.includes(cat)));
	keys = choose(keys, n)
	return getItems(keys);
}



//#region join all syms
function joinAllSyms() {
	let oldSyms = await localOrRoute('oldSyms', '../assets/syms.yaml');
	for (const k in oldSyms) {
		if (isdef(Syms[k])) continue;
		Syms[k] = oldSyms[k];
	}
	downloadAsYaml(Syms, 'Syms');
}


class SolitaireClass {
	constructor(dParent) {
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

async function _start_dep() {
	console.log(ByGroupSubgroup); let keys = getGSG('sport'); console.log('keys', keys);

	//erstmal: unvertraegliche combis
	let doNotCombineGroups = [
		['Animals & Nature', 'Food & Drink'],
		['Activities', 'People & Body'],
		['Activities', 'Objects'],
		['People & Body', 'Smileys & Emotion'],

	];
	let doNotCombineSubgroups = [
		['arts & crafts', 'book-paper', 'writing', 'tool', 'event'],
		['sport', 'person-sport', 'game', 'event'],
		['music', 'musical-instrument'],
		['plant-flower', 'plant-other'],

	];


}
async function _start_dep() {

	//getCatSets();
	//await loadGroupsAndCategories();
	//let keysByGroupAndSubgroup = ByGroupSubgroup = res[1];

	console.log(ByGroupSubgroup);

	//let k1=getKeysIn('Activities','sport'); console.log('k1',k1)

	let keys = getGSG('sport');
	console.log('keys', keys);

	// let cats = getRandomCats(3);
	// console.log(cats);
	// let dictDisjoint=calcDisjunctKeysets();
	// let areDisjoint=true;
	// for(const k1 of cats.map(x=>x.key)){
	// 	for(const k2 of cats.map(x=>x.key)){
	// 		if (k1 == k2) continue;
	// 		if (!dictDisjoint[k1][k2]){
	// 			areDisjoint = false;
	// 			console.log('these sets are NOT disjoint:',k1,k2);
	// 		} 
	// 	}
	// }
	// console.log('result:',cats.keys,'are disjoint:',areDisjoint);
	// console.log('lists:',cats.list)
	// //
	// //how can I find 3 different cats that are mutually disjoint?
	// //
	return;


	createSubtitledPage('seagreen');

	revealMain();
	//[items, options] = samplePicsAndText(); //sample00(); //ok! 
	// let app = new ItemViewerClass(dTable, dTitleLeft);//, ['abacus', 'bee', 'fly', 'amphora']); //ok!
	solCats();

	downloadAsText(Categories, 'cats');



	//KOMISCH ABER GEHT! [items,options] = sample_regular_uniform_grid_fill()
	//BROKEN!!! [items,options] = sample_fill_area_flex_uniform(47); 
	//BROKEN!!! [items,options] = sample_fill_area_flex_non_uniform(47);
	//setTimeout(() => nachbearbeitung(items, options), 10);

	//BROKEN!!! cycleThroughTestsOnClick(); return;
	// testOnClick(sample_idealGridLayout_try2); return; //ok, aber hupft herum!
}


//#region cats
function getRandomCats(n) {
	const catGroups = {
		catsAnimals: { amphibian: 'animal-amphibian', bird: 'animal-bird', insect: 'animal-bug', mammal: 'animal-mammal', marine: 'animal-marine', reptile: 'animal-reptile', },
		catsOther: {
			weather: 'weather', sound: 'sound', travel: 'travel',
			award: 'award-medal', body: 'body-parts', book: 'book-paper', food: 'food', hands: 'hands', hotel: 'hotel', sport: 'person-sport',
		},
		catsVocab: { life: 'life', object: 'object', objects: 'objects', },
		catsFoodDrink: { fruit: 'food-fruit', vegetable: 'food-vegetable', dessert: 'food-sweet', drink: 'drink', },
		catsObjects: {
			art: 'arts-crafts',
			clothing: 'clothing', household: 'household',
			lock: 'lock',
			mail: 'mail',
			medical: 'medical',
			money: 'money',
			music: 'musical-instrument',
			office: 'office',
			computer: 'computer',
			dishware: 'dishware', hotel: 'hotel', game: 'game', phone: 'phone', science: 'science',
		},
		cats1: {
			art: 'arts-crafts', body: 'body-parts', book: 'book-paper', clothing: 'clothing', computer: 'computer', object: 'object',
			objects: 'objects', household: 'household',
			lock: 'lock',
			mail: 'mail',
			medical: 'medical',
			money: 'money',
			music: 'musical-instrument',
			office: 'office', phone: 'phone', science: 'science',
		},
		cats2: {
			animal: 'animals-nature', emotion: 'smileys-emotion', face: 'face', hand: 'hand', building: 'place-building',
			place: 'place', weather: 'weather', travel: 'travel',
			map: 'place-map',
		},
		cats3: {
			action: 'action', drink: 'drink', food: 'food', fruit: 'food-fruit', role: 'person-role', plant: 'plant',
			sport: 'person-sport', role: 'person-role',
			vegetable: 'food-vegetable',
			dessert: 'food-sweet',
		},
		catsBest: {
			action: 'action',
			animal: 'animals-nature',
			art: 'arts-crafts',
			clothing: 'clothing',
			computer: 'computer',
			dishware: 'dishware',
			drink: 'drink',
			emotion: 'smileys-emotion',
			fruit: 'food-fruit',
			vegetable: 'food-vegetable',
			dessert: 'food-sweet',
			game: 'game',
			hand: 'hand',
			household: 'household',
			lock: 'lock',
			mail: 'mail',
			medical: 'medical',
			money: 'money',
			music: 'musical-instrument',
			office: 'office',
			role: 'person-role',
			phone: 'phone',
			building: 'place-building',
			place: 'place',
			map: 'place-map',
			plant: 'plant',
			science: 'science',
			sound: 'sound',
			sport: 'sport',
			tool: 'tool',
			transport: 'transport',
			writing: 'writing',
		},
	};
	let list = Object.keys(catGroups.catsBest);
	let nRandom = choose(list, n);
	let res = [];

	for (const catName of nRandom) {
		let list, realKey;
		for (const k in KeySets) {
			if (k.includes(catName)) { list = KeySets[k]; realKey = k; break; }
		}
		res.push({ cat: catName, friendly: getFriendlyByCat(catName), key: realKey, list: list });
	}
	return res;
}



//#endregion

//#region safe for all code fuer DD solitaire
function dropHandler_dep(source, target, isCopy = true) {
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
function solCats_dep() {
	//OIL for category boxes
	clearElement(dTable);
	let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
	let i = 0;
	let containers = [];
	for (const cat of ['animals', 'sport', 'transport']) {
		let cont = mTitledDiv(cat, dArea, { w: 150, h: 300, bg: 'random', rounding: 12, display: 'inline-block', margin: 12 },
			{}, 'c' + i);
		i += 1;
		containers.push(cont);
	}
	mLinebreak(dArea);
	i = 0;
	let objects = [];
	for (const cat of ['horse', 'soccer', 'bird']) {
		let o = mTitledDiv(cat, dArea, { bg: 'random', rounding: 12, display: 'inline-block', padding: 4, margin: 12 },
			{}, 'i' + i);
		i += 1;
		objects.push(o.parentNode);
	}

	enableDD(objects, containers, dropHandler, false);


	//items 1: need 3 category items: just 3 boxes


}

var DragElem = null; //is the clone of HTML element from which drag started
var DDInfo = null;
function addDDSource(source, isCopy = true) {
	DDInfo.sources.push(source);
	let d = getDiv(source);
	d.onmousedown = (ev) => ddStart(ev, source, isCopy);
}
function enableDD(sources, targets, dropHandler, isCopy) {
	DDInfo = { sources: sources, targets: targets, dropHandler: dropHandler };
	let sourceDivs = getDivs(sources);
	for (let i = 0; i < sources.length; i++) {
		let source = sources[i];
		let d = sourceDivs[i];
		d.onmousedown = (ev) => ddStart(ev, source, isCopy);
	}
}
function canAct() { return true; }
function ddStart(ev, source, isCopy = true) {
	if (!canAct()) return;
	ev.preventDefault();

	//console.log('ev',ev,'source',source);

	DDInfo.source = source;
	let d = getDiv(source);
	var clone = DragElem = DDInfo.clone = d.cloneNode(true);
	// clone.eliminateSource = !isCopy;
	clone.isCopy = isCopy;
	mAppend(document.body, clone);//mClass(clone, 'letter')
	mClass(clone, 'dragelem');//der clone muss class 'dragelem' sein
	mStyleX(clone, { left: ev.clientX - ev.offsetX, top: ev.clientY - ev.offsetY });//der clone wird richtig plaziert
	clone.drag = { offsetX: ev.offsetX, offsetY: ev.offsetY };
	// von jetzt an un solange DragElem != null ist muss der clone sich mit der maus mitbewegen
	document.body.onmousemove = onMovingCloneAround;
	document.body.onmouseup = onReleaseClone;// ev=>console.log('mouse up')
}
function onMovingCloneAround(ev) {
	if (DragElem === null) return;

	let mx = ev.clientX;
	let my = ev.clientY;
	let dx = mx - DragElem.drag.offsetX;
	let dy = my - DragElem.drag.offsetY;
	mStyleX(DragElem, { left: dx, top: dy });
}
function getDiv(x) { if (isdef(x.div)) return x.div; else return x; }
function getDivs(list) {
	if (isdef(list[0].div)) return list.map(x => x.div); else return list;
}
function onReleaseClone(ev) {
	let els = allElementsFromPoint(ev.clientX, ev.clientY);
	//console.log('_________',els);
	let source = DDInfo.source;
	let dSource = getDiv(source);
	let dropHandler = DDInfo.dropHandler;
	for (const target of DDInfo.targets) {
		let dTarget = getDiv(target);
		if (els.includes(dTarget)) {
			if (isdef(dropHandler)) {
				dropHandler(source, target, DragElem.isCopy);
			} else console.log('dropped', source, 'on', target);
			//console.log('yes, we are over',dTarget);
			// dTarget.innerHTML = DragElem.innerHTML;

		}
	}
	//destroy clone
	//if (DragElem.eliminateSource) dSource.remove();
	DragElem.remove();
	DragElem = null;
	//DDInfo = null;
	document.body.onmousemove = document.body.onmouseup = null;
}




//#endregion


function genItems(n, options) {
	//console.log(n,options.maxlen)
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);
	calcLongestLabel(items, options);

	//hier koennt ich die ifs machen!
	let ifs = options.ifs;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		item.index = i;
		//item.ifs = jsCopy(options.ifs);
		let val;
		for (const propName in ifs) {
			let prop = ifs[propName];
			//console.log('___________',ifs[propName])
			//console.log('TYPE OF', propName, 'IS', typeof prop, prop, isLiteral(prop))
			if (isLiteral(prop)) val = prop;
			else if (isList(prop)) val = prop[i % prop.length];
			else if (typeof (prop) == 'function') val = prop(i, item, options, items);
			else val = null;
			if (isdef(val)) item[propName] = val;
			//console.log('ifs prop:',propName,item[propName]);
		}
	}

	if (options.repeat > 1) { items = zRepeatEachItem(items, options.repeat, options.shufflePositions); }
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);

	options.N = items.length;
	console.log(items)
	return items;
}


function sample_idealGridLayout_orig(showLabels = true, showPic = true) {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, null, 100, 70, getUID());

	let n = 30;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen = n > 24 ? 9 : 15;
	let options = { shufflePositions: true, repeat: 2, szPic: { w: 200, h: 100 }, showLabels: showLabels, showPic: showPic, percentVertical: 30, maxlen: maxlen, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + options.N;

	console.log('items', items, '\noptions', options);
	//return [items,options];

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	console.log('rows', options.rows, 'cols', options.cols);
	_setRowsColsSize(options);
	makeItemDivs(items, options);

	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());

	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	let fzMax, fpMax;
	if (options.showLabels) {
		// fzMax = Math.floor(idealFontsize(options.longestLabel, wi - 2 * Math.ceil(options.padding), hi, 24).fz);
		fzMax = Math.floor(idealFontsize(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
		fpMax = options.showPic ? Math.min(hi / 2, wi * 2 / 3, hi - fzMax) : 0;
	} else { fzMax = 1; fpMax = options.showPic ? Math.min(hi * 2 / 3, wi * 2 / 3) : 0; }
	//let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	console.log('===>pad', options.padding, 'wi', wi, idealFontsize(options.longestLabel, wi, hi, 24));
	console.log('====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel, options.wLongest);

	options.fzPic = options.picStyles.fz = fpMax; //Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = fzMax; // Math.floor(fz);
	options.szPic = { w: wi, h: hi };

	for (const item of items) {
		let ui = lGet(item);
		mStyleX(ui.div, { wmin: wi, hmin: hi, padding: 0 });
		// mStyleX(ui.dPic, { fz: hi/2 }); 
		if (isdef(ui.dPic)) mStyleX(ui.dPic, { fz: fpMax });
		if (isdef(ui.dLabel)) mStyleX(ui.dLabel, { fz: fzMax });
	}
	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		console.log('OVERFLOWN!!!!!!!!!!!! vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontsize(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		console.log('fonts set to', fz, fzPic);
		console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}


	return [items, options];
}
function sample_idealGridLayout_try1(showLabels = true, showPic = false) {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, null, 100, 70, getUID());

	let n = 20;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen = n > 24 ? 9 : 15;
	let options = { shufflePositions: true, repeat: 2, szPic: { w: 200, h: 100 }, showLabels: showLabels, showPic: showPic, percentVertical: 30, maxlen: maxlen, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);

	let ifs = options.ifs = {};
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	//let fg = (i, item) => item.bg == 'random'?'contrast': colorIdealText(item.bg);
	let defIfs = { bg: bg }; //, fg: fg, contrast: .32, fz: 20, padding: 3 };
	let defOptions = { shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1 };
	addKeys(defIfs, ifs);
	addKeys(defOptions, options);

	//console.log('options',options);

	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + options.N;

	//console.log('items', items, '\noptions', options);
	//return [items,options];

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	//console.log('rows', options.rows, 'cols', options.cols);
	_setRowsColsSize(options);
	makeItemDivs(items, options);

	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());

	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	let fzMax, fpMax;
	if (options.showLabels) {
		// fzMax = Math.floor(idealFontsize(options.longestLabel, wi - 2 * Math.ceil(options.padding), hi, 24).fz);
		fzMax = Math.floor(idealFontsize(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
		fpMax = options.showPic ? Math.min(hi / 2, wi * 2 / 3, hi - fzMax) : 0;
	} else { fzMax = 1; fpMax = options.showPic ? Math.min(hi * 2 / 3, wi * 2 / 3) : 0; }
	//let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	//console.log('===>pad', options.padding, 'wi', wi, idealFontsize(options.longestLabel, wi, hi, 24));
	//console.log('====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel, options.wLongest);

	options.fzPic = options.picStyles.fz = fpMax; //Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = fzMax; // Math.floor(fz);
	options.szPic = { w: wi, h: hi };

	for (const item of items) {
		let ui = lGet(item);
		mStyleX(ui.div, { wmin: wi, hmin: hi, padding: 0 });
		// mStyleX(ui.dPic, { fz: hi/2 }); 
		if (isdef(ui.dPic)) mStyleX(ui.dPic, { fz: fpMax });
		if (isdef(ui.dLabel)) mStyleX(ui.dLabel, { fz: fzMax });
	}
	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		console.log('OVERFLOWN!!!!!!!!!!!! vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontsize(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		console.log('fonts set to', fz, fzPic);
		console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}


	return [items, options];
}


//from live.js:
function lAdd(item, uis, other) {
	let id = isString(item) ? item : item.id;
	let l = Live[id];


	if (isdef(other)) copyKeys(other, l);
	for (const k in uis) { l[k] = uis[k]; l.addUi(uis[k]); }
}


function sample_regular_uniform_grid_fill_vCenter_WORK() {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 70, getUID());

	let n = 30;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen = n > 24 ? 9 : 15;
	let options = { percentVertical: 30, maxlen: maxlen, szPic: { w: 200, h: 200 }, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	console.log('rows', options.rows, 'cols', options.cols);
	_setRowsColsSize(options);
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());
	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	// let fzMax = Math.floor(idealFontsize(options.longestLabel, wi-2*options.padding, hi, 24).fz);
	let fzMax = Math.floor(idealFontsize(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
	console.log('===>pad', options.padding, 'wi', wi, idealFontsize(options.longestLabel, wi, hi, 24));
	let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	console.log('=====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel);

	options.fzPic = options.picStyles.fz = fpMax; //Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = fzMax; // Math.floor(fz);
	options.szPic = { w: wi, h: hi };

	for (const item of items) {
		let ui = lGet(item);
		mStyleX(ui.div, { wmin: wi, hmin: hi });
		// mStyleX(ui.dPic, { fz: hi/2 }); 
		mStyleX(ui.dPic, { fz: fpMax });
		mStyleX(ui.dLabel, { fz: fzMax });
	}
	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		console.log('vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontsize(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		console.log('fonts set to', fz, fzPic);
		console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}


	return [items, options];
}



function _correctFlexGrid(items, options, dGrid) {
	return;
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	//console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {
		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		//console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let n1 = Math.floor(others.length > 50 ? others.length / 5 : others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
			if (p < 1) break;
		}

		while (isOverflown(dGrid)) {
			console.log('hallo')
			let tx = 1, px = 0;
			_reduceFontsBy(tx, px, items, options);
			if (options.fzText < 4) break;
		}
	}

}
function _makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', border: '5px solid green', box: true
	});
	//for (const it of items) { mStyleX(lDiv(it), { flex: '0 0' }); }
	//setTimeout(() => _correctFlexGrid(items, options, dGrid), 10);
}
// BROKEN!!!

function sample_fill_area_flex_uniform(N) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 200, h: 100 }, isRegular: false, isUniform: true, fillArea: true };
	_extendOptions_0(dArea, options);

	//console.log('fzPic',options.fzPic,'fz',options.fzText);

	let n = isdef(N) ? N : chooseRandom(range(1, 50)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	// let f = getFitting(items, options);
	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	//console.log('fzPic',options.fzPic,'fz',options.fzText);
	// options.outerStyles.h=options.szPic.h;
	// options.outerStyles.w=options.szPic.w;
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	options.szPic = { w: options.area.w / options.cols, h: options.area.h / options.rows };
	//console.log('fonts vor set', options.fzPic, options.fzText);
	_setRowsColsSize(options);
	//console.log('fonts nach set', options.fzPic, options.fzText);
	for (const item of items) {
		let live = lGet(item);
		if (options.isUniform) {
			mStyleX(live.div, { w: options.szPic.w, h: options.szPic.h, margin: options.gap / 2, padding: options.padding / 2 });
		} else {
			mStyleX(live.div, { margin: options.gap / 2, padding: options.padding });

			//es gibt noch mehr platz!
			//versuche zu grown!
		}
		mStyleX(live.dLabel, { fz: options.fzText });
		mStyleX(live.dPic, { fz: options.fzPic });
	}


	_makeFlexGrid(items, options, dGrid);

	//console.log('options', options)
	//console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	//console.log('============>SUM', options.labelSum);
}


//#region helpers.js aus ZAZ
function adjustToItemSize(options, w, h, wfix, hfix, adjustFont = true) {
	//wfix... no/undef,min,max,yes =>outerStyles.wmin,wmax,w or dont set it
	options.szPic.w = w;
	if (isdef(h)) options.szPic.h = h; else h = options.szPic.h; //h unchanged!
	if (isdef(wfix)) {
		if (wfix == 'min') options.outerStyles.wmin = w;
		else if (wfix == 'max') options.outerStyles.wmax = w;
		else options.outerStyles.w = w;
	}
	if (isdef(hfix)) {
		if (hfix == 'min') options.outerStyles.hmin = options.szPic.h;
		else if (hfix == 'max') options.outerStyles.hmax = options.szPic.h;
		else options.outerStyles.h = options.szPic.h;
	}
	if (adjustFont && isdef(wfix) && wfix != 'min') {
		//text font has to be ok for longest label

		let wn = w - options.minPadding * 2;
		let hn = h - options.minPadding * 2;

		console.log('w', w, 'wn', wn, 'h', h, 'hn', hn)

		let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
		let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

		if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

		fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);


		console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

		options.fzPic = options.picStyles.fz = Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	}

}
function extendOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	_extendOptions_0(dArea, options, defOptions);
}
function getOptionsSize(dArea, options = {},) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	return _extendOptions_0(dArea, options, defOptions);
}

function getOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	return _extendOptions_0(dArea, options, defOptions);
}




function getOptionsFixedPicSize(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		maxlen: 14, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	options.fzText = options.showLabels ? 20 : 0;
	options.fzPic = options.showLabels ? 60 : 70;

	options = _extendOptions_0(dArea, options, defOptions);

	options.outerStyles = mergeOverride(options.outerStyles,
		{ w: options.szPic.w, h: options.szPic.h });

	return options;
}


//#region layout.js
function _makeGridGrid(items, options, dGrid) {
	//code grid layout:
	mStyleX(dGrid, {
		display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
}
function makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', gap: options.gap, border: '5px solid red', box: true
	});
	for (const it of items) { mStyleX(lDiv(it), { flex: '1' }); }
	setTimeout(() => correctFlexGrid(items, options, dGrid, false), 10);
}
function correctFlexGrid(items, options, dGrid, done) {
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	//console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {

		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		//console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let n1 = Math.floor(others.length > 50 ? others.length / 5 : others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		//console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			//console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		}
		if (!done) setTimeout(() => correctFlexGrid(items, options, dGrid, true), 10);
	}

}
function makeNoneGrid(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }
	mStyleX(dGrid, { border: '5px solid blue', box: true })
	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		//console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		//console.log('options',options.fzPic,options)
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		let newGap = Math.ceil(options.gap / 2);
		while (ov > 0) {

			//let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			//let newGap = Math.ceil(Math.max(1, options.gap / 2 - pad));
			//console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) { mStyleX(lDiv(it), { fz: 4, margin: newGap, padding: newGap / 2, rounding: 0 }); }
			ov = getVerticalOverflow(dGrid);
			if (ov && newGap == 1) {
				for (const it of items) { mStyleX(lDiv(it), { margin: 0, padding: 0 }); }
				break;
			}
			newGap = Math.ceil(newGap / 2);
		}

	}
}
function calcRowsCols(num, rows, cols) {
	//=> code from RSG testFactory arrangeChildrenAsQuad(n, R);
	//console.log(num, rows, cols);
	const table = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
	};
	let shape = 'rect';
	if (isdef(rows) && isdef(cols)) {
		//do nothing!
	} else if (isdef(table[num])) {
		return table[num];
	} else if (isdef(rows)) {
		cols = Math.ceil(num / rows);
	} else if (isdef(cols)) {
		rows = Math.ceil(num / cols);
	} else if (num == 2) {
		rows = 1; cols = 2;
	} else if ([4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 49, 56, 64].includes(num)) {
		rows = Math.floor(Math.sqrt(num));
		cols = Math.ceil(Math.sqrt(num));
	} else if ([3, 8, 15, 24, 35, 48, 63].includes(num)) {
		let lower = Math.floor(Math.sqrt(num));
		console.assert(num == lower * (lower + 2), 'RECHNUNG FALSCH IN calcRowsCols');
		rows = lower;
		cols = lower + 2;
	} else if (num > 1 && num < 10) {
		shape = 'circle';
	} else if (num > 16 && 0 == num % 4) {
		rows = 4; cols = num / 4;
	} else if (num > 9 && 0 == num % 3) {
		rows = 3; cols = num / 3;
	} else if (0 == num % 2) {
		rows = 2; cols = num / 2;
	} else {
		rows = 1; cols = num;
	}
	//console.log(rows, cols, shape);
	return { rows: rows, cols: cols, recommendedShape: shape };
}
function calcRowsColsSize(n, wCont, hCont, percentGap = 10, rows = null, cols = null, wpMin = 50, hpMin = 50, wpMax = 200, hpMax = 200) {
	let dims = calcRowsCols(n, rows, cols);
	if (dims.rows < dims.cols && wCont < hCont) { let hlp = dims.rows; dims.rows = dims.cols; dims.cols = hlp; }
	let hpic = hCont / dims.rows;
	let wpic = wCont / dims.cols;

	let gap = options.gap = Math.min(wpic, hpic) * percentGap / 100;
	wpic -= gap * 1.25; hpic -= gap * 1.25;

	wpic = Math.max(wpMin, Math.min(wpic, wpMax));
	hpic = Math.max(hpMin, Math.min(hpic, hpMax));
	return [wpic, hpic, gap, dims.rows, dims.cols];
}


//#region fitting.js
function getFitting(items, options) {

	let mimi = arrMinMax(items, x => x.label.length);
	let longestLabelLen = options.longestLabelLen = mimi.max;
	options.indexOfLongestLabelItem = mimi.imax;

	let n = items.length; let res = n > 3 ? getSLCombis(n) : [{ s: 1, l: n }];
	let best = bestRowsColsCombinedRatio(items, options, res); //must use options.sizingPriority!!!

	let cols = options.cols = best.cols;
	let rows = options.rows = best.rows;
	//console.log('best combi',best);

	let idealGap = .1;
	let wb = Math.min(options.area.w / cols, 400);
	let hb = Math.min(options.area.h / rows, 400);

	let gap = options.gap = Math.min(wb, hb) * idealGap;
	wb -= gap * 1.25; hb -= gap * 1.25;

	let fzText1, fzPic1;
	if (isdef(options.longestLabelLen)) fzText1 = (wb / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7);
	else fzText1 = 0;

	fzPic1 = Math.min(wb / 1.3, (hb - fzText1 * 1.2) / 1.3);

	if (fzPic1 < fzText1 * 2) { fzText1 = Math.floor(hb / 4); fzPic1 = fzText1 * 2; }
	//else if (fzPic1 > fzText1 * 4) { fzPic1 = Math.floor(Math.min(hb - fzText1 * 1.5, fzText1 * 3)); }

	options.fzText = options.labelStyles.fz = Math.min(40, fzText1);
	options.fzPic = options.picStyles.fz = Math.min(160, fzPic1);
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };
	options.isRegular = rows * cols == items.length;
	options.isCrowded = options.gap < 3;
	return fitting;
}
function bestRowsColsCombinedRatio(items, options, res) {
	let wa = options.area.w, ha = options.area.h, wp = options.szPic.w, hp = options.szPic.h;
	let aRatio;
	let rows, cols;
	cols = wa / wp;
	rows = ha / hp;
	//console.log('====>', rows, cols)
	aRatio = cols < rows ? cols / rows : rows / cols;
	options.or = cols < rows ? 'P' : 'L';
	//console.log('options.or', options.or);
	let rmin = 20000, best;
	for (const r of res) {
		let rnew = Math.abs(aRatio - r.s / r.l);
		if (rnew < rmin) { rmin = rnew; best = r; }
	}
	if (options.or == 'P') { rows = best.l; cols = best.s; } else { rows = best.s; cols = best.l; }

	//console.log('=>rows', rows, 'cols', cols, res);
	return { rows: rows, cols: cols };
}
function prepDims(items, options) {
	//console.log('rows',options.rows,'n',items.length)
	let [sz, rows, cols] = calcRowsColsSize(items.length, options.rows, options.cols);
	//console.log('picSz=' + sz, 'options.sz', options.sz,'rows',rows,'cols',cols)
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = sz);
}
function bestRowsColsWFit(n = 24, area) {
	let combis = getSLCombis(n, true);
	combis.map(x => console.log(x));

	//how many fit in width?
	defOptions = { percentGap: 5, szPic: { w: 100, h: 100 }, w: 800 };
	for (const k in defOptions) {
		if (nundef(options[k])) options[k] = defOptions[k];
	}

	let maxcols = 0, maxrows = 0, wn = options.szPic.w, hn = options.szPic.h, wb, hb, gpix;
	while (maxcols * maxrows < n) {
		gpix = Math.round(wn * options.percentGap / 100);
		options.gap = gpix;
		wb = wn + gpix;
		hb = hn + gpix;

		maxcols = Math.floor(options.w / wb);
		maxrows = Math.floor(options.area.h / hb);
		if (maxcols * maxrows < n) {
			wn *= .9;
			hn *= .9;

		}

	}
	options.szPic = { w: wn, h: hn };

	console.log('maxcols', maxcols, options.w, '\nmaxrows', maxrows, options.area.h, '\nszPic', options.szPic, wb, 'gap', gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function bestRowsColsWFit1(n = 24, options) {
	let combis = getSLCombis(n, true);
	combis.map(x => console.log(x));

	//how many fit in width?
	defOptions = { percentGap: 5, szPic: { w: 100, h: 100 }, w: 800 };
	for (const k in defOptions) {
		if (nundef(options[k])) options[k] = defOptions[k];
	}

	let maxcols = 0, maxrows = 0, wn = options.szPic.w, hn = options.szPic.h, wb, hb, gpix;
	while (maxcols * maxrows < n) {
		gpix = Math.round(wn * options.percentGap / 100);
		options.gap = gpix;
		wb = wn + gpix;
		hb = hn + gpix;

		maxcols = Math.floor(options.w / wb);
		maxrows = Math.floor(options.area.h / hb);
		if (maxcols * maxrows < n) {
			wn *= .9;
			hn *= .9;

		}

	}
	options.szPic = { w: wn, h: hn };

	console.log('maxcols', maxcols, options.w, '\nmaxrows', maxrows, options.area.h, '\nszPic', options.szPic, wb, 'gap', gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function getSLCombis(n, onlyRegular = false, addColsRows_cr = false) {
	let sq = Math.ceil(Math.sqrt(n));
	let res = [];
	for (let i = 1; i <= sq; i++) {
		let s = i;
		let l = Math.ceil(n / s);
		if (s <= l && s * l >= n) res.push({ s: s, l: l });
	}
	//console.log('res',res)
	if (onlyRegular) res = res.filter(x => x.s * x.l == n);

	if (addColsRows_cr) {
		let resX = [];
		for (const res1 of res) {
			resX.push({ rows: res1.s, cols: res1.l, s: res1.s, l: res1.l, sum: res1.s + res1.l });
			if (res1.s != res1.l) resX.push({ rows: res1.l, cols: res1.s, s: res1.s, l: res1.l, sum: res1.s + res1.l });
		}
		sortBy(resX, 'rows');
		sortBy(resX, 'sum');

		return resX;
	}

	return res;
}

//#endregion

function makeFlexGrid1(items, options, dGrid) {
	//code flex layout

	mStyleX(dGrid, {
		display: 'flex',// 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'column wrap', gap: options.gap, border: '5px solid red', box: true
	});
	//for (const it of items) { mStyleX(lDiv(it), { flex: '1 0 auto' }); }
	//setTimeout(() => correctFlexGrid1(items, options, dGrid, false), 10);
}
function correctFlexGrid1(items, options, dGrid, done) {
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	//console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {

		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		//console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let n1 = Math.floor(others.length > 50 ? others.length / 5 : others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		//console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			//console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		}
		if (!done) setTimeout(() => correctFlexGrid(items, options, dGrid, true), 10);
	}

}
function getFitting1(items, options) {

	let n = items.length; let res = n > 3 ? getSLCombis(n) : [{ s: 1, l: n }];
	//let best = bestRowsColsCombinedRatio(items, options, res); //must use options.sizingPriority!!!
	let best = _bestRowsColsFill(items, options);

	let cols = options.cols = best.cols;
	let rows = options.rows = best.rows;
	//console.log('best combi',best);

	let idealGap = .1;
	let wb = Math.min(options.area.w / cols, 400);
	let hb = Math.min(options.area.h / rows, 400);

	let gap = options.gap = Math.min(wb, hb) * idealGap;
	wb -= gap * 1.25; hb -= gap * 1.25;

	let fz, fzPic;
	fz = hb / 4;
	fzPic = fz * 3;

	// if (isdef(options.longestLabelLen)) fzText1 = (wb / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7);
	// else fzText1 = 0;

	// fzPic1 = Math.min(wb / 1.3, (hb - fzText1 * 1.2) / 1.3);

	// if (fzPic1 < fzText1 * 2) { fzText1 = Math.floor(hb / 4); fzPic1 = fzText1 * 2; }

	options.fzText = options.labelStyles.fz = fz; //Math.min(36, fzText1);
	options.fzPic = options.picStyles.fz = fzPic; //Math.min(160, fzPic1);
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };
	options.isRegular = rows * cols == items.length;
	options.isCrowded = options.gap < 3;
	return fitting;
}
function getOptionsFillContainer(dArea, szPic, fzPic, lang, fzText, luc, labelPos = 'bottom', minPadding = 0, minGap = 1, uniform = true) {
	let options = { area: getRect(dArea) };
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(fzText)) {
		//labels are present!
		options.showLabels = true;
		if (labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: fzText };
		if (nundef(fzPic)) fzPic = Math.floor(fzText * 4 * (luc == 'u' ? .7 : .6)); //taking 4 as min word length
	} else if (nundef(fzPic)) fzPic = 30;
	options.picStyles = { fz: fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true
	};

	//infer szPic if not given!
	if (nundef(szPic)) {
		if (isdef(fzText)) {
			//dann hab ich auch fzPic!!!
			let h = fzText * 1.14 + fzPic * 1.15 + minPadding * 2;
			//let w=

		}
	}
	options.szRatio = szPic.w / szPic.h;

	return options;
}

function zazTest11() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true, padding: 0, };
	_extendOptions_0(dArea, options);

	let n = chooseRandom(range(1, 50)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	let f = getFitting1(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	makeFlexGrid1(items, options, dGrid);

	// if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	// else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	// else _makeNoneGrid(items, options, dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

//this one works!
function zazTest10_fillNone() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions_0(dArea, options);

	let n = chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	_makeNoneGrid(items, options, dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('============>SUM', options.labelSum);
}

function zazTest10() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions_0(dArea, options);

	let n = chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	// options = getOptionsFillContainer(dArea, arguments[1]);
	// options.isRegular=false;
	// options.isUniform = false;
	// options.fillArea = true;

	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else _makeNoneGrid(items, options, dGrid); //best if not regular
	// else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	// else _makeFlexGrid(items, options, dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest08_fillArea_BROKEN() {
	// let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	let n = 117;// chooseRandom([2, 3, 4, 6]);
	dTitle.innerHTML = 'N=' + n;

	let dArea = getMainAreaPercent(dTable, 'random', 80, 80); //getMainAreaPadding(dTable, 2, 'silver');
	dArea.id = 'dArea';
	let options = getOptionsFillContainer(dArea);

	console.log(options)

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) {
		//_makeGridGrid(items, options, dGrid); //best if have reg option
		mStyleX(dGrid, {
			display: 'grid', 'grid-template-columns': `repeat(${options.cols}, auto)`, gap: options.gap,
			border: '5px solid yellow', box: true
		});
	} else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

function _makeNoneGrid_vor_cleanup(items, options, dGrid) {
	options.szPic = { w: options.area.w / options.cols, h: options.area.h / options.rows };
	console.log('fonts vor set', options.fzPic, options.fzText)
	_setRowsColsSize(options);
	console.log('fonts nach set', options.fzPic, options.fzText)
	for (const item of items) {
		let live = lGet(item);
		if (options.isUniform) {
			mStyleX(live.div, { w: options.szPic.w, h: options.szPic.h, margin: options.gap / 2, padding: options.padding / 2 });
		} else {
			mStyleX(live.div, { margin: options.gap / 2, padding: options.padding });

			//es gibt noch mehr platz!
			//versuche zu grown!
		}
		mStyleX(live.dLabel, { fz: options.fzText });
		mStyleX(live.dPic, { fz: options.fzPic });
	}

	mStyleX(dGrid, { padding: 0, border: '5px solid blue', box: true })
	let ov = getVerticalOverflow(dGrid);
	console.log('overflow:', ov);
	//return;
	if (!options.isUniform) {
		console.log('in makeNoneGrid!!!')
		_tryGrow(items, options);
	}

	// let [fz,fzPic]=_sizeToFonts(options);
	// console.log('haaaaaaaaaaaaaa',options.padding,options.gap);
	// options.padding=100;options.gap=50;
	// for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.padding/2 }); }
	// mStyleX(dGrid, { border: '5px solid blue', box: true })
	// let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		console.log('overflow!', ov); return;
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		console.log('options', options.fzPic, options)
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		let newGap = Math.ceil(options.gap / 2);
		while (ov > 0) {

			//let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			//let newGap = Math.ceil(Math.max(1, options.gap / 2 - pad));
			console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) { mStyleX(lDiv(it), { fz: 4, margin: newGap, padding: newGap / 2, rounding: 0 }); }
			ov = getVerticalOverflow(dGrid);
			if (ov && newGap == 1) {
				for (const it of items) { mStyleX(lDiv(it), { margin: 0, padding: 0 }); }
				break;
			}
			newGap = Math.ceil(newGap / 2);
		}

	}
}

function sample_fill_area_v0() {

	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 200, h: 100 }, isRegular: false, isUniform: false, fillArea: true, padding: .01, };
	_extendOptions_0(dArea, options);

	let n = 117;// chooseRandom(range(1,200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsFill(items, options);
	//console.log('options', options.fzText, options.fzPic, options.szPic);
	_setRowsColsSize(options);
	//console.log('options', options.fzText, options.fzPic, options.szPic);

	let f = getFitting1(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2, padding: options.gap }, 'dGrid');
	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	// _makeGridGrid(items, options, dGrid);
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeNoneGrid(items, options, dGrid);
	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

}


function zazTest09() {
	//just options
	let options = _genOptions({ n: 24, wper: 80, hper: 80, szPic: { w: 120, h: 120 }, padding: .01, gap: .02 });

	[options.rows, options.cols] = [4, 6];

	let items = options.items;

	// let bestCombi = nu_bestRowsColsSize(items, options);
	_setRowsColsSize(options);

	makeItemDivs(items, options);
	let dGrid = mDiv(options.dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	_makeGridGrid(items, options, dGrid);

	console.log(options)
}
function zazTest07_regularUniform_givenPicSizeAndArea_minimizeGridHeight_preservePicRatio() {
	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = {
		keyset: 'lifePlus', maxlen: 18, lang: 'D', 'luc': 'c',
		szPic: { w: 200, h: 200 }, padding: .025, gap: .1, isRegular: true, isUniform: true,
	};
	let items = genItems(n, options);
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	//let d=mDiv100(dArea,{bg:'green'});	return;

	_extendOptions_0(dArea, options);

	let bestCombi = _bestRowsColsSize(items, options);
	_adjustOptionsToRowsColsSize(bestCombi, options);

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest06_maxPicSize() {
	let n = chooseRandom(range(2, 14));//[2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = { keyset: 'lifePlus', maxlen: 18, lang: 'D', 'luc': 'c', padding: .025, gap: .1, szPic: { w: 200, h: 200 } };
	let items = genItems(n, options);

	let dArea = getMainAreaPercent(dTable, null, 100, 100, 'dArea');

	extendOptions(dArea, options);
	//console.log(options)

	let f = getFitting(items, options);

	console.log('fitting', f)

	adjustToItemSize(options, 200, 200, 'max', 'max');

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
	// if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	// else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	// else makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)

	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest05() {
	let n = chooseRandom(range(2, 200, 4));//[2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	let options = getOptionsFillContainer(dArea, arguments[1]);

	console.log(options)

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)

	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest04() {

	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: chooseRandom(['C', 'S']),
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 10,
		isRegular: true,
		showLabels: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	let [wp, hp, gap, rows, cols] = calcRowsColsSize(n, options.area.w, options.area.h, percentGap = 10);
	options.gap = gap;
	let fw = wp / options.szPic.w;
	let fh = 1;

	dTitle.innerHTML = 'N=' + options.N;

	options.outerStyles.w = options.szPic.w = wp;
	if (hp < options.szPic.h) { fh = hp / options.szPic.h; options.outerStyles.h = options.szPic.h = hp; }
	options.rows = rows;
	options.cols = cols;
	let fmin = Math.min(fw, fh);
	if (fmin != 1) {
		options.labelStyles.fz = options.fzText = options.fzText * fmin;
		options.picStyles.fz = options.fzPic = options.fzPic * fmin;
	}

	// console.log('gap', options.gap)
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { border: '5px solid yellow', box: true, fz: 2 }, 'dGrid');

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		'justify-items': 'center', wmax: options.w, overflow: 'hidden', padding: options.gap,
	});

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

}
function zazTest03() {

	let n = chooseRandom([36]); //2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: chooseRandom(['C', 'S']),
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 10,
		isRegular: true,
		showLabels: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	options.w = options.area.w;
	console.log('width is', options.w, options);
	[options.rows, options.cols, options.or] = bestRowsColsWFit(n, options);
	options.outerStyles.w = options.szPic.w;
	options.outerStyles.h = options.szPic.h;

	// console.log('gap', options.gap)
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { border: '5px solid yellow', box: true, fz: 2 }, 'dGrid');

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		'justify-items': 'center', wmax: options.w, overflow: 'hidden', padding: options.gap,
	});

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

}
function zazTest02() {
	createPageDivsFullVisibleArea({ top: { h: 30 }, title: { h: 30 } }, { bg: colorTrans('dimgray', .5) }, { footer: { h: 30 } }, {}); //table is above footer

	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';
	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: 'S',
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 5,
		isRegular: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	options.w = options.area.w;
	//console.log('area width',options.w);
	//console.log(options);
	[options.rows, options.cols, options.or] = bestRowsColsWFit(n, options);

	//console.log('N', items.length, options);

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { fz: 2, bg: 'blue', padding: 12 }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: 12,
		border: '5px solid yellow', box: true, 'justify-items': 'center',
	});
}
function zazTest01(n, wper, hper, lang = 'E') { zazTest00(n, { wper: wper, hper: hper, lang: lang, maxlen: 18, luc: 'c', szPic: { w: 200, h: 100 } }); }
function zazTest00(n = 117, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
	createPageDivsFullVisibleArea({ top: { h: 30 }, title: { h: 30 } }, { bg: colorTrans('dimgray', .5) }, { footer: { h: 30 } }, {}); //table is above footer
	let dArea = getMainAreaPercent(dTable, 'random', wper, hper); //getMainAreaPadding(dTable, 2, 'silver');
	dArea.id = 'dArea';
	let options = getOptionsFillContainer(dArea, arguments[1]);

	console.log(options)

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeNoneGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)


	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}







function nu_adjustOptionsToRowsColsSize(bestCombi, options) {
	let [rows, cols, wb, hb, shape] = bestCombi;
	[options.rows, options.cols, options.or] = [rows, cols, shape];
	console.log('options', options, '\nbest', rows, cols, wb, hb, shape);

	let idealGap = .1; let gap = options.gap = Math.min(wb, hb) * idealGap;
	let [wOffset, hOffset] = [gap / cols, gap / rows];
	console.log('wOffset', wOffset, 'hOffset', hOffset, '*.25', gap * .25);
	let offset = Math.max(wOffset, hOffset, gap * .25);
	let w = wb - gap - offset, h = hb - gap - offset;
	//w = wb - gap * 1.25, h = hb - gap * 1.25;

	options.szPic.w = w;
	options.szPic.h = h;

	// let [wfix, hfix, adjustFont] = [true, true, true];//wfix... no/undef,min,max,yes =>outerStyles.wmin,wmax,w or dont set it
	// if (isdef(wfix)) {
	// 	if (wfix == 'min') options.outerStyles.wmin = w;
	// 	else if (wfix == 'max') options.outerStyles.wmax = w;
	// 	else options.outerStyles.w = w; //das bedeutet isUniform!!!!!
	// }
	// if (isdef(hfix)) {
	// 	if (hfix == 'min') options.outerStyles.hmin = options.szPic.h;
	// 	else if (hfix == 'max') options.outerStyles.hmax = options.szPic.h;
	// 	else options.outerStyles.h = options.szPic.h;
	// }

	// if (adjustFont && isdef(wfix) && wfix != 'min') {
	//text font has to be ok for longest label

	options.padding = _calcPadGap(options.padding, w, h);

	options.outerStyles.padding = options.padding;

	let wn = w - options.padding * 2;
	let hn = h - options.padding * 2;

	console.log('w', w, 'wn', wn, 'h', h, 'hn', hn)

	//set font size for uniform: needs to match longest label
	let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
	let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

	if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

	//set font size for uniform: needs to match longest label
	fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);

	console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

	options.fzPic = options.picStyles.fz = Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	// }
}

function _getFirstFittingCombi(items, options, combis) {
	let wArea = options.area.w;
	let hArea = options.area.h;

	let wIdeal = options.szPicTest.w; //starts at wBrut!
	let hIdeal = options.szPicTest.h; //starts at wBrut!

	for (const res of combis) {
		let colsFit = wArea / res.cols > wIdeal;

		if (colsFit) {
			let rowsFit = hArea / res.rows > hIdeal;
			if (rowsFit) return res;

		}
		// console.log('test fit:', wArea / res.cols, wIdeal, colsFit, res.cols);
	}
	return null;
}
function _findBestCombiOrShrink(items, options, combis) {
	bestCombi = _getFirstFittingCombi(items, options, combis);
	if (isdef(bestCombi)) return bestCombi;
	//otherwise, have to reduca the size
	options.szPicTest = { w: .9 * options.szPicTest.w, h: .9 * options.szPicTest.h };
	return null;
}

function zazTest03_newSample() {

	let n = chooseRandom([36]); //2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: chooseRandom(['C', 'S']),
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 10,
		isRegular: true,
		showLabels: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	options.w = options.area.w;
	console.log('width is', options.w, options);
	let [wpic, hpic, rows, cols] = calcRowsColsSize(n, options.area.w, options.area.h);
	options.rows = rows;
	options.cols = cols;
	options.szPic.w = wpic;
	options.outerStyles.w = options.szPic.w;
	options.outerStyles.h = options.szPic.h;

	// console.log('gap', options.gap)
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { border: '5px solid yellow', box: true, fz: 2 }, 'dGrid');

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		'justify-items': 'center', wmax: options.w, overflow: 'hidden', padding: options.gap,
	});

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

}


function bestRowsColsWFit_canOverflowHeight(n = 24, options) {// { w = 800, h = 500, szPic = { w: 100, h: 100 }, szMax = { w: 200, h: 200 }, isUniform = true, isRegular = true, keepRatio = true, rowRange=[2,4] } = {}) {
	//uniformSize, regularLayout,
	let combis = getSLCombis(n, true); //TODO: da sollt es schon so eine variant geben die nur regulars returned!
	combis.map(x => console.log(x));

	//how many fit in width?
	defOptions = { percentGap: 5, szPic: { w: 100, h: 100 }, w: 800 };
	options = mergeOverride(defOptions, options);

	//console.log(options);

	let gpix = Math.round(options.szPic.w * options.percentGap / 100);
	options.gap = gpix;
	let wb = options.szPic.w + gpix;
	let hb = options.szPic.h + gpix;

	let maxcols = Math.floor(options.w / wb);

	console.log('maxcols', maxcols, options.w, wb, gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function getStandardOptions_SizingPriority(dArea, options) {
	// if (nundef(options.sizingPriority)) {
	// 	let fzp = valf(options.fzPic, null), fzt = valf(options.fzText, null), szp = valf(options.szPic, null);
	// 	if (szp || !fzt && !fzp) { options.sizingPriority = 'size'; }
	// 	else {
	// 		options.sizingPriority = 'font';
	// 		//if (!fzt) { options.fzText = fzp / 3; } else if (!fzp) { options.fzPic = 2 * options.fzText; }
	// 	}
	// }
	//by now I have 

	defOptions = { szPic: { w: 100, h: 100 }, showLabels: true, maxlen: 14, wper: 80, hper: 80, fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E', minPadding: 0, minGap: 1, uniform: true };
	options = isdef(options) ? mergeOverride(defOptions, options) : defOptions;
	options.area = getRect(dArea);
	options.aRatio = options.area.w / options.area.h;
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(options.fzText)) {
		//labels are present!
		if (options.labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: options.fzText };
		if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length
		//console.log('hab den pic font inferred:', options.fzPic, 'fzText', options.fzText)
	} else if (nundef(options.fzPic)) options.fzPic = 30;

	//console.log('fzText', options.fzText, 'fzPic', options.fzPic, 'szPic', options.szPic);

	options.picStyles = { fz: options.fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true, rounding: 6,
	};

	return options;
}
function makeNoneGrid_0(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }

	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		if (ov > 0) {
			let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			let newGap = Math.max(1, options.gap / 2 - pad);
			console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) {
				mStyleX(lDiv(it), { margin: newGap, padding: newGap / 2 });
			}
		}
	}
	// console.log('overflow',isOverflown(dGrid));
	// if (isOverflown(dGrid)){
	// 	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap/2, padding: 1 }); }
	// }
}
function correctFlexGrid_0(items, options, dGrid) {
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {
		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		// for (const it of others) {
		// 	if (coin()) continue;
		// 	// for (const it of others) {
		// 	// for (const it of arrTake(others, Math.floor(items.length / 2))) {
		// 	// for (const it of arrTake(items, Math.floor(items.length / 2))) {
		// 	let d = lDiv(it);
		// 	let r = getRect(d);
		// 	mStyleX(lDiv(it), { wmin: r.w + p });
		// }
		console.log('correctur!!!', p)
	}
}
function getOptionsFillContainer(dArea, szPic, fzPic, lang, fzText, luc, labelPos = 'bottom', minPadding = 0, minGap = 1, uniform = true) {
	let options = { area: getRect(dArea) };
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(fzText)) {
		//labels are present!
		options.showLabels = true;
		if (labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: fzText };
		if (nundef(fzPic)) fzPic = Math.floor(fzText * 4 * (luc == 'u' ? .7 : .6)); //taking 4 as min word length
	} else if (nundef(fzPic)) fzPic = 30;
	options.picStyles = { fz: fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true
	};

	//infer szPic if not given!
	if (nundef(szPic)) {
		if (isdef(fzText)) {
			//dann hab ich auch fzPic!!!
			let h = fzText * 1.14 + fzPic * 1.15 + minPadding * 2;
			//let w=

		}
	}
	options.szRatio = szPic.w / szPic.h;

	return options;
}
function getFittings(items, options) {
	let res = getRegularFits(items.length);

	let szu = options.szUniform;

	let fitting = [];
	let area = options.area;
	for (const r of res) {
		//calc max label for each column, then sum them up to get grid width!
		//this only makes sense for landscape!
		//if this is landscape, will take rows=r.s, cols=r.l
		let [wCols, wGrid] = maxSumColumns(items.map(x => x.rect.w), r.s, r.l);
		//console.log('for',r.l,'columns, grid width would be',wGrid);
		let wExtraN = area.w - wGrid;
		let wExtraL = area.w - r.l * szu.w;
		let hExtraL = area.w - r.s * szu.h;
		let wExtraP = area.w - r.s * szu.w;
		let hExtraP = area.w - r.l * szu.h;
		if (wExtraN >= 0 && hExtraL >= 0) { fitting.push({ type: 'N', wCols: wCols, rows: r.s, cols: r.l, wExtra: wExtraN, hExtra: hExtraL }) }
		if (wExtraL >= 0 && hExtraL >= 0) { fitting.push({ type: 'L', rows: r.s, cols: r.l, wExtra: wExtraL, hExtra: hExtraL }) }
		if (wExtraP >= 0 && hExtraP >= 0) { fitting.push({ type: 'P', rows: r.l, cols: r.s, wExtra: wExtraP, hExtra: hExtraP }) }
	}
	return fitting;
}


function calcRowsColsSizeNew(n, rows, cols, dParent, wmax, hmax, minsz = 50, maxsz = 200) {

	//berechne outer dims
	let ww, wh, hpercent, wpercent;
	if (isdef(dParent)) {
		let b = getBounds(dParent);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else if (isdef(wmax) && isdef(hmax)) {
		ww = wmax;
		wh = hmax;
		hpercent = .9;
		wpercent = .9;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .9;
		wpercent = .9;
	}
	let dims = calcRowsColsX(n, rows, cols);
	if (dims.rows < dims.cols && ww < wh) { let h = dims.rows; dims.rows = dims.cols; dims.cols = h; }
	let hpic = wh * hpercent / dims.rows;
	let wpic = ww * wpercent / dims.cols;
	hpic = Math.max(minsz, Math.min(hpic, maxsz));
	wpic = Math.max(minsz, Math.min(wpic, maxsz));
	return [wpic, hpic, dims.rows, dims.cols];
}
function calcRowsColsSize_0(n, rows, cols, dParent, wmax, hmax, minsz = 50, maxsz = 200) {

	//berechne outer dims
	let ww, wh, hpercent, wpercent;
	if (isdef(dParent)) {
		let b = getBounds(dParent);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else if (isdef(wmax) && isdef(hmax)) {
		ww = wmax;
		wh = hmax;
		hpercent = .9;
		wpercent = .9;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .56;
		wpercent = .64;
	}

	//console.log(ww,wh)
	let sz;//, picsPerLine;
	//if (lines <= 1) lines = undefined;

	//console.log('===>vor calcRowsColsX: rows='+rows,'cols'+cols);
	let dims = calcRowsColsX(n, rows, cols);
	//console.log('===>nach calcRowsColsX: rows='+rows,'cols'+cols);

	let hpic = wh * hpercent / dims.rows;
	let wpic = ww * wpercent / dims.cols;

	//console.log('hpic', hpic, 'wpic', wpic, ww, window.innerWidth, wh, window.innerHeight);
	sz = Math.min(hpic, wpic);
	//picsPerLine = dims.cols;
	sz = Math.max(minsz, Math.min(sz, maxsz)); //Math.max(50, Math.min(sz, 200));
	return [sz, dims.rows, dims.cols]; //pictureSize, picsPerLine];
}
function calcRowsColsX(num, rows, cols) {
	const tableOfDims = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
		40: { rows: 5, cols: 8 },
	};
	if (isdef(rows) || isdef(cols)) return calcRowsCols(num, rows, cols);
	else if (isdef(tableOfDims[num])) return tableOfDims[num];
	else return calcRowsCols(num, rows, cols);
}
function calcRowsCols_0(num, rows, cols) {
	//=> code from RSG testFactory arrangeChildrenAsQuad(n, R);
	//console.log(num, rows, cols);
	let shape = 'rect';
	if (isdef(rows) && isdef(cols)) {
		//do nothing!
	} else if (isdef(rows)) {
		cols = Math.ceil(num / rows);
	} else if (isdef(cols)) {
		rows = Math.ceil(num / cols);
	} else if (num == 2) {
		rows = 1; cols = 2;
	} else if ([4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 49, 56, 64].includes(num)) {
		rows = Math.floor(Math.sqrt(num));
		cols = Math.ceil(Math.sqrt(num));
	} else if ([3, 8, 15, 24, 35, 48, 63].includes(num)) {
		let lower = Math.floor(Math.sqrt(num));
		console.assert(num == lower * (lower + 2), 'RECHNUNG FALSCH IN calcRowsCols');
		rows = lower;
		cols = lower + 2;
	} else if (num > 1 && num < 10) {
		shape = 'circle';
	} else if (num > 16 && 0 == num % 4) {
		rows = 4; cols = num / 4;
	} else if (num > 9 && 0 == num % 3) {
		rows = 3; cols = num / 3;
	} else if (0 == num % 2) {
		rows = 2; cols = num / 2;
	} else {
		rows = 1; cols = num;
	}
	//console.log(rows, cols, shape);
	return { rows: rows, cols: cols, recommendedShape: shape };
}


function mCenterWrapper() {
	let html = `<dTable style="width: 100%;height:100%">
  <tr>
     <td style="text-align: center; vertical-align: middle;">
          <div></div>
     </td>
  </tr>
	</dTable>`;
	let elem = createElementFromHTML(html);
	let dOuter = mCreate('div');
	mAppend(dOuter, elem);
	let dInner = elem.children[0].children[0].children[0].children[0];
	//console.log(dOuter, dInner)
	return [dOuter, dInner];
}
function centerWrap(elem) {
	//console.log('_________',elem.parentNode)
	let dParent = elem.parentNode;

	let [outer, inner] = mCenterWrapper();
	mAppend(dParent, outer);
	mAppend(inner, elem);
}
function presentItems1(items, dParent, options = {}) {
	mStyleX(dParent, { display: 'flex', 'justify-content': 'center' });

	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let [rows, cols] = bestFitRowsCols(items.length);
	//console.log('best fit ergibt: rows',rows,'cols',cols)
	let [w, h, r, c] = calcRowsColsSizeNew(items.length, rows, cols);
	//console.log('calcRowsColsSize ergibt: rows',r,'cols',c);
	//console.log('N='+items.length,'r='+r,'c='+c,'w='+w,'h='+h)

	//eigentlich kann man erst jetzt die items stylen!

	c = cols;
	let gridStyles = { display: 'grid', 'grid-template-columns': `repeat(${c}, auto)` }; //${w}px)`};
	gridStyles = mergeOverride({ 'place-content': 'center', gap: 4, margin: 4, padding: 4 }, gridStyles);
	mStyleX(dGrid, gridStyles);

	let b = getRect(dGrid);

	return { dGrid: dGrid, sz: b };
}
function showItemsTableWrapper(items, dParent, options = {}) {

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let [dOuter, dInner] = mCenterWrapper();
		item.div = dOuter;

		if (options.labelTop) item.dLabel = mText(item.label, dInner, options.labelStyles);

		let dPic = item.dPic = mDiv(dInner, { family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom) item.dLabel = mText(item.label, dInner, options.labelStyles);

		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}


	return presentItems1(items, dParent, options);
}

function getBestUniformRegularFit1(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
	}
	let area = options.area;
	let aratio = area.w / area.h;
	let pratio = szMin.w / szMin.h;
	let best, mindiff = 1000, foundFit = false;
	for (const r of res) {
		//console.log(r);
		//console.log(r,wi);
		let ratio = r.c / r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(aratio - ratio);
		//console.log('ratio',ratio)
		if (rdiff < mindiff) {

			let fits = r.r * szMin.h <= area.h && r.c * szMin.w <= area.w;
			if (fits) {
				mindiff = rdiff;
				best = [r.r, r.c]; foundFit = true;
				//console.log('fitting:', best, fits);
			}
		}
	}
	return [best[0], best[1], foundFit];
}
function getBestUniformRegularFitTotalerBloedsinn(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
	}
	let area = options.area;
	let aratio = area.w / area.h;
	let pratio = szMin.w / szMin.h;
	let best, nofitBest, fitmindiff = 1000, mindiff = 1000, foundFit = false;
	for (const r of res) {
		//console.log(r);
		//console.log(r,wi);
		let ratio = r.c / r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(aratio - ratio);
		//console.log('ratio',ratio)
		if (rdiff < fitmindiff) {

			let fits = r.r * szMin.h <= area.h && r.c * szMin.w <= area.w;
			if (fits) {
				mindiff = fitmindiff = rdiff;
				best = [r.r, r.c]; foundFit = true;
				//console.log('fitting:', best, fits);
			} else {
				mindiff = rdiff;
				nofitbest = [r.r, r.c];
				//console.log('non-fitting:', nofitbest, false);
			}

			//
			//console.log('new best:',rdiff,best)
		}
	}
	return [best[0], best[1], foundFit];
}
function getBestUniformRegularFitJustLandscape(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
	}
	let area = options.area;
	let aratio = area.w / area.h;
	let pratio = szMin.w / szMin.h;
	let best, bestNoFit, minDiffFits = 100000, minDiffNoFit = 100000, foundFit = false;
	for (const r of res) {
		//console.log(r);
		//console.log(r,wi);
		let ratio = r.c / r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(aratio - ratio);
		//console.log('ratio',ratio)
		let fits = false;
		if (rdiff < minDiffFits) {

			fits = r.r * szMin.h <= area.h && r.c * szMin.w <= area.w;
			if (fits) {
				console.log('FOUND A FIT!!!!!!!!!!!!')
				minDiffFits = rdiff;
				best = [r.r, r.c]; foundFit = true;
				//console.log('fitting:', best, fits);
			}
		}
		if (!fits && rdiff < minDiffNoFit) {
			minDiffNoFit = rdiff;
			bestNoFit = [r.r, r.c];
		}
	}
	if (nundef(best)) return [bestNoFit[0], bestNoFit[1], false];
	else return [best[0], best[1], foundFit];
}
