
function getInstance(G) {
	//console.log(G.id)
	return new (Daat.GameClasses[G.id])(G.id);
}
class Game {
	constructor(name) { this.name = name; }
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }
	startGame() { }
	startLevel() { }
	startRound() { }
	prompt() {
		myShowPics(evaluate);
		//showPicturesSpeechTherapyGames(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		sayTryAgain();
		if (G.showHint) shortHintPic();
		return 10;
	}
	activate() { }
	interact() { }
	eval(ev) {
		ev.cancelBubble = true;
		// let id = evToClosestId(ev);		let i = firstNumber(id);		let item = Pictures[i];
		let item = findItemFromEvent(Pictures, ev);
		Selected = { pic: item, feedbackUI: iDiv(item), sz: getRect(iDiv(item)).h };

		//console.log('item in eval',item,'Selected',Selected,'rect',getRect(iDiv(item)));
		//console.log('Selected', Selected.pic.key, 'id', id)

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
}
class GAbacus extends Game {
	constructor(name) { super(name); }
	startGame() { G.successFunc = successThumbsUp; G.failFunc = failThumbsDown; G.correctionFunc = this.showCorrectSequence.bind(this); }
	showCorrectSequence() { let t = correctBlanks(); if (G.level <= 1 && (G.step <= 3 || G.op != 'mult')) showSayHint(3); return t + 1000; }
	startLevel() { if (!isList(G.steps)) G.steps = [G.steps]; G.numPics = 2; }
	prompt() {
		mLinebreak(dTable, 2);

		showHiddenThumbsUpDown({ sz: 110 });
		mLinebreak(dTable);

		G.seq = makeExpSequence();


		//console.log('G.seq', G.seq);

		let panel = mDiv(dTable, { bg: '#00000080', padding: 20, rounding: 10 });
		//replace op in seq by wr
		//arrReplace(G.seq,G.op,OPS[G.op].wr);
		[G.words, G.letters] = showEquation(G.seq, panel);
		setNumberSequenceGoal();
		//console.log(G)

		mLinebreak(dTable, 30);

		let instr1 = (G.language == 'E' ? 'calculate' : "rechne");
		//let s=G.seq;
		let spOp = G.oop.sp; if (G.language == 'D') spOp = DD[spOp];
		let instr2 = G.operand + ' ' + spOp + ' ' + G.step + ' ?';
		//instr1 = arrTake(G.seq,3).join(' ');
		showInstruction('', instr1, dTitle, true, instr2);

		//console.log('showHint', G.showHint);

		if (G.level <= 1 && G.showHint && (G.step <= 3 || G.op != 'mult')) hintEngineStart(getOperationHintString, [0, 1], 5000 + G.level * 1000);

		activateUi();
	}
	trialPrompt() {
		if (G.level <= 1 && G.showHint && (G.step <= 3 || G.op != 'mult')) hintEngineStart(getOperationHintString, [0, 1], 5000 + G.level * 1000);
		TOMain = setTimeout(() => getWrongChars().map(x => unfillChar(x)), 500);
		return 600;
	}
	activate() { onkeypress = this.interact; }
	interact(ev) {
		//console.log('key!');
		clearFleetingMessage();
		if (!canAct()) return;

		let sel = Selected = onKeyWordInput(ev);
		if (nundef(sel)) return;
		//console.log('===>', sel);

		//target,isMatch,isLastOfGroup,isVeryLast,ch
		let lastInputCharFilled = sel.target;
		console.assert(sel.isMatch == (lastInputCharFilled.letter == sel.ch), lastInputCharFilled, sel.ch);

		//all cases aufschreiben und ueberlegen was passieren soll!
		//TODO: multiple groups does NOT work!!!
		if (sel.isMatch && sel.isVeryLast) {
			deactivateFocusGroup();
			evaluate(true);
		} else if (sel.isMatch && sel.isLastOfGroup) {
			//it has been filled
			//remove this group from Goal.blankWords
			sel.target.isBlank = false;
			sel.target.group.hasBlanks = false;
			removeInPlace(Goal.blankWords, sel.target.group);
			removeInPlace(Goal.blankChars, sel.target);
			deactivateFocusGroup();
			console.log('haaaaaaaaaaaalo', Goal.isFocus)
			//console.log('=>', Goal)
		} else if (sel.isMatch) {
			//a partial match
			removeInPlace(Goal.blankChars, sel.target);
			sel.target.isBlank = false;
		} else if (sel.isVeryLast) {
			Selected.words = getInputWords();
			Selected.answer = getInputWordString();
			Selected.req = getCorrectWordString();
			deactivateFocusGroup();
			//console.log('LAST ONE WRONG!!!')
			evaluate(false);
			//user entered last missing letter but it is wrong!
			//can there be multiple errors in string?
		} else if (sel.isLastOfGroup) {
			//unfill last group

			Selected.words = getInputWords();
			Selected.answer = getInputWordString();
			Selected.req = getCorrectWordString();
			deactivateFocusGroup();
			evaluate(false);
			//user entered last missing letter but it is wrong!
			//can there be multiple errors in string?
		} else {
			if (!G.silentMode) { writeSound(); playSound('incorrect1'); }
			deactivateFocusGroup();
			//unfillCharInput(Selected.target);
			showFleetingMessage('does NOT fit: ' + Selected.ch, 0, { fz: 24 });
			setTimeout(() => unfillCharInput(Selected.target), 500);
		}
		//
	}

