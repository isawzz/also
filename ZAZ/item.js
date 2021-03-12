function addLabels(items, lang = 'E', lowerUpperCap = 'c') {
	let max = 0;
	for (const item of items) {
		let label = item.info[lang];
		if (label.length > max) { max = label.length; }
		item.label = lowerUpperCap == 'c' ? toNoun(label) : lowerUpperCap == 'l' ? label : label.toUpperCase();
	}
	return max;
}
function calcLongestLabel(items, options) {
	let mimi = arrMinMax(items, x => x.label.length);
	let max = options.longestLabelLen = mimi.max;
	let longest = items.filter(x => x.label.length == max);
	console.log('longest items:', longest)
	let bestItem = longest[0], maxmw = 0;
	for (const item of longest) {
		let w = item.label.toLowerCase();
		let cntmw = 0;
		for (let i = 0; i < w.length; i++) if (w == 'm' || w == 'w') cntmw += 1;
		if (cntmw > maxmw) { cntmw = maxmw; bestItem = item; }
	}

	options.longestLabel = bestItem.label; // items[mimi.imax].label;

	options.wLongest = replaceAll(options.longestLabel, 'i', 'w');
	options.wLongest = replaceAll(options.wLongest, 'l', 'w');
	options.wLongest = replaceAll(options.wLongest, 't', 'n');
	options.wLongest = replaceAll(options.wLongest, 'r', 'n');
	options.indexOfLongestLabelItem = bestItem.index;
	console.log('longest item label is', options.longestLabel)
	// items.map(x=>console.log(x.label,x.label.length));
	options.labelSum = arrSum(items, ['label', 'length']);
}

function genItems(n, options) {
	//console.log(n,options.maxlen)
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);
	calcLongestLabel(items, options);

	if (options.repeat > 1) {
		items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	}

	options.N = items.length;

	return items;
}
function zRepeatEachItem(items, repeat, shufflePositions = false) {
	//repeat items: repeat & shufflePositions
	let orig = items;
	let itRepeat = items;
	for (let i = 1; i < repeat; i++) { itRepeat = itRepeat.concat(orig.map(x=>registeredItemCopy(x))); }
	if (shufflePositions) { shuffle(itRepeat); }
	//weil die items schon geshuffled wurden muss ich iRepeat neu setzen in den reihenfolge in der sie in itRepeat vorkommen!
	let labelRepeat = {};
	let idx = 0;
	for (const item of itRepeat) {
		let iRepeat = labelRepeat[item.label];
		if (nundef(iRepeat)) iRepeat = 1; else iRepeat += 1;
		item.iRepeat = iRepeat;
		item.index = idx; idx += 1;
		labelRepeat[item.label] = iRepeat;
	}
	return itRepeat;
}
function getAllItems(cond, baseSet = 'all') { return getItems(10000, cond, baseSet); }
function getItem(k) { return infoToItem(Syms[k]); }
function getItems(n, cond, baseSet = 'all') {
	//n ... number, key list, info list or item list
	//cond ... undefined, string(KeySet or search SymKeys) or function(filter SymKeys)
	if (isString(baseSet)) baseSet = KeySets[baseSet];
	let keys = isdef(cond) ? isString(cond) ?
		isdef(KeySets[cond]) ? KeySets[cond] : baseSet.filter(x => x.includes(cond))
		: baseSet.filter(x => cond(Syms[x])) : baseSet;
	if (isNumber(n)) n = n >= keys.length ? keys : choose(keys, n);
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	for (let i = 0; i < n.length; i++) n[i].index = i;
	return n;
}
function getItemsMaxLen(n, len, baseSet = 'all', lang = 'E', lowerUpperCap = 'c') { return getItemsMaxWordLength(...arguments); }
function getItemsMaxWordLength(n, len, baseSet = 'all', lang = 'E', lowerUpperCap = 'c') {
	//assumes adding the labels in that language!
	let items = getItems(n, x => x[lang].length <= len, baseSet); // cond is on Syms object!!!
	addLabels(items, lang, lowerUpperCap);
	return items;
}
function infoToItem(x) { let item = { info: x, key: x.key }; item.id = lRegister(item); return item; }
function registeredItemCopy(orig) { let item = jsCopy(orig); item.id = lRegister(item); return item; }
function makeItemDivs(items, options) {
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let dOuter = mCreate('div');
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		let dLabel;
		if (options.showLabels && options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic;
		if (options.showPic) {
			dPic = mDiv(dOuter, { family: item.info.family });
			dPic.innerHTML = item.info.text;
			if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);
		}

		if (options.showLabels && options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { div: dOuter, options: options });
		if (isdef(dLabel)) lAdd(item, { dLabel: dLabel })
		if (isdef(dPic)) lAdd(item, { dPic: dPic })
	}

}


