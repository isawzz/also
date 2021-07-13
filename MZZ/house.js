//new API
function convertToGraphElements(g1,house) {
	// let elements = { nodes: [], edges: [] };
	let vertices = house.rooms.map(x => Items[x]);
	let doors = [];
	for (const v of vertices) {

		v.center = getCenter(v.rect);
		v.center.x+=v.rect.l-house.rect.l;
		v.center.y+=v.rect.t-house.rect.t;

		g1.addNode(v,v.center);
		// elements.nodes.push({ data: v, position: v.center });
		doors = union(doors, v.doors);
	}

	let centers = g1.getNodes().map(x=>x.data('center'));
	g1.storePositions('prest',centers);
	let edges = doors.map(x => Items[x]).filter(x => x.rooms.length == 2);
	//console.log('edges in converter:',edges)
	for (const e of edges) {
		if (e.rooms.length < 2) continue;
		e.source = e.rooms[0];
		e.target = e.rooms[1];
		g1.addEdge(e.source,e.target,e);
		// elements.edges.push({ data: e });
	}
	//return elements;
}


//testing
function makeNewLayout(g1) {
	let nodes = g1.getNodes();
	let x = 10; let y = 10;
	for (n of nodes) {
		n.position({ x: x, y: y });
		x += 50; y += 50; if (y > 250) { y = 10; } if (x > 550) { x = 10; }
	}
}

