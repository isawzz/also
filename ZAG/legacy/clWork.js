class GPremem extends Game {
	constructor() { super(); this.piclist = []; }
	prompt() {
		this.piclist = [];
		//console.log(G)
		let showLabels = G.showLabels == true && G.pictureLabels == true;
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
		Selected = { piclist: piclist, feedbackUI: piclist.map(x => iDiv(x)), sz: getRect(iDiv(piclist[0])).h };
		let req = Selected.reqAnswer = piclist[0].label;
		Selected.answer = piclist[piclist.length - 1].label;
		if (Selected.answer == req) { return true; } else { return false; }
	}
}




