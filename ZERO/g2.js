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


function showItems1(items, dParent, options = {}) {

	//#region prep
	//1. options.fixedFont=true: problem: only works if items fit window space!
	// let sz = idealItemSize(items, options);//labels are added!
	// let rows = idealRows(items, options, sz); //assume items should all be visible

	//2. first fit rows,cols in window
	//then compute font
	//compute size of each item
	let szText = sizeOfLongestLabel(items, options);
	let [sz, rows, cols] = calcRowsColsSize(items.length, null, null, null, window.innerWidth, window.innerHeight - 80, 50, 200);
	//console.log('szText', szText, 'sz', sz, 'rows', rows);
	//console.log('styles',options.outerStyles); delete options.outerStyles.w;
	//jetzt muss der font so reduziert werden dass sich 1 item in sz.w ausgeht!
	let wText = szText.w;
	let wi = sz;
	let fz = lookup(options, ['labelStyles', 'fz']) || 20;
	if (wText > wi) fz = Math.max(8, Math.round(fz * wi / wText));
	lookupSet(options, ['labelStyles', 'fz'], fz);
	//muss aber auch den fz von pic verkleinern und dann die items selbst verkleinern!!!
	//if (sz < 150) {
	let fzPic = sz * 2 / 3;
	lookupSet(options, ['picStyles', 'fz'], fzPic);
	//lookupSet(options,['outerStyles','padding'],0)
	//}
	lookupSet(options, ['outerStyles', 'w'], 50);
	options.rows = rows;
	options.cols = cols;
	//#endregion

	console.log('items', items.length, 'wText', wText, 'wi', wi, 'fzText', fz, 'rows', rows);

	dParent = mDiv(dParent);

	let dummy=mCreate('div');

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let dOuter = item.div = mDiv(dParent);

		if (options.labelOnTop) item.dLabel = options.label ? mText(item.label, dOuter, options.labelStyles) : null;

		let dPic = item.dPic = mDiv(dOuter, { family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (!options.labelOnTop) item.dLabel = options.label ? mText(item.label, dOuter, options.labelStyles) : null;

		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);
		item.w = item.h = dOuter.style.width = dOuter.style.height = sz + 'px';

		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}

	presentItems(items, dParent, rows);
	return dParent;
}


