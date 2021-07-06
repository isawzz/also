function leaveBreadCrumbs(cells,color='yellow'){
	let sz=10;//getSize(cells[0]).sz;
	for(const cell of cells){
		mCellContent(cell,{w:sz,h:sz,bg:color,fg:'white',rounding:'50%'});
	}
}
function getPathCells(path){
	let nodes = path.nodes().map(x=>x.id());
	let res = [];
	for(const nid of nodes){
		// let [r,c]=nodeIdToRowCol(nid); //allNumbers(nid).map(x=>Math.abs(x));
		// res.push(getCell(r,c));
		res.push(nodeIdToCell(nid));
	}
	return res;
}
function getRCI(edgeId){
	//edge id is of the form r1-c1_r2-c2
	let [r1,c1,r2,c2]=allNumbers(edgeId).map(x=>Math.abs(x));	//console.log('r,c 1:',r1,c1,'\nr,c 2:',r2,c2);
	let i1,i2; //indices that have to be switched form 1 to 0
	i1=r1<r2?2:r1>r2?0:c1<c2?1:3;
	i2=i1==0?2:i1==1?3:i1==2?0:1;
	return [r1,c1,i1,r2,c2,i2];
}
function getMaze(m,r,c){return m[r][c]; }
function getCell(r,c){return mBy(getCommonIdTable(r,c));}
function nodeIdToRowCol(nid){return allNumbers(nid).map(x=>Math.abs(x));}
function nodeIdToCell(nid){return getCell(...nodeIdToRowCol(nid));}
function setBorder(cell,dir){
	prop = getBorderPropertyForDirection(dir);
	cell.style[prop]=`${G.gap}px solid black`;
	//mStyleX(cell,{bg:'red'}); cell.innerHTML = dir;
}
function getBorderPropertyForDirection(dir){	return {0:'border-top',1:'border-right',2:'border-bottom',3:'border-left'}[dir];}








