function test10_syms() {
	//clearElement(dTable);

	zPicS(chooseRandom(SymKeys), dTable,{sz:200,bg:'random',fg:'random'});
}









function showGotItButton() {
	mLinebreak(dTable);
	mButton('Got it!', doOtherStuff, dTable, { fz: 42 });
}
function doOtherStuff() {
	// test04_subGame();	
	//test04_justABlankPage();
	// test04_blankPageWithMessageAndCountdownAndBeep('think about the passcode!');
	test05_popup('think about the passcode!');
}




function test04_textItems(){
	clearElement(dTable);
	let keys = getRandomKeysIncluding(12, 'bee', 'all');
	//console.log('keys', keys);

	// let iGoal = keys.indexOf(this.goal.key);
	let rows=3;
	let items = getLbls(null, undefined, { rows: rows, showLabels: true }, keys);



	// let items = getRandomItems(12,'life',true,true);
	console.log('items',items)
	presentItems(items, dTable, rows);
}


function test06_submit() {
	showSubmitForm(dTable);
}

var imageCounter = -1;
function test05_popup(msg, ms) {
	let dPopup = mBy('dPopup');
	show(dPopup);
	clearElement(dPopup);
	let dOuter = mDiv(dPopup);

	let long = 4000;
	let superlong = 20000;
	if (isdef(ms)) { G = { timeout: ms }; }//G.timeout=long+1;

	imageCounter += 1;

	mLinebreak(dOuter, 25);
	if (G.timeout > long) {
		let dpics = mDiv(dOuter, { layout: 'fh' });

		if (G.timeout < superlong) {
			sayRandomVoice(Settings.language == 'E' ? 'walk around until the beep!' : "geh' herum bis zum signal!");
			//loadRandomTaeOrPosturePic(dpics);
			loadWalker(dpics);
		} else {
			sayRandomVoice(Settings.language == 'E' ? 'exercise until the beep!' : 'mach bewegung bis zum signal!');
			if (coin()) loadRandomExerciser2(dpics); else loadRandomExerciser(dpics); //,imageCounter);
		}
		// sayRandomVoice(Settings.language == 'E' ? 'exercise until the beep!' : 'mach bewegung bis zum signal!');
		//sayRandomVoice(Settings.language == 'E' ? 'move or exercise until the beep!' : 'turne oder bewege dich bis zum signal!');


		// let imgs = ['tae', 'posture'];
		// let nums = ['01', '02', '03', '04'];
		// mImage(`../assets/images/postures/${chooseRandom(imgs)}0${randomNumber(1,8)}.jpg`, dpics,200,200);
		mLinebreak(dOuter, 25);
	} else {
		mLinebreak(dOuter, 35);

	}

	mText(msg, dOuter, { family: 'AlgerianRegular', fz: 32, fg: 'indigo', align: 'center' });

	mLinebreak(dOuter, 25);

	//return;

	let dt = mDiv(dOuter, { fg: 'red', fz: 44 });
	if (nundef(G) || nundef(G.timeout)) { G = { timeout: 3000 } };
	startTimeCD(dt, G.timeout, () => { if (G.timeout > long) beep(900, 330, 800); setTimeout(backToPasscode, 1000); });
	mLinebreak(dOuter, 100);

	mStyleX(dOuter, { layout: 'fv', bg: 'white', w: '100%', h: '100%' });//das muss am ende sein sonst geht es nicht!!!!!!!!!!!!!!!!!!
}
function test04_blankPageWithMessageAndCountdownAndBeep(msg) {
	show(dTable); //show a freezer
	let d = mDiv(dTable);

	let d1 = mDiv(d, { w: '100%', background: 'red' }); d1.innerHTML = 'hallo 111';
	mLinebreak(d, 20);
	let d2 = mDiv(d, { w: '100%', background: 'red' }); d2.innerHTML = 'hallo 222222';
	let d3 = mDiv(d, { w: '100%', background: 'red' }); d3.innerHTML = 'hallo 3333333';
	// mText(msg, d, { family: 'AlgerianRegular', w:'80%', fz: 22, fg: 'indigo' });
	// mLinebreak(d);
	// mText(msg, d, { family: 'AlgerianRegular', fz: 22, fg: 'indigo' });
	// mLinebreak(d);
	// let d1 = mDiv(d, { fg: 'black', align: 'center', h:30 });
	// //mFlex(d1);
	// // let d2 = mDiv(d1, { fz: 24, w: 100, display: 'inline-block' });
	// d1.innerHTML = '00:00:00';
	// //let cd = new CountdownTimer(G.timeout, d1, backToPasscode);
	// if (nundef(TOList)) TOList = {};

	return;
	startTimeCD(d2, G.timeout, () => { beep(900, 440, 800); backToPasscode(); });
	//show countdown timer!
	// setTimeout(backToPasscode, G.timeout);
}

