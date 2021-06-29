class GHouse extends Game {
	constructor(name, o) { super(name, o); }
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);
			return 20000;
		};

	}
	prompt() {
		this.trials = 1;
		let qFuncs = [this.howMany.bind(this), this.areRoomsConnected.bind(this), this.isThereAPath.bind(this)];
		let q = this.isThereAPath.bind(this);//chooseRandom(qFuncs); // 

		let n = randomNumber(this.nrooms / 2, this.nrooms);
		let wTotal = n < 4 || n > 12 ? 700 : n > 10 ? 600 : 500;
		let house = this.house = iHouse(dTable, n, { w: wTotal, h: 400 });
		this.rooms = house.rooms.map(x => Items[x]);
		this.walls = house.walls.map(x => Items[x]);
		this.doors = [];
		console.log('q',q.name,q.name.includes('Path'))
		this.addOneDoorPerRoom([q.name.includes('Path')?'s':'n','e']);
		this.addLabelsToRooms();

		//console.log('num rooms:',this.rooms.length)

		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);

		mLinebreak(dTable);
		let dGraph = mDiv(dTable, { w: wTotal, h: 100, bg: BLUE });
		this.graph = makePlanarGraph(dGraph, this.rooms, this.doors);
		hide(dGraph);

		q();

		this.controller.activateUi.bind(this.controller)();
	}
	//#region qFuncs
	isThereAPath() {
		let house = this.house;
		//console.log('G', this); let r1 = getRoomSE(house); console.log('SE', r1); return;
		//let [r1,r2] = getDiagRoomPairs(house);
		//console.log('diagOpposed', r);

		let corners = getCornerRoomsDict(house);
		// console.log('corners', corners);
		let nw = corners.NW;
		// console.log('nw', nw)
		let funcs = getShortestPathsFrom(nw);
		// console.log('funcs', funcs);
		let n2 = null;
		for (const k in corners) {
			if (k != 'NW') {
				let dist = funcs.distanceTo('#' + corners[k]);
				if (dist != Infinity && dist >= 3) {
					//take that node!
					n2 = corners[k];
					break;
				} else console.log('distance to', k, dist);
			}
		}
		if (!n2) { n2 = corners.SE; }
		showInstruction('', this.language == 'E' ? `is there a path from "${Items[nw].id}" to "${Items[corners.SE].id}"`
			: `gibt es einen weg von ${Items[nw].id} zu ${Items[n2].id}`, dTitle, true);
		let answer = funcs.distanceTo('#' + n2) != Infinity;
		let correct, incorrect;
		if (answer) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, iDiv(this.house), {});
	}
	howMany() {
		showInstruction('', this.language == 'E' ? 'how many units are there in this house?' : "wieviele wohneinheiten hat dieses haus?", dTitle, true);
		let numUnits = howManyComponents();
		// console.log(numUnits)
		let otherChoices = [
			numUnits * 2,
			Math.round(numUnits / 2),
			numUnits + randomNumber(1, 10)
		];
		let di = {};
		for (let i = 0; i < otherChoices.length; i++) {
			let n = otherChoices[i];
			while (n == numUnits || isdef(di[n])) { n += 1; } //console.log('!!!!!'); }
			di[n] = true;
			otherChoices[i] = n;
		}
		createMultipleChoiceElements({ num: numUnits, text: numUnits },
			otherChoices.map(x => ({ num: x, text: x })), this.dChoices, iDiv(this.house), {});

	}
	areRoomsConnected() {
		showInstruction('', this.language == 'E' ? 'are all rooms connected?' : "sind alle zimmer verbunden?", dTitle, true);
		let numUnits = howManyComponents();
		let correct, incorrect;
		if (numUnits == 1) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, iDiv(this.house), {});
	}

	//#region add stuff to house
	addLabelsToRooms() {
		let roomlist = ['bedroom', 'livingroom', 'bathroom', 'kitchen'];
		sortByFunc(this.rooms, x => x.rect.w * x.rect.h);
		this.rooms.map(x => addLabel(x, x.ch, {}));

	}
	addOneDoorPerRoom(directions) {
		//console.log('______________________')
		//console.log('rooms', this.rooms);
		//console.log('house', this.house);
		for (const r of this.rooms) {
			let door = makeRandomDoor(r, this.house, directions); this.doors.push(door);
		}
		//console.log('dooes', this.doors);
	}
	addWallFinderByMouseClick() {
		dTable.onclick = ev => {
			console.log(ev.clientX, ev.clientY);
			let w = findWall(ev.clientX, ev.clientY, this.walls);
			console.log('found wall', w)
		}
	}
	addFurnitureItems() {
		let keys = ['bed', 'bathtub', 'chair', 'couch and lamp', 'toilet', 'door', 'table'];//ByGroupSubgroup.Objects.household;
		let items = Pictures = genItemsFromKeys(keys);
		console.assert(arrLast(items).key == 'table', 'NOOOOOOO');
		let itable = arrLast(items);
		shuffle(items);
		let dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		for (const item of items) { let d = miPic(item, dWordArea); iAdd(item, { div: d }); }
		mStyleX(iDiv(itable), { fg: BROWN });

		enableDD(items, rooms, this.dropHandler.bind(this), false);
	}
	//#endregion

	eval() {
		clearFleetingMessage();
		Selected = { delay: 5000, reqAnswer: G.correctAnswer, answer: Goal.choice.text, feedbackUI: Goal.buttonClicked };

		//console.log('Selected', Selected);
		return (Goal.buttonClicked == Goal.buttonCorrect);
	}

}

function createMultipleChoiceElements(correctAnswer, wrongAnswers, dParent, dFeedbackUI, styles) {

	//console.log(correctAnswer)
	if (nundef(Goal)) Goal = {};
	let choices = wrongAnswers; choices.push(correctAnswer);
	Goal.correctChoice = correctAnswer;
	shuffle(choices);
	if (coin()) shuffle(choices);
	Goal.choices = choices;
	Goal.feedbackUI = dFeedbackUI;

	let idx = 0;
	for (const ch of choices) {
		////'&frac57;', //'&frac12;', 
		let dButton = mButton(ch.text, onClickChoice, dParent, { wmin: 100, fz: 36, margin: 20, rounding: 4, vpadding: 4, hpadding: 10 }, ['toggleButtonClass']);
		dButton.id = 'bChoice_' + idx; idx += 1;
		//	console.log('==============',ch,wp.result)
		if (ch.text == correctAnswer.text) {
			Goal.choice = ch.toString();
			Goal.buttonCorrect = dButton; //else console.log('ch', ch.toString(), 'res', wp.result.text)
		}
	}
}
function onClickChoice(ev) {
	let id = evToClosestId(ev);
	let b = mBy(id);
	let index = Number(stringAfter(id, '_'));
	Goal.choice = Goal.choices[index];
	Goal.buttonClicked = b;
	//console.log('clicked:',Goal.choice,Goal.correctChoice)
	if (Goal.choice == Goal.correctChoice) { mStyleX(b, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
	else { mXit(b, 100); }
	G.controller.evaluate.bind(G.controller)();
}