function iMaze(dParent, rows, cols, styles = { w: 500, h: 400, gap: 4, sz: 50, szDoor: 40 }) {

	//achtung styles: fg is wall color, bg is room color!
	let [w, h, gap, sz, szDoor] = [styles.w, styles.h, styles.gap, styles.sz, styles.szDoor];
	console.log(styles)
	let d = mDiv(dParent, { display: 'inline-grid', position: 'relative', gap: gap, w: w, h: h, padding: gap });
	d.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
	d.style.gridTemplateRows = 'repeat(' + rows + ',1fr)';
	let wallWidth = valf(styles.gap, 4);

	let [wallColor, floorColor] = [valf(styles.fg, 'white'), valf(styles.bg, BLUE)];
	mStyleX(d, { bg: wallColor });

	let rooms = [];
	for (let r = 0; r < rows; r++) { //['a', 'c', 'd', 'f', 'z']) {
		for (let c = 0; c < cols; c++) { //['a', 'c', 'd', 'f', 'z']) {
			let room = iCell(d, getUID(), { w: sz, h: sz, bg: floorColor, row: r, col: c });
			rooms.push(room);
		}
	}


	let maze = { rect: getRect(d), fg: wallColor, bg: floorColor, doors: [], rooms: rooms.map(x => x.id), szDoor: szDoor, wallWidth: wallWidth };
	maze.roomsByLetter = {};
	rooms.map(x => maze.roomsByLetter[x.ch] = x.id);
	iAdd(maze, { div: d });
	rooms.map(x => x.house = maze.id);

	cellAdjacency(maze);

	return maze;
}
function iCell(dParent, ch, styles) {
	let def = { position: 'relative' };
	copyKeys(def, styles);
	let dCell = mDiv(dParent, styles);
	let rect = getRect(dCell);
	let size = Math.round(rect.w * rect.h / 1000);
	let room = { id: ch, ch: ch, bg: dCell.style.backgroundColor, rect: rect, size: size };
	delete Items[ch];
	iAdd(room, { div: dCell });
	room.doors = [];
	room.furniture = [];
	room.hasDoor = () => !isEmpty(room.doors)
	room.hasPassThrough = () => room.doors.length >= 2;
	return room;
}
function cellAdjacency(house) {
	//assumes rectangular rooms! to make other shapes of rooms, need to compose them!
	let rooms = house.rooms.map(x => Items[x]);

	for (let i = 0; i < rooms.length; i++) {
		for (let j = i + 1; j < rooms.length; j++) {
			let [r1, r2] = [rooms[i], rooms[j]];
			let [e1, e2] = [r1.rect, r2.rect];
			let rhoeher = e1.t < e2.t ? r1 : r2;
			let rleft = e1.x < e2.x ? r1 : r2;
			let rniedriger = (rhoeher == r1 ? r2 : r1);
			let rright = (rleft == r1 ? r2 : r1);
			let diff = 2 * house.wallWidth; // =min length between rooms to warrant a wall

			//check for vertical wall
			let y1 = Math.max(e1.t, e2.t);
			let y2 = Math.min(e1.b, e2.b);
			let dCommony = y2 - y1;
			if (dCommony > diff && isCloseTo(rright.rect.l, rleft.rect.r)) {
				//console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommony);
				// let re1=getRect(iDiv(r1),iDiv(house)); //relative to house
				// let re2=getRect(iDiv(r2),iDiv(house));
				//showRect('r1', r1); showRect('r2', r2); showRect('house', house);
				let dr = {
					x: rleft.rect.r - house.rect.l,
					y: rniedriger.rect.t - house.rect.t, //fuer door: + (dCommony - szDoor) / 2,
					w: rright.rect.l - rleft.rect.r, //house.wallWidth,
					h: dCommony, //fuer door: szDoor
				};
				extendRect(dr);
				addAdjacencyFromTo(rleft, rright, 'e', dr);
			}

			//check for horizontal wall
			let x1 = Math.max(e1.l, e2.l);
			let x2 = Math.min(e1.r, e2.r);
			let dCommonx = x2 - x1;
			if (dCommonx > diff && isCloseTo(rniedriger.rect.t, rhoeher.rect.b)) {
				//console.log(r1.ch, 'and', r2.ch, 'share horizontal wall of size', dCommonx);
				// let re1=getRect(iDiv(r1),iDiv(house)); //relative to house
				// let re2=getRect(iDiv(r2),iDiv(house));
				//showRect('r1', r1); showRect('r2', r2); showRect('house', house);
				let dr = {
					x: rright.rect.l - house.rect.l, //fuer door: + (dCommonx - szDoor) / 2,
					y: rhoeher.rect.b - house.rect.t,
					w: dCommonx, //fuer door: szDoor, 
					h: house.wallWidth
				};
				extendRect(dr);
				addAdjacencyFromTo(rhoeher, rniedriger, 's', dr);
			}
		}
	}


	// add OUTER walls:
	for (let i = 0; i < rooms.length; i++) {
		let r = rooms[i];
		//console.log(r.ch);
		if (isCloseTo(r.rect.l, house.rect.l)) {
			//this room has western outer wall
			let wallRect = { x: house.rect.l, y: r.rect.t, w: house.wallWidth, h: r.rect.h };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 'w', wallRect);
			r.isW = true;
		}
		if (isCloseTo(r.rect.r, house.rect.r)) {
			//this room has eastern outer wall
			let wallRect = { x: r.rect.r, y: r.rect.t, w: house.wallWidth, h: r.rect.h };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 'e', wallRect);
			r.isE = true;
		}
		if (isCloseTo(r.rect.t, house.rect.t)) {
			//this room has northern outer wall
			let wallRect = { x: r.rect.l, y: house.rect.t, w: r.rect.w, h: house.wallWidth };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 'n', wallRect);
			r.isN = true;
		}
		if (isCloseTo(r.rect.b, house.rect.b)) {
			//this room has southern outer wall
			let wallRect = { x: r.rect.l, y: r.rect.b, w: r.rect.w, h: house.wallWidth };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 's', wallRect);
			r.isS = true;
		}
	}
}