	eval(isCorrect) { return isCorrect; }

}
class GAnagram extends Game {
	constructor(name) {
		super(name);
		if (G.language == 'C') {
			this.realLanguage = G.language;
			G.language = chooseRandom('E', 'S', 'F', 'D');
		}
	}
	clear() { super.clear(); if (isdef(this.language)) G.language = this.language; }
	startLevel() {
		G.keys = setKeysG(G, filterWordByLength, 25);
		if (G.keys.length < 25) { G.keys = setKeysG(G, filterWordByLength, 25, 'all'); }
		console.log(G.keys)
	}
	prompt() {
		myShowPics(() => fleetingMessage('drag and drop the letters to form the word!'), {}, {});
		setGoal();
		showInstruction(Goal.label, G.language == 'E' ? 'drag letters to form' : "forme", dTitle, true);
		mLinebreak(dTable);

		this.inputs = createDropInputs();
		let x = mLinebreak(dTable, 50);//x.style.background='red'
		this.letters = createDragLetters();

		activateUi();

	}
	trialPrompt() {
		sayTryAgain();
		setTimeout(() => {
			this.inputs.map(x => iDiv(x).innerHTML = '_')
			// mClass(d, 'blink');
		}, 1500);

		return 10;
	}
	eval(w, word) {
		Selected = { answer: w, reqAnswer: word, feedbackUI: iDiv(Goal) }; //this.inputs.map(x => iDiv(x)) };
		//console.log(Selected);
		return w == word;
	}

}
class GCats extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }

	startLevel() {
		console.log(G);
		// let n = this.numCats = G.numCats;
		// if (n == 2 || n == 3) console.log('n', n, 'result', genCats(n)); else n = 4;
		let data = genCats(G.numCats); //this.numCats); //genCats();
		let options = this.options = {};
		this.keysByCat = data;
		this.catsByKey = {};
		this.keylists = [];
		for (const cat in data) {
			this.keylists.push({ keys: data[cat], cat: cat });
			for (const k of data[cat]) {
				this.catsByKey[k] = cat;
			}
		}
		this.cats = Object.keys(this.keysByCat);
		this.lists = Object.values(this.keysByCat);
		this.allKeys = Object.keys(this.catsByKey);
		this.showPics = true;// this.cats.includes('gesture')||this.cats.includes('emotion')||this.cats.includes('music');

		_extendOptions(options);
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

		//evaluate();
		//relayout sources in target
	}

	prompt() {

		//generate words:
		//console.log('lists', this.keylists);
		let pickRandom = G.pickRandom; console.log('pickRandom', pickRandom);
		let items;


		if (pickRandom == false) {
			// let n = G.numPics;
			// if (n == 1 || n == 2 || n == 3) console.log('n', n); else n = 4;
			items = Pictures = getNItemsPerKeylist(G.numPics, this.keylists, this.options);
		} else {
			console.log(this.allKeys);
			let keys = choose(this.allKeys, G.numPics);
			items = Pictures = genItemsFromKeys(keys, this.options);
			items.map(x => x.cat = this.catsByKey[x.key]);
			//for(let i=0;i<items.length;i++){items[i].cat=keysPlus[i].cat;}
			console.log('items', items)
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
		let hWin = window.innerHeight * .4;
		//console.log('wLongest',wLongest,'wmin',wmin)

		//show categories:
		let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		let containers, dWordArea;
		if (this.showPics) {
			if (this.cats.includes('music')) { this.options.showLabels = false; }
			let wCont = wWin / G.numCats; //Math.max(150, wmin + 2 * padding);
			let hCont = hWin;
			containers = this.containers = createContainers(this.cats, dArea, { fz: 24, fg: 'contrast', w: wCont, h: hCont }); //['animals', 'sport', 'transport'], dArea);
		} else {
			containers = this.containers = createContainers(this.cats, dArea, { fg: 'contrast', w: Math.max(150, wmin + 2 * padding) }); //['animals', 'sport', 'transport'], dArea);
		}
		mLinebreak(dTable);

		//show words:
		dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
		if (this.showPics) {
			let w = this.options.w = window.innerWidth - 100;
			let h = this.options.h = 120;
			mStyleX(dWordArea, { h: h });
			this.options.rows = 1;
			//this.options.outerStyles.padding=12;
			let rect = myPresent(dWordArea, items, this.options);
			items.map(x => mStyleX(iDiv(x), { w: 'auto', padding: 8 }))
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
	trialPrompt() {
		sayTryAgain();
		TOMain = setTimeout(() => { Pictures.map(x => mAppend(this.dWordArea, iDiv(x))) }, 1200);
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
		Pictures.map(x => console.log(x.label, x.isCorrect));
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
}
class GElim extends Game {
	constructor(name) { super(name); }
	startGame() {
		G.correctionFunc = () => { writeSound(); playSound('incorrect1'); return G.spokenFeedback ? 1800 : 300; };
		G.successFunc = () => { Goal.pics.map(x => iDiv(x).style.opacity = .3); successPictureGoal(); }
	}
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		this.piclist = [];
		let colorKeys = G.numColors > 1 ? choose(G.colors, G.numColors) : null;
		let showRepeat = G.numRepeat > 1;
		let rows = G.numColors > 1 ? G.numColors : undefined;
		myShowPics(this.interact.bind(this), { bg: 'white' },// { contrast: G.contrast, },
			{
				showRepeat: showRepeat, colorKeys: colorKeys, numRepeat: G.numRepeat,
				contrast: G.contrast, rows: rows
			});

		//console.log('G.colors', G.colors, 'colorKeys', colorKeys);
		let [sSpoken, sWritten, piclist] = logicMulti(Pictures);
		this.piclist = piclist;
		Goal = { pics: this.piclist, sammler: [] };

		showInstructionX(sWritten, dTitle, sSpoken, { fz: 22, voice: 'zira' });
		activateUi();
	}
	trialPrompt() {
		sayTryAgain();
		let msg = G.language == 'D' ? 'noch einmal!' : 'try again!'
		showFleetingMessage(msg, 0, { margin: -8, fz: 22 }, true);
		return 1000;
	}
	activate() {
		for (const p of this.piclist) { if (p.isSelected) toggleSelectionOfPicture(p); }
		this.piclist = [];
	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) return;

		let pic = findItemFromEvent(Pictures, ev);
		// let id = evToClosestId(ev);
		// let pic = firstCond(Pictures, x => iDiv(x).id == id);
		writeSound(); playSound('hit');

		if (Goal.pics.includes(pic)) {
			removePicture(pic);
			//console.log('YES!!!!'); 
			Goal.sammler.push(pic);
		}


		if (Goal.pics.length == Goal.sammler.length) evaluate(true);
		else if (!Goal.pics.includes(pic)) { this.lastPic = pic; evaluate(false); }
		// if (pic.label == Goal.label) evaluate(false);
		// else { removePicture(pic);maLayout(Pictures,dTable) }

	}
	eval(isCorrect) {
		//	console.log('eval', isCorrect);
		// console.log('piclist', this.piclist)
		Selected = { piclist: this.piclist, feedbackUI: isCorrect ? Goal.pics.map(x => iDiv(x)) : iDiv(this.lastPic) };
		return isCorrect;
	}
}
class GMem extends Game {
	constructor(name) { super(name); }
	clear() { clearTimeout(this.TO); showMouse(); }
	prompt() {
		myShowPics(this.interact.bind(this),
			{ border: '3px solid #ffffff80' },
			{});
		setGoal();

		if (G.level > 2) { showInstruction('', G.language == 'E' ? 'remember all' : 'merke dir alle', dTitle, true); }
		else { showInstruction(Goal.label, G.language == 'E' ? 'remember' : 'merke dir', dTitle, true); }
		let secs = calcMemorizingTime(G.numPics, G.level > 2);
		hideMouse();
		TOMain = setTimeout(() => turnCardsAfter(secs), 300, G.level >= 5); //needed fuer ui update! sonst verschluckt er last label

	}
	interact(ev) {
		//console.log('interact!', ev);
		ev.cancelBubble = true;
		if (!canAct()) return;
		let pic = findItemFromEvent(Pictures, ev);
		turnFaceUpSimple(pic);
		if (G.trialNumber == G.trials - 1) turnFaceUpSimple(Goal);
		TOMain = setTimeout(() => evaluate(ev), 300);
	}

	interact_orig(ev) {
		//console.log('interact!', ev);
		ev.cancelBubble = true;
		if (!canAct()) return;
		//console.log('halloooooooooooooo')
		let pic = findItemFromEvent(Pictures, ev);
		toggleFace(pic);

		if (G.trialNumber == G.trials - 1) {
			turnFaceUp(Goal);
			TOMain = setTimeout(() => evaluate(ev), 100);
		} else evaluate(ev);
	}
}
class GMissingLetter extends Game {
	constructor(name) { super(name); }
	startLevel() {
		G.maxPosMissing = G.posMissing == 'start' ? G.numMissing - 1 : 100;
	}
	prompt() {
		myShowPics(() => fleetingMessage('just enter the missing letter!'));
		setGoal();

		showInstruction(Goal.label, G.language == 'E' ? 'complete' : "ergänze", dTitle, true);

		mLinebreak(dTable);

		// create sequence of letter ui
		let style = { margin: 6, fg: 'white', display: 'inline', bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 80 };
		let d = createLetterInputs(Goal.label.toUpperCase(), dTable, style); // acces children: d.children

		// randomly choose 1-G.numMissing alphanumeric letters from Goal.label
		let indices = getIndicesCondi(Goal.label, (x, i) => isAlphaNum(x) && i <= G.maxPosMissing);
		this.nMissing = Math.min(indices.length, G.numMissing);
		//console.log('nMissing is', this.nMissing, G.numPosMissing, G.maxPosMissing, indices, indices.length)
		let ilist = choose(indices, this.nMissing); sortNumbers(ilist);

		this.inputs = [];
		for (const idx of ilist) {
			let inp = d.children[idx];
			inp.innerHTML = '_';
			mClass(inp, 'blink');
			this.inputs.push({ letter: Goal.label[idx].toUpperCase(), div: inp, index: idx });
		}

		mLinebreak(dTable);

		let msg = this.composeFleetingMessage();
		//console.log('msg,msg', msg)
		showFleetingMessage(msg, 3000);
		activateUi();

	}
	trialPrompt() {
		let selinp = Selected.inp;
		sayTryAgain();
		TOMain = setTimeout(() => {
			let d = selinp.div;
			d.innerHTML = '_';
			mClass(d, 'blink');
		}, 1200);

		showFleetingMessage(this.composeFleetingMessage(), 3000);
		return 1500;
	}
	activate() {
		onkeypress = ev => {
			clearFleetingMessage();
			if (!canAct()) return;
			let charEntered = ev.key.toString();
			if (!isAlphaNum(charEntered)) return;

			Selected = { lastLetterEntered: charEntered.toUpperCase() };
			//console.log(inputs[0].div.parentNode)

			if (this.nMissing == 1) {
				let d = Selected.feedbackUI = this.inputs[0].div;
				Selected.positiveFeedbackUI = iDiv(Goal);
				Selected.lastIndexEntered = this.inputs[0].index;
				Selected.inp = this.inputs[0];
				d.innerHTML = Selected.lastLetterEntered;
				mRemoveClass(d, 'blink');
				let result = buildWordFromLetters(mParent(d));

				evaluate(result);
			} else {
				let ch = charEntered.toUpperCase();
				for (const inp of this.inputs) {
					if (inp.letter == ch) {
						Selected.lastIndexEntered = inp.index;
						Selected.inp = inp;
						let d = Selected.feedbackUI = inp.div;
						d.innerHTML = ch;
						mRemoveClass(d, 'blink');
						removeInPlace(this.inputs, inp);
						this.nMissing -= 1;
						break;
					}
				}
				if (nundef(Selected.lastIndexEntered)) {
					//the user entered a non existing letter!!!
					showFleetingMessage('you entered ' + Selected.lastLetterEntered);
					sayRandomVoice('try a different letter!', 'anderer Buchstabe!')
				}
				showFleetingMessage(this.composeFleetingMessage(), 3000);
				//if get to this place that input did not match!
				//ignore for now!
			}
		}

	}
	eval(word) {
		//console.log('word',word,Goal)
		let answer = normalize(word, G.language);
		let reqAnswer = normalize(Goal.label, G.language);

		Selected.reqAnswer = reqAnswer;
		Selected.answer = answer;

		//console.log(answer, reqAnswer)
		if (answer == reqAnswer) return true;
		else if (G.language == 'D' && fromUmlaut(answer) == fromUmlaut(reqAnswer)) {
			//console.log('hhhhhhhhhhhhhhhhhhh')
			return true;
		} else {
			return false;
		}
	}
	composeFleetingMessage() {
		//console.log('this', this)
		let lst = this.inputs;
		//console.log(this.inputs)
		let msg = lst.map(x => x.letter).join(',');
		let edecl = lst.length > 1 ? 's ' : ' ';
		let ddecl = lst.length > 1 ? 'die' : 'den';
		let s = (G.language == 'E' ? 'Type the letter' + edecl : 'Tippe ' + ddecl + ' Buchstaben ');
		return s + msg;
	}

}
class GNamit extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }
	prompt() {
		G.showLabels = false;
		myShowPics(null, {}, { rows: 1 });
		//console.assert(false,'THE END')
		Goal = { pics: Pictures };

		showInstruction('', G.language == 'E' ? 'drag labels to pictures' : "ordne die texte den bildern zu", dTitle, true);
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
		TOMain = setTimeout(() => { Pictures.map(x => removeLabel(x)) }, 1200);
		return 1500;
	}
	eval() {
		this.piclist = Pictures;
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => iDiv(x)), sz: getRect(iDiv(this.piclist[0])).h };
		let isCorrect = true;
		for (const p of Pictures) {
			let label = p.label;
			if (nundef(iDiv(p).children[1])) {
				p.isCorrect = isCorrect = false;
			} else {
				let text = getActualText(p);
				if (text != label) { p.isCorrect = isCorrect = false; } else p.isCorrect = true;
			}
		}
		return isCorrect;
	}

}
class GPremem extends Game {
	constructor() { super(); this.piclist = []; }
	prompt() {
		this.piclist = [];
		G.showLabels = false;
		myShowPics(this.interact.bind(this),
			{ border: '3px solid #ffffff80' }, // border: '3px solid #ffffff80'
			{}); //, showLabels: false });
		// { showLabels: false }); //, showLabels: false });
		// { numRepeat: G.numRepeat, sameBackground: G.sameBackground, showLabels: false }); //, showLabels: false });
		showInstruction('', G.language == 'E' ? 'click any picture' : 'click irgendein Bild', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		for (const p of this.piclist) { toggleSelectionOfPicture(p); }
		this.piclist = [];
		showInstruction('', 'try again: click any picture', dTitle, true);
		return 10;
	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) return;

		let pic = findItemFromEvent(Pictures, ev);
		// let id = evToClosestId(ev);
		// let i = firstNumber(id);
		// let pic = Pictures[i];
		//let div = pic.div;
		if (!isEmpty(this.piclist) && this.piclist.length < G.numRepeat - 1 && this.piclist[0].label != pic.label) return;
		toggleSelectionOfPicture(pic, this.piclist);
		//console.log('clicked', pic.key, this.piclist);//,piclist, GPremem.PicList);
		if (isEmpty(this.piclist)) {
			showInstruction('', G.language == 'E' ? 'click any picture' : 'click irgendein Bild', dTitle, true);
		} else if (this.piclist.length < G.numRepeat - 1) {
			//set incomplete: more steps are needed!
			//frame the picture
			showInstruction(pic.label, G.language == 'E' ? 'click another' : 'click ein andres Bild mit', dTitle, true);
		} else if (this.piclist.length == G.numRepeat - 1) {
			// look for last picture with x that is not in the set
			let picGoal = firstCond(Pictures, x => x.label == pic.label && !x.isSelected);
			setGoal(picGoal.index);
			showInstruction(picGoal.label, G.language == 'E' ? 'click the ' + (G.numRepeat == 2 ? 'other' : 'last')
				: 'click das ' + (G.numRepeat == 2 ? 'andere' : 'letzte') + ' Bild mit', dTitle, true);
		} else {
			//set is complete: eval
			evaluate(this.piclist);
		}
	}
	eval(piclist) {
		Selected = { piclist: piclist, feedbackUI: piclist.map(x => iDiv(x)), sz: getRect(iDiv(piclist[0])).h };
		let req = Selected.reqAnswer = piclist[0].label;
		Selected.answer = piclist[piclist.length - 1].label;
		if (Selected.answer == req) { return true; } else { return false; }
	}
}
class GSayPic extends Game {
	constructor(name) { super(name); }
	clear() { Speech.stopRecording(); }
	prompt() {

		myShowPics();
		setGoal();

		showInstruction(Goal.label, G.language == 'E' ? 'say:' : "sage: ", dTitle);
		animate(dInstruction, 'pulse800' + bestContrastingColor(G.color, ['yellow', 'red']), 900);

		mLinebreak(dTable);
		MicrophoneUi = mMicrophone(dTable, G.color);
		//console.log('MicrophoneUi',MicrophoneUi)
		MicrophoneHide();

		TOMain = setTimeout(activateUi, 200);

	}
	trialPrompt(nTrial) {
		sayRandomVoice(nTrial < 2 ? 'speak UP!!!' : 'Louder!!!', 'LAUTER!!!');
		animate(dInstruction, 'pulse800' + bestContrastingColor(G.color, ['yellow', 'red']), 500);
		return 600;
	}
	activate() {
		//console.log('hallo')
		if (Speech.isSpeakerRunning()) {
			TOMain = setTimeout(this.activate.bind(this), 200);
		} else {
			TOMain = setTimeout(() => Speech.startRecording(G.language, evaluate), 100);
		}

	}
	eval(isfinal, speechResult, confidence, sessionId) {

		//console.log(Goal);
		//console.log('===>',sessionId,SessionId);
		if (sessionId != SessionId) {
			alert('NOT THIS BROWSER!!!!!!'); return undefined;
		}
		let answer = Goal.answer = normalize(speechResult, G.language);
		let reqAnswer = Goal.reqAnswer = normalize(Goal.label, G.language);

		Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: iDiv(Goal) };

