var Flag=false;
async function _start() {
	initTable(); initSidebar(); initAux(); initScore(); loadUser(); timit = new TimeIt('*timer', true);//	console.log('dTable', dTable)

	// timit.show('starting: click to start!');
	// Flag = false;
	// onclick=()=>{Flag=true;console.log('click')};
	// while (!Flag) { await sleepX(1000); }
	// timit.show('after');
	testmc0();
}

function testmc0() {
	let game = new Game_C4();
	let state = game.start();
	let winner = null;
	let ngames = 0;
	let playerOneWins = 0;
	let haveDisplayed = false;

	while (ngames < N_GAMES) {
		let plays = game.legalPlays(state)
		let play = plays[Math.floor(Math.random() * plays.length)]
		state = game.nextState(state, play)
		winner = game.winner(state)

		// If there's a winner, reset
		if (winner != null) {
			// display one board
			if (!haveDisplayed) {
				let printBoard = state.board.map((row) => row.map((cell) => cell == -1 ? 2 : cell));
				console.log(printBoard);
				haveDisplayed = true;
			}
			ngames += 1;
			playerOneWins += (winner == 1);
			state = game.start();
			winner = null;
		}
	}
	console.log(playerOneWins / ngames);
}








