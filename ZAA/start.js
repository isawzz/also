async function _start() {
	initTable(); initSidebar(); initAux(); initScore();
	loadUser();
	startUnit();
}
function startUnit() {
	renewTimer(G,'time'); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (START_IN_MENU) { START_IN_MENU = false; onClickTemple(); } else startGame();

}

