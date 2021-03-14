function initLive() { Live = {}; Daat = {}; UIS = {}; }
//uses Live,UIS, may use Daat

function lRegister(item) { let x = new LiveObject(item); return x.id; }
function lAdd(item, props) {
	let id = isString(item) ? item : item.id;
	let l = Live[id];
	for (const k in props) { l[k] = props[k]; }// l.addUi(uis[k]); }
}
function lAddMain(item, elem) {
	let id = isString(item) ? item : item.id;
	let l = Live[id];
	l.addUi(elem);
	elem.liveId = id;
	l.div = l[elem.id] = elem;
	//for (const k in props) { l[k] = props[k]; }// l.addUi(uis[k]); }
}
function lGet(item) { let id = isString(item) ? item : item.id; return Live[id]; }
function lDiv(item) { let id = isString(item) ? item : item.id; return Live[id].div; }
function IGet(id) { return Live[id].item; }
function evToLive(ev) { let id = evToClosestId(ev); return isdef(id) ? UIS[id] : null; }
function evToItem(ev) { let live = evToLive(ev); return isdef(live) ? live.item : null; }


class LiveObject {
	constructor(o) { //a live object represents some other object (eg.,'serverData' object, picture,...) and gets a UID at birth
		//console.log('__________________k',k)
		this.oid = o.id; //koennt eine oid sein???

		copyKeys(o, this, { id: true }); //TODO: choose one of those????
		this.item = o;

		let id = this.id = getUID();
		Live[id] = this;
		this.TOList = [];
		this.UIS = {}; //unused!!!
		this.uiActivated = false;
		this.uiState = LiveObject.States.none;
	}
	//#region hidden API
	_clearTO() { this.TOList.map(x => clearTimeout(x)); this.TOList = []; }
	_clearUI() { for (const k in this.UIS) { this.UIS[k].die(); } }
	//#endregion

	//#region life-cycle
	activate() { this.uiActivated = true; }
	clear() { this._clearTO(); } //just hide its UI???
	deactivate() { this.uiActivated = false; }
	die() { this._clearTO(); this._clearUI(); Live[this.id] = null; } //unlink UIS
	//#endregion

	//#region states ???
	static States = { none: 0, gettingReady: 1, ready: 2, running: 3, on: 3, off: 4 }
	run() { console.log('object', this.id, 'is running...') }
	setGettingReady() { this.running = false; this.uiState = LiveObject.States.gettingReady; console.log('...getting ready!'); }
	setRunning() { this.running = true; this.uiState = LiveObject.States.running; }
	setReady() { this.running = false; this.uiState = LiveObject.States.ready; console.log('ready!'); }
	getReady(ms) {
		if (isdef(ms)) { this.setGettingReady(); setTimeout(this.setReady.bind(this), ms); }
		else this.setReady();
	}
	//#endregion

	//region uis: unused!!!
	addUi(elem, info) { let ui = new UIObject(this.id, elem, info); this.UIS[ui.id] = ui; }
	removeUi(id) { this.UIS[id].die(); delete this.UIS[id]; }
	//#endregion
}

class UIObject {
	constructor(lid, elem, info) {
		let id = elem.id = this.id = getUID();
		this.elem = elem; //usually a div
		this.lid = lid;
		UIS[id] = this;
		if (isdef(info)) copyKeys(info, this);

	}
	append(dParent) { mAppend(dParent, this.elem); }
	die() { delete UIS[this.id]; this.remove(); } //make sure alle links updated! make sure alle event handlers turned off!
	getLive() { return Live[this.lid]; }
	remove() { this.elem.remove(); }
}
