//#region settings
var SettingTypesCommon = {
	samplesPerGame: true,
	minutesPerUnit: true,
	incrementLevelOnPositiveStreak: true,
	decrementLevelOnNegativeStreak: true,
	showLabels: true,
	language: true,
	vocab: true,
	showTime: true,
	spokenFeedback: true,
	silentMode: true,
	switchGame: true,
	trials: false,
	showHint: false,
}

function createSettingsUi(dParent) {
	clearElement(dParent);
	let ttag = 'h2';
	mAppend(dParent, createElementFromHTML(`<${ttag}>Common Settings for ${Username}:</${ttag}>`));

	let nGroupNumCommonAllGames = mInputGroup(dParent);
	setzeEineZahl(nGroupNumCommonAllGames, 'samples', 25, ['samplesPerGame']);
	setzeEineZahl(nGroupNumCommonAllGames, 'minutes', 1, ['minutesPerUnit']);
	setzeEineZahl(nGroupNumCommonAllGames, 'correct streak', 5, ['incrementLevelOnPositiveStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'fail streak', 2, ['decrementLevelOnNegativeStreak']);
	setzeEinOptions(nGroupNumCommonAllGames, 'show labels', ['toggle', 'always', 'never'], ['toggle', 'always', 'never'], 'toggle', ['showLabels']);
	setzeEinOptions(nGroupNumCommonAllGames, 'language', ['E', 'D', 'S', 'F', 'C'], ['English', 'German','Spanish','French','Chinese'], 'E', ['language']);
	setzeEinOptions(nGroupNumCommonAllGames, 'vocabulary', Object.keys(KeySets), Object.keys(KeySets), 'best25', ['vocab']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'show time', false, ['showTime']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'spoken feedback', true, ['spokenFeedback']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'silent', false, ['silentMode']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'switch game after level', false, ['switchGame']);


	mLinebreak(dParent);
	let g = DB.games[G.id];
	if (nundef(g)) return;
	mAppend(dParent, createElementFromHTML(`<${ttag}>Settings for <span style='color:${g.color}'>${g.friendly}</span></${ttag}>`));

	let nGroupSpecific = mInputGroup(dParent);
	setzeEineZahl(nGroupSpecific, 'trials', 3, ['trials']);
	setzeEineCheckbox(nGroupSpecific, 'show hint', true, ['showHint']);

}

//#region update Settings after ui change
function appSpecificSettings() {
	console.log('....',G.showLabels,'init')
	updateLabelSettings();
	updateTimeSettings();
	updateKeySettings();
	updateSpeakmodeSettings();
}

function updateSpeakmodeSettings() {
	if (Settings.silentMode && Settings.spokenFeedback) Settings.spokenFeedback = false;

}
function updateKeySettings(nMin) {
	//console.log(G,KeySets);
	if (nundef(G)) return;
	G.keys = setKeys({ nMin, lang: Settings.language, keysets: KeySets, key: Settings.vocab });
	//console.log('keyset:', G.keys);
}
function updateTimeSettings() {
	let timeElem = mBy('time');
	//console.log('updateTimeSettings',_getFunctionsNameThatCalledThisFunction())
	if (Settings.showTime) { show(timeElem); startTime(timeElem); }
	else hide(timeElem);
}
function updateLabelSettings() {
	console.log('....',G.showLabels,Settings,G)
	console.assert(isdef(Score.labels), 'Score not set!!!!!');
	if (Settings.showLabels == 'toggle') Settings.labels = Score.labels == true; //true;
	else Settings.labels = (Settings.showLabels == 'always');
}

