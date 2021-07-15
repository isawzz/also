//#region sudoku utilities
function arrToMatrix(arr, rows, cols) {
	let i = 0, res = [];
	for (let r = 0; r < rows; r++) {
		let rarr = [];
		for (let c = 0; c < cols; c++) {
			let a = arr[i]; i++;
			rarr.push(a);
		}
		res.push(rarr);
	}
	return res;
}
function sudokuSampleToIndexMatrix(s, rows, cols) {
	//all 0 entries => ' ', and all numbers>0 => 
	if (isNumber(s)) s = String(s);
	let letters = toLetterArray(s);
	//console.log('letters',letters);
	let nums = letters.map(x => Number(x));
	//console.log('nums',nums);
	let res = [];
	for (const n of nums) {
		if (n === 0) res.push(' ');
		else res.push(n - 1);
	}
	//console.log('numbers',nums);
	let matrix = arrToMatrix(res, rows, cols);
	return matrix;
}
function stringToMatrix(s, rows, cols) {
	if (isNumber(s)) s = String(s);
	let letters = toLetterArray(s);
	//console.log('letters',letters);
	let nums = letters.map(x => Number(x));
	//console.log('numbers',nums);
	let matrix = arrToMatrix(nums, rows, cols);
}
function getSudokuPatternFromDB(r, c, index) {
	let key = '' + r + 'x' + c;
	let numSamples = Object.keys(DB.games.gColoku.samples[key]).length;
	//console.log('r', r, 'c', c, numSamples)
	if (nundef(index)) index = randomNumber(0, numSamples - 1); else if (index >= numSamples) index = 1;
	let sample = DB.games.gColoku.samples[key][index];
	//console.log('sample', sample, 'index', index, sample.sol, r, c)
	let pattern = sudokuSampleToIndexMatrix(sample.sol, r, c);
	//console.log('pattern',pattern);
	let puzzle = sudokuSampleToIndexMatrix(sample.min, r, c);
	return { pattern: pattern, puzzle: puzzle };
}
function getSudokuPattern(r, c) {
	//mach das pattern es sollte 16 geben!
	// 0 1 2 3 
	// 3 2 0 1
	// 2 3 1 0
	// 1 0 2 3

	// 0 1 2 3 
	// 2 3 0 1
	// 3 0 1 2
	// 1 2 3 0

	// 0 1 2 3 
	// 2 3 0 1
	// 1 0 3 2
	// 3 2 1 0
	let patterns = {
		44: [
			[[0, 1, 2, 3], [2, 3, 0, 1], [3, 0, 1, 2], [1, 2, 3, 0]],
			[[0, 1, 2, 3], [3, 2, 0, 1], [2, 3, 1, 0], [1, 0, 3, 2]],
			[[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]],
		],
	};
	return chooseRandom(patterns['' + r + c]);
}
function destroySudokuRule(pattern, rows, cols) {
	let sz = Math.min(rows, cols);
	let [r1, r2] = choose(range(0, sz - 1), 2);
	let c = chooseRandom(range(0, sz - 1));
	// arrSwap2d(pattern, r1, c, r2, c);


	//TEST arrSwap2d(pattern, 0, 3, 1, 3);return;

	//generate row error
	if (coin(50)) { arrSwap2d(pattern, r1, c, r2, c); }

	//generate col error
	else if (coin(50)) { arrSwap2d(pattern, c, r1, c, r2); }

}
function hasDuplicate(arr, efunc) {
	let di = {};
	if (nundef(efunc)) efunc = x => { return x === ' ' };
	let i = -1;
	//console.log('check for dupl in',arr)
	for (const a of arr) {
		//console.log('i', i, 'a', a)
		i += 1;
		if (efunc(a)) continue; //!isNumber(a) && a==' ') {console.log('H!',a);continue;}
		if (a in di) return { i: i, val: a };
		di[a] = true;
	}
	return false;
}

