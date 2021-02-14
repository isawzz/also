function infoToItem(x) { return { info: x, key: x.key }; }
function getItems(n, cond, baseSet = 'all') {
	//n ... number, key list, info list or item list
	//cond ... undefined, string(KeySet or search SymKeys) or function(filter SymKeys)
	if (isString(baseSet)) baseSet = KeySets[baseSet];
	//console.log('baseSet', baseSet);
	let keys = isdef(cond) ? isString(cond) ?
		isdef(KeySets[cond]) ? KeySets[cond] : baseSet.filter(x => x.includes(cond))
		: baseSet.filter(x => cond(Syms[x])) : baseSet;
	//console.log('keys', keys);
	if (isNumber(n)) n = choose(keys, n);
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	return n;
}
function getItem(k) { return infoToItem(Syms[k]); }
function addLabelsReturnMeasure(items, options) {

	let opt = options.label;
	if (!opt) return null;

	let wMax = 0; let sz;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		item.label = nundef(opt) ? info.E : isString(opt) ? info[opt] : opt(item);
		sz = getSizeWithStyles(item.label, isdef(options.labelStyles) ? options.labelStyles : {});
		//console.log(sz)
		if (sz.w > wMax) { wMax = sz.w };
	}
	return { w: wMax, h: sz.h };
}
function lookupDef(o, proplist, def) { return lookup(o, proplist) || def; }
function itemSizeAndLabel(items, options) {
	let szText = addLabelsReturnMeasure(items, options);

	let o = options.outerStyles;
	let [m, p, b] = isdef(o) ? [o.margin, o.padding, firstNumber(o.border)] : [0, 0, 0];
	[m, p, b] = [isdef(m) ? m : 0, isdef(p) ? p : 0, isdef(b) ? b : 0];
	console.log('m=' + m, 'p=' + p, 'b=' + b);

	let wText = szText.w + 2 * (m + p + b) + 1;// 20+10+8+1;// 2*lookupDef(options,['outerStyles','padding'],25);
	let w = lookup(options, ['outerStyles', 'sz']) || lookup(options, ['outerStyles', 'w']) || 0;
	w = Math.max(wText, w);
	console.log('w', w);
	if (isdef(options.outerStyles)) { delete options.outerStyles.w; delete options.outerStyles.sz };

	return w; //TODO: h auch!
}
function showItems(items, dParent, options = {}) {

	let w = itemSizeAndLabel(items, options);
	dParent = mDiv(dParent);
	mStyleX(dParent, { display: 'grid', 'grid-template-columns': `repeat(auto-fit,${w}px)` });

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let dOuter = item.div = mDiv(dParent);

		item.dLabel = options.label ? mText(item.label, dOuter, options.labelStyles) : null;

		let dPic = item.dPic = mDiv(dOuter, { fz: 100, family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}
	return dParent;
}

