function getCommonId(row, col) { return '' + row + "-" + col; }
function getCommonIdTable(row, col) { return 'td_' + getCommonId(row, col); }
function newMaze(x, y) {

	// Establish variables and starting grid
	var totalCells = x * y;
	var cells = new Array();
	var unvis = new Array();
	for (var i = 0; i < y; i++) {
		cells[i] = new Array();
		unvis[i] = new Array();
		for (var j = 0; j < x; j++) {
			cells[i][j] = [0, 0, 0, 0];
			unvis[i][j] = true;
		}
	}

	// Set a random position to start from
	var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
	var path = [currentCell];
	unvis[currentCell[0]][currentCell[1]] = false;
	var visited = 1;

	// Loop through all available cell positions
	while (visited < totalCells) {
		// Determine neighboring cells
		var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
		[currentCell[0], currentCell[1] + 1, 1, 3],
		[currentCell[0] + 1, currentCell[1], 2, 0],
		[currentCell[0], currentCell[1] - 1, 3, 1]];
		var neighbors = new Array();

		// Determine if each neighboring cell is in game grid, and whether it has already been checked
		for (var l = 0; l < 4; l++) {
			if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
		}

		// If at least one active neighboring cell has been found
		if (neighbors.length) {
			// Choose one of the neighbors at random
			next = neighbors[Math.floor(Math.random() * neighbors.length)];

			// Remove the wall between the current cell and the chosen neighboring cell
			cells[currentCell[0]][currentCell[1]][next[2]] = 1;
			cells[next[0]][next[1]][next[3]] = 1;


			// Mark the neighbor as visited, and set it as the current cell
			unvis[next[0]][next[1]] = false;
			visited++;
			currentCell = [next[0], next[1]];
			path.push(currentCell);
		}
		// Otherwise go back up a step and keep going
		else {
			currentCell = path.pop();
		}
	}
	return cells;
}

function newMazePlusGraph(x, y, g) {

	// Establish variables and starting grid
	var dxy = G.sz + 2 * G.gap; //(G.sz+G.gap)*2/3;//+G.gap;
	var offs = dxy / 2 + G.gap;

	var totalCells = x * y;
	var cells = new Array();
	var unvis = new Array();
	for (var i = 0; i < y; i++) {
		cells[i] = new Array();
		unvis[i] = new Array();
		for (var j = 0; j < x; j++) {
			cells[i][j] = [0, 0, 0, 0];
			g.addNode({ id: getCommonId(i, j), row: i, col: j }, { x: offs + dxy * j, y: offs + dxy * i });
			unvis[i][j] = true;
		}
	}

	// Set a random position to start from
	var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
	var path = [currentCell];
	unvis[currentCell[0]][currentCell[1]] = false;
	var visited = 1;

	// Loop through all available cell positions
	while (visited < totalCells) {
		// Determine neighboring cells
		var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
		[currentCell[0], currentCell[1] + 1, 1, 3],
		[currentCell[0] + 1, currentCell[1], 2, 0],
		[currentCell[0], currentCell[1] - 1, 3, 1]];
		var neighbors = new Array();

		// Determine if each neighboring cell is in game grid, and whether it has already been checked
		for (var l = 0; l < 4; l++) {
			if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
		}

		// If at least one active neighboring cell has been found
		if (neighbors.length) {
			// Choose one of the neighbors at random
			next = neighbors[Math.floor(Math.random() * neighbors.length)];

			// Remove the wall between the current cell and the chosen neighboring cell
			cells[currentCell[0]][currentCell[1]][next[2]] = 1;
			cells[next[0]][next[1]][next[3]] = 1;

			let row = currentCell[0];
			let col = currentCell[1];
			let row2 = next[0];
			let col2 = next[1];
			g.addEdge(getCommonId(row, col), getCommonId(row2, col2), {});

			// Mark the neighbor as visited, and set it as the current cell
			unvis[next[0]][next[1]] = false;
			visited++;
			currentCell = [next[0], next[1]];
			path.push(currentCell);
		}
		// Otherwise go back up a step and keep going
		else {
			currentCell = path.pop();
		}
	}
	return cells;
}


