async function _start() {

	// initLive();	
	//Daat={};
	initTable(); initSidebar(); initAux(); initScore(); initSymbolTableForGamesAddons(); //creates Daat
	// addonFeatureInit(); //new API!
	Speech = new SpeechAPI('E');
	KeySets = getKeySets();
	loadUser(); console.assert(isdef(G));

	//TEST let data = genCats();	let sample = new CatsApp(data);	uiActivated = true;	sample.prompt(dTable);
	//makeCategories(); return; //console.log([3,6,1,2].sort()); return;
	startUnit();
}
function startUnit() {
	restartTime();
	U.session = {};
	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();

}

function initSymbolTableForGamesAddons() {
	//console.log('Daat', Daat);//yes this is an empty dict!
	if (nundef(Daat)) Daat = {};
	Daat.GameClasses = {
		gTouchPic: GTouchPic, gNamit: GNamit, gStory: GStory, gSentence: GSentence, gSwap: GSwap,
		gTouchColors: GTouchColors, gPremem: GPremem, gMem: GMem, gMissingLetter: GMissingLetter,
		gMissingNumber: GMissingNumber, gWritePic: GWritePic, gSayPic: GSayPic, gSteps: GSteps, gElim: GElim,
		gAnagram: GAnagram, gAbacus: GAbacus, gPasscode: GPasscode, gCats: GCats,

	}
}

function gatherItems(n, options) {
	let items = null;
	while (!items) { items = Pictures = pickSuitableItems(n, options); }

	//labels need to be replaced!
	let l = items[0].letter;
	for (let i = 0; i < n; i++) {
		let item1 = items[i];
		let item2 = items[(i + 1) % n];
		let label = item1.origLabel = item1.label;
		let idx = item1.iLetter;
		let newLetter = item2.letter;
		let s = label.substring(0, idx) + newLetter + label.substring(idx + 1);
		//console.log('s', s);
		item1.label = s;
		if (isWord(item1.label)) {
			item2.iLetter = (item2.iLetter + 1) % item2.label.length;
			item2.letter = item2.label[item2.iLetter];
			item1.label = label.substring(0, idx) + item2.letter + label.substring(idx + 1);
			if (isWord(item1.label)) return gatherItems(n, options);
		}
	}
	return items;
}
function replaceAt(s,i,ssub){return s.substring(0,i)+ssub+s.substring(i+1);}
function arrCycleSwap(arr, prop, clockwise = true) {
	let n = arr.length;
	let h = arr[0].prop;
	for (let i = 1; i < n; i++) { arr[i - 1][prop] = arr[i][prop]; }
	arr[n - 1][prop] = h;
}
function getBlinkingLetter(item) {
	if (nundef(item.letters)) return null;
	return firstCond(item.letters, x => x.isBlinking);
}
function stopBlinking(item) { if (isdef(item)) { item.isBlinking = false; mRemoveClass(iDiv(item), 'blink'); } }
function startBlinking(item, items, unique = true) {
	console.log('item', item, 'items', items, 'unique', unique)
	if (unique) {
		let prevLetter = firstCond(items, x => x.isBlinking == true);
		console.log('prevLetter', prevLetter);
		stopBlinking(prevLetter);
	}
	mClass(iDiv(item), 'blink');
	item.isBlinking = true;
}

function pickSuitableItems(n, options) {
	let items = genItems(n, options);
	let words = items.map(x => x.label);

	let used = [];
	for (const item of items) {
		let res = getRandomConsonant(item.label, used);
		if (isEmpty(res)) return null;
		let i = item.iLetter = res.i;
		let letter = item.letter = item.label[i];
		used.push(letter);
		//console.log('w',item.label,'i', i, 'letter', letter);
	}
	return items;
}
function getVowels(w, except = []) {
	w = w.toLowerCase();
	console.log('w', w);
	let vowels = 'aeiouy';
	let res = [];
	for (let i = 0; i < w.length; i++) {
		if (vowels.includes(w[i]) && !except.includes(w[i])) res.push({ i: i, letter: w[i] });
	}
	console.log('res', res)
	return res;
}
function getConsonants(w, except = []) {
	w = w.toLowerCase();
	//console.log('w',w);
	let vowels = 'aeiouy' + except.join('');
	let res = [];
	for (let i = 0; i < w.length; i++) {
		if (!vowels.includes(w[i])) res.push({ i: i, letter: w[i] });
	}
	//console.log('res',res)
	return res;
}
function getRandomVowel(w, except = []) { let vowels = getVowels(w, except); return chooseRandom(vowels); }
function getRandomConsonant(w, except = []) { let cons = getConsonants(w, except); return chooseRandom(cons); }







async function _start_neu() {
	//createSubtitledPage3T2('indigo'); 
	revealMain();
	loadUser('nil', dUsername);
	temple(dButtons);
	initScore();
	initTable();

	//menu(dTable);
	startGame();
	return;




	menu(); //sample00(); //onClickTemple();
	// let keys = SymKeys.filter(x=>x.includes('bookmark') || x.includes('box'));
	// let app = new ItemViewerClass(dTable, dTitleRight,keys);
}


function revealMain() { mReveal(dAll); }
































//#region trash
function trash() {
	console.log(DB); createSubtitledPage('indigo'); mDiv(dTitleRight, { matop: -14 }, 'dRight'); revealMain();
	let d = mText('hello!', dTable, { fz: 32 }); d.id = 'message';

	//menu();

	//titlebar(0);
	//onclick=()=>rev='off';
	//setInterval( checkFocus, 20000 );


	ifPageVisible.on('blur', function () {
		console.log('BLUR!!!!!!!!!!!!!!')
		//enterInterruptState();
		// console.log('stopping game', G.id)
		// _saveAll();
		return 'hallo'
	});

	ifPageVisible.on('focus', function () {
		console.log('FOCUS!!!!!!!!')
		// if (isdef(G.instance)) {
		// 	updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
		// 	setGame(G.id);
		// }
		// closeAux();
		// startGame();
		// console.log('restarting game', G.id)
	});

}
function checkFocus() {
	var info = document.getElementById("message");

	if (document.hasFocus()) {
		info.innerHTML = "The document has the focus.";
	} else {
		info.innerHTML = "The document doesn't have the focus.";
	}
}
var rev = "fwd";
function titlebar(val) {
	var msg = "YOUR TURN!!!";
	var res = " ";
	var speed = 100;
	var pos = val;
	msg = "   |-" + msg + "-|";
	var le = msg.length;
	if (rev == "fwd") {
		if (pos < le) {
			pos = pos + 1;
			scroll = msg.substr(0, pos);
			document.title = scroll;
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
		else {
			rev = "bwd";
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
	}
	else {
		if (pos > 0) {
			pos = pos - 1;
			var ale = le - pos;
			scrol = msg.substr(ale, le);
			document.title = scrol;
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
		else {
			rev = "fwd";
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
	}
}

