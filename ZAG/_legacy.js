//#region init UI
// function initLive() { Live = {}; Daat = {}; }
// function initTable() {
// 	let table = mBy('table');
// 	clearElement(table);

// 	console.log('hhhhhhhhhhhhhh');

// 	initLineTop();
// 	initLineTitle();
// 	initLineTable();
// 	initLineBottom();

// 	dTable = dLineTableMiddle;
// 	dTitle = dLineTitleMiddle;
// 	//console.log(dTable,dTitle)
// }
// function initSidebar() {
// 	let dParent = mBy('sidebar');
// 	clearElement(dParent);
// 	dLeiste = mDiv(dParent);
// 	mStyleX(dLeiste, { 'min-width': 70, 'max-height': '100vh', display: 'flex', 'flex-flow': 'column wrap' });
// }
// function initAux() {
// 	dAux = mBy('dAux');
// }
// function initLineTop() {
// 	dLineTopOuter = mDiv(table); dLineTopOuter.id = 'lineTopOuter';
// 	dLineTop = mDiv(dLineTopOuter); dLineTop.id = 'lineTop';
// 	dLineTopLeft = mDiv(dLineTop); dLineTopLeft.id = 'lineTopLeft';
// 	dLineTopRight = mDiv(dLineTop); dLineTopRight.id = 'lineTopRight';
// 	dLineTopMiddle = mDiv(dLineTop); dLineTopMiddle.id = 'lineTopMiddle';

// 	dScore = mDiv(dLineTopMiddle);
// 	dScore.id = 'dScore';

// 	dLevel = mDiv(dLineTopLeft);
// 	dLevel.id = 'dLevel';

// 	dGameTitle = mDiv(dLineTopRight);
// 	dGameTitle.id = 'dGameTitle';
// 	let d = mDiv(dLineTopRight);
// 	d.id = 'time';

// 	mLinebreak(table);
// }
// function initLineTitle() {
// 	dLineTitleOuter = mDiv(table); dLineTitleOuter.id = 'lineTitleOuter';
// 	dLineTitle = mDiv(dLineTitleOuter); dLineTitle.id = 'lineTitle';
// 	dLineTitleLeft = mDiv(dLineTitle); dLineTitleLeft.id = 'lineTitleLeft';
// 	dLineTitleRight = mDiv(dLineTitle); dLineTitleRight.id = 'lineTitleRight';
// 	dLineTitleMiddle = mDiv(dLineTitle); dLineTitleMiddle.id = 'lineTitleMiddle';

// 	mLinebreak(table);
// }
// function initLineTable() {
// 	dLineTableOuter = mDiv(table); dLineTableOuter.id = 'lineTableOuter';
// 	dLineTable = mDiv(dLineTableOuter); dLineTable.id = 'lineTable';
// 	dLineTableLeft = mDiv(dLineTable); dLineTableLeft.id = 'lineTableLeft';
// 	dLineTableMiddle = mDiv(dLineTable); dLineTableMiddle.id = 'lineTableMiddle';
// 	mClass(dLineTableMiddle, 'flexWrap');
// 	dLineTableRight = mDiv(dLineTable); dLineTableRight.id = 'lineTableRight';

// 	mLinebreak(table);
// }
// function initLineBottom() {
// 	dLineBottomOuter = mDiv(table); dLineBottomOuter.id = 'lineBottomOuter';
// 	dLineBottom = mDiv(dLineBottomOuter); dLineBottom.id = 'lineBottom';
// 	dLineBottomLeft = mDiv(dLineBottom); dLineBottomLeft.id = 'lineBottomLeft';
// 	dLineBottomRight = mDiv(dLineBottom); dLineBottomRight.id = 'lineBottomRight';
// 	dLineBottomMiddle = mDiv(dLineBottom); dLineBottomMiddle.id = 'lineBottomMiddle';

// 	mLinebreak(table);
// }
//#endregion

