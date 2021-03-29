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










