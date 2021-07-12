class GColoku extends Game {
	startGame() {
		this.correctionFunc = () => {
			if (this.qName == 'isThisSudokuCorrect') {
				mStyleX(Goal.buttonCorrect, { bg: 'green' });
				animate(Goal.buttonCorrect, 'komisch', 1000);

				console.log('correct', Goal.correct)
				if (!Goal.correct) {
					animateColorScale(Goal.correctionFeedbackUI, Goal.item.color, 1.5, 1500);
					this.dComment.innerHTML = 'rule broken! duplicate in ' + Goal.err.type;
					// animate(Goal.correctionFeedbackUI, 'scaleInColor', 1000);
					//this.maze.breadCrumbs(this.path); else this.maze.colorComponents();
				} else {
					this.dComment.innerHTML = 'this coloku is correct!';
				}
			} else {

				this.dWordArea.remove();
				this.bDone.remove();
				this.dComment.innerHTML = 'rule broken! duplicate in ' + Goal.err.type;

				animateColorScale(Goal.correctionFeedbackUI, Goal.item.color, 1.5, 1500);

				// mXit(this.dGrid, 200);
			}

			return 20000;
		};
		this.failFunc = () => {
			if (this.qName == 'isThisSudokuCorrect') {
				if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
				else { mXit(Goal.buttonClicked, 100); }
				//mStyleX(this.dGraph, { opacity: 1 });
			} else {
				mXit(this.dGrid, 200);
			}
		}
		this.successFunc = () => {
			if (this.qName == 'isThisSudokuCorrect') {
				if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
				else { mXit(Goal.buttonClicked, 100); }
			} else {
				mCheckit(this.dGrid, 200);
			}
		}
	}
	prompt() {

		this.trials = 1;
		let [rows, cols] = [this.rows, this.cols];// = [4, 4];
		this.dGrid = mGrid(rows, cols, dTable, { position: 'relative', w: 300, h: 300, gap: 10, bg: 'white' });

		let o = getSudokuPatternFromDB(4, 4, 1);
		console.log('pattern', o.pattern, 'puzzle', o.puzzle);
		let [pattern, minPuzzle] = [this.pattern, this.minPuzzle] = [o.pattern, o.puzzle];
		// let pattern = this.pattern = getSudokuPattern(rows, cols);
		printMatrix(pattern, 'pattern');
		printMatrix(minPuzzle, 'puzzle');

		//jetzt kommt aehnliche frage wie bei maze
		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);
		mLinebreak(dTable);
		this.dComment = mDiv(dTable);
		mLinebreak(dTable);

		let qName = this.level == 0 && coin()? 'isThisSudokuCorrect':'solve';
		//let qName = this.qName = 'solve'; // solve | isThisSudokuCorrect
		this[qName]();
		//let q =this.q = this.solve.bind(this); //chooseRandom([this.isThisSudokuCorrect.bind(this),this.solve.bind(this)]);
		//q=this.isThisSudokuCorrect.bind(this);
		//q();

		this.controller.activateUi.bind(this.controller)();
	}
	fillGrid(pattern) {
		//fill grid w/ colored divs
		let items = this.items = [];
		let colors = this.colors = [RED, YELLOW, BLUE, GREEN];
		let [rows, cols, dGrid] = [this.rows, this.cols, this.dGrid];
		shuffle(colors);
		for (let r = 0; r < rows; r++) {
			let arr = [];
			for (let c = 0; c < cols; c++) {
				let nch = pattern[r][c];

				let color = isNumber(nch) ? colors[pattern[r][c]] : null;
				let d = mDiv(dGrid, { bg: color }, getUID());
				let item = { row: r, col: c, id: d.id, color: color, val: nch };
				iAdd(item, { div: d });
				arr.push(item);
			}
			items.push(arr);
		}
		return items;
	}
	makeLines(){
		let [wline,dGrid] = [2,this.dGrid];
		let gSize = getSize(dGrid);
		console.log('size:', gSize);
		let rh = makeRect((gSize.w - wline) / 2, 0, wline, gSize.h);
		let rv = makeRect(0, (gSize.h - wline) / 2, gSize.w, wline);
		let vLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rh.l, top: rh.t, w: rh.w, h: rh.h });
		let hLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rv.l, top: rv.t, w: rv.w, h: rv.h });


	}
	setGoal(pattern) {
		let err = checkSudokuRule(pattern);
		let answer = (err == null); console.log('correct', answer);
		if (err) console.log('err', err.type, '[' + err.row + ',' + err.col + ']');
		//find the tile where the error really is!
		Goal = { correct: answer, err: err };
	}
	isThisSudokuCorrect() {

		this.trials = 1;

		let [pattern, rows, cols, dGrid] = [this.pattern, this.rows, this.cols, this.dGrid];
		//if (coin()) destroySudokuRule(pattern, rows, cols);
		destroySudokuRule(pattern, rows, cols);

		this.setGoal(pattern);

		let items = this.fillGrid(pattern);
		this.makeLines();
		let wsp = {
			D: 'ist dieses coloku korrekt?',
			E: 'is this coloku correct?',
			S: 'es este coloku correcto?',
			F: 'est ce que ce coloku est exacte?',
		};
		let sp = wsp[this.language];
		showInstructionX(sp, dTitle, sp);

		showFleetingMessage('rule: each color must be unique in every row, column and quadrant!', 15000);

		console.log('answer', Goal.correct, Goal.err);
		let correct, incorrect;
		if (Goal.correct) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		let feedbackUI = Goal.correctionFeedbackUI = Goal.correct ? this.dGrid : iDiv(this.items[Goal.err.row][Goal.err.col]);
		createMultipleChoiceElements(correct, incorrect, this.dChoices, feedbackUI, {});
		Goal.item = Goal.correct ? this.items[0] : this.items[Goal.err.row][Goal.err.col];



	}
	solve() {
		//take a few pieces out
		//this.numMissing = 1; //das wird dann automatisiert!

		//take a random number out of puzzle
		let [rrand, crand] = [randomNumber(0, this.rows - 1), randomNumber(0, this.cols - 1)];
		let puzzle = this.puzzle = jsCopy(this.pattern);

		//find all possible r,c that can be removed (=are empty in min version of puzzle)
		let [min, rows, cols] = [this.minPuzzle, this.rows, this.cols];
		let combis = [];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (min[r][c] === ' ') combis.push({ row: r, col: c });
			}
		}

		//take numMissing of these randomly
		let combisToRemove = choose(combis, this.numMissing);

		//remove these entries from pattern to get real puzzle!
		for (const o of combisToRemove) {
			puzzle[o.row][o.col] = ' ';
		}

		printMatrix(puzzle, 'puzzle');
		this.fillGrid(puzzle);
		this.makeLines();

		let sp = 'solve this coloku!'
		showInstructionX(sp, dTitle, sp);

		showFleetingMessage('rule: each color must be unique in every row, column and quadrant!', 15000);

		//containers should be divs of empty (unset) puzzle
		let itemlist = this.itemlist = arrFlatten(this.items);
		console.log('items', itemlist);
		let containers = this.containers = itemlist.filter(x => x.val === ' ');
		console.log('containers', containers)

		let dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		let colorItems = this.colorItems = [];
		for (const color of this.colors) {
			let colorItem = { id: getUID(), color: color };
			let d = mDiv(dWordArea, { w: 40, h: 40, bg: color, margin: 10 }, colorItem.id);
			iAdd(colorItem, { div: d });
			colorItems.push(colorItem);
		}

		enableDD(colorItems, containers, this.dropHandler.bind(this), true);
		mLinebreak(dTable, 50);
		this.bDone = mButton('Done!', this.controller.evaluate.bind(this.controller), dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);

	}
	dropHandler(source, target, isCopy = true) {
		let dSource = iDiv(source);
		let dTarget = iDiv(target);
		mStyleX(dTarget, { bg: source.color });
		target.color = source.color;
		target.val = this.colors.indexOf(source.color);

	}

	evalIsCorrect() {
		Selected = { feedbackUI: Goal.buttonClicked };
		//console.log('Selected', Selected);
		return Goal.buttonClicked == Goal.buttonCorrect;
	}
	evalSolve() {
		//compare pattern to item values
		let [items, pattern, rows, cols] = [this.items, this.pattern, this.rows, this.cols];
		//mach ein pattern!
		console.log('flat', arrFlatten(this.items));
		let pat = items.map(x => x.map(y => y.val));
		printMatrix(pat, 'trial!');

		this.setGoal(pat);
		if (Goal.err) {
			Goal.correctionFeedbackUI = iDiv(this.items[Goal.err.row][Goal.err.col]);
			Goal.item = this.items[Goal.err.row][Goal.err.col];
		}

		Selected = { feedbackUI: this.dGrid };
		return Goal.correct;
	}
	eval() {
		clearFleetingMessage();
		//console.log(Goal.buttonClicked)
		return this.qName == 'solve' ? this.evalSolve() : this.evalIsCorrect();
	}

}


