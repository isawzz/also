function getFitting(items, options) {

	let mimi = arrMinMax(items, x => x.label.length);
	let longestLabel = options.longestLabel = mimi.max;
	options.itemWithLongestLabelIndex = mimi.imax;
	detectPicSize(items, options); //console.log('item size (just for ratio!):',options.szPic);
	let n = items.length; let res = n > 3 ? getSLCombis(n) : [{ s: 1, l: n }]; mText('N=' + n, dTitleMiddle);
	let best = bestCombi(items, options, res);
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
	options.fzText = options.labelStyles.fz = Math.min(36, fzText1);
	options.fzPic = options.picStyles.fz = Math.min(160, fzPic1);
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };
	options.isRegular = rows * cols == items.length;
	options.isCrowded = options.gap < 3;
	return fitting;
}
function detectPicSize(items, options) {
	//infer szPic if not given!
	//console.log(options.szPic)
	if (nundef(options.szPic)) {
		console.log('should NOT get in here!!!')
		if (isdef(options.fzText)) {
			//dann hab ich auch fzPic!!!
			let h = options.fzText * 1.14 + options.fzPic * 1.15 + options.minPadding * 2;
			//let w = options.fzText * options.maxlen * (options.luc == 'u' ? .7 : .6) + options.minPadding * 2;
			let w = options.fzText * longestLabel * (options.luc == 'u' ? .7 : .6) + options.minPadding * 2;
			options.szPic = { w: w, h: h };
		} else {
			let h = options.fzPic * 1.15 + options.minPadding * 2;
			let w = options.fzPic * 1.25 + options.minPadding * 2;
			options.szPic = { w: w, h: h };
		}
	}
	options.szRatio = options.szPic.w / options.szPic.h;
}
function bestCombi(items, options, res) {
	let wa = options.area.w, ha = options.area.h, wp = options.szPic.w, hp = options.szPic.h;
	let aRatio;

	//wa/wp ist wieviele pics haben in 1 row platz (=cols)

	let rows, cols;
	cols = wa / wp;
	rows = ha / hp;
	//console.log('====>', rows, cols)
	aRatio = cols < rows ? cols / rows : rows / cols;
	options.or = cols < rows ? 'P' : 'L';
	//console.log('aRatio', aRatio)
	//console.log('options.or', options.or);

	let rmin = 20000, best;
	for (const r of res) {
		let rnew = Math.abs(aRatio - r.s / r.l);
		//console.log('rnew', rnew, r.s, r.l);
		if (rnew < rmin) {
			//console.log('rnew', rnew, r.s, r.l);
			rmin = rnew; best = r;
		}
	}
	//console.log('N',items.length,'options',options,'res',res)

	if (options.or == 'P') { rows = best.l; cols = best.s; } else { rows = best.s; cols = best.l; }

	//console.log('=>rows', rows, 'cols', cols);
	return { rows: rows, cols: cols };
}
function getSLCombis(n) {
	let sq = Math.ceil(Math.sqrt(n));
	let res = [];
	for (let i = 2; i <= sq; i++) {
		let s = i;
		let l = Math.ceil(n / s);
		if (s <= l && s * l >= n) res.push({ s: s, l: l });
	}
	//teste die 2 letzten ob sie gleich sind!

	return res;
}

