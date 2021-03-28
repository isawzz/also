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



