async function _start() {
	initTable(); initSidebar(); initAux(); initScore();
	loadUser();
	startUnit();
}
function startUnit() {
	renewTimer(G,'time'); //console.log('time',G.showTime,'should be started')
	U.session = {};
	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();

}

class TimeoutManager {
	constructor() {
		this.TO = {};
	}
	clear(key) {
		if (nundef(key)) key = Object.keys(this.TO);
		else if (isString(key)) key = [];

		for (const k of key) {
			clearTimeout(this.TO[k]);
			delete this.TO[k];
		}
	}
	set(ms, callback, key) {
		if (nundef(key)) key = getUID();
		TO[key] = setTimeout(ms, callback);
	}
}


class CountdownTimer {
	constructor(ms, elem) {
		this.timeLeft = ms;
		this.msStart = Daat.now();
		this.elem = elem;
		this.tick();
	}
	msElapsed() { return Date.now() - this.msStart; }
	tick() {
		this.timeLeft -= this.msElapsed;
		this.elem.innerHTML = this.timeLeft;
		if (this.timeLeft > 1000) {
			setTimeout(this.tick.bind(this), 500);
		} else this.elem.innerHTML = 'timeover';
	}
}