function checkSudokuRule(matrix) {
	//should return at least one example of offending tiles if incorrect! null otherwise!

	//check rows is simple!
	let i = 0;
	for (const arr of matrix) {
		let dd = hasDuplicate(arr);
		if (dd) {
			let err = { type: 'row', row: i, col: dd.i, val: dd.val, info: dd, i: i };
			return err;
		}
		i += 1;
	}

	i = 0;
	for (const arr of bGetCols(matrix)) {
		let dd = hasDuplicate(arr);
		if (dd) {
			let err = { type: 'column', col: i, row: dd.i, val: dd.val, i: i, info: dd };
			return err;
		}
		i += 1;
	}

	//console.log('still here!');

	// let sub0=bGetSubMatrix(pattern,0,2,0,2);
	// let sub1=bGetSubMatrix(pattern,0,2,2,2);
	// let sub2=bGetSubMatrix(pattern,2,2,0,2);
	// let sub3=bGetSubMatrix(pattern,2,2,2,2);
	let [rows, cols] = [matrix.length, matrix[0].length];
	let rowsEach = rows==9?3:2;
	let colsEach = cols==4?2:3;
		let chunks = bGetChunksWithIndices(matrix, rowsEach, colsEach);
	//printMatrix(chunks, 'quadrants');



	i = 0;
	for (const arr of chunks) {
		let dd = hasDuplicate(arr);
		if (dd) {
			let val = dd.val;
			let err = { type: 'quadrant', row: val.row, col: val.col, val: val.val, i: i, info: dd };
		}
		i += 1;
	}

	return null;
}
function checkSudokuRule_trial1(matrix) {
	//should return at least one example of offending tiles if incorrect! null otherwise!

	for (const arr of matrix) { let dd = hasDuplicate(arr); if (dd) return { type: 'row', info: dd }; }

	for (const arr of bGetCols(matrix)) { let dd = hasDuplicate(arr); if (dd) return { type: 'column', info: dd }; }

	//console.log('still here!');

	// let sub0=bGetSubMatrix(pattern,0,2,0,2);
	// let sub1=bGetSubMatrix(pattern,0,2,2,2);
	// let sub2=bGetSubMatrix(pattern,2,2,0,2);
	// let sub3=bGetSubMatrix(pattern,2,2,2,2);
	let chunks = bGetChunks(matrix, 2, 2);
	//printMatrix(chunks, 'quadrants');
	for (const arr of chunks) { let dd = hasDuplicate(arr); if (dd) return { type: 'quadrant', info: dd }; }

	return null;
}
//#endregion

//#region board 2d arr utilities
function bGetSubMatrix(arr2d, rFrom, rows, cFrom, cols) {
	let res = []; for (let i = 0; i < rows; i++) res.push([]);
	//console.log('rows',rows,res);return;
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	let rIndex = 0;
	for (let r = rFrom; r < rFrom + rows; r++) {
		for (let c = cFrom; c < cFrom + cols; c++) {
			res[rIndex].push(arr2d[r][c]);
		}
		rIndex += 1;
	}
	//console.log('res',res)
	//printMatrix(res,'res')
	return res;
}
function bGetSubMatrixWithIndices(arr2d, rFrom, rows, cFrom, cols) {
	let res = []; for (let i = 0; i < rows; i++) res.push([]);
	//console.log('rows',rows,res);return;
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	let rIndex = 0;
	for (let r = rFrom; r < rFrom + rows; r++) {
		for (let c = cFrom; c < cFrom + cols; c++) {
			res[rIndex].push({ row: r, col: c, val: arr2d[r][c] });
		}
		rIndex += 1;
	}
	//console.log('res',res)
	//printMatrix(res,'res')
	return res;
}
function bGetChunksWithIndices(arr2d, rowsEach, colsEach) {
	//das returned nicht flattened arrays of just entries, but flattened arrays of {row:r,col:c,val:entry}
	let res = [];
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	for (let r = 0; r < rTotal; r += rowsEach) {
		let m1 = [];
		for (let c = 0; c < cTotal; c += colsEach) {
			//console.log('rFrom',r,'cFrom',c)
			m1 = bGetSubMatrixWithIndices(arr2d, r, rowsEach, c, colsEach);
			res.push(arrFlatten(m1));
		}
		//printMatrix(m1,'quad'+res.length);
	}
	return res;
}
function bGetChunks(arr2d, rowsEach, colsEach) {
	let res = [];
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	for (let r = 0; r < rTotal; r += rowsEach) {
		let m1 = [];
		for (let c = 0; c < cTotal; c += colsEach) {
			//console.log('rFrom',r,'cFrom',c)
			m1 = bGetSubMatrix(arr2d, r, rowsEach, c, colsEach);
			res.push(arrFlatten(m1));
		}
		//printMatrix(m1,'quad'+res.length);
	}
	return res;
}
function bGetRows(arr2d) {
	return arr2d;
}
function bGetCols(arr2d) {
	let rows = arr2d.length;
	let cols = arr2d[0].length;

	let res = [];
	for (let c = 0; c < cols; c++) { res.push([]); }
	//console.log('res',res);

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			res[c].push(arr2d[r][c]);
		}
	}

	return res;
}
function printMatrix(arr2d, title = 'result') {
	let rows = arr2d.length;
	let cols = arr2d[0].length;
	let arr = arrFlatten(arr2d);
	// console.log('arr', arr,rows,cols)
	let s = toBoardString(arr, rows, cols);
	//console.log(title, s)
}



//#region board utilities
var StateDict = {};
var EmptyFunc = x => nundef(x) || x == ' ';


function bGetCol(arr, icol, rows, cols) {
	let iStart = icol;
	let res = [];
	for (let i = iStart; i < iStart + (cols * rows); i += cols) res.push(arr[i]);
	return res;
}
function bGetRow(arr, irow, rows, cols) {
	let iStart = irow * cols;
	let arrNew = arr.slice(iStart, iStart + cols);

	let res = [];
	for (let i = iStart; i < iStart + cols; i++) res.push(arr[i]);

	console.assert(sameList(arrNew, res), 'NOOOOOO');
	return res;
}