function test04_blankPageWithMessageAndCountdown(msg) {
	show(mBy('dPopup')); //show a freezer
	let d = mBy('dExpContent');
	clearElement(d);
	mText(msg, d, { family: 'AlgerianRegular', fz: 36, fg: 'indigo' });
	mLinebreak(d);
	let d1 = mDiv(d, { fg: 'black', bg: 'red', align: 'center' });
	//let cd = new CountdownTimer(G.timeout, d1, backToPasscode);
	if (nundef(TOList)) TOList = {};
	startTimeCD(d1, G.timeout, backToPasscode);
	//show countdown timer!
	// setTimeout(backToPasscode, G.timeout);
}
function test04_blankPageWithMessage(msg) {
	show(mBy('dPopup')); //show a freezer
	let d = mBy('dExpContent');
	clearElement(d);
	mText(msg, d, { family: 'AlgerianRegular', fz: 36, fg: 'indigo' });
	//show countdown timer!
	setTimeout(backToPasscode, G.timeout);
}
function test04_justABlankPage() {
	show(mBy('dPopup')); //show a freezer
	let d = mBy('dExpContent');
	clearElement(d);
	mText('think about the passcode!', d, { family: 'AlgerianRegular', fz: 36, fg: 'indigo' });
	//show countdown timer!
	setTimeout(backToPasscode, G.timeout);
}
function backToPasscode() {
	hide('dPopup')
	console.log('enter the passcode now!!!');
	//need to add more pictures
	//need to remove the button! 
	clearElement(dTable);
	let keys = [Goal.key].concat(getRandomKeysFromGKeys(G.numPics - 1));
	shuffle(keys);
	let iGoal = keys.indexOf(Goal.key);
	//GroupCounter = 0;

	Pictures = showPics(evaluate, undefined, undefined, keys);
	//console.log('Pictures',Pictures);
	setGoal(iGoal);
	//console.log('Goal',Goal)
	let wort = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
	showInstruction('', 'click ' + wort + '!!!', dTitle, true);
	Pictures.map(x => x.div.style.cursor = 'pointer');
	activateUi();

}
function onClickExperiment() {
	console.log('clicked on experimental screen!!!')
}



function test04_subGame() {
	//FAILED ATTEMPT!!!!!!!!!!!!!!
	//play one of the other games with special settings
	Daat = { settings: jsCopy(Settings), user: jsCopy(U) };

	setRandomGameRound()

	U.avGames = ['gTouchPic', 'gAbacus'];
	console.log('Settings', Settings, '\nU', U);
	U.lastGame = 'gTouchPic';
	setGame(U.lastGame);
	Settings.samplesPerGame = 1;
	Settings.minutesPerUnit = .05;
	startGame();
	//problem ist: every time


}




























function maShowCards(keys, labels, dParent, onClickPictureHandler, { showRepeat, containerForLayoutSizing, lang, border, picSize, bgs, colorKeys, contrast, repeat = 1, sameBackground, shufflePositions = true } = {}, { sCont, sPic, sText } = {}) {
	Pictures = [];

	//zInno('Steam Engine',dParent); return;

	keys = zInnoRandom(10); // ['Gunpowder']; //zInnoRandom(10); 
	keys.map(x => zInno(x, dParent)); //console.log(keys); 	

	let cards = [];
	for (const k of keys) {
		let card = zInno(k, dParent);
		cards.push(card);
		zMeasure(card);
	}

	//test09_zViewer(); return;;
	//test10_zViewerClockCrownFactory(); return;
	//test08_towerAndOtherSymbols(dParent); return;
	//test07_showDeck(dParent);
	//test06_showCards(dParent); 
	//test05_ElectricitySuburbia(dParent);
	//test04_Electricity(dParent); return;
	//test03_lighbulb(dParent); return;
	//test00_oldMaPic(dParent); 
	//test02_zPic(dParent);test01_oldMaPicAusgleichVonPadding(dParent); return;
	// let c=card52();	console.log(c);	
	// showSingle52(dParent);


	//showAllInnoCards(dParent);

	return;

	mLinebreak(dParent);

	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'green' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'blue' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'yellow' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
	keys = getRandomCards(5, { type: 'inno', color: 'purple' }); console.log(keys);
	showDeck(keys, dParent, 'left', 100)
}






