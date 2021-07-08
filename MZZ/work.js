class GMaze extends Game {
	constructor(name, o) { super(name, o); }
	clear(){super.clear(); if (isdef(this.maze)) this.maze.clear();}
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);
			if (Goal.correctChoice.text == 'yes') this.maze.breadCrumbs(this.path); else this.maze.colorComponents();

			return 20000;
		};
		this.failFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
			//mStyleX(this.dGraph, { opacity: 1 });
		}
		this.successFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
		}
	}
	startRound(){if (isdef(this.maze)) this.maze.clear();}
	prompt() {

		this.trials = 1;
		[this.rows, this.cols] = [6 + this.level * 2, 6 + this.level * 2];

		let maze = this.maze = new MazeGraph(dTable,this.rows,this.cols,this.sz,this.gap);

		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);
		mLinebreak(dTable);

		let q = chooseRandom([this.isThereAPath.bind(this)]);
		q();

		this.controller.activateUi.bind(this.controller)();
	}

	isThereAPath() {

		//this.maze.showGraph(); //for testing!

		//set content of start and goal cells
		let cellStart = this.maze.getTopLeftCell();
		//console.log('cellStart',cellStart)
		mCellContent(iDiv(cellStart), { w: '50%', h: '50%', fz: '60%', bg: 'green', fg: 'white', rounding: '50%' }, 'A');

		let cellGoal = this.maze.getBottomRightCell();
		mCellContent(iDiv(cellGoal), { w: '50%', h: '50%', fz: '60%', bg: 'red', fg: 'white', rounding: '50%' }, 'B');

		[this.roomFrom, this.roomTo] = [cellStart.nodeId, cellGoal.nodeId];

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

		showInstructionX(wr, dTitle, sp, { voice: voice });
		//#endregion

		let path = this.path = this.maze.getShortestPathFromTo(this.roomFrom, this.roomTo);

		console.assert(path.length < Infinity,'WAAAAAAAAAAAAAAS?');
		if (coin(this.level>2?50:40)) this.maze.cutPath(this.path,.5,.75);
		// this.maze.cutPath(this.path,.5,.75);
		let len = this.maze.getLengthOfShortestPath(this.roomFrom, this.roomTo); //verify that no longer a path!!!!!

		let answer = len != Infinity;
		console.log('answer', answer, len)
		let correct, incorrect;
		if (answer) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, this.maze.dMaze, {});
	}

	eval() {
		clearFleetingMessage();
		//console.log(Goal.buttonClicked)
		Selected = { reqAnswer: G.correctAnswer, answer: Goal.choice.text, feedbackUI: Goal.buttonClicked };

		//console.log('Selected', Selected);
		return (Goal.buttonClicked == Goal.buttonCorrect);
	}

}
