function filterWordByLength(k, w) { 
	//console.log('k',k,'w',w,'max',G.maxWordLength,'min',G.minWordLength)
	if (nundef(G.minWordLength)) G.minWordLength=0;
	return w.length <= G.maxWordLength && w.length >= G.minWordLength && !w.includes(' '); 
}
class GElim extends Game {
	constructor(name) { super(name); }
	startGame() {
		G.correctionFunc = () => { writeSound(); playSound('incorrect1'); return G.spokenFeedback ? 1800 : 300; };
		G.successFunc = () => { Goal.pics.map(x => x.div.style.opacity = .3); successPictureGoal(); }
	}
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		this.piclist = [];
		let colorKeys = G.numColors > 1 ? choose(G.colors, G.numColors) : null;
		let showRepeat = G.numRepeat > 1;
		myShowPics(this.interact.bind(this), { contrast: G.contrast, },
			{ showRepeat: showRepeat, colorKeys: colorKeys, repeat: G.numRepeat });

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
		// let pic = firstCond(Pictures, x => x.div.id == id);
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
		Selected = { piclist: this.piclist, feedbackUI: isCorrect ? Goal.pics.map(x => x.div) : this.lastPic.div };
		return isCorrect;
	}
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








