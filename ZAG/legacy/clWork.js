class GSentence extends Game {
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
		myShowPics(() => fleetingMessage('drag and drop the letters to form the word!'), {}, { });
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



