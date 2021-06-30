function iHouse(dParent, ns = 1, styles = { w: 500, h: 400 }) {
	//achtung styles: fg is wall color, bg is room color!
	let d = mDiv(dParent, { display: 'inline-grid', position: 'relative' });

	ns = isNumber(ns) ? d.style.gridTemplateAreas = getLayoutSample(ns) : ns; //'"z z d" "a a c" "a a c"';// getLayoutSample(3);
	let s = d.style.gridTemplateAreas = ns;
	//setGranularityFactor(s, 9);
	let letterList = filterDistinctLetters(s);
	let wallWidth = valf(styles.gap, 4);
	let szDoor = valf(styles.szDoor, 40);


	mStyleX(d, { bg: valf(styles.fg, 'white'), w: styles.w, h: styles.h, gap: wallWidth, padding: wallWidth });
	let rooms = [];
	for (const ch of letterList) { //['a', 'c', 'd', 'f', 'z']) {
		let r = iRoom(d, ch, { bg: valf(styles.bg, BLUE) });
		rooms.push(r);
	}

	let house = { doors: [], rooms: rooms.map(x => x.id), roomLetters: letterList, szDoor: szDoor, wallWidth: wallWidth };
	house.roomsByLetter = {};
	rooms.map(x => house.roomsByLetter[x.ch] = x.id);
	iAdd(house, { div: d });
	rooms.map(x => x.house = house.id);

	house.rect = getRect(d);
	roomAdjacency(house);

	return house;
}
function iRoom(dParent, ch, styles) {
	let def = { 'grid-area': ch, position: 'relative' };
	copyKeys(def, styles);
	let dCell = mDiv(dParent, styles);
	let rect = getRect(dCell);
	let size = Math.round(rect.w * rect.h/1000);
	let room = { id: ch, ch: ch, bg: dCell.style.backgroundColor, rect: rect, size: size };
	delete Items[ch];
	iAdd(room, { div: dCell });
	room.doors = [];
	room.furniture = [];
	room.hasDoor = () => !isEmpty(room.doors)
	room.hasPassThrough = () => room.doors.length >= 2;
	return room;
}
function findWall(r1,r2){
	for(const dir in r1.walls){
		let walls=r1.walls[dir];
		for(const wall of walls){
			if (wall.r2 == r2.id) return wall;
		}
	}
	return null;
}
function findFreeWall(r1,walls){
	r1 = isString(r1) ? Items[r1] : r1;
	if (nundef(walls)) {
		walls = [];
		for(const dir in r1.walls){
			walls=walls.concat(r1.walls[dir]);
		}
	}
	console.log('walls',r1.ch)
	walls = walls.filter(x=>!x.door);
	return isEmpty(walls)?null:chooseRandom(walls);
}
function iDoor(r1,dir,r2) {
	r1 = isString(r1) ? Items[r1] : r1;
	let house = Items[r1.house];

	//if r2 is given, it is a room, so make door between these 2 rooms: return if not adjacent!
	//if nundef(r2), if dir is given, 
	r2 = isdef(r2)? isString(r2) ? Items[r2] : r2: null;

	let wall=r2?findWall(r1,r2):isdef(dir)?findFreeWall(r1,r1.walls[dir]):findFreeWall(r1);
	console.log('door wall for room:',r1.id,wall);

}

function roomAdjacency(house) {
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
				console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommony);
				// let re1=getRect(iDiv(r1),iDiv(house)); //relative to house
				// let re2=getRect(iDiv(r2),iDiv(house));
				showRect('r1', r1); showRect('r2', r2); showRect('house', house);
				let dr = {
					x: rleft.rect.r - house.rect.l,
					y: rniedriger.rect.t - house.rect.t, //fuer door: + (dCommony - szDoor) / 2,
					w: house.wallWidth, h: dCommony, //fuer door: szDoor
				};
				extendRect(dr);
				addAdjacencyFromTo(rleft, rright, 'e', dr);
			}

			//check for horizontal wall
			let x1 = Math.max(e1.l, e2.l);
			let x2 = Math.min(e1.r, e2.r);
			let dCommonx = x2 - x1;
			if (dCommonx > diff && isCloseTo(rniedriger.rect.t, rhoeher.rect.b)) {
				console.log(r1.ch, 'and', r2.ch, 'share horizontal wall of size', dCommonx);
				// let re1=getRect(iDiv(r1),iDiv(house)); //relative to house
				// let re2=getRect(iDiv(r2),iDiv(house));
				showRect('r1', r1); showRect('r2', r2); showRect('house', house);
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
			addAdjacencyFromTo(r, null, 'w', wallRect);
		}
		if (isCloseTo(r.rect.r, house.rect.r)) {
			//this room has eastern outer wall
			let wallRect = { x: r.rect.r, y: r.rect.t, w: house.wallWidth, h: r.rect.h };
			addAdjacencyFromTo(r, null, 'e', wallRect);
		}
		if (isCloseTo(r.rect.t, house.rect.t)) {
			//this room has northern outer wall
			let wallRect = { x: r.rect.l, y: house.rect.t, w: r.rect.w, h:house.wallWidth };
			addAdjacencyFromTo(r, null, 'n', wallRect);
		}
		if (isCloseTo(r.rect.b, house.rect.b)) {
			//this room has southern outer wall
			let wallRect = { x: r.rect.l, y: r.rect.b, w: r.rect.w, h:house.wallWidth };
			addAdjacencyFromTo(r, null, 's', wallRect);
		}
	}
}