function setPositionData(g1) {
	let ids = g1.getNodeIds();
	for (const id of ids) {
		let pos = g1.getProp(id, 'center');
		g1.setPosition(id, pos.x, pos.y);
	}
	g1.reset();
}
function storePositionData(g1) {
	let ids = g1.getNodeIds();
	let x = 10; let y = 10;
	for (const id of ids) {
		g1.setProp(id, 'center', { x: x, y: y });
		x += 50; y += 50; if (y > 250) { y = 10; } if (x > 550) { x = 10; }
	}
}
function storeRoomPositions(g1, house) {
	let ids = g1.getNodeIds();
	let di = g1.posDict = {};
	for (const id of ids) {
		let r = Items[id];
		let center = getCenter(iDiv(r));
		center.x += r.rect.x;
		center.y += r.rect.y;
		//console.log('center of room',id,center);
		g1.setProp(id, 'center', center);
		di[id] = center;
	}
}
function convertToGraphElements_dep(g1,house) {
	let elements = { nodes: [], edges: [] };
	let vertices = house.rooms.map(x => Items[x]);
	let doors = [];
	for (const v of vertices) {
		v.center = getCenter(v.rect);
		elements.nodes.push({ data: v, position: v.center });
		doors = union(doors, v.doors);
	}
	let edges = doors.map(x => Items[x]).filter(x => x.rooms.length == 2);
	//console.log('edges in converter:',edges)
	for (const e of edges) {
		if (e.rooms.length < 2) continue;
		e.source = e.rooms[0];
		e.target = e.rooms[1];
		elements.edges.push({ data: e });
	}
	return elements;
}
function iDoor(r1, dir, r2, styles = {}) {
	r1 = isString(r1) ? Items[r1] : r1;
	let house = Items[r1.house];
	r2 = isdef(r2) ? isString(r2) ? Items[r2] : r2 : null;
	let wall = r2 ? findWall(r1, r2) : isdef(dir) ? findFreeWall(r1, r1.walls[dir]) : findFreeWall(r1);

	if (wall.door) { errlog('there is already a door between', r1.id, 'and', r2); return; }

	let szDoor = valf(styles.szDoor, house.szDoor);
	let bg = valf(styles.bg, house.bg);
	let dParent = iDiv(house);
	let wr = wall.rect;

	//console.log('wall',wall);
	if (nundef(r2) && wall.room) { r2 = Items[wall.room]; } //console.log('r2',r2); }

	let dr = jsCopy(wr);
	let or = wall.dir == 'e' || wall.dir == 'w' ? 'v' : 'h';
	//console.log('or',or)
	if (or == 'v') {
		let len = wr.h;
		let offy = (len - szDoor) / 2;
		dr.y = dr.t = dr.t + offy;
		dr.h = szDoor;
	} else {
		let len = wr.w;
		let offx = (len - szDoor) / 2;
		dr.x = dr.l = dr.l + offx;
		dr.w = szDoor;
	}

	let id = getDoorId(r1.id, r2 ? r2.id : house.id);
	let door = { rooms: [r1.id], rect: dr, id: id, or: or }; //, source: r1.id, target: r2 ? r2.id : house.id };
	if (r2) { r2.doors.push(id); door.rooms.push(r2.id); } else { house.doors.push(id); }
	r1.doors.push(id);

	//paint(iDiv(house), wr, 'violet'); showRect('r1', r1); showRect('wall', wall); showRect('door', { rect: dr }); showRect('r1', r1); showRect('wall', wall); showRect('door', door); if (r2) showRect('r2', r2); else showRect('house', house);
	//let d = paint(iDiv(house), dr, bg); 
	let stylesPlus = { position: 'absolute', left: dr.x, top: dr.y, w: dr.w, h: dr.h, bg: bg };
	copyKeys(stylesPlus, styles);
	d = mDiv(dParent, styles);
	iAdd(door, { div: d });

	return door;

}
function iLabyrint(dParent, cols,rows, styles = { w: 800, h: 400 }) {
	//achtung styles: fg is wall color, bg is room color!
	let d = mDiv(dParent, { display: 'inline-grid', position: 'relative', box: true });

	//each room name is a..z + 1..9


	ns = isNumber(ns) ? d.style.gridTemplateAreas = getLayoutSample(ns) : ns; //'"z z d" "a a c" "a a c"';// getLayoutSample(3);
	let s = d.style.gridTemplateAreas = ns;
	//setGranularityFactor(s, 9);
	let letterList = filterDistinctLetters(s);
	let wallWidth = valf(styles.gap, 4);

	//hier berechne ich house size etwas genauer: 
	//let [wHouse,hHouse]=keepGridAtFixedIntegerSize(d);
	let lines = s.split('"').filter(x => !isWhiteSpaceString(x));
	//console.log('lines',lines);
	//console.log('this thins has',cols,'cols','and',rows,'rows');
	//each unit should be divisible by 4
	let wHouse = Math.round(styles.w / cols) * cols + wallWidth * cols + 1;
	let hHouse = Math.round(styles.h / rows) * rows + wallWidth * rows + 1;
	d.style.gridTemplateRows = `repeat(${rows}, 1fr)`;// / repeat(${cols}, 1fr)`;
	d.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;// / repeat(${cols}, 1fr)`;

	let szDoor = valf(styles.szDoor, 40);

	let [wallColor, floorColor] = [valf(styles.fg, 'white'), valf(styles.bg, BLUE)];
	mStyleX(d, { bg: wallColor, w: wHouse, h: hHouse, gap: wallWidth, padding: wallWidth });

	let rooms = [];
	for (const ch of letterList) { //['a', 'c', 'd', 'f', 'z']) {
		let r = iRoom(d, ch, { bg: floorColor });
		rooms.push(r);
	}

	let house = { rect: getRect(d), fg: wallColor, bg: floorColor, doors: [], rooms: rooms.map(x => x.id), roomLetters: letterList, szDoor: szDoor, wallWidth: wallWidth };
	house.roomsByLetter = {};
	//console.log('..........',house.rect)
	rooms.map(x => house.roomsByLetter[x.ch] = x.id);
	iAdd(house, { div: d });
	rooms.map(x => x.house = house.id);

	roomAdjacency(house);

	return house;
}
function iHouse(dParent, ns = 1, styles = { w: 500, h: 400 }) {
	//achtung styles: fg is wall color, bg is room color!
	let d = mDiv(dParent, { display: 'inline-grid', position: 'relative', box: true });

	ns = isNumber(ns) ? d.style.gridTemplateAreas = getLayoutSample(ns) : ns; //'"z z d" "a a c" "a a c"';// getLayoutSample(3);
	let s = d.style.gridTemplateAreas = ns;
	//setGranularityFactor(s, 9);
	let letterList = filterDistinctLetters(s);
	let wallWidth = valf(styles.gap, 4);

	//hier berechne ich house size etwas genauer: 
	//let [wHouse,hHouse]=keepGridAtFixedIntegerSize(d);
	let lines = s.split('"').filter(x => !isWhiteSpaceString(x));
	//console.log('lines',lines);
	let cols = lines[0].split(' ').length;
	let rows = lines.length;
	//console.log('this thins has',cols,'cols','and',rows,'rows');
	//each unit should be divisible by 4
	let wHouse = Math.round(styles.w / cols) * cols + wallWidth * cols + 1;
	let hHouse = Math.round(styles.h / rows) * rows + wallWidth * rows + 1;
	d.style.gridTemplateRows = `repeat(${rows}, 1fr)`;// / repeat(${cols}, 1fr)`;
	d.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;// / repeat(${cols}, 1fr)`;

	let szDoor = valf(styles.szDoor, 40);

	let [wallColor, floorColor] = [valf(styles.fg, 'white'), valf(styles.bg, BLUE)];
	mStyleX(d, { bg: wallColor, w: wHouse, h: hHouse, gap: wallWidth, padding: wallWidth });

	let rooms = [];
	for (const ch of letterList) { //['a', 'c', 'd', 'f', 'z']) {
		let r = iRoom(d, ch, { bg: floorColor });
		rooms.push(r);
	}

	let house = { rect: getRect(d), fg: wallColor, bg: floorColor, doors: [], rooms: rooms.map(x => x.id), roomLetters: letterList, szDoor: szDoor, wallWidth: wallWidth };
	house.roomsByLetter = {};
	//console.log('..........',house.rect)
	rooms.map(x => house.roomsByLetter[x.ch] = x.id);
	iAdd(house, { div: d });
	rooms.map(x => x.house = house.id);

	roomAdjacency(house);

	return house;
}
function iRoom(dParent, ch, styles) {
	let def = { 'grid-area': ch, position: 'relative' };
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
function findWall(r1, r2) {
	for (const dir in r1.walls) {
		let walls = r1.walls[dir];
		for (const wall of walls) {
			if (wall.r2 == r2.id) return wall;
		}
	}
	return null;
}
function findFreeWall(r1, walls) {
	r1 = isString(r1) ? Items[r1] : r1;
	if (nundef(walls)) {
		walls = [];
		for (const dir in r1.walls) {
			walls = walls.concat(r1.walls[dir]);
		}
	}
	//console.log('walls',r1.ch)
	walls = walls.filter(x => !x.door);
	return isEmpty(walls) ? null : chooseRandom(walls);
}
function hideOuterDoors(house) {
	// console.log(house.doors);
	for (const did of jsCopy(house.doors)) {
		// console.log(did)
		let door = Items[did];
		hide(iDiv(door));//.remove();
		// console.log('door',door);
		// for(const rid of door.rooms){removeInPlace(Items[rid].doors,did);}
		// removeInPlace(house.doors,did);
	}
	// console.log(house.doors);

}
function removeOuterDoors(house) {
	console.log(house.doors);
	for (const did of jsCopy(house.doors)) {
		console.log(did)
		let door = Items[did];
		iDiv(door).remove();
		console.log('door', door);
		for (const rid of door.rooms) { removeInPlace(Items[rid].doors, did); }
		removeInPlace(house.doors, did);
	}
	console.log(house.doors);

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
		}
		if (isCloseTo(r.rect.r, house.rect.r)) {
			//this room has eastern outer wall
			let wallRect = { x: r.rect.r, y: r.rect.t, w: house.wallWidth, h: r.rect.h };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 'e', wallRect);
		}
		if (isCloseTo(r.rect.t, house.rect.t)) {
			//this room has northern outer wall
			let wallRect = { x: r.rect.l, y: house.rect.t, w: r.rect.w, h: house.wallWidth };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 'n', wallRect);
		}
		if (isCloseTo(r.rect.b, house.rect.b)) {
			//this room has southern outer wall
			let wallRect = { x: r.rect.l, y: r.rect.b, w: r.rect.w, h: house.wallWidth };
			extendRect(wallRect);
			addAdjacencyFromTo(r, null, 's', wallRect);
		}
	}
}

