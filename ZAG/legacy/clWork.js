class GRiddle extends Game {
	constructor(name) { super(name); }
	startGame() {
		G.successFunc = successThumbsUpPlus; G.failFunc = failThumbsDownPlus;
		G.correctionFunc = () => {
			// 	clearElement(this.dResult);
			mText('correct answer: ' + Goal.label, this.dResult, { fz: 40, matop: 20 }); 
			return 10000;
		};
	}

	prompt() {
		G.trials = 1;
		showInstruction('', 'Solve the Riddle:', dTitle, true);

		//console.log('starting story');

		let wp = this.wp = getRandomWP(1, G.maxIndex);
		let haveResult = wp.isTextResult = instantiateNames(wp);
		if (!haveResult) instantiateNumbers(wp);

		mLinebreak(dTable, 2);

		showHiddenThumbsUpDown(90);
		mLinebreak(dTable);
		let dArea = this.textArea = mDiv(dTable, { w: '70%' });
		let d = mText(wp.text, dArea, { fz: 28 });

		mLinebreak(dTable, 20);
		let dResult = this.dResult = mDiv(dTable);

		// this.createInputElements();
		Goal = { label: wp.result.text };
		this.createMultipleChoiceElements();

		mLinebreak(dTable);

		// console.log(wp.text); console.log(wp.result);


		activateUi();
	}
	createMultipleChoiceElements() {
		let wp = this.wp;

		let choices = [];
		if (wp.isTextResult) {
			choices = Object.values(wp.diNames);

		} else {
			let res = wp.result.number;
			choices = [res, res + randomNumber(1, 25), res / randomNumber(2, 5), res * randomNumber(2, 5)];
		}

		shuffle(choices);
		let dParent = this.dResult;
		for (const ch of choices) {
			let dButton = mButton(ch, (ev) => {
				//console.log('ev', ev)
				let id = evToClosestId(ev);
				let b = mBy(id);
				let x = b.innerHTML;
				//console.log('________________', x);
				let bg = x == Goal.label ? 'green' : 'red';
				mStyleX(b, { bg: bg })
				//console.log('clicked', b)
				//console.log('clicked', ch, Goal.label);
				Goal.buttonClicked = ev.target;
				evaluate(ch, Goal.label);
			}, dParent, { wmin:60, fz: 28, margin: 10, rounding: 4, vpadding: 4, hpadding: 10 }, ['toggleButtonClass']);
			dButton.id = 'b_' + ch;
			if (ch.toString() == wp.result.text) Goal.buttonCorrect = dButton;
		}

	}
	createInputElements() {
		this.inputBox = addNthInputElement(this.dResult, 0);
		this.defaultFocusElement = this.inputBox.id;
		onclick = () => mBy(this.defaultFocusElement).focus();
		mBy(this.defaultFocusElement).focus();
	}

	trialPrompt_dep() {
		sayTryAgain();
		let n = G.trialNumber; // == 1 ? 1 : (G.trialNumber + Math.floor((Goal.label.length - G.trialNumber) / 2));

		showFleetingMessage('try again!', 0, {}, true);

		this.inputBox = addNthInputElement(this.dResult, G.trialNumber);
		this.defaultFocusElement = this.inputBox.id;
		mLinebreak(dTable);

		return 10;
	}
	activate() { }//this.activate_input(); }
	activate_input() {
		this.inputBox.onkeyup = ev => {
			if (!canAct()) return;
			if (ev.key === "Enter") {
				ev.cancelBubble = true;
				evaluate(ev);
			}
		};
		this.inputBox.focus();
	}
	eval(answer, reqAnswer) {
		clearFleetingMessage();
		Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: Goal.button };
		return (answer == reqAnswer);
	}
	eval_dep(ev) {
		console.log('#', G.trialNumber, 'of', G.trials);
		clearFleetingMessage();
		Selected = {};
		let answer = normalize(this.inputBox.value, 'E');
		let reqAnswer = normalize(this.wp.result.text, 'E');
		console.log('answer', answer, 'req', reqAnswer);
		let isCorrect = answer == reqAnswer;
		Selected = { reqAnswer: reqAnswer, answer: answer, feedbackUI: isCorrect ? Goal.buttonClicked : Goal.buttonCorrect };
		return (answer == reqAnswer);
	}

}









