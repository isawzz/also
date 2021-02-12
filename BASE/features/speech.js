var RecogOutput = false;
var RecogOutputError = true;
var RecogHighPriorityOutput = true;
var SpeakerOutput = false;
var MicrophoneUi;
var SessionId;
//var RecognitionAvailable = true;

class SpeechAPI {
	constructor(lang) {
		this.recorder = new Recorder(lang);
		this.speaker = new Speaker(lang);
		SessionId = Date.now();
	}
	testRecorder() {
		this.st
		this.recorder.start();
	}
	train() {

	}
	setLanguage(lang) {
		//console.log('settings the language to:',lang)
		this.speaker.setLanguage(lang);
		this.recorder.setLanguage(lang);
	}
	isSpeakerRunning() { return this.speaker.isRunning; }
	startRecording(lang, callback) {
		this.recorder.isCancelled = false;
		this.recorder.callback = callback;
		this.recorder.setLanguage(lang);
		this.recorder.start();
	}
	stopRecording() {
		this.recorder.isCancelled = true;
		this.recorder.stop();
	}

	say(text, r = .5, p = .8, v = .5, voicekey, callback, lang) {

		//what happens if change lang in the middle of speaking???
		if (isdef(lang)) this.speaker.setLanguage(lang);
		this.speaker.enq(arguments);
		this.speaker.deq();
	}

	stopSpeaking() {
		this.speaker.clearq();
	}

}

class Recorder {
	constructor(lang) {
		let rec = this.rec = new webkitSpeechRecognition();
		//console.log('speech recognition', rec)
		rec.continuous = true;
		rec.interimResults = true;
		rec.maxAlternatives = 5;
		this.setLanguage(lang);
		//flags
		this.isRunning = false;
		this.isCancelled = false;
		//result
		this.result = null;
		this.isFinal = null;
		this.confidence = null;

		this.callback = null;

		let genHandler = (ev, name) => {
			if (RecogOutput) console.log('recorder', name, 'isCancelled', this.isCancelled, 'isRunning', this.isRunning);
		}
		rec.onerror = ev => {
			genHandler(ev, 'error');
			// console.log('____________', ev.error == 'no-speech', ev.error)
			if (ev.error == 'network') {
				alert('no internet connection: Speech Recognition is not available! (error:'+ev.error+')');
				RecognitionAvailable = false;
			} //else {
			// 	alert('Great! Speech Recognition is available! '+ev.error)
			// 	RecognitionAvailable = true;
			// }
			if (RecogOutputError) console.error(ev);
			this.stop();
		};
		rec.onstart = ev => {
			genHandler(ev, 'started');
			if (!this.isCancelled) this.isRunning = true;
		};
		rec.onresult = ev => {
			genHandler(ev, 'result!');
			if (!this.isCancelled) this.processResult(ev);
		};
		rec.onend = ev => {
			genHandler(ev, 'ended');
			if (!this.isCancelled && this.callback) {
				//console.log('-------------------------')
				this.callback(this.isFinal, this.result, this.confidence, SessionId);
			}
			this.isCancelled = this.isRunning = false;
			this.callback = null;
		};

	}
	processResult(ev) {
		//console.log('**********', ev)
		let res = ev.results[0];
		this.isFinal = res.isFinal;
		this.result = res[0].transcript;
		this.confidence = res[0].confidence;

		if (this.isFinal) console.log('....result', this.result, 'FINAL?', this.isFinal)

		if (this.isFinal) {
			this.stop();
		}
	}
	setLanguage(lang) { this.rec.lang = (lang == 'E' ? 'en-US' : 'de-DE'); }
	start() {
		MicrophoneShow();
		setTimeout(() => this.rec.start(), 10);
	}
	stop() {
		//console.log('stopping!')
		MicrophoneHide();
		setTimeout(() => this.rec.stop(), 10);
	}
	getLastResult() {
		//should be of form {isFinal:,result:,confidence:}
		return { isFinal: this.isFinal, result: this.result, confidence: this.confidence };
	}
}
class Speaker {
	static get VOICES() {
		return {
			david: 'Microsoft David Desktop - English',
			zira: 'Microsoft Zira Desktop - English',
			us: 'Google US English',
			ukFemale: 'Google UK English Female',
			ukMale: 'Google UK English Male',
			deutsch: 'Google Deutsch',
		};
	}
	constructor(lang) {
		//console.log('init speaker...')
		this.lang = lang;
		this.q = [];
		this.isRunning = false;
		let awaitVoices = new Promise(resolve =>
			speechSynthesis.onvoiceschanged = resolve)
			.then(this.initVoices.bind(this));
	}
	initVoices() {
		this.voices = speechSynthesis.getVoices().sort(function (a, b) {
			const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
			if (aname < bname) return -1;
			else if (aname == bname) return 0;
			else return +1;
		});
		//console.log('voices:', this.voices.map(x => x.name))
	}
	setLanguage(lang) { this.lang = lang; }
	enq(args) { this.q.push(args); }
	deq() {
		if (nundef(this.voices)){
			setTimeout(this.deq.bind(this),500);
		}
		else if (!isEmpty(this.q)) {
			let args = this.q.pop();
			this.utter(...args);
		} else {
			this.isRunning = false;

		}
	}
	clearq() {
		this.q = [];
	}

