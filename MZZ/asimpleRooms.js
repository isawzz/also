class GMaze extends Game {
	constructor(name, o) { super(name, o); }
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);
			if (Goal.correctChoice.text == 'yes') this.showPath(); else this.colorComponents();
			//this.showPath();
			return 20000;
		};
		this.failFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
			mStyleX(this.dGraph, { opacity: 1 });
		}
		this.successFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
			mStyleX(this.dGraph, { opacity: 1 });
		}
	}
	prompt() {

		MNaGraph.destroy();

		this.trials = 1;
		[this.rows, this.cols] = [6 + this.level * 2, 6 + this.level * 2];

		let [rows, cols, sz, gap, szDoor] = [this.rows, this.cols, this.sz, this.gap, this.szDoor];
		let [wCell, hCell] = [sz, sz];
		let wTotal = cols * (wCell + gap);
		let hTotal = rows * (hCell + gap);
		let dGridOuter = this.dMaze = mDiv(dTable, { bg: 'BLUE', wmin: wTotal, hmin: hTotal });

		let g = this.graph = new MNaGraph(null, { noLabels: true, node: { bg: 'blue', w: 5, h: 5 }, edge: { w: 1 } }, [], false);
		let m = this.maze = newMazePlusGraph(cols, rows, g);

		let id = 'tMaze';
		setCSSVariable('--wCell', `${wCell}px`);
		setCSSVariable('--hCell', `${hCell}px`);
		let tMaze = createElementFromHtml(`
			<table id="${id}">
			<tbody></tbody>
			</table>
		`);
		mAppend(dGridOuter, tMaze);
		//console.log('maze', m);
		let sBorder = `${gap}px solid black`;
		for (var i = 0; i < m.length; i++) {
			$('#tMaze > tbody').append("<tr>");
			for (var j = 0; j < m[i].length; j++) {
				var selector = getCommonIdTable(i, j);;
				$('#tMaze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
				if (m[i][j][0] == 0) { $('#' + selector).css('border-top', sBorder); }
				if (m[i][j][1] == 0) { $('#' + selector).css('border-right', sBorder); }
				if (m[i][j][2] == 0) { $('#' + selector).css('border-bottom', sBorder); }
				if (m[i][j][3] == 0) { $('#' + selector).css('border-left', sBorder); }
				//mStyleX(mBy(selector), { bg: coin(30) ? 'random' : 'lightgreen' });
			}
			$('tMmaze > tbody').append("</tr>");
		}

		//hier drin kommt der graph!
		let rect = getRect(tMaze);
		let dGridOuter2 = this.dGraph = mDiv(dTable, { align: 'left', bg: 'aliceblue', maleft: 20, w: rect.w, h: rect.h });
		hide(this.dGraph);

		//#region prep container for multiple choices
		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);

		mLinebreak(dTable);
		//#endregion

		let q = chooseRandom([this.isThereAPath.bind(this)]);
		q();

		this.controller.activateUi.bind(this.controller)();
	}

	disconnect() {
		//get a random tile that has 2 openings!
		//it does need to be close to the middle!
		//let i=randomNumber(1,this.rows-1);

	}

	//#region qFuncs
	isThereAPath() {

		//this.showGraph(); //for testing!

		let [g, m, sz] = [this.graph, this.maze, this.sz];
		let cellFrom = getCommonIdTable(0, 0);
		let roomFrom = getCommonId(0, 0);
		let cell = mBy(cellFrom);

		mCellContent(cell, { w: sz / 2, h: sz / 2, fz: sz / 3, bg: 'green', fg: 'white', rounding: '50%' }, 'A');

		//get last cell!
		//this.rows-1,this.cols-1
		let [r2, c2] = [this.rows - 1, this.cols - 1];
		let tl2 = m[r2][c2];
		let cellTo = getCommonIdTable(r2, c2);
		let roomTo = getCommonId(r2, c2);
		let cell2 = mBy(cellTo);
		//console.log(cell2);
		// mStyleX(cell2, { bg: 'red' })
		// cell2.innerHTML = 'B';
		mCellContent(cell2, { w: sz / 2, h: sz / 2, fz: sz / 3, bg: 'red', fg: 'white', rounding: '50%' }, 'B');

		[this.roomFrom, this.roomTo] = [roomFrom, roomTo];
		//#region spoken and written instruction
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
		let fill1 = [`. "A"! `, ` A `];
		let fill2 = [`. "B"`, ` B`];
		let l = this.language;
		let sp = sp1[l][0] + fill1[0] + sp2[l][0] + fill2[0] + '?';
		let wr = sp1[l][1] + fill1[1] + sp2[l][1] + fill2[1] + '?';

		let voice = this.language == 'E' ? coin() ? 'ukMale' : 'zira' : this.language;

		//#endregion

		showInstructionX(wr, dTitle, sp, { voice: voice });

		let path = this.path = g.getShortestPathFromTo(this.roomFrom, this.roomTo);
		// let funcs = this.dijkstra = g.getShortestPathsFrom(idGraph);
		// let len = funcs.distanceTo('#' + roomTo);
		// let path = funcs.pathTo('#' + roomTo);

		if (coin(30)) this.rausSchneiden();
		//this.rausSchneiden();
		let len = g.getLengthOfShortestPath(this.roomFrom, this.roomTo); //verify that no longer a path!!!!!

		let answer = len != Infinity;
		console.log('answer', answer, len)
		let correct, incorrect;
		if (answer) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, this.dMaze, {});
	}

	rausSchneiden() {
		let [g, m, path] = [this.graph, this.maze, this.path];
		let ids = path.map(x => x.id());

		let edges = path.edges(); //get all edges of path

		//find random edge along the path
		let i = randomNumber(edges.length / 2, edges.length * 3 / 4);
		let edge = edges[i];
		let eid = edges[i].id();
		//console.log('edge id', eid);

		//remove this edge: right now, just color it!
		edge.style({ 'line-color': 'red' });
		g.removeEdge(edge);
		setTimeout(() => { g.removeEdge(edge); }, 2000);
		//verify that there is no longer a solution!

		//get maze cells connected by this edge
		let [r1, c1, i1, r2, c2, i2] = getRCI(edge.id());
		//console.log('row,col,idx', r1, c1, i1, r2, c2, i2)
		let [m1, cell1, m2, cell2] = [getMaze(m, r1, c1), getCell(r1, c1), getMaze(m, r2, c2), getCell(r2, c2)];

		//maze cells should set component i1,i2 from 1 to 0
		console.assert(m1[i1] && m2[i2], 'ERRRRRRRRRRRRRRRRRRRRR!!!!!!!!!!!!')
		m1[i1] = m2[i1] = 0;

		//table cells should set corresponding border
		setBorder(cell1, i1);
		setBorder(cell2, i2);



	}
	showPath() {
		let cells = getPathCells(this.path);
		leaveBreadCrumbs(cells);
		//for (const cell of cells) { mStyleX(cell, { bg: '#ffffff80' }); }
	}
	colorComponents() {
		//this.showGraph();
		let g=this.graph;

		let c1=g.getComponents();
		//get hue wheel!!!
		let wheel=getColorWheel('red',c1.length);
		console.log('wheel',wheel)
		let i=0;
		for(const c11 of c1){
			let nodes = c11.nodes();
			let ids = nodes.map(x=>x.id());

			console.log('nodes',ids);
			let cells = ids.map(x=>nodeIdToCell(x));
			leaveBreadCrumbs(cells,wheel[i]);i++;
		}

	}


	//#region helpers
	hideGraph() {
		this.graph.cy.unmount();
		hide(this.dGraph);
	}
	showGraph() {
		show(this.dGraph);
		this.graph.cy.mount(this.dGraph);
		// g.presetLayout();
		// g.reset();
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

