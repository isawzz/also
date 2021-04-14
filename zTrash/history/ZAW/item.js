//#region syms item + div + dPic + dLabel
function addLabels(items, lang = 'E', luc = 'c') {
	for (const item of items) {
		let label = item.info[lang];
		item.label = luc == 'c' ? toNoun(label) : luc == 'l' ? label : label.toUpperCase();
	}
}
function addLabels_dep(items, lang = 'E', luc = 'c') {
	let max = 0;
	for (const item of items) {
		let label = item.info[lang];
		//console.log(':::::::::',item,item.info,lang,label)
		if (label.length > max) { max = label.length; }
		item.label = luc == 'c' ? toNoun(label) : luc == 'l' ? label : label.toUpperCase();
		//console.log(':::::::::::::',item.label)
	}
	return max;
}
function applyColorkey(item) {
	//console.log('halllllllllllll')
	let l = item.live;
	let sShade = '0 0 0 ' + item.textShadowColor;
	item.shadeStyles = { 'text-shadow': sShade, fg: anyColorToStandardString('black', l.options.contrast) };
	let ui = l.options.showPic ? l.dPic : l.dLabel;
	mStyleX(ui, item.shadeStyles);
}
function calcLongestLabel(items, options) {
	let mimi = arrMinMax(items, x => x.label.length);
	let max = options.longestLabelLen = mimi.max;
	let longest = items.filter(x => x.label.length == max);

	options.labelSum = arrSum(items, ['label', 'length']);
	if (options.hugeFont) {
		let item = longest[0];
		options.longestLabel = item.label;
		options.indexOfLongestLabelItem = item.index;
		options.wLongest = item.label + 'n';
		return;
	}

	//console.log('longest items:', longest)
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
	//console.log('longest item label is', options.longestLabel)
	// items.map(x=>console.log(x.label,x.label.length));
	options.labelSum = arrSum(items, ['label', 'length']);
}
function registeredItemCopy(orig) { let item = jsCopy(orig); item.id = iRegister(item); return item; }
function registerAsNewItem(item) { item.id = iRegister(item); return item; }

function zRepeatEachItem(items, repeat, shufflePositions = false) {
	//repeat items: repeat & shufflePositions
	let orig = items;
	let itRepeat = items;
	for (let i = 1; i < repeat; i++) { itRepeat = itRepeat.concat(orig.map(x => registeredItemCopy(x))); }
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
function zRepeatInColorEachItem(items, colorKeys) {
	//colorKeys: copy colorKeys.length times into different colors
	let itColors = [];
	for (let i = 0; i < colorKeys.length; i++) {
		let newItems;
		if (i > 0) { newItems = jsCopy(items); newItems.map(x => registerAsNewItem(x)); }
		else newItems = items;
		itColors = itColors.concat(newItems);
	}

	for (let i = 0; i < colorKeys.length; i++) {
		let colorKey = colorKeys[i];
		let textShadowColor = ColorDict[colorKey].c;
		for (let j = 0; j < items.length; j++) {
			let index = i * items.length + j;
			//console.log('schau', index, colorKey);
			let x = itColors[index];
			x.index = index;
			x.textShadowColor = textShadowColor;
			x.color = ColorDict[colorKey];
			x.colorKey = colorKey;
		}
		//newItems.map(x => { x.textShadowColor = textShadowColor; x.color = ColorDict[colorKey]; x.colorKey = colorKey; });
	}
	//for (let i = 0; i < itColors.length; i++) itColors[i].index = i;
	//console.log(itColors[0])
	return itColors;
}
function getItem(k) { return infoToItem(Syms[k]); }

//new API:
function genKeys(n, options) {
	let [maxlen, lang, keySet] = [options.maxlen, options.language, options.keySet];
	let cond = isdef(maxlen) ? ((x) => x[lang].length <= maxlen) : null;
	let keys = _getKeysCond(n, cond, keySet);
	return keys;
}
function _getKeysCond(n, cond, keySet = 'all') {
	//console.log('n', n, 'cond', cond, 'keySet', keySet)
	if (isString(keySet)) keySet = KeySets[keySet];
	let keys = isdef(cond) ? isString(cond) ?
		isdef(KeySets[cond]) ? KeySets[cond] : keySet.filter(x => x.includes(cond))
		: keySet.filter(x => cond(Syms[x])) : keySet;
	keys = n >= keys.length ? keys : choose(keys, n);
	return keys;
}
function genItems(n, options) { let keys = genKeys(n, options); let items = genItemsFromKeys(keys, options); return items; }
function genItemsFromKeys(keys, options) {
	let items = keys.map(x => infoToItem(Syms[x]));
	//console.log(options.language,options.luc)
	addLabels(items, options.language, options.luc);
	//console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',items.map(x=>x.label))

	items = _extendItemsAndOptions(items, options);
	return items;
}
function genItemsFromObjects(list, keyProp, labelProp, options) {
	//console.log('list',list)
	let keys = [];
	for (const l of list) keys.push(l[keyProp]);
	//console.log(keys);
	//console.log(keyProp,list)
	//for(const k of keys) {console.log(k);console.log(Syms[k]);}
	let items = list.map(x => infoToItem(Syms[x[keyProp]]));
	let i = 0, luc = options.luc;
	for (const item of items) {
		let label = list[i][labelProp];
		//console.log(label);
		item.o = list[i];
		//console.log('item.o',list[i])
		item.label = luc == 'c' ? toNoun(label) : luc == 'l' ? label : label.toUpperCase();
		i += 1;
	}
	//console.log(items)
	items = _extendItemsAndOptions(items, options);
	return items;
}
function _extendItemsAndOptions(items, options) {
	calcLongestLabel(items, options);

	//hier koennt ich die ifs machen!
	let ifs = options.ifs;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		item.index = i;
		//item.ifs = jsCopy(options.ifs);
		let val;
		for (const propName in ifs) {
			let prop = ifs[propName];
			//console.log('___________',ifs[propName])
			//console.log('TYPE OF', propName, 'IS', typeof prop, prop, isLiteral(prop))
			if (isLiteral(prop)) val = prop;
			else if (isList(prop)) val = prop[i % prop.length];
			else if (typeof (prop) == 'function') val = prop(i, item, options, items);
			else val = null;
			if (isdef(val)) item[propName] = val;
			//console.log('ifs prop:',propName,item[propName]);
		}
	}
	//console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',items.map(x=>x.label))

	if (options.repeat > 1) { items = zRepeatEachItem(items, options.repeat, options.shufflePositions); }
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);

	options.N = items.length;
	//console.log(items)
	//console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',items.map(x=>x.label))
	return items;
}

