
function getInstance(G) {
	return new (Daat.GameClasses[G.id])(G.id);
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
function myPresent(dArea, items, options) {
	//console.log(options, items)
	let w = options.w; //window.innerWidth-70;
	let h = options.h; //window.innerHeight-150;
	let [wi, hi, rows, cols] = calcRowsColsSizeAbWo(items.length, w, h, options.showLabels);
	let gap = wi * .1; wi -= gap; hi -= gap;
	let fzPic = options.fzPic = Math.min(wi * .8, G.showLabels ? hi * .6 : hi * .75);
	//console.log('fzPic',fzPic,G.showLabels)
	let fz = options.fz = idealFontSize(options.wLongest, wi, hi / 3);
	options.szPic = { w: wi, h: hi };
	//console.log(items[0]);
	//console.log('dims', w, h, wi, hi, rows, cols, fzPic, fz);
	let outerStyles = {
		w: wi, h: hi, margin: gap / 2, rounding: 6,
		bg: valf(options.ifs.bg, 'random'), fg: 'contrast', display: 'inline-flex', 'flex-direction': 'column',
		'justify-content': 'center', 'align-items': 'center',
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
		let dLabel,dPic;
		if (options.showPic) {dPic = mDiv(dOuter, picStyles);		dPic.innerHTML = item.info.text;}
		//console.log('showLabels ',options.showLabels)
		if (options.showLabels) dLabel = mText(item.label, dOuter, labelStyles);
		if (options.showRepeat) addRepeatInfo(dOuter, item.iRepeat, wi);		
		iAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });
	}
	items.map(x => mAppend(dArea, iDiv(x)));
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
function myShowPics(handler, ifs = {}, options = {}, keys, labels) {
	//O
	options = getOptionsMinimalistic(dTable, handler, window.innerWidth - 180, window.innerHeight - 220, ifs, options, G);
	options.ifs = ifs;
	//console.log(options)
	//I
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	let items = Pictures = genItemsFromKeys(keys, options);
	if (isdef(labels)) {
		options.showLabels = true;
		for (let i = 0; i < items.length; i++) item[i].label = labels[i % labels.length];
	}
	//L
	myPresent(dTable, items, options);
	return items;
}