//#region pic helpers
function picInfo(key) {
	//#region doc 
	/*	
usage: info = picInfo('red heart');

key ... string or hex key or keywords (=>in latter case will perform picSearch and return random info from result)

returns info
	*/
	//#endregion 
	if (isdef(symbolDict[key])) return symbolDict[key];
	else {
		ensureSymByHex();
		let info = symByHex[key];
		if (isdef(info)) { return info; }
		else {
			let infolist = picSearch({ keywords: key });
			//console.log('result from picSearch(' + key + ')', infolist);
			if (infolist.length == 0) return null;
			else return chooseRandom(infolist);
		}
	}
}
function picRandom(type, keywords, n = 1) {
	let infolist = picSearch({ type: type, keywords: keywords });
	//console.log(infolist)
	return n == 1 ? chooseRandom(infolist) : choose(infolist, n);
}
function picSearch({ keywords, type, func, set, group, subgroup, props, isAnd, justCompleteWords }) {
	//#region doc 
	/*	
usage: ilist = picSearch({ type: 'all', func: (d, kw) => allCondX(d, x => /^a\w*r$/.test(x.key)) });

keywords ... list of strings or just 1 string  =>TODO: allow * wildcards!
type ... E [all,eduplo,iduplo,emo,icon] =>dict will be made from that!
func ... (dict,keywords) => infolist

>the following params are used to select one of standard filter functions (see helpers region filter functions)
props ... list of properties to match with filter function
isAnd ... all keywords must match in filter function
justCompleteWords ... matches have to be complete words

returns list of info
	*/
	//#endregion 

	if (isdef(set)) ensureSymBySet();

	if (isdef(type) && type != 'all') ensureSymByType();

	//if (type == 'icon') console.log(symByType,'\n=>list',symListByType)

	let [dict, list] = isdef(set) ? [symBySet[set], symListBySet[set]]
		: nundef(type) || type == 'all' ? [symbolDict, symbolList] : [symByType[type], symListByType[type]];

	//console.log(dict);

	//console.log('_____________',keywords,type,dict,func)
	//if (nundef(keywords)) return isdef(func) ? func(dict) : dict2list(dict);
	if (set == 'role' && firstCond(dict2list(dict), x => x.id == 'rotate')) console.log('===>', symBySet[set], dict, dict2list(dict));

	if (nundef(keywords)) return isdef(func) ? func(dict) : list;
	if (!isList(keywords)) keywords = [keywords];
	if (isString(props)) props = [props];

	let infolist = [];
	if (isList(props)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInPropsAsWord(dict, keywords, props);
			} else {
				infolist = allWordsContainedInProps(dict, keywords, props);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInPropsAsWord(dict, keywords, props);
			} else {
				infolist = anyWordContainedInProps(dict, keywords, props);
			}
		}
	} else if (nundef(props) && nundef(func)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInKeysAsWord(dict, keywords);
			} else {
				infolist = allWordsContainedInKeys(dict, keywords);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInKeysAsWord(dict, keywords);
			} else {
				infolist = anyWordContainedInKeys(dict, keywords);
			}
		}
	} else if (isdef(func)) {
		//propList is a function!
		//console.log('calling func',dict,keywords)
		infolist = func(dict, keywords);
	}
	return infolist;
}
function picSet(setname) {
	//if no key is give, just get a random pic from this set
	ensureSymBySet();
	return chooseRandom(symListBySet[setname]);
	// if (isdef(key)) {
	// 	if (isdef(symBySet[setname][key])) return symbolDict[key];
	// 	else return picSearch({ set: setname, keywords: [key] });
	// } else return chooseRandom(symListBySet[name]);
}
//#endregion