		if (isEmpty(answer)) return false;
		else return isSimilar(answer, reqAnswer) || isList(Goal.info.valid) && firstCond(Goal.info.valid, x => x.toUpperCase() == answer.toUpperCase());

	}
}
class GSentence extends Game {
	constructor(name) {
		super(name);
		this.prevLanguage = G.language;
		G.language = 'E';
	}
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }
	clear() { super.clear(); G.language = this.prevLanguage; }
	startLevel() {
		G.sentences = EnglishSentences.map(x => x.split(' ')).filter(x => x.length <= G.maxWords);
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

		//choose a random sentence

		let words = G.sentence = chooseRandom(G.sentences);

		showInstruction('', 'drag words into blanks', dTitle, true);
		mLinebreak(dTable);

		let fz = 32;
		let h = fz * 1.25, wmin = fz * 1.25;

		let items = Pictures = [];
		let containers = [];
		let options = _simpleOptions({ fz: fz, bg: 'transparent', fg: 'white', showPic: false, showLabels: true }, { wmin: wmin });

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
class GSteps extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectWords; }
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}

	prompt() {
		this.piclist = [];
		let colorKeys = G.numColors > 1 ? choose(G.colors, G.numColors) : null;
		let bg = G.numColors > 1 || G.numRepeat > 1 ? 'white' : 'random';
		let rows = G.numColors > 1 ? G.numColors : undefined;
		let showRepeat = G.numRepeat > 1;

		myShowPics(this.interact.bind(this), { bg: bg },// { contrast: G.contrast, },
			{ rows: rows, showRepeat: showRepeat, colorKeys: colorKeys, numRepeat: G.numRepeat, contrast: G.contrast });


		// myShowPics(this.interact.bind(this), { contrast: G.contrast, },
		// 	{ showRepeat: showRepeat, colorKeys: colorKeys, numRepeat: G.numRepeat });

		setMultiGoal(G.numSteps);
		// console.log(Goal)

		let cmd = 'click';
		let spoken = [], written = [], corr = [];
		for (let i = 0; i < G.numSteps; i++) {
			let goal = Goal.pics[i];
			let sOrdinal = getOrdinal(goal.iRepeat);
			[written[i], spoken[i], corr[i]] = getOrdinalColorLabelInstruction(cmd, sOrdinal, goal.color, goal.label);
			goal.correctionPhrase = corr[i];
			cmd = 'then';
		}
		// console.log('written', written, '\nspoken', spoken);
		showInstructionX(written.join('; '), dTitle, spoken.join('. '), { fz: 20 });

		activateUi();
	}
	trialPrompt() {
		sayTryAgain();
		showFleetingMessage(this.message, 0);
		return 1000;
	}
	activate() {
		for (const p of this.piclist) { toggleSelectionOfPicture(p); }
		this.piclist = [];

	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) { console.log('no act'); return; }

		let pic = findItemFromEvent(Pictures, ev);

		toggleSelectionOfPicture(pic, this.piclist);
		if (this.piclist.length == Goal.pics.length) {
			clearFleetingMessage();
			Selected = { piclist: this.piclist }; evaluate();
		}
	}
	interact_dep(ev) {
		ev.cancelBubble = true;
		if (!canAct()) { console.log('no act'); return; }

		let pic = findItemFromEvent(Pictures, ev);

		toggleSelectionOfPicture(pic, this.piclist);

		if (isEmpty(this.piclist)) return;

		let iGoal = this.piclist.length - 1;

		if (pic != Goal.pics[iGoal]) { Selected = { pics: this.piclist, wrong: pic, correct: Goal[iGoal] }; evaluate(false); }
		else if (this.piclist.length == Goal.pics.length) { Selected = { piclist: this.piclist }; evaluate(true); }
	}
	eval() {
		//console.log('eval', isCorrect);
		//console.log('piclist', this.piclist)
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => iDiv(x)), sz: getRect(iDiv(this.piclist[0])).h };
		let isCorrect = true;
		this.message = G.language == 'D' ? 'beachte die REIHENFOLGE!' : 'mind the ORDER!';
		for (let i = 0; i < this.piclist.length; i++) {
			let p = this.piclist[i];
			if (!Goal.pics.includes(p)) this.message = G.language == 'D' ? 'noch einmal!' : 'try again!';
			if (this.piclist[i] != Goal.pics[i]) isCorrect = false;
		}
		return isCorrect;
	}
	eval_dep(isCorrect) {
		//console.log('eval', isCorrect);
		//console.log('piclist', this.piclist)
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => iDiv(x)), sz: getRect(iDiv(this.piclist[0])).h };
		return isCorrect;
	}
}
class GTouchColors extends Game {
	constructor(name) { super(name); }
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		//console.log(G.pictureLabels,G.showLabels)
		let colorKeys = choose(G.colors, G.numColors);
		//let showLabels = G.showLabels == true && G.labels == true;
		let rows = G.numColors;
		myShowPics(evaluate, { bg: 'white' },// { contrast: G.contrast, },
			{ showLabels: G.showLabels, colorKeys: colorKeys, rows: rows });

