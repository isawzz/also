async function _start() {
	initTable(); initSidebar(); initAux(); initScore();	loadUser();

	//bTest01();
	//bTest02();
	//test15();
	startUnit();
	// console.log(checkBoardEmpty(new Array().fill(' ')));
	// console.log(checkBoardFull(new Array().fill('s')));
	//let x=checkWinnerTTT(["O", "O", "X", "X", "O", " ", "O", "X", "X"],3,3);	console.log('x',x);

	//console.log('G', G, 'U', U);
	// let keys = SymKeys;//.filter(x=>x.includes('bookmark') || x.includes('box'));
	// let app = new ItemViewerClass(dTable, dLineTitleRight, keys);

	//console.log('dTable', dTable);
	// mBackground(BLUEGREEN);
	// mCenterFlex(dTable);
	// let styles = { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
	// let items = iGrid(3, 3, dTable, styles);
	//ich will jetzt das game ttt spielen gegen computer!
	
}
function startUnit() {
	renewTimer(G, 'time'); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (START_IN_MENU) { START_IN_MENU = false; onClickTemple(); } else GC.startGame();

}
