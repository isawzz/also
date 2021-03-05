function addLabels(items, lang = 'E', lowerUpperCap = 'c') {
	let max = 0;
	for (const item of items) {
		let label = item.info[lang];
		if (label.length > max) { max = label.length; }
		item.label = lowerUpperCap == 'c' ? toNoun(label) : lowerUpperCap == 'l' ? label : label.toUpperCase();
	}
	return max;
}
function getAllItems(cond, baseSet = 'all') { return getItems(10000, cond, baseSet); }
function getItems(n, cond, baseSet = 'all') {
	//n ... number, key list, info list or item list
	//cond ... undefined, string(KeySet or search SymKeys) or function(filter SymKeys)
	if (isString(baseSet)) baseSet = KeySets[baseSet];
	//console.log('baseSet', baseSet);
	let keys = isdef(cond) ? isString(cond) ?
		isdef(KeySets[cond]) ? KeySets[cond] : baseSet.filter(x => x.includes(cond))
		: baseSet.filter(x => cond(Syms[x])) : baseSet;
	//console.log('keys', keys.length);
	if (isNumber(n)) n = n >= keys.length ? keys : choose(keys, n);
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	return n;
}
function getItemsMaxLen(n,len, baseSet = 'all', lang = 'E', lowerUpperCap = 'c') {return getItemsMaxWordLength(...arguments);}
function getItemsMaxWordLength(n, len, baseSet = 'all', lang = 'E', lowerUpperCap = 'c') {
	//assumes adding the labels in that language!
	let items =  getItems(n, x => x[lang].length <= len, baseSet); // cond is on Syms object!!!
	addLabels(items,lang,lowerUpperCap);
	return items;
}
function getItem(k) { return infoToItem(Syms[k]); }
function infoToItem(x) { let item = { info: x, key: x.key }; item.id = lRegister(item); return item; }