		//{ contrast: G.contrast }, { colorKeys: colorKeys, showLabels: showLabels });
		if (G.shuffle == true) {
			//console.log('HAAAAAAAAAAAAAAAAAAAAAAAALO')
			//shuffle(Pictures);
			let dParent = iDiv(Pictures[0]).parentNode;
			shuffleChildren(dParent);
		}
		//showPicturesSpeechTherapyGames(evaluate, { contrast: G.contrast }, { colorKeys: colorKeys });
		//Pictures.map(x => x.color = ColorDict[x.textShadowColor]);

		setGoal(randomNumber(0, Pictures.length - 1));

		let [written, spoken] = getOrdinalColorLabelInstruction('click'); //getColorLabelInstruction('click');
		showInstructionX(written, dTitle, spoken);

		activateUi();
	}
	eval(ev) {
		ev.cancelBubble = true;
		// let id = evToClosestId(ev);		let i = firstNumber(id);		let item = Pictures[i];
		let item = findItemFromEvent(Pictures, ev);
		Selected = { pic: item, feedbackUI: iDiv(item) };
		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item == Goal) { return true; } else { return false; }
	}
}
class GTouchPic extends Game {
	constructor(name) { super(name); }
	prompt() {
		//console.log('showLabels',showLabels,G.showLabels)
		//console.log(G.showLabels, G.labels, showLabels)
		myShowPics(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
}
class GWritePic extends Game {
	constructor(name) { super(name); }
	startGame() {
		G.correctionFunc = showCorrectWordInTitle;
		onkeydown = ev => {
			if (!canAct()) return;
			if (isdef(this.inputBox)) { this.inputBox.focus(); }
		}
	}
	startLevel() {
		G.keys = setKeysG(G, filterWordByLength, 25);
		if (G.keys.length < 25) { G.keys = setKeysG(G, filterWordByLength, 25, 'all'); }
		console.log(G.keys)
	}
	prompt() {
		console.log('showLabels: G', G.showLabels, G.labels);
		let showLabels = G.showLabels == true && G.labels == true;
		myShowPics(() => mBy(this.defaultFocusElement).focus(), {}, { showLabels: showLabels });
		setGoal();

		if (G.instruction == 'all') {
			showInstruction(Goal.label, G.language == 'E' ? 'type' : "schreib'", dTitle, true);
		} else if (G.instruction == 'spokenGoal') {
			let wr = G.language == 'E' ? 'type the correct word' : "schreib' das passende wort";
			let sp = (G.language == 'E' ? 'type' : "schreib'") + ' ' + Goal.label;
			showInstruction('', wr, dTitle, true, sp);
		} else {
			let wr = G.language == 'E' ? 'type the correct word' : "schreib' das passende wort";
			showInstruction('', wr, dTitle, true, wr);
		}

		mLinebreak(dTable);
		this.inputBox = addNthInputElement(dTable, G.trialNumber);
		this.defaultFocusElement = this.inputBox.id;

		activateUi();
		//return 10;
	}
	trialPrompt() {
		sayTryAgain();
		let n = G.trialNumber == 1 ? 1 : (G.trialNumber + Math.floor((Goal.label.length - G.trialNumber) / 2));

		showFleetingMessage(Goal.label.substring(0, n));
		mLinebreak(dTable);
		this.inputBox = addNthInputElement(dTable, G.trialNumber);
		this.defaultFocusElement = this.inputBox.id;

		return 10;
	}
	activate() {
		this.inputBox.onkeyup = ev => {
			if (!canAct()) return;
			if (ev.key === "Enter") {
				ev.cancelBubble = true;
				evaluate(ev);
			}
		};
		this.inputBox.focus();
	}
	eval(ev) {
		//console.log('#',G.trialNumber,'of',G.trials)
		let answer = normalize(this.inputBox.value, G.language);
		let reqAnswer = normalize(Goal.label, G.language);

		Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: iDiv(Goal) };
		if (answer == reqAnswer) {
			showFleetingMessage(Goal.label);
			return true;
		} else {
			//if (G.trialNumber == G.trials-1) dTitle.innerHTML = Goal.label;
			return false;
		}
	}

}

//unused:
class GMissingNumber extends Game {
	constructor(name) { super(name); }
	startGame() {
		G.successFunc = successThumbsUp;
		G.failFunc = failThumbsDown;
		G.correctionFunc = this.showCorrectSequence.bind(this);
	}
	showCorrectSequence() { return numberSequenceCorrectionAnimation(getNumSeqHint); }
	startLevel() {
		if (!isList(G.steps)) G.steps = [G.steps];
		G.numPics = 2;
		G.labels = false; // do not show labels for the thumbs up/down: TODO: should really do this in game/showThumbsUpDown
	}
	prompt() {
		mLinebreak(dTable, 12);

		showHiddenThumbsUpDown({ sz: 140 });
		mLinebreak(dTable);

		G.step = chooseRandom(G.steps);
		G.op = chooseRandom(G.ops);
		G.oop = OPS[G.op];
		G.seq = createNumberSequence(G.seqLen, G.minNum, G.maxNum, G.step, G.op);
		[G.words, G.letters] = showNumberSequence(G.seq, dTable);
		setNumberSequenceGoal();
		//console.log(G)

		mLinebreak(dTable);

		let instr1 = (G.language == 'E' ? 'complete the sequence' : "ergänze die reihe");
		showInstruction('', instr1, dTitle, true);

		if (G.showHint) {

			hintEngineStart(getNumSeqHintString, [0, 1, 2, 3, 4], 5000 + G.level * 1000);
		}

		activateUi();
	}
	trialPrompt() {
		let hintlist = G.trialNumber >= 4 ? [G.trialNumber] : range(G.trialNumber, 4);
		if (G.showHint) hintEngineStart(getNumSeqHintString, hintlist, 3000 + G.level * 1000);
		TOMain = setTimeout(() => getWrongChars().map(x => unfillChar(x)), 500);
		return 600;
	}
	activate() { onkeypress = this.interact; }
	interact(ev) {
		//console.log('key!');
		clearFleetingMessage();
		if (!canAct()) return;

		let sel = Selected = onKeyWordInput(ev);
		if (nundef(sel)) return;
		//console.log('===>', sel);

		//target,isMatch,isLastOfGroup,isVeryLast,ch
		let lastInputCharFilled = sel.target;
		console.assert(sel.isMatch == (lastInputCharFilled.letter == sel.ch), lastInputCharFilled, sel.ch);

		//all cases aufschreiben und ueberlegen was passieren soll!
		//TODO: multiple groups does NOT work!!!
		if (sel.isMatch && sel.isVeryLast) {
			deactivateFocusGroup();
			evaluate(true);
		} else if (sel.isMatch && sel.isLastOfGroup) {
			//it has been filled
			//remove this group from Goal.blankWords
			sel.target.isBlank = false;
			sel.target.group.hasBlanks = false;
			removeInPlace(Goal.blankWords, sel.target.group);
			removeInPlace(Goal.blankChars, sel.target);
			deactivateFocusGroup();
			console.log('haaaaaaaaaaaalo', Goal.isFocus)
			//console.log('=>', Goal)
		} else if (sel.isMatch) {
			//a partial match
			removeInPlace(Goal.blankChars, sel.target);
			sel.target.isBlank = false;
		} else if (sel.isVeryLast) {
			Selected.words = getInputWords();
			Selected.answer = getInputWordString();
			Selected.req = getCorrectWordString();
			deactivateFocusGroup();
			//console.log('LAST ONE WRONG!!!')
			evaluate(false);
			//user entered last missing letter but it is wrong!
			//can there be multiple errors in string?
		} else if (sel.isLastOfGroup) {
			//unfill last group

			Selected.words = getInputWords();
			Selected.answer = getInputWordString();
			Selected.req = getCorrectWordString();
			deactivateFocusGroup();
			evaluate(false);
			//user entered last missing letter but it is wrong!
			//can there be multiple errors in string?
		} else {
			if (!G.silentMode) { writeSound(); playSound('incorrect1'); }
			deactivateFocusGroup();
			//unfillCharInput(Selected.target);
			showFleetingMessage('does NOT fit: ' + Selected.ch, 0, { fz: 24 });
			setTimeout(() => unfillCharInput(Selected.target), 500);
		}
		//
	}