//#region helpers
function addAdjacencyFromTo(r1, r2, dir, rect) {
	//console.log(rect);
	let house = Items[r1.house];
	//console.log('---------',house)
	if (!r2) rect = rrto(rect, house.rect);
	//console.log(rect)
	lookupAddToList(r1, ['walls', dir], { rect: rect, dir: dir, room: r2 ? r2.id : r2, door: null });
	let dir2 = r2 ? getOppDir(dir) : dir;
	lookupAddToList(r2 ? r2 : Items[r1.house], ['walls', dir2], { rect: rect, dir: dir2, room: r1.id, door: null });
}
function areNeighbors(r1, r2) {
	let res = firstCond(r1.doors, x => x.includes(r1.id) && x.includes(r2.id));
	//console.log('are',r1.id+','+r2.id,'neighbors?',res!=null, r1.doors);
	return res != null;
}
function getDoorId(r1, r2) { return r1 + '_' + r2 + '_' + r1; }
function getLayoutSample(n) {
	//console.log('n', n)

	if (G.level > 4){
		//room size: min 40x40 (40x14=560)
		// max ist 20x8=80 rooms a 50x50, versuch das mal!
		// wenn platz habe 1000, kann ich 50x20 rooms in einer reihe machen und hohe kann machen 5
		//3x4, 3x5, 3x6, 3x7, 3x8, 3x9, 3x10, 
		//4x5, 4x6, 4x7, 4x8, 4x9, 4x10, 4x11, 4x12, 4x13, 4x14
		
	}

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
		25: ['"a b c d e f g" "a h i k l m g" "o p n r s m u" "v w x y q t j"'],
		26: ['"a a c d e f g" "h i b k l j n" "o p q r s m u" "v w x y z t u"'],
		27: ['"a b c d e f g" "h i j k l m n" "o p q r s t u" "v w x y z A u"'],
		28: ['"a b c d e f g" "h i j k l m n" "o p q r s t u" "v w x y z A B"'],
		29: ['"a b c d e f g h" "i j k d m n o p" "q r r t u v w x" "y z A B C s l l"'],
		30: ['"a b c d e f g h" "i j k d m n o p" "q r s t u v w x" "y z A B C D l l"'],
		31: ['"a b c d e f g h" "i j k l m n o p" "q r s t u v w x" "y z A B C D E E"'],
		32: ['"a b c d e f g h" "i j k l m n o p" "q r s t u v w x" "y z A B C D E F"'],
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
		let isN = r.isN = isNorthRoom(house, r);
		let isS = r.isS = isSouthRoom(house, r);
		let isW = r.isW = isWestRoom(house, r);
		let isE = r.isE = isEastRoom(house, r);
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
function makeRect(x, y, w, h) { let r = { x: x, y: y, w: w, h: h }; extendRect(r); return r; }
function paint(dParent, r, color = 'random') {
	let d = mDiv(dParent, { position: 'absolute', left: r.x, top: r.y, w: r.w, h: r.h, bg: color });
	return d;
}
function rrto(r1, r2) {
	let r = jsCopy(r1);
	r.x -= r2.x; r.l -= r2.x; r.r -= r2.x;
	r.y -= r2.y; r.t -= r2.y; r.b -= r2.y;
	return r;
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
function showRect(s, o) {
	let r = o.rect;
	console.log('\n', s, 'w', Math.round(r.w), '=', Math.round(r.l), Math.round(r.r), 'h', Math.round(r.h), '=', Math.round(r.t), Math.round(r.b));
}
function showRectReal(s, o) {
	let r = o.rect;
	console.log('\n', s, 'w', r.w, '=', r.l, r.r, 'h', r.h, '=', r.t, r.b);
}