function bNei(arr, idx, rows, cols, includeDiagonals = true) {
	let nei = [];
	//ang tile ist 0,0
	//get r,c from index: 
	let [r, c] = iToRowCol(idx, rows, cols);

	if (r > 0) nei.push(idx - cols); else nei.push(null);
	if (r > 0 && c < cols - 1 && includeDiagonals) nei.push(idx - cols + 1); else nei.push(null);
	if (c < cols - 1) nei.push(idx + 1); else nei.push(null);
	if (r < rows - 1 && c < cols - 1 && includeDiagonals) nei.push(idx + cols + 1); else nei.push(null);
	if (r < rows - 1) nei.push(idx + cols); else nei.push(null);
	if (r < rows - 1 && c > 0 && includeDiagonals) nei.push(idx + cols - 1); else nei.push(null);
	if (c > 0) nei.push(idx - 1); else nei.push(null);
	if (r > 0 && c > 0 && includeDiagonals) nei.push(idx - cols - 1); else nei.push(null);
	//console.log('idx', idx, 'rows', rows, 'cols', cols, 'r', r, 'c', c);
	return nei;

}
function iFromRowCol(row, col, rows, cols) { return row * cols + col; }
function iToRowCol(idx, rows, cols) { let c = idx % cols; let r = (idx - c) / rows; return [r, c]; }
function bCheck(r, c, rows, cols) { return r >= 0 && r < rows && c >= 0 && c < cols ? r * cols + c : null; }
function bNeiDir(arr, idx, dir, rows, cols, includeDiagonals = true) {
	let [r, c] = iToRowCol(idx, rows, cols);
	switch (dir) {
		case 0: if (r > 0) return (idx - cols); else return (null);
		case 1: if (r > 0 && c < cols - 1 && includeDiagonals) return (idx - cols + 1); else return (null);
		case 2: if (c < cols - 1) return (idx + 1); else return (null);
		case 3: if (r < rows - 1 && c < cols - 1 && includeDiagonals) return (idx + cols + 1); else return (null);
		case 4: if (r < rows - 1) return (idx + cols); else return (null);
		case 5: if (r < rows - 1 && c > 0 && includeDiagonals) return (idx + cols - 1); else return (null);
		case 6: if (c > 0) return (idx - 1); else return (null);
		case 7: if (r > 0 && c > 0 && includeDiagonals) return (idx - cols - 1); else return (null);
	}
	return null;
}
function bRayDir(arr, idx, dir, rows, cols) {
	let indices = [];
	let i = idx;
	while (i < arr.length) {
		let i = bNeiDir(arr, i, dir, rows, cols);
		if (!i) break; else indices.push(i);
	}
	return indices;
}
function bFreeRayDir(arr, idx, dir, rows, cols) {
	let indices = [];
	let i = idx;
	while (i < arr.length) {
		i = bNeiDir(arr, i, dir, rows, cols);
		if (!i || !EmptyFunc(arr[i])) break; else indices.push(i);
	}
	return indices;
}
function bFreeRayDir1(arr, idx, dir, rows, cols) {
	let indices = [];
	let i = idx;
	while (i < arr.length) {
		i = bNeiDir(arr, i, dir, rows, cols);
		if (!i) break;
		else indices.push(i);
		if (!EmptyFunc(arr[i])) break;
	}
	return indices;
}
function isOppPiece(sym, plSym) { return sym && sym != plSym; }
function bCapturedPieces(plSym, arr, idx, rows, cols, includeDiagonals = true) {
	//console.log('player sym',plSym,'arr',arr,'idx', idx,'rows', rows,'cols', cols);
	let res = [];
	let nei = bNei(arr, idx, rows, cols, includeDiagonals);
	//console.log('nei',nei);
	for (let dir = 0; dir < 8; dir++) {
		let i = nei[dir];
		if (nundef(i)) continue;

		let el = arr[i];
		//console.log('___i',i,'el',el,'checking dir',dir);
		if (EmptyFunc(el) || el == plSym) continue;
		let inew = [];
		let MAX = 100, cmax = 0;

		while (isOppPiece(el, plSym)) {
			//console.log('index',i,'is opp',el)
			if (cmax > MAX) break; cmax += 1;
			inew.push(i);
			i = bNeiDir(arr, i, dir, rows, cols);
			//console.log(i,cmax,'dir',dir);
			if (nundef(i)) break;
			el = arr[i];
			//console.log('i',i,'el',el,'max',cmax);
		}
		if (el == plSym) {
			//add all the captured pieces to res
			res = res.concat(inew);
		}
	}
	return res;
}
function bFullRow(arr, irow, rows, cols) {
	let iStart = irow * cols;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + 1; i < iStart + cols; i++) if (arr[i] != x) return null;
	return x;
}
function bStrideRow(arr, irow, rows, cols, stride) {
	//console.log('hallo!', cols, stride)
	for (let i = 0; i <= cols - stride; i++) {
		let ch = bStrideRowFrom(arr, irow, i, rows, cols, stride);
		//console.log('ch', ch, i)
		if (ch) return ch;
	}
	return null;
}
function bStrideRowFrom(arr, irow, icol, rows, cols, stride) {
	//console.log(cols, icol, stride)
	if (cols - icol < stride) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	//console.log('starting el:', x)
	if (EmptyFunc(x)) return null;
	for (let i = iStart + 1; i < iStart + stride; i++) if (arr[i] != x) return null;
	return x;
}
function bStrideCol(arr, icol, rows, cols, stride) {
	//console.log('hallo!', rows, stride)
	for (let i = 0; i <= rows - stride; i++) {
		let ch = bStrideColFrom(arr, i, icol, rows, cols, stride);
		//console.log('ch', ch, i)
		if (ch) return ch;
	}
	return null;
}
function bStrideColFrom(arr, irow, icol, rows, cols, stride) {
	//console.log(irow, icol, rows, cols, stride)
	if (rows - irow < stride) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	//console.log('starting el:', x)
	if (EmptyFunc(x)) return null;
	for (let i = iStart + cols; i < iStart + cols * stride; i += cols) if (arr[i] != x) return null;
	return x;
}
function bStrideDiagFrom(arr, irow, icol, rows, cols, stride) {
	//console.log(irow, icol, rows, cols, stride)
	if (rows - irow < stride || cols - icol < stride) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	//console.log('starting el:', x)
	if (EmptyFunc(x)) return null;
	for (let i = iStart + cols + 1; i < iStart + (cols + 1) * stride; i += cols + 1) if (arr[i] != x) return null;
	return x;
}
function bStrideDiag2From(arr, irow, icol, rows, cols, stride) {
	//console.log(irow, icol, rows, cols, stride)
	if (rows - irow < stride || icol - stride + 1 < 0) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	//console.log('starting el:', x)
	if (EmptyFunc(x)) return null;
	for (let i = iStart + cols - 1; i < iStart + (cols - 1) * stride; i += cols - 1) if (arr[i] != x) return null;
	return x;
}
function bFullCol(arr, icol, rows, cols) {
	let iStart = icol;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + cols; i < iStart + (cols * rows); i += cols) if (arr[i] != x) return null;
	return x;
}
function bFullDiag(arr, rows, cols) {
	let iStart = 0;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + cols + 1; i < arr.length; i += cols + 1) { if (arr[i] != x) return null; }//console.log(i,arr[i]); }
	return x;
}
function bFullDiag2(arr, rows, cols) {
	let iStart = cols - 1;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	//console.log(iStart,arr[iStart]);
	for (let i = iStart + cols - 1; i < arr.length - 1; i += cols - 1) { if (arr[i] != x) return null; }//console.log(i,arr[i]); }
	return x;
}
function bPartialRow(arr, irow, rows, cols) {
	let iStart = irow * cols;
	let x = null;
	for (let i = iStart; i < iStart + cols; i++) {
		if (EmptyFunc(arr[i])) continue;
		else if (EmptyFunc(x)) x = arr[i];
		else if (arr[i] != x) return null;
	}
	return x;
}
function bPartialCol(arr, icol, rows, cols) {
	let iStart = icol;
	let x = null;
	for (let i = iStart; i < iStart + (cols * rows); i += cols) { if (EmptyFunc(arr[i])) continue; else if (EmptyFunc(x)) x = arr[i]; else if (arr[i] != x) return null; }
	return x;
}
function bPartialDiag(arr, rows, cols) {
	let iStart = 0;
	let x = null;
	for (let i = iStart; i < arr.length; i += cols + 1) { if (EmptyFunc(arr[i])) continue; else if (EmptyFunc(x)) x = arr[i]; else if (arr[i] != x) return null; }
	return x;
}
function bPartialDiag2(arr, rows, cols) {
	let iStart = cols - 1;
	let x = null;
	//console.log(iStart,arr[iStart]);
	for (let i = iStart; i < arr.length - 1; i += cols - 1) {
		if (EmptyFunc(arr[i])) continue; else if (EmptyFunc(x)) x = arr[i]; else if (arr[i] != x) return null;
	}
	return x;
}
function boardToNode(state) {
	let res = new Array();
	for (let i = 0; i < state.length; i++) {
		if (state[i] == null) res[i] = ' ';
		else res[i] = state[i];
		//else if (state[i]=='O')
	}
	return res;
}
function printBoard(arr, rows, cols, reduced = true) {
	let arrR = boardArrOmitFirstRowCol(arr, rows, cols);
	let s = toBoardString(arrR, rows, cols);
	console.log('board', s);
}
function boardArrOmitFirstRowCol(boardArr, rows, cols) {
	let res = [];
	for (let r = 1; r < rows; r++) {
		for (let c = 1; c < cols; c++) {
			let i = iFromRowCol(r, c, rows, cols);

			res.push(boardArr[i]);
		}
	}
	return res;

}
// new version von printState:
function toBoardString(arr, rows, cols) {
	let s = '\n';
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			let item = arr[r * cols + c];

			s += '' + (nundef(item) ? '_' : item) + ' ';
		}
		s += '\n';
	}
	return s;
}
function printState(state, cols) {
	//console.log('___________',state)
	if (nundef(cols)) cols = G.cols;
	let formattedString = '';
	state.forEach((cell, index) => {
		formattedString += isdef(cell) ? ` ${cell == '0' ? ' ' : cell} |` : '   |';
		if ((index + 1) % G.cols == 0) {
			formattedString = formattedString.slice(0, -1);
			if (index < G.rows * G.cols - 1) {
				let s = '\u2015\u2015\u2015 '.repeat(G.cols);
				formattedString += '\n' + s + '\n'; //\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
				// formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
			}
		}
	});
	console.log('%c' + formattedString, 'color: #6d4e42;font-size:10px');
	console.log();
}
function bCreateEmpty(rows, cols) { return new Array(rows * cols).fill(null); }

