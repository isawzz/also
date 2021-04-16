var playerImage = new Image();
playerImage.src = "/TEST/ttt0/images/o.png";
var computerImage = new Image();
computerImage.src = "/TEST/ttt0/images/x.png";
var board = new Array();
var BOARD_SIZE = 9;
var UNOCCUPIED = ' ';
var HUMAN_PLAYER = 'O';
var COMPUTER_PLAYER = 'X';
var active_turn = "HUMAN";
var choice;
var searchTimes = new Array();
var showAverageTime = true;

function boardToNode(state) {
	let res = new Array();
	for (let i = 0; i < state.length; i++) {
		if (state[i] == null) res[i] = UNOCCUPIED;
		else res[i] = state[i];
		//else if (state[i]=='O')
	}
	active_turn = "COMPUTER";
	return res;
}

function alphaBetaMinimax(node, depth, alpha, beta, maxDepth = 9) {
	//console.log('node', node, '\ndepth', depth, '\nalpha', alpha, '\nbeta', beta);
	if (depth >= maxDepth) return 1;
	if (CheckForWinner(node) === 1 || CheckForWinner(node) === 2
		|| CheckForWinner(node) === 3)
		return GameScore(node, depth);

	depth += 1;
	var availableMoves = GetAvailableMoves(node);
	var move, result, possible_game;
	if (active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = alphaBetaMinimax(possible_game, depth, alpha, beta, maxDepth);
			node = UndoMove(node, move);
			if (result > alpha) {
				alpha = result;
				if (depth == 1) choice = move;
			} else if (alpha >= beta) {
				return alpha;
			}
		}
		return alpha;
	} else {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = alphaBetaMinimax(possible_game, depth, alpha, beta);
			node = UndoMove(node, move);
			if (result < beta) {
				beta = result;
				if (depth == 1) choice = move;
			} else if (beta <= alpha) {
				return beta;
			}
		}
		return beta;
	}
}

function NewGame() {
	//ok let arr = [UNOCCUPIED, UNOCCUPIED, UNOCCUPIED, UNOCCUPIED, COMPUTER_PLAYER, HUMAN_PLAYER, UNOCCUPIED, HUMAN_PLAYER, UNOCCUPIED];
	let arr = [HUMAN_PLAYER, UNOCCUPIED, UNOCCUPIED, UNOCCUPIED, HUMAN_PLAYER, COMPUTER_PLAYER, UNOCCUPIED, COMPUTER_PLAYER, UNOCCUPIED];
	active_turn = "COMPUTER"; //HUMAN | COMPUTER

	for (i = 0; i < BOARD_SIZE; i++) {
		board[i] = arr[i]; // UNOCCUPIED;
		if (arr[i] == UNOCCUPIED) document.images[i].src = "images/blank.png";
		else if (arr[i] == HUMAN_PLAYER) document.images[i].src = playerImage.src;
		else document.images[i].src = computerImage.src;
	}
	DeleteTimes();
	showAverageTime = true;
	if (active_turn == "HUMAN") {
		var alert = document.getElementById("turnInfo");
		alert.innerHTML = "Your turn!";
	} else {
		var alert = document.getElementById("turnInfo");
		alert.innerHTML = "Computer's turn.";
		setTimeout(MakeComputerMove, 300);
	}
}

function MakeMove(pos) {
	if (!GameOver(board) && board[pos] === UNOCCUPIED) {
		board[pos] = HUMAN_PLAYER;
		document.images[pos].src = playerImage.src;
		if (!GameOver(board)) {
			var alert = document.getElementById("turnInfo");
			active_turn = "COMPUTER";
			alert.innerHTML = "Computer's turn.";
			MakeComputerMove();
		}
	}
}

function MakeComputerMove() {
	var start, end, time;
	start = new Date().getTime() / 1000;
	alphaBetaMinimax(board, 0, -Infinity, +Infinity);
	end = new Date().getTime() / 1000;
	time = end - start;
	ShowTimes(time);
	var move = choice;
	board[move] = COMPUTER_PLAYER;
	document.images[move].src = computerImage.src;
	choice = [];
	active_turn = "HUMAN";
	if (!GameOver(board)) {
		var alert = document.getElementById("turnInfo");
		alert.innerHTML = "Your turn!";
	}
}

function GameScore1(game, depth,pl, opp) {
	var score = CheckForWinner(game);
	if (score === 1) return 0;
	else if (score === opp.score) return depth - 10;
	else if (score === pl.score) return 10 - depth;
}
function GameScore(game, depth) {
	var score = CheckForWinner(game);
	if (score === 1) return 0;
	else if (score === 2) return depth - 10;
	else if (score === 3) return 10 - depth;
}


function UndoMove(game, move) {
	game[move] = UNOCCUPIED;
	ChangeTurn();
	return game;
}

function GetNewState(move, game) {
	var piece = ChangeTurn();
	game[move] = piece;
	return game;
}

