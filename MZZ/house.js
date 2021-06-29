function addAdjacency(adj, r1, r2, wallId) {
	if (nundef(adj[r1.ch])) adj[r1.ch] = {}; //adjacency matrix by room name, not id!
	if (nundef(adj[r2.ch])) adj[r2.ch] = {};
	if (nundef(adj[r1.id])) adj[r1.id] = {};
	if (nundef(adj[r2.id])) adj[r2.id] = {};
	// console.log(adj[r2.id])

	adj[r1.id][r2.id] = adj[r2.id][r1.id] = adj[r1.ch][r2.ch] = adj[r2.ch][r1.ch] = wallId;
	// if (r1.ch == 'a' && r2.ch == 'd'){
	// 	console.log('jetzt',jsCopy(adj));
	// 	console.log(r1.id,r2.id,adj[r1.id][r2.id],adj[r2.id][r1.id]);
	// }

}
function findWall(x, y, walls, accuracy = 10) {
	for (const w of walls) {
		let [wx, wy, ww, wh] = [w.rect.x, w.rect.y, w.rect.w, w.rect.h];
		if (isCloseTo(x, wx)) {
			//clicked close to a vertical wall!
			//check if y is within wall height:
			if (y >= wy && y <= wy + wh) {
				//this is the correct wall!
				return w;
			}
		}
		if (isCloseTo(y, wy) && x >= wx && x <= wx + ww) return w;
	}
}
function findRoom(r1, house) {
	if (isDict(r1)) return r1;
	else if (isLetter(r1)) { let rid = firstCond(house.rooms, x => Items[x].ch == r1); return Items[rid] }
	else return Items[r1];
}
function isCornerRoom(house, room) {
	let rr = room.rect;
	let rh = house.rect;
	let w = house.wallWidth;
	let isHorSide = isCloseTo(rr.x, rh.x, w) || isCloseTo(rr.r, rh.r, w);
	let isVertSide = isCloseTo(rr.y, rh.y, w) || isCloseTo(rr.b, rh.b, w);
	return isHorSide && isVertSide;
}
function isNorthRoom(house, room) { return isCloseTo(room.rect.t, house.rect.t, house.wallWidth); }
function isSouthRoom(house, room) { return isCloseTo(room.rect.b, house.rect.b, house.wallWidth); }
function isEastRoom(house, room) { return isCloseTo(room.rect.r, house.rect.r, house.wallWidth); }
function isWestRoom(house, room) { return isCloseTo(room.rect.l, house.rect.l, house.wallWidth); }
function getRoomNE(house) { return firstCond(house.rooms, x => isNorthRoom(house, Items[x]) && isEastRoom(house, Items[x])); }
function getRoomNW(house) { return firstCond(house.rooms, x => isNorthRoom(house, Items[x]) && isWestRoom(house, Items[x])); }
function getRoomSE(house) {
	let rooms = house.rooms.map(x => Items[x]);
	//console.log('rooms',rooms);
	for (const r of rooms) {
		let isSouth = isSouthRoom(house, r);
		//console.log('south:',isSouth,r.rect.b,house.rect.b);
		let isEast = isEastRoom(house, r);
		//console.log('east:',isEast,r.rect.r,house.rect.r);
	}
	return firstCond(house.rooms, x => isSouthRoom(house, Items[x]) && isEastRoom(house, Items[x]));
}
function getRoomSW(house) { return firstCond(house.rooms, x => isSouthRoom(house, Items[x]) && isWestRoom(house, Items[x])); }
function getDiagonallyOpposedCornerRooms(house) {
	if (coin()) return [getRoomNW(house), getRoomSE(house)]; else return [getRoomSW(house), getRoomNE(house)];
}
function getDiagRoomPairs(house) {
	return [[getRoomNW(house), getRoomSE(house)], [getRoomSW(house), getRoomNE(house)]];
}
function getCornerRoomsDict(house) {
	let rooms = house.rooms.map(x => Items[x]);
	let result = {};
	for (const r of rooms) {
		let isN = isNorthRoom(house, r);
		let isS = isSouthRoom(house, r);
		let isW = isWestRoom(house, r);
		let isE = isEastRoom(house, r);
		if (isN && isW) result.NW = r.id;
		else if (isN && isE) result.NE = r.id;
		else if (isS && isE) result.SE = r.id;
		else if (isS && isW) result.SW = r.id;
	}
	return result;
}
function getCornerRooms(house) {
	let rooms = house.rooms.map(x => Items[x]);
	let result = [];
	for (const r of rooms) {
		if (isCornerRoom(house, r)) {
			result.push(r.id);
		}
	}
	return result;
}
function getLayoutSample(n) {
	//console.log('n', n)
	let samples = {
		1: '"a"',
		2: '"a b"', //'"a" "b"',
		3: ['"a b c"', '"a a" "b c"', '"a b" "c c"'], // "cd"',
		4: ['"z z d" "a a c" "a a c"', '"a b" "c d"'],
		5: ['"a b e" "c c d"', '"a a b" "c d e"', '"a b e" "c d e"'],
		6: ['"a b b c" "d d e f"', '"a b b c" "a d e f"', '"a b b b" "c d e f"'],
		7: ['"a b c d" "a b e f"', '"a b b c" "a d e c" "a d f g"'],
		8: ['"a a b c" "d d e c" "f g e h"', '"a b b c" "a d e c" "f g e h"'],
		9: ['"a a b b" "c d d e" "f g h i"', '"a d e b" "c d e b" "f g h i"'],
		10: '"j a b b" "c d d e" "f g h i"',
		11: '"j a a b b" "j c d d e" "f g h i k"',
		12: '"j a a b b l" "j c d d e l" "f g h i k k"',
		13: '"j a a b b" "j c d d e" "f g h i k" "l l m m k"',
		14: '"n j a a b b" "n j c d d e" "f g h i i k" "l l m m m k"',
		15: '"n j o o b b" "n j a a b b" "n j c d d e" "f g h i i k" "l l m m m k"',
		16: [
			'"a b c d e" "f f g h e" "o p i h j" "k l i m n"',
			'"a b b d e" "n f p g e" "i j j o k" "l l c m h"',
			'"a a p g c h" "a a b b c h" "n d d e e f" "o i j k l m"',
			'"a b c o d e" "f b c p g e" "f i i j g k" "n l m j h k"'
		],
		17: [
			'"a b c d e" "f g h i j" "k l m i o" "p n q q o"',
			'"a a c d e" "f g h i j" "k l m i o" "p n q b o"',
			'"a b c d e" "f b h i j" "k l m i o" "p n m q g"'
		],
		18: [
			'"a b c d e" "a g h i j" "k l m n o" "p q r f o"',
			'"a b b c d e" "a g h h i j" "k l l m n o" "p q q r f o"',
			'"a b b c d e" "a g g h i j" "k g g m n o" "p q l r f o"',
			'"a b b c d e" "a g h h i j" "k k l m n o" "p q l r f o"',
		],
		19: [
			'"a b c d e" "f b h i j" "k l m s o" "p n q g r"',
			'"a a b c d e" "f h b i i j" "k l m m s o" "p n q g g r"',
			'"a a b c d e" "f h b i l j" "k h m m s o" "p n q g g r"',
			'"a q b c d e" "f h b i l j" "k h m m s o" "p n m m g r"',
			'"a q b c d e" "f h b i l j" "k h m m s o" "p n m m g r"',
		],
		20: [
			'"a b c d e" "f g h i j" "k l m n o" "p q r s t"',
			'"a b b c d e" "f g h h i j" "k k l m n o" "p q r s s t"',
			'"a b b c d e" "f g h h i j" "k k l m i o" "p q r n s t"',
			'"a f b c d e" "a g h h i j" "k k l m i o" "p q r n s t"',
		],
		21: [
			'"a b b c d e" "f g h h i j" "k u l m n o" "p q r s s t"',
			'"a b b c d e" "f u g h i j" "k u l m n o" "p q r s n t"',
			'"a b b c d e" "f g h u i j" "k k l m i o" "p q r n s t"',
			'"a f b c d e" "a g h h i j" "k u l m i o" "p q r n s t"',
		],
		22: [
			'"a v b c d e" "f g h h i j" "k u l m n o" "p q r s s t"',
			'"a b b c d e e" "f u g h i j v" "k u l m n o v" "p q r s n t t"',
			'"a b b c d e e" "f u g h i j j" "k u l m n o v" "p q r s n t t"',
			'"a b b c d d e" "m b b c i j e" "f u g h i j v" "k u l l n o v" "p q r s n t t"',
		],
		23: [
			'"a v b c d e" "f g h h i j" "k u l m n o" "p q r w s t"',
			'"a w b c d e e" "f u g h i j v" "k u l m n o o" "p q r s n t t"',
			'"a b b c d e e" "f w g h i j j" "k u l m n o v" "p q r s n t t"',
		],
		24: [
			'"a v b c d e" "f g h x i j" "k u l m n o" "p q r w s t"',
			'"a v v b c d e" "f g h x x i j" "k u l l n o m" "p q r w s t m"',
		],
	};
	let s;
	if (nundef(n)) {
		let l = chooseRandom(Object.keys(samples));
		s = samples[l];
	} else {
		s = samples[n];
	}
	s = isList(s) ? chooseRandom(s) : s;
	s = getLetterSwapEncoding(s);
	//console.log('s', s);
	return s;
}
function iHouse(dParent, nrooms = 1, styles = { w: 500, h: 400 }) {
	let d = mDiv(dParent, { display: 'inline-grid' });

	let s = d.style.gridTemplateAreas = getLayoutSample(nrooms); //'"z z d" "a a c" "a a c"';// getLayoutSample(3);

	//setGranularityFactor(s, 9);
	let letterList = filterDistinctLetters(s);
	let wallWidth = valf(styles.gap, 4);

	//console.log(letterList)
	mStyleX(d, { bg: 'white', w: styles.w, h: styles.h, gap: wallWidth, padding: wallWidth });
	let rooms = [];
	for (const ch of letterList) { //['a', 'c', 'd', 'f', 'z']) {
		let r = iRoom(d, ch, { bg: BLUE });
		rooms.push(r);
	}

	let house = { rooms: rooms.map(x => x.id), roomLetters: letterList, wallWidth: wallWidth };
	house.roomsByLetter = {};
	rooms.map(x => house.roomsByLetter[x.ch] = x.id);
	iAdd(house, { div: d });
	rooms.map(x => x.house = house.id);

	let adjInfo = roomAdjacency(rooms, 40, wallWidth);
	//house.walls = walls.map(x => x.id);
	house.adjMatrix = adjInfo.adjacencyMatrix;
	house.walls = adjInfo.walls.map(x => x.id);

	house.rect = getRect(d);

	return house;
}
function iRoom(dParent, ch, styles) {
	let def = { 'grid-area': ch, position: 'relative' };
	copyKeys(def, styles);
	let dCell = mDiv(dParent, styles);
	let rect = getRect(dCell);
	//[rect.l, rect.t, rect.r, rect.b] = [rect.x, rect.y, rect.x + rect.w, rect.y + rect.h];
	let size = rect.w * rect.h;
	let room = { id: ch, ch: ch, bg: dCell.style.backgroundColor, rect: rect, size: size };
	delete Items[ch];
	iAdd(room, { div: dCell });
	room.doors = [];
	room.walls = [];
	room.furniture = [];
	room.hasDoor = () => !isEmpty(room.doors)
	room.hasPassThrough = () => room.doors.length >= 2;
	return room;
}
function makeAreas(dParent, layout) {
	// setBackgroundColor('random');
	let dGrid = mDiv(dParent, { gap: 10, bg: 'white', w: '90%', padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	if (nundef(layout)) layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];
	let x = createGridLayout(dGrid, layout); //teilt dGrid in areas ein

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: true },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: false },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: false },
	};

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles, item.titleOnTop)
		//console.log('children', dCell.children);
		iRegister(item, item.id);
		if (item.titleOnTop) iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		else iAdd(item, { div: dCell, dTitle: dCell.children[2], dMessage: dCell.children[0], dContent: dCell.children[1] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
function makeDoorBetweenRooms(r1, r2, house, styles) {
	r1 = this.findRoom(r1, house);
	if (!r1) { errlog('r1 not a room', r1); return; }
	r2 = this.findRoom(r2, house);
	if (!r2) { errlog('r2 not a room', r2); return; }
	//console.log('matrix',house.adjMatrix)
	let wid = lookup(house.adjMatrix, [r1.id, r2.id]);
	if (wid) {
		//find this wall in r1 and set dir from there!
		let roomWall = firstCond(r1.walls, x => x.id == wid);
		//console.log('roomWall', roomWall);
		return iDoor(r1, roomWall, styles);
	} else {
		errlog('r1 and r2 not connected', r1.ch, r2.ch);
	}
	return null;
}
function makeRandomDoor(r1, house, directions, styles) {
	//console.log('directions', directions);
	r1 = findRoom(r1, house);
	let dir = chooseRandom(directions);

	let walls = r1.walls.filter(x => x.dir == dir);
	//console.log('r1',r1,'walls',walls)
	let roomWall = chooseRandom(walls);
	return iDoor(r1, roomWall, styles);
}
function makeDoorHouseRoomDir(house, room, dir) {
	let r1 = findRoom(room, house);
	console.log('room', r1)
	let roomWall = firstCond(r1.walls, x => x.dir == dir);
	let wall = Items[roomWall.id];
	console.log('northern wall', wall)
	return iDoor(r1, roomWall)
}
function roomAdjacency(house) {
	//assumes rectangular rooms! to make other shapes of rooms, need to compose them!
	let rooms = house.rooms.map(x=>Items[x]);

	for (let i = 0; i < rooms.length; i++) {
		for (let j = i + 1; j < rooms.length; j++) {
			let [r1, r2] = [rooms[i], rooms[j]];
			let [e1, e2] = [r1.rect, r2.rect];
			let rhoeher = e1.t < e2.t ? r1 : r2; if (rhoeher.rect.t < miny) miny = rhoeher.rect.t;
			let rleft = e1.x < e2.x ? r1 : r2; if (rleft.rect.l < minx) minx = rleft.rect.l;
			let rniedriger = (rhoeher == r1 ? r2 : r1); if (rniedriger.rect.b > maxy) maxy = rniedriger.rect.b;
			let rright = (rleft == r1 ? r2 : r1); if (rright.rect.r > maxx) maxx = rright.rect.r;
			let diff = doorsize;

			//check for vertical wall
			let y1 = Math.max(e1.t, e2.t);
			let y2 = Math.min(e1.b, e2.b);
			let dCommony = y2 - y1; // rleft.rect.r - rright.rect.l;
			//let dCommony = rhoeher.rect.b - rniedriger.rect.t;
			if (dCommony > diff) {
				//potential for vertical passage
				let shareVert = isCloseTo(rright.rect.l - rleft.rect.r, wWall); // <= wWall;
				//console.log('shareVert',shareVert)
				if (shareVert) {
					//console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommony);
					let commonWallRect = { x: rleft.rect.r, y: rniedriger.rect.t, w: wWall, h: dCommony };
					let wall = { rect: commonWallRect, dir: 'v', rooms: [{ dir: 'w', id: rleft.id }, { dir: 'e', id: rright.id }], rLeft: rleft.id, rRight: rright.id };
					let wallId = wall.id = iRegister(wall);
					walls.push(wall);
					addAdjacency(adj, r1, r2, wallId);
				}else{
					//console.log('room',r1.ch,'is NOT close to', r2.ch)
				}
			}

			//check for horizontal wall
			let x1 = Math.max(e1.l, e2.l);
			let x2 = Math.min(e1.r, e2.r);
			let dCommonx = x2 - x1; // rleft.rect.r - rright.rect.l;
			if (dCommonx > diff) {
				//potential for horizontal passage
				let shareHor = isCloseTo(rniedriger.rect.t - rhoeher.rect.b, wWall);
				if (shareHor) {
					//console.log(r1.ch, 'and', r2.ch, 'share horizontal wall of size', dCommonx);
					let commonWallRect = { x: rright.rect.l, y: rhoeher.rect.b, w: dCommonx, h: wWall };
					let wall = { rect: commonWallRect, dir: 'h', rooms: [{ dir: 'n', id: rhoeher.id }, { dir: 's', id: rniedriger.id }], rUpper: rhoeher.id, rLower: rniedriger.id };
					let wallId = wall.id = iRegister(wall);
					walls.push(wall);
					addAdjacency(adj, r1, r2, wallId);
					//console.log(adj)
				}else{
					//console.log('room',r1.ch,'is NOT close to', r2.ch)
				}
			}
		}
	}

	//console.log('minx', minx)
	//all walls with min or max are outer walls
	for (let i = 0; i < rooms.length; i++) {
		let r = rooms[i];
		//console.log(r.ch);
		if (isCloseTo(r.rect.l,minx)) {
			//this room has western outer wall
			let wallRect = { x: r.rect.x - wWall, y: r.rect.t, w: wWall, h: r.rect.h };
			let wall = { rect: wallRect, dir: 'v', rooms: [{ dir: 'e', id: r.id }], rRight: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		//console.log(r.rect.r,maxx)
		if (isCloseTo(r.rect.r,maxx)) {
			//this room has eastern outer wall
			let wallRect = { x: r.rect.r, y: r.rect.t, w: wWall, h: r.rect.h };
			let wall = { rect: wallRect, dir: 'v', rooms: [{ dir: 'w', id: r.id }], rLeft: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		if (isCloseTo(r.rect.t,miny)) {
			//this room has northern outer wall
			let wallRect = { x: r.rect.x, y: r.rect.t - wWall, w: r.rect.w, h: wWall };
			let wall = { rect: wallRect, dir: 'h', rooms: [{ dir: 's', id: r.id }], rLower: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		if (isCloseTo(r.rect.b,maxy)) {
			//this room has southern outer wall
			let wallRect = { x: r.rect.x, y: r.rect.b, w: r.rect.w, h: wWall };
			let wall = { rect: wallRect, dir: 'h', rooms: [{ dir: 'n', id: r.id }], rUpper: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		//break;
	}

	//each room should get a walls list
	for (const w of walls) {
		for (const r of w.rooms) {
			let room = Items[r.id];
			room.walls.push({ dir: (w.dir == 'v' ? r.dir == 'w' ? 'e' : 'w' : r.dir == 'n' ? 's' : 'n'), id: w.id });
		}
	}

	return { adjacencyMatrix: adj, walls: walls };
}

function roomAdjacency(rooms, doorsize = 40, wWall = 4) {
	let adj = {};
	let walls = [];
	let minx = rooms[0].rect.l, maxx = rooms[0].rect.r, miny = rooms[0].rect.t, maxy = rooms[0].rect.b;
	rooms.map(x => { x.walls = []; x.nei = [] });

	for (let i = 0; i < rooms.length; i++) {
		for (let j = i + 1; j < rooms.length; j++) {
			let [r1, r2] = [rooms[i], rooms[j]];
			let [e1, e2] = [r1.rect, r2.rect];
			let rhoeher = e1.t < e2.t ? r1 : r2; if (rhoeher.rect.t < miny) miny = rhoeher.rect.t;
			let rleft = e1.x < e2.x ? r1 : r2; if (rleft.rect.l < minx) minx = rleft.rect.l;
			let rniedriger = (rhoeher == r1 ? r2 : r1); if (rniedriger.rect.b > maxy) maxy = rniedriger.rect.b;
			let rright = (rleft == r1 ? r2 : r1); if (rright.rect.r > maxx) maxx = rright.rect.r;
			let diff = doorsize;

			//check for vertical wall
			let y1 = Math.max(e1.t, e2.t);
			let y2 = Math.min(e1.b, e2.b);
			let dCommony = y2 - y1; // rleft.rect.r - rright.rect.l;
			//let dCommony = rhoeher.rect.b - rniedriger.rect.t;
			if (dCommony > diff) {
				//potential for vertical passage
				let shareVert = isCloseTo(rright.rect.l - rleft.rect.r, wWall); // <= wWall;
				//console.log('shareVert',shareVert)
				if (shareVert) {
					//console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommony);
					let commonWallRect = { x: rleft.rect.r, y: rniedriger.rect.t, w: wWall, h: dCommony };
					let wall = { rect: commonWallRect, dir: 'v', rooms: [{ dir: 'w', id: rleft.id }, { dir: 'e', id: rright.id }], rLeft: rleft.id, rRight: rright.id };
					let wallId = wall.id = iRegister(wall);
					walls.push(wall);
					addAdjacency(adj, r1, r2, wallId);
				}else{
					//console.log('room',r1.ch,'is NOT close to', r2.ch)
				}
			}

			//check for horizontal wall
			let x1 = Math.max(e1.l, e2.l);
			let x2 = Math.min(e1.r, e2.r);
			let dCommonx = x2 - x1; // rleft.rect.r - rright.rect.l;
			if (dCommonx > diff) {
				//potential for horizontal passage
				let shareHor = isCloseTo(rniedriger.rect.t - rhoeher.rect.b, wWall);
				if (shareHor) {
					//console.log(r1.ch, 'and', r2.ch, 'share horizontal wall of size', dCommonx);
					let commonWallRect = { x: rright.rect.l, y: rhoeher.rect.b, w: dCommonx, h: wWall };
					let wall = { rect: commonWallRect, dir: 'h', rooms: [{ dir: 'n', id: rhoeher.id }, { dir: 's', id: rniedriger.id }], rUpper: rhoeher.id, rLower: rniedriger.id };
					let wallId = wall.id = iRegister(wall);
					walls.push(wall);
					addAdjacency(adj, r1, r2, wallId);
					//console.log(adj)
				}else{
					//console.log('room',r1.ch,'is NOT close to', r2.ch)
				}
			}
		}
	}

	//console.log('minx', minx)
	//all walls with min or max are outer walls
	for (let i = 0; i < rooms.length; i++) {
		let r = rooms[i];
		//console.log(r.ch);
		if (isCloseTo(r.rect.l,minx)) {
			//this room has western outer wall
			let wallRect = { x: r.rect.x - wWall, y: r.rect.t, w: wWall, h: r.rect.h };
			let wall = { rect: wallRect, dir: 'v', rooms: [{ dir: 'e', id: r.id }], rRight: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		//console.log(r.rect.r,maxx)
		if (isCloseTo(r.rect.r,maxx)) {
			//this room has eastern outer wall
			let wallRect = { x: r.rect.r, y: r.rect.t, w: wWall, h: r.rect.h };
			let wall = { rect: wallRect, dir: 'v', rooms: [{ dir: 'w', id: r.id }], rLeft: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		if (isCloseTo(r.rect.t,miny)) {
			//this room has northern outer wall
			let wallRect = { x: r.rect.x, y: r.rect.t - wWall, w: r.rect.w, h: wWall };
			let wall = { rect: wallRect, dir: 'h', rooms: [{ dir: 's', id: r.id }], rLower: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		if (isCloseTo(r.rect.b,maxy)) {
			//this room has southern outer wall
			let wallRect = { x: r.rect.x, y: r.rect.b, w: r.rect.w, h: wWall };
			let wall = { rect: wallRect, dir: 'h', rooms: [{ dir: 'n', id: r.id }], rUpper: r.id };
			let wallId = wall.id = iRegister(wall);
			walls.push(wall);
		}
		//break;
	}

	//each room should get a walls list
	for (const w of walls) {
		for (const r of w.rooms) {
			let room = Items[r.id];
			room.walls.push({ dir: (w.dir == 'v' ? r.dir == 'w' ? 'e' : 'w' : r.dir == 'n' ? 's' : 'n'), id: w.id });
		}
	}

	return { adjacencyMatrix: adj, walls: walls };
}
function setGranularityFactor(s, f = 2) {
	let lines = s.split('"');
	//console.log(lines);
	let lines1 = lines.filter(x => !isEmptyOrWhiteSpace(x));
	//console.log(lines1);
	//multiply each line item * factor
	let lines2 = [];
	for (const l of lines1) {
		let lNew = '';
		for (let i = 0; i < l.length; i++) {
			if (l[i] == ' ') continue;// lNew += ' ';
			for (let x = 0; x < f; x++) lNew += l[i] + ' ';

		}
		lines2.push(lNew.trim());
	}
	//console.log(lines2);
	//multiply each line * factor
	let lines3 = [];
	for (const l of lines2) { for (let i = 0; i < f; i++) { lines3.push(l); } }
	//console.log(lines3);
	return lines3;

}