function calcRowsColsX(num, rows, cols) {
	const tableOfDims = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
		40: { rows: 5, cols: 8 },
	};
	if (isdef(rows) || isdef(cols)) return calcRowsCols(num, rows, cols);
	else if (isdef(tableOfDims[num])) return tableOfDims[num];
	else return calcRowsCols(num, rows, cols);
}
function calcRowsCols(num, rows, cols) {
	//=> code from RSG testFactory arrangeChildrenAsQuad(n, R);
	//console.log(num, rows, cols);
	const table = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
	};
	let shape = 'rect';
	if (isdef(rows) && isdef(cols)) {
		//do nothing!
	} else if (isdef(table[num])) {
		return table[num];
	} else if (isdef(rows)) {
		cols = Math.ceil(num / rows);
	} else if (isdef(cols)) {
		rows = Math.ceil(num / cols);
	} else if (num == 2) {
		rows = 1; cols = 2;
	} else if ([4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 49, 56, 64].includes(num)) {
		rows = Math.floor(Math.sqrt(num));
		cols = Math.ceil(Math.sqrt(num));
	} else if ([3, 8, 15, 24, 35, 48, 63].includes(num)) {
		let lower = Math.floor(Math.sqrt(num));
		console.assert(num == lower * (lower + 2), 'RECHNUNG FALSCH IN calcRowsCols');
		rows = lower;
		cols = lower + 2;
	} else if (num > 1 && num < 10) {
		shape = 'circle';
	} else if (num > 16 && 0 == num % 4) {
		rows = 4; cols = num / 4;
	} else if (num > 9 && 0 == num % 3) {
		rows = 3; cols = num / 3;
	} else if (0 == num % 2) {
		rows = 2; cols = num / 2;
	} else {
		rows = 1; cols = num;
	}
	//console.log(rows, cols, shape);
	return { rows: rows, cols: cols, recommendedShape: shape };
}
function getGameValues() {
	let user = U.id;
	let game = G.id;
	let level = G.level;

	let settings = { numColors: 1, numRepeat: 1, numPics: 1, numSteps: 1, colors: ColorList }; // general defaults
	settings = mergeOverride(settings, DB.settings);
	if (isdef(U.settings)) settings = mergeOverride(settings, U.settings);
	if (isdef(DB.games[game])) settings = mergeOverride(settings, DB.games[game]);
	let next = lookup(DB.games, [game, 'levels', level]); if (next) settings = mergeOverride(settings, next);
	next = lookup(U, ['gameSettings', game]); if (next) settings = mergeOverride(settings, next);
	next = lookup(U, ['gameSettings', game, 'levels', level]); if (next) settings = mergeOverride(settings, next);

	//console.log(settings);
	delete settings.levels;
	Speech.setLanguage(settings.language);

	return settings;
}
function getParamsForMaPicStyle(desc = 'segoeBlack') {
	desc = desc.toLowerCase();
	switch (desc) {
		case 'twittertext': return { isText: true, isOmoji: false };
		case 'twitterimage': return { isText: false, isOmoji: false };
		case 'openmojitext': return { isText: true, isOmoji: true };
		case 'openmojiimage': return { isText: false, isOmoji: true };
		case 'openmojiblacktext': return { isText: true, isOmoji: 'openmoBlack' };
		case 'segoe': return { isText: true, isOmoji: 'segoe ui emoji' };
		case 'segoeblack': return { isText: true, isOmoji: 'segoe ui symbol' };
		default: return { isText: true, isOmoji: false };
	}

}
function mHasClass(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function mLinebreak(dParent, gap) {
	if (isString(dParent)) dParent = mBy(dParent);
	let d = mDiv(dParent);
	//console.log('parent style',dParent.style.display)

	//console.log(dParent.classList, Array.from(dParent.classList))

	if (dParent.style.display == 'flex' || mHasClass(dParent, 'flexWrap')) mClass(d, 'linebreak');
	else d.innerHTML = '<br>';

	if (isdef(gap)) { d.style.minHeight = gap + 'px'; d.innerHTML = ' &nbsp; '; d.style.opacity = .2; }//return mLinebreak(dParent);}

	return d;
}
function mpOver(d, dParent, fz, color, picStyle) {
	//maPicOver
	//d is pos fixed!!!
	//console.log('dParent',dParent)
	let b = getRect(dParent);

	let cx = b.w / 2 + b.x;
	let cy = b.h / 2 + b.y;
	//console.log('picStyle')
	d.style.top = picStyle == 'segoeBlack' ? ((cy - fz * 2 / 3) + 'px') : ((cy - fz / 2) + 'px');
	d.style.left = picStyle == 'segoeBlack' ? ((cx - fz / 3) + 'px') : ((cx - fz * 1.2 / 2) + 'px');

	//console.log(b);
	// d.style.top = picStyle == 'segoeBlack' ? (b.y + 60 - fz / 2 + 'px') : (b.y + 100 - fz / 2 + 'px');
	// d.style.left = picStyle == 'segoeBlack' ? (b.x + 120 - fz / 2 + 'px') : (b.x + 100 - fz / 2 + 'px');
	d.style.color = color;
	d.style.fontSize = fz + 'px';
	d.style.display = 'block';
	let { isText, isOmoji } = getParamsForMaPicStyle(picStyle);
	d.style.fontFamily = isString(isOmoji) ? isOmoji : isOmoji ? 'emoOpen' : 'emoNoto';
	return d;
}
function setKeys({ nMin, lang, key, keysets, filterFunc, confidence, sortByFunc } = {}) {
	//console.log('setKeys (legacy)',nMin,lang,key,keysets);
	//G.keys = setKeys({ nMin, lang: G.language, keysets: KeySets, key: G.vocab });

	let keys = jsCopy(keysets[key]);
	//console.log('setKeys (from',getFunctionsNameThatCalledThisFunction()+')',keys)

	if (isdef(nMin)) {
		let diff = nMin - keys.length;
		let additionalSet = diff > 0 ? firstCondDictKeys(keysets, k => k != key && keysets[k].length > diff) : null;

		//console.log('diff',diff,additionalSet, keys)
		if (additionalSet) KeySets[additionalSet].map(x => addIf(keys, x)); //
		//if (additionalSet) keys = keys.concat(keysets[additionalSet]);
		//console.log(keys)
	}

	let primary = [];
	let spare = [];
	for (const k of keys) {
		let info = Syms[k];

		info.best = Syms[k][lang];

		if (nundef(info.best)) {
			let ersatzLang = (lang == 'D' ? 'D' : 'E');
			let klang = 'best' + ersatzLang;
			//console.log(k,lang,klang)
			if (nundef(info[klang])) info[klang] = lastOfLanguage(k, ersatzLang);
		}
		//console.log(k,lang,lastOfLanguage(k,lang),info.best,info)
		let isMatch = true;
		if (isdef(filterFunc)) isMatch = isMatch && filterFunc(k, info.best);
		if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
		if (isMatch) { primary.push(k); } else { spare.push(k); }
	}

	//console.assert(isEmpty(intersection(spare,primary)))

	if (isdef(nMin)) {
		//if result does not have enough elements, take randomly from other
		let len = primary.length;
		let nMissing = nMin - len;
		if (nMissing > 0) { let list = choose(spare, nMissing); spare = arrMinus(arr, list); primary = primary.concat(list); }
	}

	if (isdef(sortByFunc)) { sortBy(primary, sortByFunc); }

	if (isdef(nMin)) console.assert(primary.length >= nMin);
	//console.log(primary)
	return primary;
}


//#region badges
var badges = [];
function removeBadges(dParent, level) {
	while (badges.length > level) {
		let badge = badges.pop()
		removeElem(badge.div);
	}
}
function addBadge(dParent, level, clickHandler, animateRubberband = false) {
	let fg = '#00000080';
	let textColor = 'white';
	//let stylesForLabelButton = { rounding: 8, margin: 4 };
	//const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let isText = true; let isOmoji = false;
	let i = level - 1;
	let key = levelKeys[i];
	let k = replaceAll(key, ' ', '-');

	let item = getItem(k);
	let label = item.label = "level " + i;
	let h = window.innerHeight;
	let sz = h / 14;
	let options = _simpleOptions({ w: sz, h: sz, fz: sz / 4, fzPic: sz / 2, bg: levelColors[i], fg: textColor });
	//console.log('options.....',options);
	options.handler = clickHandler;
	let d = makeItemDiv(item, options);
	//console.log(d)
	mAppend(dParent, d);

	item.index = i;
	badges.push(item);
	return arrLast(badges);
	// let d1 = mpBadge(info, label, { w: hBadge, h: hBadge, bg: levelColors[i], fgPic: fg, fgText: textColor }, null, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
	// d1.id = 'dBadge_' + i;

	// let info = Syms[k];
	// let label = "level " + i;
	// let h = window.innerHeight; let hBadge = h / 14;
	// let d1 = mpBadge(info, label, { w: hBadge, h: hBadge, bg: levelColors[i], fgPic: fg, fgText: textColor }, null, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
	// d1.id = 'dBadge_' + i;
	// if (animateRubberband) mClass(d1, 'aniRubberBand');
	// if (isdef(clickHandler)) d1.onclick = clickHandler;
	// badges.push({ key: info.key, info: info, div: d1, id: d1.id, index: i });
	// return arrLast(badges);
}
function showBadges(dParent, level, clickHandler) {
	clearElement(dParent); badges = [];
	for (let i = 1; i <= level; i++) {
		addBadge(dParent, i, clickHandler);
	}
	//console.log(badges)
}
function showBadgesX(dParent, level, clickHandler, maxLevel) {
	clearElement(dParent);
	badges = [];
	//console.log('maxlevel', maxLevel, 'level', level)
	for (let i = 1; i <= maxLevel + 1; i++) {
		if (i > level) {
			let b = addBadge(dParent, i, clickHandler, false);
			//console.log('badge', i, 'is', b)
			b.live.div.style.opacity = .25;
			b.achieved = false;
		} else {
			let b = addBadge(dParent, i, clickHandler, true);
			b.achieved = true;
		}
	}
	//console.log(badges)
}
function onClickBadgeX(ev) {
	//console.log('haaaaaaaaaaaaaaaalo', ev)
	interrupt(); //enterInterruptState();
	let item = evToItem(ev);
	setBadgeLevel(item.index);
	userUpdate(['games', G.id, 'startLevel'], item.index);
	auxOpen = false;
	TOMain = setTimeout(startGame, 100);
}
function setBadgeLevel(i) {
	//i is now correct level
	//let userStartLevel = getUserStartLevel(G.id);
	//if (userStartLevel > i) _updateStartLevelForUser(G.id, i);
	G.level = i;
	Score.levelChange = true;

	//setBadgeOpacity
	if (isEmpty(badges)) showBadgesX(dLeiste, G.level, onClickBadgeX, G.maxLevel);

	for (let iBadge = 0; iBadge < G.level; iBadge++) {
		let d1 = iDiv(badges[iBadge]);
		d1.style.opacity = .75;
		d1.style.border = 'transparent';
		// d1.children[1].innerHTML = '* ' + iBadge + ' *'; //style.color = 'white';
		d1.children[1].innerHTML = '* ' + (iBadge + 1) + ' *'; //style.color = 'white';
		d1.children[0].style.color = 'white';
	}
	let d = iDiv(badges[G.level]);
	d.style.border = '1px solid #00000080';
	d.style.opacity = 1;
	// d.children[1].innerHTML = 'Level ' + G.level; //style.color = 'white';
	d.children[1].innerHTML = 'Level ' + (G.level + 1); //style.color = 'white';
	d.children[0].style.color = 'white';
	for (let iBadge = G.level + 1; iBadge < badges.length; iBadge++) {
		let d1 = iDiv(badges[iBadge]);
		d1.style.border = 'transparent';
		d1.style.opacity = .25;
		// d1.children[1].innerHTML = 'Level ' + iBadge; //style.color = 'white';
		d1.children[1].innerHTML = 'Level ' + (iBadge + 1); //style.color = 'white';
		d1.children[0].style.color = 'black';
	}
}
//#endregion

//#region layouts
function layoutGrid(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	//console.log(elist, elist.length)
	let dims = calcRowsCols(elist.length, rows, cols);
	//console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${dims.cols}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	//console.log('parentStyle', parentStyle)

	mStyleX(dGrid, parentStyle);
	let b = getRect(dGrid);
	return { w: b.w, h: b.h };

}
function layoutFlex(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	console.log(elist, elist.length)
	let dims = calcRowsCols(elist.length, rows, cols);
	console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	if (containerStyles.orientation == 'v') {
		// console.log('vertical!');
		// parentStyle['flex-flow']='row wrap';
		parentStyle['writing-mode'] = 'vertical-lr';
	}
	parentStyle.display = 'flex';
	parentStyle.flex = '0 0 auto';
	parentStyle['flex-wrap'] = 'wrap';
	// parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	mStyleX(dGrid, parentStyle);
	let b = getRect(dGrid);
	return { w: b.w, h: b.h };

}

//#endregion

//#region settings
var SettingTypesCommon = {
	samplesPerGame: true,
	minutesPerUnit: true,
	incrementLevelOnPositiveStreak: true,
	decrementLevelOnNegativeStreak: true,
	pictureLabels: true,
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
	mAppend(dParent, createElementFromHTML(`<${ttag}>Common G for ${Username}:</${ttag}>`));

	let nGroupNumCommonAllGames = mInputGroup(dParent);
	setzeEineZahl(nGroupNumCommonAllGames, 'samples', 25, ['samplesPerGame']);
	setzeEineZahl(nGroupNumCommonAllGames, 'minutes', 1, ['minutesPerUnit']);
	setzeEineZahl(nGroupNumCommonAllGames, 'correct streak', 5, ['incrementLevelOnPositiveStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'fail streak', 2, ['decrementLevelOnNegativeStreak']);
	setzeEinOptions(nGroupNumCommonAllGames, 'show labels', ['toggle', 'always', 'never'], ['toggle', 'always', 'never'], 'toggle', ['pictureLabels']);
	setzeEinOptions(nGroupNumCommonAllGames, 'language', ['E', 'D', 'S', 'F', 'C'], ['English', 'German','Spanish','French','Chinese'], 'E', ['language']);
	setzeEinOptions(nGroupNumCommonAllGames, 'vocabulary', Object.keys(KeySets), Object.keys(KeySets), 'best25', ['vocab']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'show time', false, ['showTime']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'spoken feedback', true, ['spokenFeedback']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'silent', false, ['silentMode']);
	setzeEineCheckbox(nGroupNumCommonAllGames, 'switch game after level', false, ['switchGame']);


	mLinebreak(dParent);
	let g = DB.games[G.id];
	if (nundef(g)) return;
	mAppend(dParent, createElementFromHTML(`<${ttag}>G for <span style='color:${g.color}'>${g.friendly}</span></${ttag}>`));

	let nGroupSpecific = mInputGroup(dParent);
	setzeEineZahl(nGroupSpecific, 'trials', 3, ['trials']);
	setzeEineCheckbox(nGroupSpecific, 'show hint', true, ['showHint']);

}

//settings: update G after ui change
function appSpecificSettings() {
	updateLabelSettings();
	updateTimeSettings();
	updateKeySettings();
	updateSpeakmodeSettings();
}

function updateSpeakmodeSettings() {
	if (G.silentMode && G.spokenFeedback) G.spokenFeedback = false;

}
function updateKeySettings(nMin) {
	//console.log(G,KeySets);
	if (nundef(G)) return;
	G.keys = setKeys({ nMin, lang: G.language, keysets: KeySets, key: G.vocab });
	//console.log('keyset:', G.keys);
}
function updateTimeSettings() {
	let timeElem = mBy('time');
	//console.log('updateTimeSettings',_getFunctionsNameThatCalledThisFunction())
	if (G.showTime) { show(timeElem); startTime(timeElem); }
	else hide(timeElem);
}
function updateLabelSettings() {
	if (G.pictureLabels == 'toggle') G.showLabels = true; //true;
	else G.showLabels = (G.pictureLabels == 'always');
	//console.log('G.pictureLabels',G.pictureLabels,'labels has been set to',G.showLabels)
}
//#endregion













