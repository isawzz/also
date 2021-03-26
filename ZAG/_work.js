class GAbacus extends Game {
	constructor(name) { super(name); }
	startGame() { G.successFunc = successThumbsUp; G.failFunc = failThumbsDown; G.correctionFunc = this.showCorrectSequence.bind(this); }
	showCorrectSequence() { let t = correctBlanks(); if (G.level<=1) showSayHint(3); return t + 1000; }
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

		console.log('showHint',G.showHint);

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

function makeItemDiv(item, options) {

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

	if (isdef(item.textShadowColor)) { applyColorkey(item, options); }
	return dOuter;

}








