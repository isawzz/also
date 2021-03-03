function getAllItems(cond,baseSet='all'){	return getItems(10000,cond,baseSet);}
function getItems(n, cond, baseSet = 'all') {
	//n ... number, key list, info list or item list
	//cond ... undefined, string(KeySet or search SymKeys) or function(filter SymKeys)
	if (isString(baseSet)) baseSet = KeySets[baseSet];
	//console.log('baseSet', baseSet);
	let keys = isdef(cond) ? isString(cond) ?
		isdef(KeySets[cond]) ? KeySets[cond] : baseSet.filter(x => x.includes(cond))
		: baseSet.filter(x => cond(Syms[x])) : baseSet;
	console.log('keys', keys.length);
	if (isNumber(n)) n = n>=keys.length?keys:choose(keys, n);
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	return n;
}
function getItem(k) { return infoToItem(Syms[k]); }
function infoToItem(x) { let item={ info: x, key: x.key };item.id = lRegister(item);return item; }

