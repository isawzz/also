class GHome extends Game {
	constructor(name, o) { super(name, o); }
	prompt() {
		let rooms = mHouse(dTable);
		//for (const r of rooms) r.door = mDoor(r, coin() ? 'h' : 'v');

		
	}
	eval() {
	}
}

function mHouse(dParent) {
	let d = mDiv(dParent, { display: 'inline-grid' });
	d.style.gridTemplateAreas = '"z z d" "a a c" "a a f"';
	mStyleX(d, { bg: 'white', w: 500, h: 400, gap: 4, padding: 4 });
	let rooms = [];
	for (const ch of ['a', 'c', 'd', 'f', 'z']) {
		let r = mRoom(d,ch,{bg:BLUE});
		rooms.push(r);
	}
	return rooms;
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
function mRoom(dParent,ch,styles) { 
	let def={'grid-area':ch,position:'relative'};
	copyKeys(def,styles);
	let dCell = mDiv(dParent, styles);
	let room = { div: dCell, bg: dCell.style.backgroundColor };
	mDoor(room, coin() ? 'h' : 'v');
	return room;
}