//#region helpers
function addAdjacencyFromTo(r1, r2, dir, rect) {
	lookupAddToList(r1, ['walls', dir], { rect: rect, dir: dir, room: r2?r2.id:r2, door: null });
	let dir2 = r2?getOppDir(dir):dir;
	lookupAddToList(r2?r2:Items[r1.house], ['walls', dir2], { rect: rect, dir: dir2, room: r1.id, door: null });
}
function getDoorId(r1, r2) { return r1 + '_' + r2 + '_' + r1; }
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
function getOppDir(dir) { return { e: 'w', w: 'e', n: 's', s: 'n' }[dir]; }
function showRect(s,o){
	let r=o.rect;
	console.log('\n',s,r.l,r.t,r.r,r.b);
}


function makeDoorBetween_noWallInfo(r1, r2, szDoor) {

	r1 = isString(r1) ? Items[r1] : r1;
	r2 = isString(r2) ? Items[r2] : r2;
	let house = Items[r1.house];

	if (firstCond(house.doors, x => isSameList(Items[x], [r1.id, r2.id]))) {
		console.log('there is already a door between these rooms!');
		return;
	}

	if (nundef(szDoor)) szDoor = house.szDoor;

	let [e1, e2] = [r1.rect, r2.rect];
	let rhoeher = e1.t < e2.t ? r1 : r2;
	let rleft = e1.x < e2.x ? r1 : r2;
	let rniedriger = (rhoeher == r1 ? r2 : r1);
	let rright = (rleft == r1 ? r2 : r1);
	let diff = house.wallWidth * 2;
	let door = null;
	let doorId = getDoorId(r1.id, r2.id);

	//check for vertical wall
	let y1 = Math.max(e1.t, e2.t);
	let y2 = Math.min(e1.b, e2.b);
	let dCommony = y2 - y1;
	if (dCommony > diff && isCloseTo(rright.rect.l, rleft.rect.r)) {
		console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommony);
		// let re1=getRect(iDiv(r1),iDiv(house)); //relative to house
		// let re2=getRect(iDiv(r2),iDiv(house));
		showRect('r1', r1); showRect('r2', r2); showRect('house', house);
		if (szDoor > dCommony) szDoor = dCommony;
		let dr = {
			x: rleft.rect.r - house.rect.l,
			y: rniedriger.rect.t - house.rect.t + (dCommony - szDoor) / 2,
			w: house.wallWidth, h: szDoor
		};
		extendRect(dr);
		let dParent = iDiv(house);
		let d = mDiv(dParent, { bg: 'red', position: 'absolute', left: dr.x, top: dr.y, w: dr.w, h: dr.h });
		door = { id: doorId, rect: dr, dir: 'v', rooms: [r1.id, r2.id] };
		iAdd(door, { div: d });

	} else { console.log('room', r1.ch, 'does not share a wall with', r2.ch); }

	//check for horizontal wall
	let x1 = Math.max(e1.l, e2.l);
	let x2 = Math.min(e1.r, e2.r);
	let dCommonx = x2 - x1;
	if (dCommonx > diff && isCloseTo(rniedriger.rect.t, rhoeher.rect.b)) {
		console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommonx);
		// let re1=getRect(iDiv(r1),iDiv(house)); //relative to house
		// let re2=getRect(iDiv(r2),iDiv(house));
		showRect('r1', r1); showRect('r2', r2); showRect('house', house);
		if (szDoor > dCommonx) szDoor = dCommonx;
		let dr = {
			x: rright.rect.l - house.rect.l + (dCommonx - szDoor) / 2,
			y: rhoeher.rect.b - house.rect.t,
			w: szDoor, h: house.wallWidth
		};
		extendRect(dr);
		let dParent = iDiv(house);
		let d = mDiv(dParent, { bg: 'red', position: 'absolute', left: dr.x, top: dr.y, w: dr.w, h: dr.h });
		door = { id: doorId, rect: dr, dir: 'v', rooms: [r1.id, r2.id] };
		iAdd(door, { div: d });

	} else { console.log('room', r1.ch, 'does not share a wall with', r2.ch); }

	if (door) { house.doors.push(door.id); }
	return door;
}





//#region old code

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

//#endregion

