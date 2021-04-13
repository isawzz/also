class AIPlayer {
	constructor(max_depth = -1) {
		this.id = getUID('AI'); 
		this.userColor = randomColor();
		this.max_depth = max_depth;
		this.nodes_map = new Map();
	}
	setData(o) { copyKeys(o, this); }
	move(possibleMoves) { return chooseRandom(possibleMoves); }

	getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
    
		//clear nodes_map if the function is called for a new move
	 if(depth == 0) this.nodes_map.clear();
	 
		//If the board state is a terminal one, return the heuristic value
	 if(board.isTerminal() || depth == this.max_depth ) {
			 if(board.isTerminal().winner == 'x') {
					 return 100 - depth;
			 } else if (board.isTerminal().winner == 'o') {
					 return -100 + depth;
			 } 
			 return 0;
	 }
}
}