class Game {
	constructor(name) { this.name = name; }
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }
	startGame() { }
	startLevel() { }
	startRound() { }
	prompt() {
		Pictures = myShowPics(evaluate);
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
	showCorrectSequence() { let t = correctBlanks(); if (G.level <= 1) showSayHint(3); return t + 1000; }
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

		console.log('showHint', G.showHint);

		if (G.level <= 1 && G.showHint) hintEngineStart(getOperationHintString, [0, 1], 5000 + G.level * 1000);

		activateUi();
	}
	trialPrompt() {
		if (G.level <= 1 && G.showHint) hintEngineStart(getOperationHintString, [0, 1], 5000 + G.level * 1000);
		setTimeout(() => getWrongChars().map(x => unfillChar(x)), 500);
		return 10;
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
		// console.log('____________ calling setKeys')

		//let f = (k, w) => w.length <= G.maxWordLength && w.length >= G.minWordLength && !w.includes(' ')
		//console.log('f', f)
		G.keys = setKeys({
			lang: G.language, keysets: KeySets, key: 'all',
			filterFunc: filterWordByLength, //(k, w) => w.length <= G.maxWordLength && w.length >= G.minWordLength && !w.includes(' ')
		});
		//return;
		// console.log(G.keys)
		if (G.keys.length < 25) {
			G.keys = setKeys({
				lang: G.language, keysets: KeySets, key: 'all',
				filterFunc: filterWordByLength, //(k, w) => w.length <= G.maxWordLength && w.length >= G.minWordLength && !w.includes(' ')
			});
		}
		// console.log(G.keys)
		//console.log('keys', G.keys)
	}
	prompt() {
		let showLabels = G.showLabels == true && G.labels == true;
		myShowPics(() => fleetingMessage('drag and drop the letters to form the word!'), {}, { showLabels: showLabels });
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
			this.inputs.map(x => x.div.innerHTML = '_')
			// mClass(d, 'blink');
		}, 1500);

		return 10;
	}
	eval(w, word) {
		Selected = { answer: w, reqAnswer: word, feedbackUI: iDiv(Goal) }; //this.inputs.map(x => x.div) };
		//console.log(Selected);
		return w == word;
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
		myShowPics(this.interact.bind(this), { bg: 'white' },// { contrast: G.contrast, },
			{ showRepeat: showRepeat, colorKeys: colorKeys, numRepeat: G.numRepeat, contrast: G.contrast });

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
		let showLabels = G.showLabels == true && G.labels == true;
		myShowPics(this.interact.bind(this),
			{ border: '3px solid #ffffff80' },
			{ numRepeat: G.numRepeat, sameBackground: true, showLabels: showLabels });
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
		setTimeout(() => getWrongChars().map(x => unfillChar(x)), 500);
		return 10;
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
class GNamit extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }
	prompt() {
		myShowPics(null, {}, { rows: 1, showLabels: false });

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
		setTimeout(() => { Pictures.map(x => removeLabel(x)) }, 1500);
		return 10;
	}
	eval() {
		this.piclist = Pictures;
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => x.div), sz: getRect(this.piclist[0].div).h };
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
class GTouchPic extends Game {
	constructor(name) { super(name); }
	prompt() {
		//console.log('showLabels',showLabels,G.showLabels)
		//console.log(G.showLabels, G.labels, showLabels)
		Pictures = myShowPics(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
}
class GTouchColors extends Game {
	constructor(name) { super(name); }
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		let colorKeys = choose(G.colors, G.numColors);
		let showLabels = G.showLabels == true && G.labels == true;
		myShowPics(evaluate, { contrast: G.contrast }, { colorKeys: colorKeys, showLabels: showLabels });
		if (G.shuffle == true) {
			console.log('HAAAAAAAAAAAAAAAAAAAAAAAALO')
			//shuffle(Pictures);
			let dParent = Pictures[0].div.parentNode;
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
		G.keys = setKeys({
			lang: G.language, keysets: KeySets, key: G.instruction == 'all' ? 'all' : G.vocab,
			filterFunc: (k, w) => w.length <= G.maxWordLength && w.length >= G.minWordLength && !w.includes(' ')
		});

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

		Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: Goal.div };
		if (answer == reqAnswer) {
			showFleetingMessage(Goal.label);
			return true;
		} else {
			//if (G.trialNumber == G.trials-1) dTitle.innerHTML = Goal.label;
			return false;
		}
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
		return 10;
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

		Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: Goal.div };

		if (isEmpty(answer)) return false;
		else return isSimilar(answer, reqAnswer) || isList(Goal.info.valid) && firstCond(Goal.info.valid, x => x.toUpperCase() == answer.toUpperCase());

	}
}
class GPremem extends Game {
	constructor() { super(); this.piclist = []; }
	prompt() {
		this.piclist = [];
		//console.log(G)
		let showLabels = G.showLabels == true && G.labels == true;
		myShowPics(this.interact.bind(this),
			{ border: '3px solid #ffffff80' }, // border: '3px solid #ffffff80'
			{ numRepeat: G.numRepeat, sameBackground: G.sameBackground, showLabels: showLabels }), //, showLabels: false });
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
		Selected = { piclist: piclist, feedbackUI: piclist.map(x => x.div), sz: getRect(piclist[0].div).h };
		let req = Selected.reqAnswer = piclist[0].label;
		Selected.answer = piclist[piclist.length - 1].label;
		if (Selected.answer == req) { return true; } else { return false; }
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
		let showRepeat = G.numRepeat > 1;

		myShowPics(this.interact.bind(this), { contrast: G.contrast, },
			{ showRepeat: showRepeat, colorKeys: colorKeys, numRepeat: G.numRepeat });

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
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => x.div), sz: getRect(this.piclist[0].div).h };
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
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => x.div), sz: getRect(this.piclist[0].div).h };
		return isCorrect;
	}
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
class GCats extends Game {
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
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => x.div), sz: getRect(this.piclist[0].div).height };
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