function newMazePlusGraphFromTo(x, y, g, from, to) {

	//default for path I am interested in: top-left to bottom-right
	if (nundef(from)) from = { r: 0, c: 0 };
	if (nundef(to)) to = { r: y - 1, c: x - 1 };

	// Establish variables and starting grid
	var dxy = G.sz + 2 * G.gap; //(G.sz+G.gap)*2/3;//+G.gap;
	var offs = dxy / 2 + G.gap;

	var totalCells = x * y;
	var cells = new Array();
	var unvis = new Array();
	for (var i = 0; i < y; i++) {
		cells[i] = new Array();
		unvis[i] = new Array();
		for (var j = 0; j < x; j++) {
			cells[i][j] = [0, 0, 0, 0];
			g.addNode({ id: getCommonId(i, j), row: i, col: j }, { x: offs + dxy * j, y: offs + dxy * i });
			unvis[i][j] = true;
		}
	}

	// Set a random position to start from
	var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
	let startCell = currentCell;
	var path = [currentCell];
	unvis[currentCell[0]][currentCell[1]] = false;
	var visited = 1;

	var pathToFrom = [];
	var pathToTo = [];

	// Loop through all available cell positions
	while (visited < totalCells) {
		// Determine neighboring cells
		var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
		[currentCell[0], currentCell[1] + 1, 1, 3],
		[currentCell[0] + 1, currentCell[1], 2, 0],
		[currentCell[0], currentCell[1] - 1, 3, 1]];
		var neighbors = new Array();

		// Determine if each neighboring cell is in game grid, and whether it has already been checked
		for (var l = 0; l < 4; l++) {
			if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
		}

		// If at least one active neighboring cell has been found
		if (neighbors.length) {
			// Choose one of the neighbors at random
			next = neighbors[Math.floor(Math.random() * neighbors.length)];

			//if this is the from cell or the to cell, remember path as it is NOW
			if (next[0] == from.r && next[1] == from.c) {
				pathToFrom = jsCopy(path); pathToFrom.push(currentCell);
			} else if (next[0] == to.r && next[1] == to.c) {
				pathToTo = jsCopy(path); pathToTo.push(currentCell);
			}

			// Remove the wall between the current cell and the chosen neighboring cell
			cells[currentCell[0]][currentCell[1]][next[2]] = 1;
			cells[next[0]][next[1]][next[3]] = 1;

			let row = currentCell[0];
			let col = currentCell[1];
			let row2 = next[0];
			let col2 = next[1];
			g.addEdge(getCommonId(row, col), getCommonId(row2, col2), {});

			// Mark the neighbor as visited, and set it as the current cell
			unvis[next[0]][next[1]] = false;
			visited++;
			currentCell = [next[0], next[1]];
			path.push(currentCell);
		}
		// Otherwise go back up a step and keep going
		else {
			currentCell = path.pop();
		}
	}
	pathToFrom.push([from.r,from.c]);
	pathToTo.push([to.r,to.c]);
	//console.log('pathToTo',pathToTo);
	//reverse pathToFrom
	pathToFrom=arrReverse(pathToFrom);
	//console.log('pathToFrom',pathToFrom);
	pathToTo = pathToTo.slice(1);
	let completePath = pathToFrom.concat([startCell]).concat(pathToTo);
	console.log('path',completePath.join(' > '));
	console.log('START:',startCell);
	let shorter = shortenPath(completePath);

	console.log('path was shortened from',completePath.length,'to',shorter.length)
	return {maze:cells,path:shorter};
}

function shortenPath(path){
	let res = [];
	let testPath = path.map(x=>x.join('_'));
	console.log('path:',testPath);
	let i=0;
	while(testPath.length>0){
		let p = testPath[i]; console.log('____\nelement:',p);
		testPath = testPath.slice(1);
		let idx = testPath.indexOf(p);
		if (idx<0){
			//console.log('el',p,'does NOT occur in',testPath.join(' > '));
			res.push(p.split('_'));
			console.log('res:',res.join(', '))
			continue;
		}else{
			console.log('el',p,'occurs at',idx);//,testPath.join(' > '));
			testPath = testPath.slice(idx+1);console.log('path:',testPath)
			res.push(p.split('_'));
		}
	}
	console.log('res',res)
	return res;




	for(let i=0;i<path.length;i++){
		//if this same element occurs again in path, cut out
		
		
		
		console.log('rest',rest)
		let idx = occuranceInRestOfPath(p,rest); //testPath.slice(i+1));
		console.log('idx',idx);
		if (idx>0) {
			console.log('found cycle!!!');
			i+=idx;
		}
		res.push(p.split('_'));

	}
	console.log('res',res)
	return res;
}
function occuranceInRestOfPath(p,arr){
	return arr.indexOf(p);
}