function checkWinnerPossible(arr, rows, cols) {
	for (i = 0; i < rows; i++) { let ch = bPartialRow(arr, i, rows, cols); if (ch) return ch; }
	for (i = 0; i < cols; i++) { let ch = bPartialCol(arr, i, rows, cols); if (ch) return ch; }
	let ch = bPartialDiag(arr, rows, cols); if (ch) return ch;
	ch = bPartialDiag2(arr, rows, cols); if (ch) return ch;
	return null;
}
function checkWinner(arr, rows, cols) {
	for (i = 0; i < rows; i++) { let ch = bFullRow(arr, i, rows, cols); if (ch) return ch; }
	for (i = 0; i < cols; i++) { let ch = bFullCol(arr, i, rows, cols); if (ch) return ch; }
	let ch = bFullDiag(arr, rows, cols); if (ch) return ch;
	ch = bFullDiag2(arr, rows, cols); if (ch) return ch;
	return null;
}
function checkBoardEmpty(arr) { for (const x of arr) { if (!EmptyFunc(x)) return false; } return true; }
function checkBoardFull(arr) { for (const x of arr) if (EmptyFunc(x)) return false; return true; }

//TTT
function checkPotentialTTT(arr) { return checkWinnerPossible(arr, G.rows, G.cols); }
function checkWinnerTTT(arr) { return checkWinner(arr, G.rows, G.cols); }
function checkWinnerC4(arr, rows = 6, cols = 7, stride = 4) {
	//console.log(arr,rows,cols,stride)

	for (i = 0; i < rows; i++) { let ch = bStrideRow(arr, i, rows, cols, stride); if (ch) return ch; }
	for (i = 0; i < cols; i++) { let ch = bStrideCol(arr, i, rows, cols, stride); if (ch) return ch; }
	for (i = 0; i < rows; i++) {
		for (j = 0; j < cols; j++) {
			let ch = bStrideDiagFrom(arr, i, j, rows, cols, stride); if (ch) return ch;
			ch = bStrideDiag2From(arr, i, j, rows, cols, stride); if (ch) return ch;
		}
	}
	return null;
}
//#endregion