	eval(isCorrect) { return isCorrect; }

}
class GPasscode extends Game {
	constructor(name) { super(name); this.needNewPasscode = true; }
	clear() { clearTimeout(this.TO); clearTimeCD(); }
	startGame() {
		G.incrementLevelOnPositiveStreak = G.samplesPerGame;
		G.decrementLevelOnNegativeStreak = G.samplesPerGame;

	}
	startLevel() { this.needNewPasscode = true; }
	prompt() {
		G.trials = 1;
		if (this.needNewPasscode) {
			G.timeout = 1000;
			this.needNewPasscode = false;
			let keys = getRandomKeysFromGKeys(G.passcodeLength);
			myShowPics(null,
				{ border: '3px solid #ffffff80' },
				{ numRepeat: G.numRepeat, sameBackground: true }, keys);

			//console.log(Pictures)
			Goal = Pictures[0];
			//console.log('===>Goal',Goal);

			this.wort = (G.language == 'E' ? 'the passcode' : 'das Codewort');
			showInstruction(Goal.label, this.wort + (G.language == 'E' ? ' is' : ' ist'), dTitle, true);

			TOMain = setTimeout(anim1, 300, Goal, 500, showGotItButton);
		} else {
			G.timeout *= 2;
			doOtherStuff();
		}

	}
	eval(x) {
		CountdownTimer.cancel();
		// return super.eval(x);
		let isCorrect = super.eval(x);
		if (!isCorrect) this.needNewPasscode = true;
		return isCorrect;
		// //return the opposite, but no feedback!
		// if (isCorrect) return undefined; else return false;

	}
}
//TODO:
class GStory extends Game {
	constructor(name) { super(name); }
	prompt() {
		let showLabels = G.showLabels == true && G.labels == true;
		//console.log(G.showLabels, G.labels, showLabels)
		myShowPics(evaluate, {}, { showLabels: showLabels });
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
}

