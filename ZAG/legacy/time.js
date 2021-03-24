var TimestampStarted, TimeElapsed, OnTimeOver = null, TimeElem, TimeLeft;
function restartTime(elem) { TimestampStarted = msNow(); TimeElapsed = 0; startTime(elem); }
function startTime(elem) {

	if (nundef(Settings.showTime) || !Settings.showTime) return;
	if (nundef(TimestampStarted)) { TimestampStarted = msNow(); TimeElapsed = 0; }
	if (nundef(elem) && isdef(TimeElem)) { elem = TimeElem; }
	else { if (isString(elem)) elem = mBy(elem); TimeElem = elem; }

	// console.log(TimestampStarted, _getFunctionsNameThatCalledThisFunction())
	var timeLeft = TimeLeft = Settings.minutesPerUnit * 60000 - getTimeElapsed();
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
function unitTimeUp() { return (Settings.minutesPerUnit * 60000 - getTimeElapsed()) <= 0; }
function startTimeClock(elem) {
	if (nundef(Settings.showTime) || !Settings.showTime) return;
	var today = new Date(),
		h = format2Digits(today.getHours()),
		m = format2Digits(today.getMinutes()),
		s = format2Digits(today.getSeconds());

	if (isString(elem)) elem = mBy(elem); elem.innerHTML = h + ":" + m + ":" + s;
	TOList.clock = setTimeout(() => startTimeClock(elem), 500);

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

class CountdownTimer {
	static TO;
	static cancel() { clearTimeout(CountdownTimer.TO); }
	constructor(ms, elem, callback) {
		CountdownTimer.cancel();
		console.log('haloooooooooooooo')
		this.timeLeft = ms;
		this.msStart = Date.now();
		this.elem = elem;
		this.tick();
		this.callback = callback;
	}
	msElapsed() { return Date.now() - this.msStart; }
	tick() {
		console.log('tick')
		this.timeLeft -= this.msElapsed();
		let t = msToTime(this.timeLeft);
		let s = format2Digits(t.h) + ":" + format2Digits(t.m) + ":" + format2Digits(t.s);
		this.elem.innerHTML = s; //this.timeLeft;
		if (this.timeLeft > 1000) {
			TO = setTimeout(this.tick.bind(this), 500);
		} else {
			this.elem.innerHTML = 'timeover';
			this.callback();
		}
	}
}

var MSTimeClock, MSTimeDiff, MSTimeStart, MSTimeCallback, MSTimeTO;
function clearTimeCD() {
	if (nundef(MSTimeTO)) return;
	clearTimeout(MSTimeTO); MSTimeClock = MSTimeDiff = MSTimeStart = MSTimeCallback = MSTimeTO = null;
}
function startTimeCD(elem, ms, callback) {
	if (isdef(ms)) { MSTimeClock = ms; MSTimeDiff = 0; MSTimeStart = Date.now(); MSTimeCallback = callback; }
	else { MSTimeDiff = (Date.now() - MSTimeStart); }

	//console.log('elapsed',MSTimeDiff);
	if (MSTimeDiff > MSTimeClock) {
		//console.log('time is OVER................');
		MSTimeCallback();
		return;
	}

	let t = msToTime(MSTimeClock - MSTimeDiff);
	if (isString(elem)) elem = mBy(elem); elem.innerHTML = t.h + ":" + format2Digits(t.m) + ":" + format2Digits(t.s);

	// var today = new Date(),
	// 	h = format2Digits(today.getHours()),
	// 	m = format2Digits(today.getMinutes()),
	// 	s = format2Digits(today.getSeconds());
	// if (isString(elem)) elem = mBy(elem); elem.innerHTML = h + ":" + m + ":" + s;

	MSTimeTO = setTimeout(() => startTimeCD(elem), 500);

}


