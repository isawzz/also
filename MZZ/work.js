class GHome extends Game {
	constructor(name, o) { super(name, o); }
	prompt() {
		let rooms = mHouse(dTable, valf(this.nrooms, 1));
		for (const r of rooms) r.door = mDoor(r, coin() ? 'h' : 'v');

		roomAdjacency(rooms);
		//return;
		let keys = ByGroupSubgroup.Objects.household;
		//console.log(keys);

		//nehme 
		let roomlist = ['bedroom', 'livingroom', 'bathroom', 'kitchen'];

		//sort rooms by size
		sortByFunc(rooms, x => x.rect.w * x.rect.h);
		//console.log(rooms);

		rooms.map(x => addLabel(x, x.ch, {}));

		mLinebreak(dTable, 40);
		// mDiv(dTable,{w:100,h:100,bg:'red'});
		keys = ['bed', 'bathtub', 'chair', 'couch and lamp', 'toilet', 'door', 'table'];
		//return;
		// this.options = {}; _extendOptions(this.options);
		let items = Pictures = genItemsFromKeys(keys, {});
		console.assert(arrLast(items).key == 'table', 'NOOOOOOO');
		let itable = arrLast(items);
		//console.log(itable);
		//console.log(items);

		//items.map(x => x.cat = this.catsByKey[x.key]);
		shuffle(items);
		let dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		for (const item of items) { let d = miPic(item, dWordArea); iAdd(item, { div: d }); }
		mStyleX(iDiv(itable), { fg: BROWN });

		enableDD(items, rooms, this.dropHandler.bind(this), false);

		this.controller.activateUi.bind(this.controller)();


	}

	dropHandler(source, target, isCopy = true) {
		let dSource = iDiv(source);
		let dTarget = iDiv(target);

		if (!isCopy) {
			mAppend(dTarget, dSource);
		} else {
			let dNew = mText(dSource.innerHTML, dTarget, { wmin: 100, fz: 20, padding: 4, margin: 4, display: 'inline-block' });
			addDDSource(dNew, false);
		}

		if (isOverflown(dTarget)) {
			let d = dTarget.parentNode;
			let r = getRect(d);
			let w = r.w + 100;

			mSize(d, w, r.h);
			console.log('overflow!!!!', r.w, '=>', w)
		}
	}
	eval() {
	}
}
function filterDistinctLetters(s) {
	let arr = [];
	for (let i = 0; i < s.length; i++) {
		let ch = s[i];
		if (isLetter(ch) && !arr.includes(ch)) arr.push(ch);
	}
	return arr;
}
function isEmptyOrWhiteSpace(s) { return isEmpty(s.trim()); }
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
function mHouse(dParent, nrooms = 1) {
	let d = mDiv(dParent, { display: 'inline-grid' });
	d.style.gridTemplateAreas = '"z z d" "a a c" "a a f"';
	let s = d.style.gridTemplateAreas = '"a a b b" "a a b b" "c c d e" "c c f g"';
	//s = d.style.gridTemplateAreas = '"a a b b c" "a a b b d" "e f f g h" "e i i g j"';
	setGranularityFactor(s, 9);
	//s = d.style.gridTemplateAreas = '"a b" "c d"';
	let letterList = filterDistinctLetters(s);
	console.log(letterList)
	mStyleX(d, { bg: 'white', w: 500, h: 400, gap: 4, padding: 4 });
	let rooms = [];
	for (const ch of letterList) { //['a', 'c', 'd', 'f', 'z']) {
		let r = mRoom(d, ch, { bg: BLUE });
		rooms.push(r);
	}
	return rooms;
}

