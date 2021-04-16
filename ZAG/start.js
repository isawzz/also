async function _start() {

	initTable(); initSidebar(); initAux(); initScore(); initSymbolTableForGamesAddons(); //creates Daat
	loadUser(); console.assert(isdef(G));

	//wp00();
	//wp01_alle();
	//wp02_checkMinus();
	//TEST let data = genCats();	let sample = new CatsApp(data);	uiActivated = true;	sample.prompt(dTable);
	//makeCategories(); return; //console.log([3,6,1,2].sort()); return;
	startUnit();
	//t00_wpInstantiate();
	//console.log(math.fraction(1,2));
}
function startUnit() {
	restartTime();
	U.session = {};
	if (START_IN_MENU) { START_IN_MENU = false; onClickTemple(); } else startGame();

}

function initSymbolTableForGamesAddons() {
	//console.log('Daat', Daat);//yes this is an empty dict!
	if (nundef(Daat)) Daat = {};
	Daat.GameClasses = {
		gTouchPic: GTouchPic, gNamit: GNamit, gRiddle: GRiddle, gSentence: GSentence, gSwap: GSwap,
		gTouchColors: GTouchColors, gPremem: GPremem, gMem: GMem, gMissingLetter: GMissingLetter,
		gMissingNumber: GMissingNumber, gWritePic: GWritePic, gSayPic: GSayPic, gSteps: GSteps, gElim: GElim,
		gAnagram: GAnagram, gAbacus: GAbacus, gPasscode: GPasscode, gCats: GCats,

	}
}

async function t00_wpInstantiate() {
	
	let p = firstCond(wp, x => x.index == 1); // chooseRandom(arrTake(wp,24));
	instantiateWP(p);
}


function iStyle(item,styles){
	let outerStyles = jsCopy(styles);
	let picStyles={fz:styles.fzPic};
	let labelStyles={fz:styles.fz};

	let dPic=iPic(item);if (isdef(dPic)) mStyleX(dPic,picStyles)
	let dLabel=iLabel(item);if (isdef(dLabel)) mStyleX(dLabel,labelStyles)
	let d=iDiv(item);if (isdef(d)) mStyleX(d,outerStyles)
}


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