//#region Board classes
class Board {
	constructor(rows, cols, handler, cellStyle) {
		let styles = isdef(cellStyle) ? cellStyle : { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		this.rows = rows;
		this.cols = cols;
		let items = this.items = iGrid(this.rows, this.cols, dTable, styles);
		items.map(x => {
			let d = iDiv(x);
			mCenterFlex(d);
			d.onclick = handler;
		});
		//console.log(this.items)
	}
	get(ir, c) {
		if (isdef(c)) {
			// interpret as row,col
			let idx = ir * this.cols + c;
			return this.items[idx];
		} else {
			//interpret as index
			return this.items[ir];
		}
	}
	getState() {
		return this.items.map(x => x.label);
	}
	setState(arr, colors) {

		if (isEmpty(arr)) return;
		if (isList(arr[0])) { arr = arrFlatten(arr); }

		for (let i = 0; i < arr.length; i++) {
			let item = this.items[i];
			let val = arr[i];
			if (!EmptyFunc(val)) {
				addLabel(item, val, { fz: 60, fg: colors[val] });
			} else item.label = val;
			//item.label = arr[i];

		}
	}
	clear() {
		for (const item of this.items) {
			let dLabel = iLabel(item);
			if (isdef(dLabel)) { removeLabel(item); item.label = null; }
		}
	}
}

class Board2D {
	constructor(rows, cols, dParent, cellStyles, boardStyles, handler) {
		cellStyles = this.cellStyles = isdef(cellStyles) ? cellStyles : { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		boardStyles = this.boardStyles = isdef(boardStyles) ? boardStyles : { bg: 'silver', fg: 'black' };
		this.rows = rows;
		this.cols = cols;
		this.dParent = dParent;
		//let dGridParent = this.dGridParent = mDiv(dParent,{bg:'green'});
		let dBoard = this.dBoard = mDiv(dParent);//, boardStyles);
		let items = this.items = this.fill(dBoard, this.rows, this.cols, null, cellStyles);
	}
	fill(d, rows, cols, items, cellStyles) {
		if (nundef(items)) items = [];
		clearElement(d);
		mStyleX(d, { display: 'grid', 'grid-template-columns': cols });
		for (let i = 0; i < rows * cols; i++) {
			let item = items[i];
			if (isdef(item)) {
				let d1 = iDiv(item);
				if (isdef(d1)) mAppend(d, iDiv(item));
				else {
					d1 = mDiv(d, cellStyles); iAdd(item, { div: d1 }); mAppend(d, d1);
				}
			} else {
				let [r, c] = iToRowCol(i);
				item = { row: r, col: c, index: i };
				let d1 = mDiv(d, cellStyles); iAdd(item, { div: d1 }); mAppend(d, d1);
			}
			mStyleX(iDiv(item), cellStyles);
			items.push(item)
		}
		return items;
	}
	get(ir, c) {
		if (isdef(c)) {
			// interpret as row,col
			let idx = ir * this.cols + c;
			return this.items[idx];
		} else {
			//interpret as index
			return this.items[ir];
		}
	}
	getState() {
		return this.items.map(x => x.label);
	}
	setState(arr, colors) {

		if (isEmpty(arr)) return;
		if (isList(arr[0])) { arr = arrFlatten(arr); }

		for (let i = 0; i < arr.length; i++) {
			let item = this.items[i];
			let val = arr[i];
			if (!EmptyFunc(val)) {
				addLabel(item, val, { fz: 60, fg: colors[val] });
			} else item.label = val;
			//item.label = arr[i];

		}
	}
	clear() {
		for (const item of this.items) {
			let dLabel = iLabel(item);
			if (isdef(dLabel)) { removeLabel(item); item.label = null; }
		}
	}
}

//#endregion

//#region expand and reduce board (perlen 1. version)
function reduceBoard(board, rNew, cNew, iModify) {
	//console.log(board.rows,board.cols, 'iModify',iModify)
	let [boardArrOld, rOld, cOld] = [board.fields.map(x => isdef(x.item) ? x.item.index : null), board.rows, board.cols];

	//console.log('boardArrOld',boardArrOld)

	let rest = [];
	if (rOld > rNew) { rest = bGetRow(boardArrOld, iModify, rOld, cOld).filter(x => x != null); }
	else if (cOld > cNew) { rest = bGetCol(boardArrOld, iModify, rOld, cOld).filter(x => x != null); }
	//console.log('restPerlen', rest)

	let boardArrNew = new Array(rNew * cNew);
	for (let r = 0; r < rNew; r++) {
		for (let c = 0; c < cNew; c++) {
			let i = iFromRowCol(r, c, rNew, cNew);
			let x = (rOld != rNew) ? r : c;
			if (x < iModify) {
				let iOld = iFromRowCol(r, c, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
			}
			// else if (x == iModify) boardArrNew[i] = null;
			else {
				let [ir, ic] = (rOld != rNew) ? [r + 1, c] : [r, c + 1];

				let iOld = iFromRowCol(ir, ic, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
				//console.log('TRANFER!!!', boardArrOld[iOld]);
			}
		}
	}
	return { rows: rNew, cols: cNew, boardArr: boardArrNew, extras: rest };
}
function expandBoard(board, rNew, cNew, iInsert) {
	let [boardArrOld, rOld, cOld] = [board.fields.map(x => isdef(x.item) ? x.item.index : null), board.rows, board.cols];

	let boardArrNew = new Array(rNew * cNew);
	for (let r = 0; r < rNew; r++) {
		for (let c = 0; c < cNew; c++) {
			let i = iFromRowCol(r, c, rNew, cNew);
			let x = (rOld != rNew) ? r : c;
			if (x < iInsert) {
				let iOld = iFromRowCol(r, c, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
			}
			else if (x == iInsert) boardArrNew[i] = null;
			else {
				let [ir, ic] = (rOld != rNew) ? [r - 1, c] : [r, c - 1];

				let iOld = iFromRowCol(ir, ic, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
				//console.log('TRANFER!!!', boardArrOld[iOld]);
			}
		}
	}
	return { rows: rNew, cols: cNew, boardArr: boardArrNew, extras: [] };

}
function insertColNew(board, cClick) { return expandBoard(board, board.rows, board.cols + 1, cClick + 1); }
function insertRowNew(board, cClick) { return expandBoard(board, board.rows + 1, board.cols, cClick + 1); }
function removeColNew(board, cClick) { return reduceBoard(board, board.rows, board.cols - 1, cClick); }
function removeRowNew(board, cClick) { return reduceBoard(board, board.rows - 1, board.cols, cClick); }
//#endregion

function getCenters(layout, rows, cols, wCell, hCell,) {
	if (layout == 'quad') { return quadCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex') { return hexCenters(rows, cols, wCell, hCell); }
	else if (layout == 'circle') { return circleCenters(rows, cols, wCell, hCell); }
}
function getCentersFromAreaSize(layout, wBoard, hBoard, wCell, hCell) {
	let info;
	if (layout == 'quad') { info = quadCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex') { info = hexCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex1') { info = hex1Centers(rows, cols, wCell, hCell); }
	else if (layout == 'circle') { info = circleCenters(rows, cols, wCell, hCell); }
	return info;
}
function getCentersFromRowsCols(layout, rows, cols, wCell, hCell) {
	let info;
	if (layout == 'quad') { info = quadCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex') { info = hexCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex1') { info = hex1Centers(rows, cols, wCell, hCell); }
	else if (layout == 'circle') { info = circleCenters(rows, cols, wCell, hCell); }
	return info;
}
function quadCenters(rows, cols, wCell, hCell) {
	let offX = wCell / 2, offY = hCell / 2;
	let centers = [];
	let x = 0; y = 0;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let center = { x: x + offX, y: y + offY };
			centers.push(center);
			x += wCell;
		}
		y += hCell; x = 0;
	}
	//last,x,y+offX,offY 	
	return [centers, wCell * cols, hCell * rows];
}
function circleCenters(rows, cols, wCell, hCell) {
	//find center
	let [w, h] = [cols * wCell, rows * hCell];
	let cx = w / 2;
	let cy = h / 2;

	//console.log('cx,cy', cx, cy)

	let centers = [{ x: cx, y: cy }];

	//calc wieviele schichten sich ausgehen?
	let rx = cx + wCell / 2; let dradx = rx / wCell;
	let ry = cy + hCell / 2; let drady = ry / hCell;
	let nSchichten = Math.floor(Math.min(dradx, drady));
	//console.log('Schichten', nSchichten)

	for (let i = 1; i < nSchichten; i++) {
		let [newCenters, wsch, hsch] = oneCircleCenters(i * 2 + 1, i * 2 + 1, wCell, hCell);
		//console.log('newCenters',newCenters,'w',wsch,'h',hsch);//,'\n',newCenters.centers.length);
		for (const nc of newCenters) {
			//console.log('adding point',nc);
			centers.push({ x: nc.x + cx - wsch / 2, y: nc.y + cy - hsch / 2 });
		}
	}
	return [centers, wCell * cols, hCell * rows];
}
function oneCircleCenters(rows, cols, wCell, hCell) {
	//find center
	let [w, h] = [cols * wCell, rows * hCell];
	let cx = w / 2;
	let cy = h / 2;

	//console.log('cx,cy',cx,cy)

	let centers = [{ x: cx, y: cy }];


	//wieviele will ich placen?
	let n = 8;
	//was ist radius?
	let radx = cx - wCell / 2;
	let rady = cy - hCell / 2;

	//console.log('radx,rady',radx,rady)

	let peri = Math.min(radx, rady) * 2 * Math.PI;
	//console.log('.............n',n)
	n = Math.floor(peri / Math.min(wCell, hCell));
	//console.log('.............n',n)
	while (n > 4 && n % 4 != 0 && n % 6 != 0) n -= 1;
	//console.log('.............n',n)

	centers = getEllipsePoints(radx, rady, n)
	centers = centers.map(pt => ({ x: pt.X + cx, y: pt.Y + cy }));

	return [centers, wCell * cols, hCell * rows];
}

//#region hex
function hexCenters(rows, cols, wCell = 100, hCell) {
	if (nundef(hCell)) hCell = (hCell / .866);
	let hline = hCell * .75;
	let offX = wCell / 2, offY = hCell / 2;
	let centers = [];
	let startSmaller = Math.floor(rows / 2) % 2 == 1;

	let x = 0; y = 0;
	for (let r = 0; r < rows; r++) {
		let isSmaller = startSmaller && r % 2 == 0 || !startSmaller && r % 2 == 1;
		let curCols = isSmaller ? cols - 1 : cols;
		let dx = isSmaller ? wCell / 2 : 0;
		dx += offX;
		for (let c = 0; c < curCols; c++) {
			let center = { x: dx + c * wCell, y: offY + r * hline };
			centers.push(center);
		}
	}
	return [centers, wCell * cols, hCell / 4 + rows * hline];
}
function _calc_hex_col_array(rows, cols) {
	let colarr = []; //how many cols in each row
	for (let i = 0; i < rows; i++) {
		colarr[i] = cols;
		if (i < (rows - 1) / 2) cols += 1;
		else cols -= 1;
	}
	return colarr;
}

function hex1Count(rows, topcols) {
	let colarr = _calc_hex_col_array(rows, topcols);
	let total = 0;
	for (let r = 0; r < colarr.length; r++) { total += colarr[r]; }
	return total;
}
function hex1Indices(rows, topcols) {
	let colarr = _calc_hex_col_array(rows, topcols);
	let iStart = Math.floor(rows / 2);
	let inc = -1;
	let res = [];
	for (let r = 0; r < colarr.length; r++) {
		let n = colarr[r];
		for (let c = 0; c < n; c++) {
			let icol = iStart + 2 * c;
			let irow = r;
			res.push({ row: irow, col: icol });
		}
		if (iStart == 0) inc = 1;
		iStart += inc;
	}
	return res;
}

function hex1Centers(rows, cols, wCell = 100, hCell) {
	//console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
	//rows = 7, cols = 6;
	let colarr = _calc_hex_col_array(rows, cols);
	//console.log('colarr', colarr);
	let maxcols = arrMax(colarr);
	//calc x offset of row: (maxcols-colarr[i])*wCell/2
	if (nundef(hCell)) hCell = (hCell / .866);
	let hline = hCell * .75;
	let offX = wCell / 2, offY = hCell / 2;
	let centers = [];

	let x = 0; y = 0;
	for (let r = 0; r < colarr.length; r++) {
		let n = colarr[r];
		for (let c = 0; c < n; c++) {
			let dx = (maxcols - n) * wCell / 2;
			let dy = r * hline;
			let center = { x: dx + c * wCell + offX, y: dy + offY };
			centers.push(center);
		}
	}
	//console.log(centers)
	return [centers, wCell * maxcols, hCell / 4 + rows * hline];
}

function hex1Board(dParent, rows, topcols, styles = {}) {
	let g = new UIGraph(dParent, styles);
	let [w, h] = [valf(lookup(styles, ['node', 'w']), 50), valf(lookup(styles, ['node', 'h']), 50)];
	//let [rows, topcols] = [5, 3];
	let total = hex1Count(rows, topcols);
	//console.log('for rows', rows, 'and cols', topcols, 'need', total, 'nodes')
	let nids = g.addNodes(total);
	g.hex1(rows, topcols, w + 4, h + 4);
	let indices = hex1Indices(rows, topcols);
	//console.log('indices', indices);
	//correct, jetzt soll jeder node die bekommen!
	let ids = g.getNodeIds();
	//console.log('node ids:', ids);
	//return;
	let di = {};
	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		lookupSet(di, [row, col], id);
		g.setProp(id, 'row', row);
		g.setProp(id, 'col', col);
		g.setProp(id, 'label', `${row},${col}`);
		//g.setStyle(id, 'label', 'data(label)');
	}
	//let labels=g.getNodes().map(x=>x.data().label);
	//console.log('labels',labels);
	//let label=g.cy.getElementById(ids[1]).data('label');

	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		let nid2 = lookup(di, [row, col + 2]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col - 1]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col + 1]); if (nid2) g.addEdge(id, nid2);
	}

