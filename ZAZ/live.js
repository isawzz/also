function initLive() { Live = {}; Daaa = {}; UIS = {}; }
//uses Live,UIS, may use Daaa

function lRegister(item) { let x = new UIClass(item); return x.id; }
function registeredItemCopy(orig) { let item = jsCopy(orig); item.id = lRegister(item); return item; }
function registerAsNewItem(item) { item.id = lRegister(item); return item; }

function lAdd(item, props) {
	let id = isString(item) ? item : item.id;
	// console.log('live id is',id,'\nadding',props);
	let l = Live[id];
	for (const k in props) {
		let val = props[k];
		l[k] = val;
		if (isDict(val) && !isEmpty(val.id)) {
			// console.log('val.id is defined:',val.id)
			val.liveId = id;
			//console.log('type of',k,'is',typeof(val),getTypeOf(val));
			// if is elem should go to UIS!
			if (isDOM(val)) {
				// console.log('found DOM elem w/ id!!!!',val.id,k);
				l.uids[k] = val.id;
			}
		}
	}
}

function lGet(item) { let id = isString(item) ? item : item.id; return Live[id]; }
function lDiv(item) { let id = isString(item) ? item : item.id; return Live[id].div; }
function IGet(id) { return Live[id].item; }
function evToLive(ev) { let id = evToClosestId(ev); return isdef(id) ? Live[mBy(id).liveId] : null; }
function evToItem(ev) { let live = evToLive(ev); return isdef(live) ? live.item : null; }

class UIClass {
	constructor(o) { //a live object represents some other object (eg.,'serverData' object, picture,...) and gets a UID at birth
		this.oid = o.id; //koennt eine oid sein??? 
		copyKeys(o, this, { id: true }); //TODO: choose one of those????
		this.item = o;
		let id = this.id = getUID();
		Live[id] = this;
		this.TOList = [];
		// this.uids = {}; //unused!!!
		this.uiActivated = false;
		this.uiState = UIClass.States.none;
	}
	//#region hidden API
	_clearTO() { this.TOList.map(x => clearTimeout(x)); this.TOList = []; }
	_clearUI() {
		for (const k in this.uids) {
			let id = this.uids[k];
			let ui = mBy(id);
			mRemove(ui); //ev unlink ui!!!
			delete this[k];
		}
		this.uids = {};
		console.log('cleared live',this)
	} 
	//#endregion

	//#region life-cycle
	activate() { this.uiActivated = true; }
	clear() { this._clearTO(); } //just hide its UI???
	deactivate() { this.uiActivated = false; }
	die() { this._clearTO(); this._clearUI(); delete Live[this.id]; } //unlink UIS
	//#endregion

	//#region states ???
	static States = { none: 0, gettingReady: 1, ready: 2, running: 3, on: 3, off: 4 }
	run() { console.log('object', this.id, 'is running...') }
	setGettingReady() { this.running = false; this.uiState = UIClass.States.gettingReady; console.log('...getting ready!'); }
	setRunning() { this.running = true; this.uiState = UIClass.States.running; }
	setReady() { this.running = false; this.uiState = UIClass.States.ready; console.log('ready!'); }
	getReady(ms) {
		if (isdef(ms)) { this.setGettingReady(); setTimeout(this.setReady.bind(this), ms); }
		else this.setReady();
	}
	//#endregion

}

