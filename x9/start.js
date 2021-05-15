var MULTI = false, RUNNING2 = false, RUNNING3 = false;
function _start() { if (MULTI) { login(_start2); } else {Username = DEFAULTUSERNAME; _start3(); }}
function _start2() { if (RUNNING2) return; RUNNING2 = true; console.log('start2'); dbLoad('boardGames', _start3); }
function _start3() {
	if (RUNNING3) return;	RUNNING3 = true;
	console.log('the following users are logged in:', lookup(DB,['settings','loggedIn']),'Username',Username);
	initTable(); initSidebar(); initAux(); initScore(); loadUser(Username); //timit = new TimeIt('*timer', true);
	//console.log(G)
	//console.log(GC)
	startUnit();
	//console.log(isNumber(0));	cTest100();
	//let x=Card52._fromKey('AH'); console.log(x)
	//rTest09(); //rTest08(); //rTest07(); //let x=rTest06_clean_OK(); console.log('result',x);//rTest04(); //rTest03_OK(); //rTest02(); //cTest10(); //rTest01();

	//#region tests
	//cTest05();//cTest10(); //cTest05(); //cTest04_2HandsRandom();

	//let game = new GKriegBack(); //game.load(); game.print_state();
	//kriegTest06(game); //kriegTest04(game); //kriegTest03(game); //kriegTest01(game); //kriegTest00(game);
	//kriegTest00UI();

	//let arr=[5,4,3,2,1,0];console.log(arr.slice(4),arrTakeFromEnd(arr,3),arrTakeFromEnd([0,1],3));
	//let game=new Chess();	game.load('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1');	console.log('moves',game.ugly_moves());//console.log('turn',game.turn(),game.moves());

	//cTest03_2HandsRandom(); //let x=Card52.getItem(0, 100, 70); console.log('x',x)

	//console.log(arrString([]));	console.log(arrString([[4],1,2,3]));	console.log(arrString([[1,2,3],[],[1,2]]));

	//chessTestPos02(); //setBackgroundColor('green');	let b = new ChessBoard();

	//let list = getRandomFractions(4);console.log('fractions',list);
	//btest11_fractions();//bTest10();//bTest09(); //bTest08();//bTest07();	//bTest06();//bTest05();//bTest04(); //bTest03();

	// let x=bTest03_async();
	// console.log('x',x);
	// CANCEL_AI=true;


	//bTest01();
	//bTest02();
	//test15();
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
	//#endregion
}
function startUnit() {
	console.log('HAAAAAAAAAAAAAAAAAAAAA')
	renewTimer(G, 'time'); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (START_IN_MENU) { START_IN_MENU = false; onClickTemple(); } else GC.startGame();

}

function cTest100() {
	for (let i = 0; i < 13; i++) {
		let key = Card52._getKey(i);
		let val = Card52.getRankValue(i);
		let rank = Card52.getRank(i);
		let suit = Card52.getSuit(i);
		let item = i52(i);
		console.log('i', i, 'key', key, 'val', val, 'rank', rank, 'suit', suit, '\nitem', item)


	}
}

