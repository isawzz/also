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
		setTimeout(() => { Pictures.map(x => removeLabel(x)) }, 1500);
		return 10;
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




