var Dictionary;
function isWord(w) { return isdef(Dictionary[G.language][w]); }
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
	startGame() { G.correctionFunc = showCorrectPictureLabels; }
	clear() { super.clear(); if (isdef(this.prevLanguage)) G.language = this.prevLanguage; }
	startLevel() {
		G.keys = setKeysG(G, filterWordByLength, 25);
		if (G.keys.length < 25) { G.keys = setKeysG(G, filterWordByLength, 25, 'all'); }
		G.trials = 4;
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

		let fz = 32;
		let options = _simpleOptions({ w: 200, h: 200, keySet: G.keys, luc: 'u', fz: fz, bg: 'random', fg: 'white', showLabels: true });
		// console.log(options)

		let n = 2;
		let items = gatherItems(n, options);
		console.log('items', items);

		let style = { margin: 3, fg: 'white', display: 'inline', bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 80 };
		for (const item of items) {
			//let d1 = item.container = mDiv(dTable, { hmin: 250 });

			let d = createLetterInputsX(item.label, dTable, style);
			iAdd(item,{div: d});
			//console.log('d', d)
			let letters = item.letters = [];
			for (let i = 0; i < arrChildren(d).length; i++) {
				let ch = d.children[i];
				let l = { item: item, div: ch, i: i, letter: item.label[i] };
				letters.push(l);
				ch.onclick = () => { console.log('clicked', d); startBlinking(l, item.letters, true) };
			}
			mStyleX(d, { margin: 35 })
		}


		// enableDD(items, containers, this.dropHandler.bind(this), false, true);
		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		activateUi();

	}
	trialPrompt() {
		//hint 1: click one letter in each word to swap them
		//hint 2: group
		//hint 3: subgroup
		//hint 4: pic
		sayTryAgain();
		for (const item of Pictures) {
			//clear hint area
			let d1 = item.container;
			if (isdef(item.dHint)) mRemove(item.dHint);
			console.log(G);
			if (G.trialNumber < 3) {
				let hint = G.trialNumber == 1 ? item.info.group : item.info.subgroup;
				let dHint = item.dHint = mText('(' + hint + ')', d1);
			} else {
				let dHint = mPic(item, d1);
			}
		}
		//TOMain = setTimeout(() => { Pictures.map(x => mAppend(this.dWordArea, iDiv(x))); }, 1200);
		return 1500;
	}
	eval() {
		let n = Pictures.length;
		let indices = [];//Pictures.map(x => {let l=getBlinkingLetter(x); if (isdef(l)) return l.i; else return null;});

		for (let i = 0; i < n; i++) {
			let p = Pictures[i];
			let blinking = getBlinkingLetter(p);
			indices.push({ i: i, blinking: blinking });
		}
		console.log('indices', indices.map(x => x.blinking));
		for (let i = 0; i < n; i++) {
			let iblink = indices[i].blinking;
			if (!iblink) continue;
			let p = Pictures[i];
			stopBlinking(p.letters[iblink]);
			//console.log('indices',indices);
		}

		let item0 = Pictures[0];
		let label0 = item0.label;
		let hLetter = label0[item0.iLetter];
		// let hLetter = Pictures[0].label[indices[0]];
		console.log('hLetter', hLetter);
		for (let i = 0; i < n - 1; i++) {
			let item1 = Pictures[i];
			let item2 = Pictures[i + 1];

			let i1 = item1.iLetter; //indices[i];
			let i2 = item2.iLetter; //indices[i + 1];

			console.log('______', i1, i2)

			//item1 must get letter that is currently at position i2 in item2.label
			let test = item1.testLabel = replaceAt(item1.label, i1, item2.label[i2]);
			console.log('test', test);
		}
		let item = Pictures[n - 1];
		item.testLabel = replaceAt(item.label, item.iLetter, hLetter);


		console.log('test', item.testLabel); //false, 'und was jetzt???????????')

		//console.assert(false,'END')
		let isCorrect = true;
		for (const p of Pictures) {
			if (p.testLabel != p.origLabel) {
				console.log('fehler:', p.origLabel, p.testLabel);
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

}


