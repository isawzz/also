function getFitting(items, options) {

	let mimi = arrMinMax(items, x => x.label.length);
	let longestLabel = options.longestLabel = mimi.max;
	options.itemWithLongestLabelIndex = mimi.imax;

	let n = items.length; let res = n > 3 ? getSLCombis(n) : [{ s: 1, l: n }]; 
	let best = bestRowsColsCombinedRatio(items, options, res); //must use options.sizingPriority!!!

	let cols = options.cols = best.cols;
	let rows = options.rows = best.rows;
	//console.log('best combi',best);

	let idealGap = .1;
	let wb = Math.min(options.area.w / cols, 400);
	let hb = Math.min(options.area.h / rows, 400);

	let gap = options.gap = Math.min(wb, hb) * idealGap;
	wb -= gap * 1.25; hb -= gap * 1.25;

	let fzText1, fzPic1;
	if (isdef(options.longestLabel)) fzText1 = (wb / options.longestLabel) * (options.luc != 'u' ? 1.9 : 1.7);
	else fzText1 = 0;

	fzPic1 = Math.min(wb / 1.3, (hb - fzText1 * 1.2) / 1.3);

	if (fzPic1 < fzText1 * 2) { fzText1 = Math.floor(hb / 4); fzPic1 = fzText1 * 2; }

	options.fzText = options.labelStyles.fz = Math.min(36, fzText1);
	options.fzPic = options.picStyles.fz = Math.min(160, fzPic1);
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };
	options.isRegular = rows * cols == items.length;
	options.isCrowded = options.gap < 3;
	return fitting;
}
function bestRowsColsCombinedRatio(items, options, res) {
	let wa = options.area.w, ha = options.area.h, wp = options.szPic.w, hp = options.szPic.h;
	// console.log('wp',wp,'hp',hp)
	// if (options.sizingPriority == 'font') {
	// 	wp = Math.max(options.fzText * .75 * options.maxlen, options.fzPic * 1.25) + 2 * options.minPadding;
	// 	hp = (options.fzText + options.fzPic) * 1.1 + 2 * options.minPadding;
	// }
	// console.log('DANACH: wp',wp,'hp',hp)
	let aRatio;
	let rows, cols;
	cols = wa / wp;
	rows = ha / hp;
	//console.log('====>', rows, cols)
	aRatio = cols < rows ? cols / rows : rows / cols;
	options.or = cols < rows ? 'P' : 'L';
	//console.log('options.or', options.or);
	let rmin = 20000, best;
	for (const r of res) {
		let rnew = Math.abs(aRatio - r.s / r.l);
		if (rnew < rmin) { rmin = rnew; best = r; }
	}
	if (options.or == 'P') { rows = best.l; cols = best.s; } else { rows = best.s; cols = best.l; }

	//console.log('=>rows', rows, 'cols', cols, res);
	return { rows: rows, cols: cols };
}
function prepDims(items, options) {
	//console.log('rows',options.rows,'n',items.length)
	let [sz, rows, cols] = calcRowsColsSize(items.length, options.rows, options.cols);
	//console.log('picSz=' + sz, 'options.sz', options.sz,'rows',rows,'cols',cols)
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = sz);
}
function bestRowsColsWFit(n = 24, area) {
	let combis = getSLCombis(n, true);
	combis.map(x => console.log(x));

	//how many fit in width?
	defOptions = { percentGap: 5, szPic: { w: 100, h: 100 }, w: 800 };
	for (const k in defOptions) {
		if (nundef(options[k])) options[k] = defOptions[k];
	}

	let maxcols = 0, maxrows = 0, wn=options.szPic.w, hn=options.szPic.h, wb, hb, gpix;
	while (maxcols * maxrows < n) {
		gpix = Math.round(wn * options.percentGap / 100);
		options.gap = gpix;
		wb = wn + gpix;
		hb = hn + gpix;

		maxcols = Math.floor(options.w / wb);
		maxrows = Math.floor(options.area.h / hb);
		if (maxcols * maxrows < n) {
			wn*=.9;
			hn*=.9;

		}

	}
	options.szPic={w:wn,h:hn};

	console.log('maxcols', maxcols, options.w, '\nmaxrows', maxrows, options.area.h, '\nszPic',options.szPic, wb, 'gap', gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function bestRowsColsWFit1(n = 24, options) {
	let combis = getSLCombis(n, true);
	combis.map(x => console.log(x));

	//how many fit in width?
	defOptions = { percentGap: 5, szPic: { w: 100, h: 100 }, w: 800 };
	for (const k in defOptions) {
		if (nundef(options[k])) options[k] = defOptions[k];
	}

	let maxcols = 0, maxrows = 0, wn=options.szPic.w, hn=options.szPic.h, wb, hb, gpix;
	while (maxcols * maxrows < n) {
		gpix = Math.round(wn * options.percentGap / 100);
		options.gap = gpix;
		wb = wn + gpix;
		hb = hn + gpix;

		maxcols = Math.floor(options.w / wb);
		maxrows = Math.floor(options.area.h / hb);
		if (maxcols * maxrows < n) {
			wn*=.9;
			hn*=.9;

		}

	}
	options.szPic={w:wn,h:hn};

	console.log('maxcols', maxcols, options.w, '\nmaxrows', maxrows, options.area.h, '\nszPic',options.szPic, wb, 'gap', gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function getSLCombis(n, onlyRegular = false) {
	let sq = Math.ceil(Math.sqrt(n));
	let res = [];
	for (let i = 1; i <= sq; i++) {
		let s = i;
		let l = Math.ceil(n / s);
		if (s <= l && s * l >= n) res.push({ s: s, l: l });
	}
	if (onlyRegular) res = res.filter(x => x.s * x.l == n);

	return res;
}

