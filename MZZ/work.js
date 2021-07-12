class GColoku extends Game {
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);

			console.log('correct',Goal.correct)
			if (!Goal.correct) {
				animateColorScale(Goal.correctionFeedbackUI, Goal.item.color, 1.5, 1500);
				this.dComment.innerHTML = 'rule broken! duplicate in '+Goal.err.type;
				// animate(Goal.correctionFeedbackUI, 'scaleInColor', 1000);
				//this.maze.breadCrumbs(this.path); else this.maze.colorComponents();
			}else{
				this.dComment.innerHTML = 'this coloku is correct!';
			}

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
	prompt() {

		let [rows, cols] = [this.rows, this.cols] = [4, 4];
		this.dGrid = mGrid(rows, cols, dTable, { position: 'relative', w: 300, h: 300, gap: 10, bg: 'white' });
		let pattern = this.pattern = getSudokuPattern(rows, cols);
		printMatrix(pattern, 'pattern');

		//jetzt kommt aehnliche frage wie bei maze
		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);
		mLinebreak(dTable);
		this.dComment = mDiv(dTable);
		mLinebreak(dTable);

		let q = chooseRandom([this.isThisSudokuCorrect.bind(this)]);
		q();

		this.controller.activateUi.bind(this.controller)();
	}
	isThisSudokuCorrect() {

		this.trials = 1;

		let [pattern, rows, cols, dGrid] = [this.pattern, this.rows, this.cols, this.dGrid];
		//if (coin()) destroySudokuRule(pattern, rows, cols);
		destroySudokuRule(pattern, rows, cols);

		let err = checkSudokuRule(pattern);
		let answer = err == null; console.log('correct', answer);
		if (err) console.log('err', err.type, '[' + err.row + ',' + err.col + ']');
		//find the tile where the error really is!
		Goal = { correct: answer, err: err };

		//fill grid w/ colored divs
		let items = this.items = [];
		let colors = this.colors = [RED, YELLOW, BLUE, GREEN];
		shuffle(colors);
		for (let r = 0; r < rows; r++) {
			let arr = [];
			for (let c = 0; c < cols; c++) {
				let color = colors[pattern[r][c]];
				let d = mDiv(dGrid, { bg: color }, getUID());
				let item = { row: r, col: c, id: d.id, color: color };
				iAdd(item, { div: d });
				arr.push(item);
			}
			items.push(arr);
		}

		let wline = 2;
		let gSize = getSize(dGrid);
		console.log('size:', gSize);
		let rh = makeRect((gSize.w - wline) / 2, 0, wline, gSize.h);
		let rv = makeRect(0, (gSize.h - wline) / 2, gSize.w, wline);
		let vLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rh.l, top: rh.t, w: rh.w, h: rh.h });
		let hLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rv.l, top: rv.t, w: rv.w, h: rv.h });

		let wsp = {
			D: 'ist dieses coloku korrekt?',
			E: 'is this coloku correct?',
			S: 'es este coloku correcto?',
			F: 'est ce que ce coloku est exacte?',
		};
		showInstructionX(wsp[this.language], dTitle, wsp);

		showFleetingMessage('rule: each color must be unique in every row, column and quadrant!', 15000);

		console.log('answer', Goal.correct, Goal.err);
		let correct, incorrect;
		if (Goal.correct) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		let feedbackUI = Goal.correctionFeedbackUI = Goal.correct ? this.dGrid : iDiv(this.items[Goal.err.row][Goal.err.col]);
		createMultipleChoiceElements(correct, incorrect, this.dChoices, feedbackUI, {});
		Goal.item=Goal.correct?this.items[0]:this.items[Goal.err.row][Goal.err.col];



	}
	eval() {
		clearFleetingMessage();
		//console.log(Goal.buttonClicked)
		Selected = { reqAnswer: G.correctAnswer, answer: Goal.choice.text, feedbackUI: Goal.buttonClicked };

		//console.log('Selected', Selected);
		return (Goal.buttonClicked == Goal.buttonCorrect);

	}

}


