
var TimestampStarted, TimeElapsed, OnTimeOver = null, TimeElem, TimeLeft, TimeSettings={};
function restartTime(elem,g={}) { TimeSettings = g; TimestampStarted = msNow(); TimeElapsed = 0; startTime(elem); }
function startTime(elem) {
	//console.log(TimeSettings.showTime,TimeSettings.minutesPerUnit)
	if (nundef(TimeSettings.showTime) || !TimeSettings.showTime) return;
	if (nundef(TimeSettings.minutesPerUnit)) TimeSettings.minutesPerUnit=10;
	if (nundef(TimestampStarted)) { TimestampStarted = msNow(); TimeElapsed = 0; }
	if (nundef(elem) && isdef(TimeElem)) { elem = TimeElem; }
	else { if (isString(elem)) elem = mBy(elem); TimeElem = elem; }

	var timeLeft = TimeLeft = TimeSettings.minutesPerUnit * 60000 - getTimeElapsed();
	//console.log('started at',TimestampStarted,'TimeLeft',TimeLeft)
	if (timeLeft > 0) {
		let t = msToTime(timeLeft);
		let s = format2Digits(t.h) + ":" + format2Digits(t.m) + ":" + format2Digits(t.s);

		elem.innerHTML = s;//h + ":" + m + ":" + s;
		setTimeout(() => startTime(elem), 500);
	} else {
		elem.innerHTML = '00:00:00';
		if (OnTimeOver) OnTimeOver();
	}
}
function unitTimeUp() { return (TimeSettings.minutesPerUnit * 60000 - getTimeElapsed()) <= 0; }
function startTimeClock(elem) {
	if (nundef(TimeSettings.showTime) || !TimeSettings.showTime) return;
	var today = new Date(),
		h = format2Digits(today.getHours()),
		m = format2Digits(today.getMinutes()),
		s = format2Digits(today.getSeconds());

	if (isString(elem)) elem = mBy(elem); elem.innerHTML = h + ":" + m + ":" + s;
	setTimeout(() => startTimeClock(elem), 500);

}
function format2Digits(i) { return (i < 10) ? "0" + i : i; }
function getTimeElapsed() { return TimeElapsed + msElapsedSince(TimestampStarted); }


function msNow() { return Date.now(); }
function msToTime(ms) {
	let secs = Math.floor(ms / 1000);
	let mins = Math.floor(secs / 60);
	secs = secs - mins * 60;
	let hours = Math.floor(mins / 60);
	mins = mins - hours * 60;
	return { h: hours, m: mins, s: secs };
}
function msElapsedSince(msStart) { return Date.now() - msStart; }
function timeToMs(h, m, s) { return ((((h * 60) + m) * 60) + s) * 1000; }


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
