class GCats extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = showCorrectPictureLabels; G.failFunc = failSomePictures; }

	startLevel() {
		let data = genCats();
		let options = this.options = {};
		this.keysByCat = data;
		this.cats = Object.keys(this.keysByCat);
		this.lists = Object.values(this.keysByCat);
		this.keylists = [];
		for (const k in this.keysByCat) { this.keylists.push({ keys: data[k], cat: k }); }
		// this.keylists = Object.values(this.keysByCat);
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
		//OIL for category boxes
		//clearElement(dParent);
		showInstruction('', G.language == 'E' ? 'drag words to categories' : "ordne die texte in kategorien", dTitle, true);
		mLinebreak(dTable);

		let dArea = mDiv(dTable, { display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });//,{layout:'fhcc'})
		let containers = this.containers = createContainers(this.cats, dArea); //['animals', 'sport', 'transport'], dArea);
		mLinebreak(dArea);
		console.log('lists', this.keylists);
		let items = Pictures = getNItemsPerKeylist(1, this.keylists, this.options);
		shuffle(items);
		for (const item of items) { // ['horse', 'soccer', 'bird']) {
			let d = mText(item.label, dArea, { bg: 'orange', rounding: 4, margin: 8, wmin: 70, padding: 2 });
			iAdd(item, { div: d });
		}

		enableDD(items, containers, this.dropHandler.bind(this), false);

		mLinebreak(dTable, 50);
		mButton('Done!', evaluate, dTable, { fz: 32, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
		activateUi();
		//add a submit button that triggers evaluation
	}
	eval() {
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
		console.log('items',Pictures);
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
function belongsToCategory(item, cat) {
	let info = item.info;
	cat = cat.toLowerCase();
	if (isdef(info.cats) && info.cats.includes(cat)) return true;
	if (isdef(info.group) && info.group.toLowerCase().includes(cat)) return true;
	if (isdef(info.subgroup) && info.group.toLowerCase().includes(cat)) return true;
	return false;

}