//#region helpers
function idealRows(items, options, sz) {
	let wOther = 50;
	let wc = window.innerWidth - wOther;
	let hOther = 250;
	let hc = window.innerHeight - hOther;
	let szCont = { w: wc, h: hc };

	let wi = sz.w, hi = sz.h, n = items.length;

	//total area: do I have to make the items smaller?
	let ai = wi * hi * n;
	let ac = wc * hc;

	console.log('area needed min:', ai, '\narea container:', ac);
	wfit = Math.floor(wc / wi);
	hfit = Math.floor(hc / hi);
	console.log('fit w:', wfit, '\nfit h:', hfit);
	//find perfect fit: 
	let res = ideaRowsCols(n, 1, hfit, 1, wfit);
	console.log('moeglich:', res);

	let rows = 4;
	console.log('=====>n', n)
	if (isEmpty(res)) rows = Math.floor(Math.sqrt(n));
	else {
		let minmax = arrMinMax(res, x => Math.abs(x.r - x.c));
		rows = res[minmax.imin].r;

	}

	// let rows=!isEmpty(res) ?res[0].r:Math.floor(Math.sqrt(n));
	return rows;
}
function bestFitRowsCols(n,area,wimin=50,wimax=200,himin=50,himax=200){

	if (nundef(area)) area={w:window.innerWidth,h:window.innerHeight};
	let wi={w:3,h:2};
	let res = idealRowsCols(n,1,15,1,n); //area.w/wimin,1,area.h/himin);
	console.log('N='+n);//res);
	area.ratio=area.w/area.h;

	let best,mindiff=1000;
	for(const r of res){
		//console.log(r);
		//console.log(r,wi);
		let ratio=r.c/r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(area.ratio-ratio);
		//console.log('ratio',ratio)
		if (rdiff < mindiff){
			mindiff=rdiff;best=[r.r,r.c];//{rows:r.rows,cols:r.cols};
			console.log('new best:',rdiff,best)
		}
	}
	console.log('best',best)
	return best;

}
function idealItemSizeFit(items, options) {
	let szText = sizeOfLongestLabel(items, options);

	if (nundef(options.picStyles)) options.picStyles = {}; options.picStyles.family = items[0].info.family;
	let szPic = getSizeWithStyles(items[0].info.text, options.picStyles);

	console.log('szText=', szText, 'szPic=', szPic);

	//calculate w needed
	let o = options.outerStyles;
	let [m, wp, hp, b] = isdef(o) ? [o.margin, isdef(o.hpadding) ? o.hpadding : o.padding, isdef(o.vpadding) ? o.vpadding : o.padding, firstNumber(o.border)] : [0, 0, 0];
	[m, wp, hp, b] = [isdef(m) ? m : 0, isdef(wp) ? wp : 0, isdef(hp) ? hp : 0, isdef(b) ? b : 0];
	console.log('m=' + m, 'wp=' + wp, 'hp=' + hp, 'b=' + b);

	let wText = szText.w + 2 * (m + wp + b) + 1;
	let w = lookup(options, ['outerStyles', 'sz']) || lookup(options, ['outerStyles', 'w']) || 0;
	w = Math.max(wText, w);
	console.log('w', w);
	//was ist mit h? szText.h=18+118+8+8=156 und er zeigt an:154
	let hTotal = szText.h + szPic.h + 2 * b + 1;
	let h = lookup(options, ['outerStyles', 'sz']) || lookup(options, ['outerStyles', 'h']) || 0;
	h = Math.max(hTotal, h);
	console.log('h', h);

	if (isdef(options.outerStyles)) { delete options.outerStyles.w; delete options.outerStyles.sz };

	return { w: w, h: h };
}
function idealItemSize(items, options) {
	let szText = sizeOfLongestLabel(items, options);

	if (nundef(options.picStyles)) options.picStyles = {}; options.picStyles.family = items[0].info.family;
	let szPic = getSizeWithStyles(items[0].info.text, options.picStyles);

	console.log('szText=', szText, 'szPic=', szPic);

	//calculate w needed
	let o = options.outerStyles;
	let [m, wp, hp, b] = isdef(o) ? [o.margin, isdef(o.hpadding) ? o.hpadding : o.padding, isdef(o.vpadding) ? o.vpadding : o.padding, firstNumber(o.border)] : [0, 0, 0];
	[m, wp, hp, b] = [isdef(m) ? m : 0, isdef(wp) ? wp : 0, isdef(hp) ? hp : 0, isdef(b) ? b : 0];
	console.log('m=' + m, 'wp=' + wp, 'hp=' + hp, 'b=' + b);

	let wText = szText.w + 2 * (m + wp + b) + 1;
	let w = lookup(options, ['outerStyles', 'sz']) || lookup(options, ['outerStyles', 'w']) || 0;
	w = Math.max(wText, w);
	console.log('w', w);
	//was ist mit h? szText.h=18+118+8+8=156 und er zeigt an:154
	let hTotal = szText.h + szPic.h + 2 * b + 1;
	let h = lookup(options, ['outerStyles', 'sz']) || lookup(options, ['outerStyles', 'h']) || 0;
	h = Math.max(hTotal, h);
	console.log('h', h);

	if (isdef(options.outerStyles)) { delete options.outerStyles.w; delete options.outerStyles.sz };

	return { w: w, h: h };
}
function idealRowsCols(n, rmin, rmax, cmin, cmax) {
	let res = [];
	for (let r = rmin; r <= rmax; r++) {
		for (let c = cmin; c <= cmax; c++) {
			if (r * c == n) res.push({ r: r, c: c });
		}
	}
	return res;
}
function infoToItem(x) { return { info: x, key: x.key }; }
function sizeOfLongestLabel(items, options) {
	// size of longest label is measured and its size returned: uses options.labelStyles as they are!
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


//#endregion