	//let deg=g.getDegree(ids[1]); //cy.getElementById(ids[1]).data('label');
	//let deg1=g.getDegree(ids[10]); //cy.getElementById(ids[1]).data('label');
	//let deg2=g.getDegree(ids[18]); //cy.getElementById(ids[1]).data('label');
	//console.log('das geht: label',label,deg,deg1,deg2);

	return g;
}

function catanBoard(dParent, rows, topcols, styles = {}) {
	let g = hex1Board(dParent, rows, topcols, styles);
	hexCornerNodes(g);

}
function correctPolys(polys, approx = 10) {
	//console.log('citySize', citySize, 'approx', approx);
	let clusters = [];
	for (const p of polys) {
		//console.log(p.map(pt => '(' + pt.x + ',' + pt.y + ') ').toString());
		for (const pt of p) {
			let found = false;
			for (const cl of clusters) {
				for (const v of cl) {
					let dx = Math.abs(v.x - pt.x);
					let dy = Math.abs(v.y - pt.y);
					//console.log('diff', dx, dy);
					if (dx < approx && dy < approx) {
						//console.log('FOUND X!!!', dx,dy);
						cl.push(pt);
						found = true;
						break;
					}
				}
				if (found) break;
			}
			if (!found) {
				//make new cluster with this point
				clusters.push([pt]);
			}
		}
	}

	//now all points of all polys are in clusters
	//go through clusters, computer mean for all points in a clusters
	let vertices = [];
	for (const cl of clusters) {
		let sumx = 0;
		let sumy = 0;
		let len = cl.length;
		for (const pt of cl) {
			sumx += pt.x;
			sumy += pt.y;
		}
		vertices.push({ x: Math.round(sumx / len), y: Math.round(sumy / len) });
	}

	for (const p of polys) {
		for (const pt of p) {
			let found = false;
			for (const v of vertices) {
				let dx = Math.abs(v.x - pt.x);
				let dy = Math.abs(v.y - pt.y);
				if (dx < approx && dy < approx) {
					if (dx != 0 || dy != 0) {
						pt.x = v.x;
						pt.y = v.y;
					}
					found = true;
				}
				if (found) break;
			}
			if (!found) {
				//make new cluster with this point
				error('point not found in vertices!!! ' + pt.x + ' ' + pt.y);
			}
		}
	}
	return vertices;
}

function getCornerVertices(centers, w = 100, h = 100) {
	let polys = [];
	for (const pt of centers) {
		let poly = getHexPoly(pt.x, pt.y, w, h);
		polys.push(poly);
	}
	let vertices = correctPolys(polys, 1);
	return vertices;
}
function hexCornerNodes(g) {
	let nodes = g.getNodes();
	let centers = nodes.map(x => x.data('center'));
	let vertices = getCornerVertices(centers);

	//now create points for unique vertices!
	//danach muss ich noch das neighborhood machen
	for (const f of nodes) {
		let center = f.data('center');
		console.log('center', center)

	}

}

//#endregion hex
