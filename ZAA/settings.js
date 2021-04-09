//#region settings ui

function createSettingsUi(dParent) {
	clearElement(dParent);
	let ttag = 'h2';
	mAppend(dParent, createElementFromHTML(`<${ttag}>Settings for ${Username}:</${ttag}>`));

	let nGroupNumCommonAllGames = mInputGroup(dParent);
	setzeEineZahl(nGroupNumCommonAllGames, 'samples', 25, ['samplesPerGame']);
	setzeEineZahl(nGroupNumCommonAllGames, 'minutes', 1, ['minutesPerUnit']);
	setzeEineZahl(nGroupNumCommonAllGames, 'correct streak', 5, ['incrementLevelOnPositiveStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'fail streak', 2, ['decrementLevelOnNegativeStreak']);
	setzeEinOptions(nGroupNumCommonAllGames, 'show labels', ['toggle', 'always', 'never'], ['toggle', 'always', 'never'], 'toggle', ['pictureLabels']);
	setzeEinOptions(nGroupNumCommonAllGames, 'language', ['E', 'D', 'S', 'F', 'C'], ['English', 'German', 'Spanish', 'French', 'Chinese'], 'E', ['language']);
	setzeEinOptions(nGroupNumCommonAllGames, 'vocabulary', Object.keys(KeySets), Object.keys(KeySets), 'best25', ['vocab']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'show time', false, ['showTime']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'spoken feedback', true, ['spokenFeedback']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'silent', false, ['silentMode']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'switch game after level', false, ['switchGame']);
	setzeEineZahl(nGroupNumCommonAllGames, 'trials', 3, ['trials']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'show hint', true, ['showHint']);

	console.log('Settings', Settings)
}
function setSettingsKeys(elem) {
	let val = elem.type == 'number' ? Number(elem.value) : elem.type == 'checkbox' ? elem.checked : elem.value;
	lookupSetOverride(G, elem.keyList, val);
	SettingsChanged = true;
	//console.log(elem.keyList, val)
	//console.log(G);
}
function setSettingsKeysSelect(elem) {

	let val;
	for (const opt of elem.children) {
		if (opt.selected) val = opt.value;
	}

	// console.log('lllllllllllllllll', a, a.value, a.keyList);
	//let val = elem.type == 'number' ? Number(elem.value) : elem.value;
	SettingsChanged = true;
	lookupSetOverride(G, elem.keyList, val);
	//console.log('result', lookup(G, elem.keyList));
}
function setzeEineZahl(dParent, label, init, skeys) {
	// <input id='inputPicsPerLevel' class='input' type="number" value=1 />
	let d = mDiv(dParent);
	let val = lookup(G, skeys);
	if (nundef(val)) val = init;
	let inp = createElementFromHTML(
		// `<input id="${id}" type="number" class="input" value="1" onfocusout="setSettingsKeys(this)" />`); 
		`<input type="number" class="input" value="${val}" onfocusout="setSettingsKeys(this)" />`);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);

	mStyleX(inp, { maleft: 12, mabottom: 4 });
	mClass(inp, 'input');

	inp.keyList = skeys;
	addSetting(skeys[0]);
}
function setzeEineCheckbox(dParent, label, init, skeys) {
	// <input id='inputPicsPerLevel' class='input' type="number" value=1 />
	let d = mDiv(dParent);
	let val = lookup(G, skeys);
	if (nundef(val)) val = init;
	let inp = createElementFromHTML(
		`<input type="checkbox" class="checkbox" ` + (val === true ? 'checked=true' : '') + ` onfocusout="setSettingsKeys(this)" >`
		// `<input id="${id}" type="number" class="input" value="1" onfocusout="setSettingsKeys(this)" />`); 
		// `<input type="number" class="input" value="${val}" onfocusout="setSettingsKeys(this)" />`
	);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);

	mStyleX(inp, { maleft: 12, mabottom: 4 });
	mClass(inp, 'input');

	inp.keyList = skeys;
	addSetting(skeys[0]);
}
function setzeEinOptions(dParent, label, optionList, friendlyList, init, skeys) {

	// <input id='inputPicsPerLevel' class='input' type="number" value=1 />
	let d = mDiv(dParent);
	let val = lookup(G, skeys);
	if (nundef(val)) val = init;

	let inp = createElementFromHTML(`<select class="options" onfocusout="setSettingsKeysSelect(this)"></select>`);
	for (let i = 0; i < optionList.length; i++) {
		let opt = optionList[i];
		let friendly = friendlyList[i];
		let optElem = createElementFromHTML(`<option value="${opt}">${friendly}</option>`);
		mAppend(inp, optElem);
		if (opt == val) optElem.selected = true;
	}
	// // `<input id="${id}" type="number" class="input" value="1" onfocusout="setSettingsKeys(this)" />`); 
	// `<input type="number" class="input" value="${val}" onfocusout="setSettingsKeys(this)" />`);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);

	mStyleX(inp, { maleft: 12, mabottom: 4 });

	inp.keyList = skeys;
	addSetting(skeys[0]);
}
//#endregion

//#region helpers 
function mInputGroup(dParent, styles) {
	let baseStyles = { display: 'inline-block', align: 'right', bg: '#00000080', rounding: 10, padding: 20, margin: 12 };
	if (isdef(styles)) styles = mergeOverride(baseStyles, styles); else styles = baseStyles;
	return mDiv(dParent, styles);
}
function addSetting(keylist) { if (nundef(Settings)) Settings = []; Settings.push(keylist); }
function updateSettings() {

	updateLabelSettings();
	updateTimeSettings();
	//updateKeySettings();
	updateSpeakmodeSettings();

	//welche settings kommen wohin?
	let scope = 'user';//'game' 'level','temp','all'
	//console.log(Settings)
	if (scope == 'temp' || nundef(Settings)) return;
	for (const k of Settings) {
		if (scope == 'user') lookupSetOverride(U, ['settings', k], G[k]);
		else if (scope == 'game') lookupSetOverride(U, ['games', G.id, k], G[k]);
		else if (scope == 'level') lookupSetOverride(U, ['games', G.id, 'levels', G.level, k], G[k]);
		else if (scope == 'all') lookupSetOverride(DB, ['settings', k], G[k]);
	}

}
function updateSpeakmodeSettings() { if (G.silentMode && G.spokenFeedback) G.spokenFeedback = false; }
function updateTimeSettings() { let timeElem = mBy('time'); if (G.showTime) { show(timeElem); startTime(timeElem); } else hide(timeElem); }
function updateLabelSettings() { if (G.pictureLabels == 'toggle') G.showLabels = true; else G.showLabels = (G.pictureLabels == 'always'); }
function updateGameValues(U, G) {
	let game = G.id;
	let level = G.level;

	let settings = { numColors: 1, numRepeat: 1, numPics: 1, numSteps: 1, colors: ColorList }; // general defaults
	settings = mergeOverride(settings, DB.settings);
	if (isdef(U.settings)) settings = mergeOverride(settings, U.settings);
	if (isdef(DB.games[game])) settings = mergeOverride(settings, DB.games[game]);
	let next = lookup(DB.games, [game, 'levels', level]); if (next) settings = mergeOverride(settings, next);
	next = lookup(U, ['games', game]); if (next) settings = mergeOverride(settings, next);
	next = lookup(U, ['games', game, 'levels', level]); if (next) settings = mergeOverride(settings, next);

	//console.log(settings);
	delete settings.levels;
	delete settings.colors;
	Speech.setLanguage(settings.language);

	copyKeys(settings, G);	
	updateSettings(); 
	//return settings;

}