	utter(text, r = .5, p = .8, v = .5, voicekey, callback = null) {


		speechSynthesis.cancel();
		var u = new SpeechSynthesisUtterance();
		//u.text = text;
		let [vkey, voice] = this.findSuitableVoice(text, voicekey);
		//console.log(this.voices,vkey)
		u.text = sepWords(text, vkey);// 'Hi <silence msec="2000" /> Flash!'; //text.toLowerCase();
		u.rate = r;
		u.pitch = p;
		u.volume = v;
		u.voice = voice;

		u.onend = ev => {
			if (isdef(callback)) callback();

			this.deq();
		};

		this.isRunning = true;
		speechSynthesis.speak(u);
	}
	findSuitableVoice(text, voicekey) {
		//console.log('findSuitableVoice',text,voicekey,this.lang);
		// voicekey ... random | key in voiceNames | starting phrase of voices.name
		//console.log(typeof voices, voices)
		let voicenames = Speaker.VOICES;
		let vkey = 'david';
		if (this.lang == 'D') {
			vkey = 'deutsch';
		} else if (text.includes('bad')) {
			vkey = 'zira';
		} else if (voicekey == 'random') {
			vkey = chooseRandom(['david', 'zira', 'us', 'ukFemale', 'ukMale']);
		} else if (isdef(voicenames[voicekey])) {
			vkey = voicekey;
		} else if (isdef(voicekey)) {
			let tryVoiceKey = firstCondDict(voicenames, x => startsWith(x, voicekey));
			if (tryVoiceKey) vkey = tryVoiceKey;
		}
		let voiceName = voicenames[vkey];
		let voice = firstCond(this.voices, x => startsWith(x.name, voiceName));
		return [vkey, voice];
	}

}


//#region Microphone UI

function mMicrophone(dParent, color) {
	let d = mDiv(dParent);
	d.innerHTML = '🎤';

	let c = bestContrastingColor(color, ['yellow', 'orange', 'red']);
	//let style = { bg: '#FF413680', rounding: '50%', fz: 50, padding: 5 };
	let bg = c;
	let style = { bg: bg, rounding: '50%', fz: 50, padding: 5, transition: 'opacity .35s ease-in-out' };
	mStyleX(d, style);
	mLinebreak(dParent);
	return d;
}
function MicrophoneShow() {
	//could use class blink
	if (nundef(MicrophoneUi)) return;
	if (RecogOutput) console.log('* mic start')
	MicrophoneUi.style.opacity = 1;
}
function MicrophoneHide() {
	if (nundef(MicrophoneUi)) return;
	if (RecogOutput) console.log('* mic end')
	MicrophoneUi.style.opacity = .31;
}

//#endregion

function isSimilar(reqAnswer, answer, lang) {
	if (answer == reqAnswer) return true;
	else if (replaceAll(answer, ' ', '') == replaceAll(reqAnswer, ' ', '')) return true;
	else if (differInAtMost(reqAnswer, answer, 1)) return true;
	else if (isSimilarSound(reqAnswer, answer, lang)) return true;
	else return false;
}

