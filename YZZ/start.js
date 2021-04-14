async function _start() {
	initTable(); initSidebar(); initAux(); initScore();
	loadUser();

	//console.log('G', G, 'U', U);
	// let keys = SymKeys;//.filter(x=>x.includes('bookmark') || x.includes('box'));
	// let app = new ItemViewerClass(dTable, dLineTitleRight, keys);

	//console.log('dTable', dTable);
	// mBackground(BLUEGREEN);
	// mCenterFlex(dTable);
	// let styles = { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
	// let items = iGrid(3, 3, dTable, styles);
	//ich will jetzt das game ttt spielen gegen computer!
	startUnit();
}
function startUnit() {
	renewTimer(G, 'time'); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (PROD_START) { PROD_START = false; onClickTemple(); } else GC.startGame();

}

