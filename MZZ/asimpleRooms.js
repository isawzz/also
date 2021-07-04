class GHouse extends Game {
	constructor(name, o) { super(name, o); }
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);
			mStyleX(this.dGraph, { opacity: 1 });
			//if (this.q.name.includes('isThereAPath')) 
			// this.showPath();
			return 20000;
		};
		this.failFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
		
		}
		this.successFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
		
		}
	}
	prompt() {

		MGraph.destroy();

		this.trials = 1;
		let n = randomNumber(this.nrooms / 2, this.nrooms); //console.log('n',n)

		let qFuncs = [this.howMany.bind(this), this.areRoomsConnected.bind(this)];
		if (n > 5) qFuncs.push(this.isThereAPath.bind(this));
		let q = this.q = this.level > 1 ? arrLast(qFuncs) : chooseRandom(qFuncs); // this.isThereAPath.bind(this);//
		let s = n;
		let wTotal = n < 4 || n > 12 ? 700 : n > 10 ? 600 : 500;
		let house = this.house = iHouse(dTable, s, { w: wTotal, h: 400 });
		let rooms = this.rooms = house.rooms.map(x => Items[x]);
		this.addLabelsToRooms();

		// let door = iDoor('g', 'e'); doors.push(door);
		let dirs = coin() ? ['n', 'w'] : ['s', 'e'];
		let doors = this.doors = [];
		for (const r of rooms) {
			let dir = coin() ? dirs[0] : dirs[1];
			let door = iDoor(r.id, dir);
			doors.push(door);
		}

		if (q.name.includes('Path')) hideOuterDoors(house);

		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);

		mLinebreak(dTable);
		let dGraph = this.dGraph = mDiv(dTable, { align: 'left', position: 'relative', w: wTotal, h: 300, rounding: 10, matop: 10, bg: 'skyblue' });
		let els = convertToGraphElements(house);
		let g1 = this.graph = new MGraph(dGraph, {}, els, Username!='gul');
		storeRoomPositions(g1);
		g1.presetLayout();
		g1.reset();
		//if (Username == 'gul') hide(dGraph);
		//hide(dGraph);
		mStyleX(dGraph, { opacity: 0 });

		q();

		this.controller.activateUi.bind(this.controller)();
	}
	//#region qFuncs
	isThereAPath() {
		let house = this.house;
		let corners = getCornerRoomsDict(house); //console.log('corners', corners); 
		let clist = Object.values(corners);	//console.log('cornerlist',clist);
		let g = this.graph;

		let id = g.getNodeWithMaxDegree(clist); //console.log('max degree node:',id);
		let cornerRoomIds = g.sortNodesByDegree(clist).map(x => x.id());
		//console.log('nodes',cornerRoomIds);

		let [r1, r2] = [Items[cornerRoomIds[0]], Items[cornerRoomIds[1]]]; //take first 2 nodes, and order by dir: n,e,
		if (r1 == r2 || areNeighbors(r1, r2) && cornerRoomIds.length > 2) r2 = Items[cornerRoomIds[2]];
		if (!r1.isW && (r2.isW || !r1.N)) [r1, r2] = [r2, r1];

		//console.log('from room',r1.id,r1,'to room',r2.id,r2);

		let roomFrom = r1.id; // corners.NW; 	// console.log('nw', nw)
		let funcs = this.dijkstra = g.getShortestPathsFrom(roomFrom);	// console.log('funcs', funcs);
		let roomTo = r2.id; //null;
		for (const k in corners) {
			if (k != 'NW') {
				let dist = funcs.distanceTo('#' + corners[k]);
				if (dist != Infinity && dist >= 3) {
					roomTo = corners[k];
					break;
				} //else console.log('distance to', k, dist);
			}
		}
		if (!roomTo) { roomTo = corners.SE; }

		//#region spoken and written instruction
		//setLanguageHALLO('F');


		this.roomFrom = roomFrom;
		this.roomTo = roomTo;

		let sp1 = {
			D: ['gibt es einen weeg von', 'gibt es einen weg von'],
			E: ['is there a path from', 'is there a path from'],
			S: ['hay un camino de', 'hay un camino de'],
			F: ["y a 'til un chemin de", "y a 'til un chemin de"],
		};
		let sp2 = {
			D: ['zu', 'zu'],
			E: ['to', 'to'],
			S: ['a', 'a'],
			F: ['!. a! ', 'à'],
		};
		let fill1 = [`. "${Items[roomFrom].id.toUpperCase()}"! `, ` ${Items[roomFrom].id} `];
		let fill2 = [`. "${Items[roomTo].id.toUpperCase()}"`, ` ${Items[roomTo].id}`];
		let l = this.language;
		let sp = sp1[l][0] + fill1[0] + sp2[l][0] + fill2[0] + '?';
		let wr = sp1[l][1] + fill1[1] + sp2[l][1] + fill2[1] + '?';

		// let wr = this.language == 'E' ? `is there a path from ${Items[nw].id} to ${Items[n2].id}` : `gibt es einen weg von ${Items[nw].id} zu ${Items[n2].id}`;
		// // let sp = this.language == 'E' ? `is there a path from: "${Items[nw].id.toUpperCase()}", to: "${Items[corners.SE].id.toUpperCase()}"`: `gibt es einen weg von ${Items[nw].id} zu ${Items[n2].id}`;
		// let sp = this.language == 'E' ? `is there a path from: "${Items.a.id.toUpperCase()}", to: "${Items.a.id.toUpperCase()}"` : `gibt es einen weeg von ${Items[nw].id} zu ${Items[n2].id}`;
		//sp = `is there a path from. "A"! to. "A"`;

		let voice = this.language == 'E' ? coin() ? 'ukMale' : 'zira' : this.language;

		//showInstruction('', wr, dTitle, true, sp, 20, 'david');		
		//#endregion

		showInstructionX(wr, dTitle, sp, { voice: voice });

		let answer = funcs.distanceTo('#' + roomTo) != Infinity;
		let correct, incorrect;
		if (answer) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, iDiv(this.house), {});
	}
	howMany() {
		showInstruction('', this.language == 'E' ? 'how many units are there in this house?' : "wieviele wohneinheiten hat dieses haus?", dTitle, true);
		let numUnits = this.graph.getNumComponents(); //howManyComponents();
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
		let numUnits = this.graph.getNumComponents(); //howManyComponents();
		let correct, incorrect;
		if (numUnits == 1) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, iDiv(this.house), {});
	}

	//#region helpers
	showPath() {
		//how to get path from this.roomFrom to this.roomTo?
		//console.log('from',this.roomFrom,'to',this.roomTo);
		mStyleX(this.dGraph, { opacity: 1 });
		// show(this.dGraph);
		//let path = this.path = getPathNodes(this.dijkstra);


		//console.log('path',path);
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
		Selected = { reqAnswer: G.correctAnswer, answer: Goal.choice.text, feedbackUI: Goal.buttonClicked };

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
	// if (Goal.choice == Goal.correctChoice) { mStyleX(b, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
	// else { mXit(b, 100); }
	G.controller.evaluate.bind(G.controller)();
}

