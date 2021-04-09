async function _start() {

	initTable(); initSidebar(); initAux(); initScore(); initSymbolTableForGamesAddons(); //creates Daat
	loadUser(); 

	startUnit();
}
function startUnit() {
	console.assert(isdef(G));
	restartTime('time',G); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();

}

function initSymbolTableForGamesAddons() {
	if (nundef(Daat)) Daat = {};
	Daat.GameClasses = {
		gTouchPic: GTouchPic, gNamit: GNamit, gRiddle: GRiddle, gSentence: GSentence, gSwap: GSwap,
		gTouchColors: GTouchColors, gPremem: GPremem, gMem: GMem, gMissingLetter: GMissingLetter,
		gMissingNumber: GMissingNumber, gWritePic: GWritePic, gSayPic: GSayPic, gSteps: GSteps, gElim: GElim,
		gAnagram: GAnagram, gAbacus: GAbacus, gPasscode: GPasscode, gCats: GCats,
	}
}

