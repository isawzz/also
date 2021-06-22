async function _start() {

	initTable(); initSidebar(); initAux(); initScore(); loadUser(); //timit = new TimeIt('*timer', true);

	startUnit();
	// let x=Card52._fromKey('AH'); console.log(x)
	// cardGameTest09(); //cardGameTest08(); //cardGameTest07(); //let x=cardGameTest06_clean_OK(); console.log('result',x);//cardGameTest04(); //cardGameTest03_OK(); //cardGameTest02(); //cTest10(); //cardGameTest01();
	
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
	renewTimer(G, 'time'); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (START_IN_MENU) { START_IN_MENU = false; onClickTemple(); } else GC.startGame();

}

