class GSwap extends Game {
	constructor(name) {
		super(name);
		if (G.language == 'C') { this.prevLanguage = G.language; G.language = chooseRandom('E', 'D'); }
	}
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }
	clear() { super.clear(); if (isdef(this.prevLanguage)) G.language = this.prevLanguage; }
	startLevel() {
		G.keys = setKeysG(G, filterWordByLength, 25);
		if (G.keys.length < 25) { G.keys = setKeysG(G, filterWordByLength, 25, 'all'); }
		console.log(G.keys)
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
		let words = G.words = choose(G.keys,2);
		showInstruction('', 'swap 2 letters to form valid words', dTitle, true);
		mLinebreak(dTable);

		let fz = 32;
		let h = fz * 1.25, wmin = fz * 1.25;
		let options = _simpleOptions({ fz: fz, bg: 'transparent', fg: 'white', showPic: false, showLabels: true }, { wmin: wmin });

		let diWords={};
		let items = Pictures = genItemsFromKeys(G.words,options);

		//take 1 letter out of first item, remember letter and index
		for(const item of items){
			let i = randomNumber(0, item.key.length-1); item.iLetter
			let letter = item.key[i];
			console.log('i',i,'letter',letter);
		}
		

		let containers = [];

		console.log('words', words);

		let dArea = mDiv(dTable, { h: 150, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		mLinebreak(dTable);
		let dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})

		let i = 0;
		for (const word of words) {
			let item = { label: word, index: i };
			let container = { label: word, index: i };
			i += 1;
			let d = makeItemDiv(item, options);
			let dCont = mDiv(dArea, { wmin: wmin + 12, hmin: h + 10, bg: colorTrans('beige', .25), fg: 'black', margin: 12 });
			container.div = dCont;

			//console.log(item,container);
			items.push(item);
			containers.push(container);
		}

		shuffle(items);
		items.map(x => { mAppend(dWordArea, iDiv(x)); mStyleX(iDiv(x), { h: h, w: 'auto' }); });

		//console.assert(false)
		enableDD(items, containers, this.dropHandler.bind(this), false, true);

		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		// myShowPics(() => fleetingMessage('drag and drop the letters to form the word!'), {}, { });
		// setGoal();
		// showInstruction(Goal.label, G.language == 'E' ? 'drag letters to form' : "forme", dTitle, true);
		// mLinebreak(dTable);

		// this.inputs = createDropInputs();
		// let x = mLinebreak(dTable, 50);//x.style.background='red'
		// this.letters = createDragLetters();

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