function ChangeTurn() {
	var piece;
	if (active_turn === "COMPUTER") {
		piece = 'X';
		active_turn = "HUMAN";
	} else {
		piece = 'O';
		active_turn = "COMPUTER";
	}
	return piece;
}

function GetAvailableMoves(game) {
	var possibleMoves = new Array();
	for (var i = 0; i < BOARD_SIZE; i++) {
		if (game[i] === UNOCCUPIED)
			possibleMoves.push(i);
	}
	return possibleMoves;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN_PLAYER won
//   3 if COMPUTER_PLAYER won
function CheckForWinner(game) {
	// Check for horizontal wins
	for (i = 0; i <= 6; i += 3) {
		if (game[i] === HUMAN_PLAYER && game[i + 1] === HUMAN_PLAYER && game[i + 2] === HUMAN_PLAYER)
			return 2;
		if (game[i] === COMPUTER_PLAYER && game[i + 1] === COMPUTER_PLAYER && game[i + 2] === COMPUTER_PLAYER)
			return 3;
	}

	// Check for vertical wins
	for (i = 0; i <= 2; i++) {
		if (game[i] === HUMAN_PLAYER && game[i + 3] === HUMAN_PLAYER && game[i + 6] === HUMAN_PLAYER)
			return 2;
		if (game[i] === COMPUTER_PLAYER && game[i + 3] === COMPUTER_PLAYER && game[i + 6] === COMPUTER_PLAYER)
			return 3;
	}

	// Check for diagonal wins
	if ((game[0] === HUMAN_PLAYER && game[4] === HUMAN_PLAYER && game[8] === HUMAN_PLAYER) ||
		(game[2] === HUMAN_PLAYER && game[4] === HUMAN_PLAYER && game[6] === HUMAN_PLAYER))
		return 2;

	if ((game[0] === COMPUTER_PLAYER && game[4] === COMPUTER_PLAYER && game[8] === COMPUTER_PLAYER) ||
		(game[2] === COMPUTER_PLAYER && game[4] === COMPUTER_PLAYER && game[6] === COMPUTER_PLAYER))
		return 3;

	// Check for tie
	for (i = 0; i < BOARD_SIZE; i++) {
		if (game[i] !== HUMAN_PLAYER && game[i] !== COMPUTER_PLAYER)
			return 0;
	}
	return 1;
}

function GameOver(game) {
	if (CheckForWinner(game) === 0) {
		return false;
	}
	else if (CheckForWinner(game) === 1) {
		var alert = document.getElementById("turnInfo");
		alert.innerHTML = "It is a tie.";
	}
	else if (CheckForWinner(game) === 2) {
		var alert = document.getElementById("turnInfo");
		alert.innerHTML = "You have won! Congratulations!";
	}
	else {
		var alert = document.getElementById("turnInfo");
		alert.innerHTML = "The computer has won.";
	}
	ShowAverageTime();
	return true;
}

function ShowTimes(time) {
	searchTimes.push(time);
	document.getElementById("searchTime").innerHTML =
		document.getElementById("searchTime").innerHTML + time + " seconds. <br />";
}

function DeleteTimes() {
	searchTimes = [];
	document.getElementById("searchTime").innerHTML = "";
}

function ShowAverageTime() {
	if (showAverageTime) {
		var sum = 0;
		var i = 0;
		for (i; i < searchTimes.length; i++)
			sum += searchTimes[i];

		document.getElementById("searchTime").innerHTML =
			document.getElementById("searchTime").innerHTML + "<br />Average search was <strong>" + sum / i + "</strong> seconds. <br />";
		showAverageTime = false;
	}
}





function alphaBetaMinimaxOrig(node, depth, alpha, beta) {
	console.log('node', node, '\ndepth', depth, '\nalpha', alpha, '\nbeta', beta);
	if (CheckForWinner(node) === 1 || CheckForWinner(node) === 2
		|| CheckForWinner(node) === 3)
		return GameScore(node, depth);

	depth += 1;
	var availableMoves = GetAvailableMoves(node);
	var move, result, possible_game;
	if (active_turn === "COMPUTER") {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = alphaBetaMinimax(possible_game, depth, alpha, beta);
			node = UndoMove(node, move);
			if (result > alpha) {
				alpha = result;
				if (depth == 1) choice = move;
			} else if (alpha >= beta) {
				return alpha;
			}
		}
		return alpha;
	} else {
		for (var i = 0; i < availableMoves.length; i++) {
			move = availableMoves[i];
			possible_game = GetNewState(move, node);
			result = alphaBetaMinimax(possible_game, depth, alpha, beta);
			node = UndoMove(node, move);
			if (result < beta) {
				beta = result;
				if (depth == 1) choice = move;
			} else if (beta <= alpha) {
				return beta;
			}
		}
		return beta;
	}
}
