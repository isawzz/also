const KSKeys = ['action', 'actionPlus', 'all', 'best25', 'best50', 'best75', 'best100', 'emo', 'huge',
	'life', 'life50', 'lifePlus', 'nemo', 'nemo100', 'object', 'object50', 'objectPlus'];
var KeySets;

function addCatsToKeys() {
	console.log('Syms', Syms);
	for (const ksk in KeySets) {
		for (const k of KeySets[ksk]) {
			let info = Syms[k]
			lookupAddIfToList(info, ['cats'], ksk);
		}
	}
	downloadAsYaml(Syms, 'symsWithCats');
}
function allWordsAndKeysLowerCase() {
	let newSyms = {};
	for (const k in Syms) {
		let info = Syms[k];
		let inew = jsCopy(info);
		for (const x of ['E', 'D', 'F', 'S']) {
			if (isdef(info[x])) {
				console.log(info[x])
				inew[x] = info[x].toLowerCase();
			}
		}
		newSyms[k.toLowerCase()] = inew;
	}
	downloadAsYaml(newSyms, 'syms1');
}
function catFiltered(cats, name, best) {
	//console.log(cats, name)
	let keys = setCategories(cats);

	let bestName = null;
	let k1 = keys.filter(x => best.includes(x));
	if (k1.length > 80) bestName = name + '100';
	else if (k1.length > 40) bestName = name + '50';
	else if (k1.length > 20) bestName = name + '25';
	let result = {};
	result[name] = keys;
	if (bestName) result[bestName] = k1;

	return result;
}
function getKeySetsX() {
	let ks = localStorage.getItem('KeySets');
	if (isdef(ks)) return JSON.parse(ks);

	let res = {};
	for (const k in Syms) {
		let info = Syms[k];
		if (nundef(info.cats)) continue;
		for (const ksk of info.cats) {
			lookupAddIfToList(res, [ksk], k);
		}
	}

	localStorage.setItem('KeySets', JSON.stringify(res));
	return res;

}
function getKeySets() {
	let ks = localStorage.getItem('KeySets');
	if (isdef(ks)) return JSON.parse(ks);

	let huge = [];
	for (const k in symbolDict) {
		let info = symbolDict[k];
		if (isdef(info.bestD)) huge.push(k);
	}

	//push all the keys that are in Syms but not in symbolDict!
	for (const k of ['zebra']) huge.push(k);

	let allKeys = symKeysBySet.nosymbols;
	let keys = allKeys.filter(x => isdef(symbolDict[x].best100));
	let keys1 = allKeys.filter(x => isdef(symbolDict[x].best100) && isdef(symbolDict[x].bestE));
	let keys2 = allKeys.filter(x => isdef(symbolDict[x].best50));
	let keys3 = allKeys.filter(x => isdef(symbolDict[x].best25));
	let res = { huge: huge, best25: keys3, best50: keys2, best75: keys1, best100: keys, all: allKeys };
	let res1 = catFiltered(['nosymemo'], 'nemo', res.best100);
	let res2 = catFiltered(['animal', 'plant', 'fruit', 'vegetable'], 'life', res.best100);
	let res3 = catFiltered(['object'], 'object', res.best100);
	let res4 = catFiltered(['gesture', 'emotion'], 'emo', res.best100);
	let res5 = catFiltered(['activity', 'role', 'sport', 'sports', 'game'], 'action', res.best100);
	for (const o of [res1, res2, res3, res4, res5]) {
		for (const k in o) res[k] = o[k];
	}

	res['objectPlus'] = union(res.object, res.best100);
	res['lifePlus'] = union(res.life, res.best100);
	res['actionPlus'] = union(res.action, res.best100);

	localStorage.setItem('KeySets', JSON.stringify(res));
	return res;

}
function setKeys({ nMin, lang, key, keysets, filterFunc, confidence, sortByFunc } = {}) {
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
		let info = symbolDict[k];

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
function genCats() {
	let di = {
		sport: ByGroupSubgroup['Activities']['sport'],
		mammal: ByGroupSubgroup['Animals & Nature']['animal-mammal'],
		job: ByGroupSubgroup['People & Body']['job'],
	};
	return di;
}


function getAllItems(cond,baseSet='all'){	return getItems(10000,cond,baseSet);}
function getItems(n, cond, baseSet = 'all') {
	//n ... number, key list, info list or item list
	//cond ... undefined, string(KeySet or search SymKeys) or function(filter SymKeys)
	if (isString(baseSet)) baseSet = KeySets[baseSet];
	//console.log('baseSet', baseSet);
	let keys = isdef(cond) ? isString(cond) ?
		isdef(KeySets[cond]) ? KeySets[cond] : baseSet.filter(x => x.includes(cond))
		: baseSet.filter(x => cond(Syms[x])) : baseSet;
	//console.log('keys', keys);
	if (isNumber(n)) n = n>=keys.length?keys:choose(keys, n);
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	return n;
}
function getRandomKeys(n, kSetOrList) { return choose(isList(kSetOrList) ? kSetOrList : KeySets[kSetOrList], n); }
function getRandomKeysIncluding(n, k, kSetOrList) {
	let keys = getRandomKeys(n, kSetOrList);
	if (!keys.includes(k)) {
		//randomly replace one of the keys by this one!
		let i = randomNumber(0, keys.length - 1);
		keys.splice(i, 1, k);
	}
	shuffle(keys);
	return keys;
}

function getSym(key, lang = 'E') {

	let info = jsCopy(picInfo(key));
	if (nundef(info.bestD)) { info.bestE = info.E.key; return info; }

	let valid, words;
	let oValid = info[lang + '_valid_sound'];
	if (isEmpty(oValid)) valid = []; else valid = sepWordListFromString(oValid, ['|']);
	let oWords = info[lang];
	if (isEmpty(oWords)) words = []; else words = sepWordListFromString(oWords, ['|']);

	let dWords = info.D;
	if (isEmpty(dWords)) dWords = []; else dWords = sepWordListFromString(dWords, ['|']);
	let eWords = info.E;
	if (isEmpty(eWords)) eWords = []; else eWords = sepWordListFromString(eWords, ['|']);

	words = isEnglish(lang) ? eWords : dWords;
	info.eWords = eWords;
	info.dWords = dWords;
	info.words = words;
	info.best = arrLast(words);
	info.valid = valid;

	currentLanguage = lang;

	return info;
}