//#older code
function getAllItems(cond, keySet = 'all') { return getItems(10000, cond, keySet); }
function getItems(n, cond, keySet = 'all') {
	//n ... number, key list, info list or item list
	//cond ... undefined, string(KeySet or search SymKeys) or function(filter SymKeys)
	if (isNumber(n)) { n = _getKeysCond(n, cond, keySet); }

	//n is now list of keys! here i can 
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	return n;
}
function getItemsMaxLen(n, len, keySet = 'all', lang = 'E', luc = 'c') { return getItemsMaxWordLength(...arguments); }
function getItemsMaxWordLength(n, len, keySet = 'all', lang = 'E', luc = 'c') {
	//assumes adding the labels in that language!
	let items = getItems(n, x => x[lang].length <= len, keySet); // cond is on Syms object!!!
	addLabels(items, lang, luc);
	return items;
}
function getNItemsPerKeylist(n, keylists, options = {}) {
	let items = [];
	for (const list of keylists) {
		options.keySet = list;
		//console.log('list',list)
		let newItems = genItems(n, options);
		newItems.map(x => items.push(x));
	}
	return items;
}
function infoToItem(x) { let item = { info: x, key: x.key }; item.id = iRegister(item); return item; }
function evToItem(ev) { let id = evToClosestId(ev); return isdef(id) ? Items[id] : null; }

function modifyColorkey(item) {
	let colorkey = chooseRandom(Object.keys(ColorDict));
	let textShadowColor = ColorDict[colorkey].c;
	item.textShadowColor = textShadowColor;
	item.color = ColorDict[colorkey];
	item.colorKey = colorkey;
	console.log('colorkey', colorkey)
	applyColorkey(item);
}
function makeItemDiv(item, options) {

	if (isdef(options.outerStyles)) copyKeys(item, options.outerStyles, {}, Object.keys(options.ifs)); //options.ifs contains per item dynamic styles!!!!!
	let dOuter = mCreate('div', options.outerStyles, item.id);

	if (isdef(item.textShadowColor)) {
		//console.log('halllllllllllll')
		let sShade = '0 0 0 ' + item.textShadowColor;
		if (options.showPic) {
			options.picStyles['text-shadow'] = sShade;
			options.picStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
		} else {
			options.labelStyles['text-shadow'] = sShade;
			options.labelStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
		}
	}

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

	iAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });

	if (isdef(item.textShadowColor)) { applyColorkey(item, options); }
	return dOuter;

}
function makeItemDivs(items, options) { for (let i = 0; i < items.length; i++) { makeItemDiv(items[i], options) } }
function makeItemDivs_dep(items, options) {
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		if (isdef(options.outerStyles)) copyKeys(item, options.outerStyles, {}, Object.keys(options.ifs)); //options.ifs contains per item dynamic styles!!!!!
		let dOuter = mCreate('div', options.outerStyles, getUID());

		if (isdef(item.textShadowColor)) {
			//console.log('halllllllllllll')
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPic) {
				options.picStyles['text-shadow'] = sShade;
				options.picStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			} else {
				options.labelStyles['text-shadow'] = sShade;
				options.labelStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			}
		}

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

		lAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });

		if (isdef(item.textShadowColor)) { applyColorkey(item, options); }


	}

}
function newItemSelection(item, items, onSelectSelected = null) {
	//console.log('===>',item,items)
	let selectedItem = firstCond(items, x => x.isSelected);
	if (selectedItem && selectedItem != item) toggleItemSelection(selectedItem);
	else if (onSelectSelected && selectedItem) { onSelectSelected(item); }
	toggleItemSelection(item);
}

function toggleItemSelection(item, selectedItems) {
	let ui = iDiv(item);
	item.isSelected = nundef(item.isSelected) ? true : !item.isSelected;
	if (item.isSelected) mClass(ui, 'framedPicture'); else mRemoveClass(ui, 'framedPicture');

	//if piclist is given, add or remove pic according to selection state
	if (isdef(selectedItems)) {
		if (item.isSelected) {
			console.assert(!selectedItems.includes(item), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
			selectedItems.push(item);
		} else {
			console.assert(selectedItems.includes(item), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
			removeInPlace(selectedItems, item);
		}
	}
}