function roomAdjacency(rooms, doorsize = 40, wall = 4) {
	let adj = {};
	let walls = [];
	let minx, maxx, miny, maxy;
	for (let i = 0; i < rooms.length; i++) {
		for (let j = i + 1; j < rooms.length; j++) {
			let [r1, r2] = [rooms[i], rooms[j]];
			r1.walls = { n: {}, e: {}, s: {}, w: {} };
			//find out if r1,r2 are adjacent
			//if they are, compute adjacency rectangle (=wall between them!)
			let [e1, e2] = [r1.rect, r2.rect];
			//console.log(r1.ch,e1,r2.ch,e2);

			//wie weiss ich dass sie eine wand sharen?
			let mintop = Math.min(e1.t, e2.t);
			//welcher ist hoeher oben?
			let rhoeher = e1.t < e2.t ? r1 : r2; if (rhoeher.rect.t < miny) miny = rhoeher.rect.t;
			let rleft = e1.x < e2.x ? r1 : r2; if (rleft.rect.l < minx) minx = rleft.rect.l;
			let rniedriger = rhoeher == r1 ? r2 : r1; if (rniedriger.rect.b > maxy) maxy = rniedriger.rect.b;
			let rright = rleft == r1 ? r2 : r1; if (rright.rect.r < maxx) maxx = rright.rect.r;
			let diff = doorsize;

			//check for vertical wall
			let dCommony = rhoeher.rect.b - rniedriger.rect.t;
			if (dCommony > diff) {
				//potential for vertical passage
				let shareVert = rright.rect.l - rleft.rect.r <= wall;
				if (shareVert) {
					console.log(r1.ch, 'and', r2.ch, 'share vertical wall of size', dCommony);
					let commonWallRect = { x: rleft.rect.r, y: rniedriger.rect.t, w: wall, h: dCommony };
					walls.push({ rect: commonWallRect, rLeft: rleft, rRight: rright });
					if (nundef(adj[r1.ch])) adj[r1.ch] = {};
					if (nundef(adj[r2.ch])) adj[r2.ch] = {};
					if (r1 == rleft) {
						adj[r1.ch][r2.ch] = { dir: 'e', rect: commonWallRect };
						adj[r2.ch][r1.ch] = { dir: 'w', rect: commonWallRect };
					} else {
						adj[r1.ch][r2.ch] = { dir: 'w', rect: commonWallRect };
						adj[r2.ch][r1.ch] = { dir: 'e', rect: commonWallRect };
					}
				}
			}

			//horizontal wall check
			let dCommonx = rleft.rect.r - rright.rect.l;
			if (dCommonx > diff) {
				//potential for horizontal passage
				let shareHor = rniedriger.rect.t - rhoeher.rect.b <= wall;
				if (shareHor) {
					console.log(r1.ch, 'and', r2.ch, 'share horizontal wall of size', dCommonx);
					let commonWallRect = { x: rright.rect.l, y: rhoeher.rect.b, w: dCommonx, h: wall };
					walls.push({ rect: commonWallRect, rUpper: rhoeher, rLower: rniedriger });
					if (nundef(adj[r1.ch])) adj[r1.ch] = {};
					if (nundef(adj[r2.ch])) adj[r2.ch] = {};
					if (r1 == rhoeher) {
						adj[r1.ch][r2.ch] = { dir: 's', rect: commonWallRect };
						adj[r2.ch][r1.ch] = { dir: 'n', rect: commonWallRect };
					} else {
						adj[r1.ch][r2.ch] = { dir: 'n', rect: commonWallRect };
						adj[r2.ch][r1.ch] = { dir: 's', rect: commonWallRect };
					}
				}
			}


		}
		//break;
	}


	//all walls with min or max are outer walls
	

	console.log('adj', adj, '\nwalls', walls);
	return { adjacencyMatrix: adj, walls: walls };
}

function mDoor(r1, r2) {
	//if r2 undefined, the door should be on outer wall of r1

}
function mDoor(room, dir = 'h') {
	function hDoor(dParent, rect) {
		let w = 50;
		let x = (rect.w - w) / 2;
		let h = 4;
		let y = -h;
		let d = mDiv(dParent, { bg: bg, position: 'absolute', left: x, top: y, w: w, h: h });
		return d;
	}
	function vDoor(dParent, rect) {
		let w = 4;
		let x = -w;
		let h = 50;
		let y = (rect.h - h) / 2;
		let d = mDiv(dParent, { bg: bg, position: 'absolute', left: x, top: y, w: w, h: h });
		return d;
	}
	let dParent = iDiv(room);
	let rect = getRect(dParent);
	let bg = room.bg;
	let d = dir == 'h' ? hDoor(dParent, rect) : vDoor(dParent, rect);
	return d;
}
function mRoom(dParent, ch, styles) {
	let def = { 'grid-area': ch, position: 'relative' };
	copyKeys(def, styles);
	let dCell = mDiv(dParent, styles);
	let rect = getRect(dCell);
	[rect.l, rect.t, rect.r, rect.b] = [rect.x, rect.y, rect.x + rect.w, rect.y + rect.h];
	let size = rect.w * rect.h;
	let room = { ch: ch, bg: dCell.style.backgroundColor, rect: rect, size: size };
	iAdd(room, { div: dCell });
	// mDoor(room, coin() ? 'h' : 'v');
	return room;
}

