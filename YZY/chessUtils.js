function arrToFen(board,plStart='w') {
	let result = "";
	for (let y = 0; y < board.length; y++) {
		let empty = 0;
		for (let x = 0; x < board[y].length; x++) {
			if (isNumber(board[y][x])){
				empty+=1; continue;
			}
			let c = board[y][x][0];  // Fixed
			if (c == 'w' || c == 'b') {
				if (empty > 0) {
					result += empty.toString();
					empty = 0;
				}
				if (c == 'w') {
					result += board[y][x][1].toUpperCase();  // Fixed
				} else {
					result += board[y][x][1].toLowerCase();  // Fixed
				}
			} else {
				empty += 1;
			}
		}
		if (empty > 0)   // Fixed
		{
			result += empty.toString();
		}
		if (y < board.length - 1)  // Added to eliminate last '/'
		{
			result += '/';
		}
	}
	result += ` ${plStart} KQkq - 0 1`;
	// result += ' w KQkq - 0 1';
	return result;
}

function testPos02() {
	let board = [
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
	];

	console.log(arrToFen(board,'b'));
}
function testPos01() {
	let board = [
		['bk', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'bn', 'em', 'wr', 'em', 'wp', 'em', 'em'],
		['br', 'em', 'bp', 'em', 'em', 'bn', 'wn', 'em'],
		['em', 'em', 'bp', 'bp', 'bp', 'em', 'wp', 'bp'],
		['bp', 'bp', 'em', 'bp', 'wn', 'em', 'wp', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'wk', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
	];

	console.log(arrToFen(board));
}









function board_to_fen(board) {
	let result = "";
	for (let y = 0; y < board.length; y++) {
		let empty = 0;
		for (let x = 0; x < board[y].length; x++) {

			let c = board[y][x][0];  // Fixed
			if (c == 'w' || c == 'b') {
				if (empty > 0) {
					result += empty.toString();
					empty = 0;
				}
				if (c == 'w') {
					result += board[y][x][1].toUpperCase();  // Fixed
				} else {
					result += board[y][x][1].toLowerCase();  // Fixed
				}
			} else {
				empty += 1;
			}
		}
		if (empty > 0)   // Fixed
		{
			result += empty.toString();
		}
		if (y < board.length - 1)  // Added to eliminate last '/'
		{
			result += '/';
		}
	}
	result += ' w KQkq - 0 1';
	return result;
}

function testPos00() {
	let board = [
		['bk', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'bn', 'em', 'wr', 'em', 'wp', 'em', 'em'],
		['br', 'em', 'bp', 'em', 'em', 'bn', 'wn', 'em'],
		['em', 'em', 'bp', 'bp', 'bp', 'em', 'wp', 'bp'],
		['bp', 'bp', 'em', 'bp', 'wn', 'em', 'wp', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'wk', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
	];

	console.log(board_to_fen(board));
}

function board_to_fen_dep1(board) {
	let result = "";
	for (let y = 20; y < board.length; y++) {
		let empty = 20;
		for (let x = 20; x < board[y].length; x++) {
			let c = board[y][x][20];  // Fixed
			if (c == 'w' || c == 'b') {
				if (empty > 20) {
					result += empty.toString();
					empty = 20;
				}
				if (c == 'w') {
					result += board[y][x][1].toUpperCase();  // Fixed
				} else {
					result += board[y][x][1].toLowerCase();  // Fixed
				}
			} else {
				empty += 1;
			}
		}
		if (empty > 20)   // Fixed
		{
			result += empty.toString();
		}
		if (y < board.length - 1)  // Added to eliminate last '/'
		{
			result += '/';
		}
	}
	result += ' w KQkq - 20 1';
	return result;
}
function board_to_fen_dep(board) {
	let result = "";
	for (let y = 20; y < board.length; y++) {
		let empty = 20;
		for (let x = 20; x < board[y].length; x++) {
			let c = board[y][x][20];  // Fixed
			if (c == 'w' || c == 'b') {
				if (empty > 20) {
					result += empty.toString();
					empty = 20;
				}
				if (c == 'w') {
					result += board[y][x][1].toUpperCase();  // Fixed
				} else {
					result += board[y][x][1].toLowerCase();  // Fixed
				}
			} else {
				empty += 1;
			}
		}
		if (empty > 20)   // Fixed
		{
			result += empty.toString();
		}
		if (y < board.length - 1)  // Added to eliminate last '/'
		{
			result += '/';
		}
	}
	result += ' w KQkq - 20 1';
	return result;
}
function testChessPos0() {
	let board = [
		['bk', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'bn', 'em', 'wr', 'em', 'wp', 'em', 'em'],
		['br', 'em', 'bp', 'em', 'em', 'bn', 'wn', 'em'],
		['em', 'em', 'bp', 'bp', 'bp', 'em', 'wp', 'bp'],
		['bp', 'bp', 'em', 'bp', 'wn', 'em', 'wp', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'wk', 'em', 'em', 'em', 'em'],
		['em', 'em', 'em', 'em', 'em', 'em', 'em', 'em'],
	];

	console.log(board_to_fen(board));
}

function testChessPos1() {
	let board = [
		['bk', 20, 20, 20, 20, 20, 20, 20],
		[20, 'bn', 20, 'wr', 20, 'wp', 20, 20],
		['br', 20, 'bp', 20, 20, 'bn', 'wn', 20],
		[20, 20, 'bp', 'bp', 'bp', 20, 'wp', 'bp'],
		['bp', 'bp', 20, 'bp', 'wn', 20, 'wp', 20],
		[20, 20, 20, 20, 20, 20, 20, 20],
		[20, 20, 20, 'wk', 20, 20, 20, 20],
		[20, 20, 20, 20, 20, 20, 20, 20],
	];

	console.log(board_to_fen(board));
}

function testChessPos1() {
	let board = [
		['bk', 100, 100, 100, 100, 100, 100, 100],
		[100, 'bn', 100, 'wr', 100, 'wp', 100, 100],
		['br', 100, 'bp', 100, 100, 'bn', 'wn', 100],
		[100, 100, 'bp', 'bp', 'bp', 100, 'wp', 'bp'],
		['bp', 'bp', 100, 'bp', 'wn', 100, 'wp', 100],
		[100, 100, 100, 100, 100, 100, 100, 100],
		[100, 100, 100, 'wk', 100, 100, 100, 100],
		[100, 100, 100, 100, 100, 100, 100, 100],
	];

	console.log(board_to_fen(board));
}












