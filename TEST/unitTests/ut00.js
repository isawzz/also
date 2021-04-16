var TestCounter = 0;
function unitTest00() {
	if (nundef(G.startPosition)) {
		let states = [
			['O', 'O', null, 'X', null, null, 'X', null, null],
			[null, 'O', null, 'O', null, 'X', null, 'X', null],
			[null, null, null, null, 'X', 'O', null, 'O', null]];
		let state = states[TestCounter]; TestCounter = (TestCounter + 1) % states.length;
		G.startPosition = state;
		G.board.clear();
		G.board.setState(state, { X: G.ai.color, O: G.human.color });
		GC.bTest.innerHTML = 'GO!';
		console.log('______ ready:'); printState(state);
	} else {
		resetRound();
		GC.startGame();
	}

}
