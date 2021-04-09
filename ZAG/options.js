function _simpleOptions(options = {}, defsOuter = {}) {
	//_simpleOptions({w:sz,h:sz,fz:sz/4,fzPic:sz/2,bg:levelColors[i], fg: textColor});	
	options.showPic = valf(options.showPic, isdef(options.fzPic));
	options.showLabels = isdef(options.fz);
	options.szPic = { w: options.w, h: options.h };
	//options.ifs = { bg: options.bg, fg: options.fg };
	options.fzText = options.fz;

	if (nundef(options.rounding)) options.rounding = 4;
	if (nundef(options.margin)) options.margin = 4;
	if (nundef(options.padding)) options.padding = 0;

	if (nundef(options.labelStyles)) options.labelStyles = {};

	if (options.showLabels) { if (nundef(options.labelPos)) options.labelBottom = true; options.labelStyles.fz = options.fzText; }

	options.picStyles = { fz: options.fzPic };

	let [w, h] = [options.szPic.w, options.szPic.h];
	options.outerStyles = {
		w: w, h: h, bg: options.bg, fg: options.fg,
		display: 'inline-flex', 'flex-direction': 'column',
		'justify-content': 'center', 'align-items': 'center', 'vertical-align': 'top',
		padding: 0, box: true, margin: options.margin, rounding: options.rounding,
	};
	if (isdef(defsOuter)) addKeys(defsOuter, options.outerStyles);

	return options;
}

function detectArea(dParent, w, h) {
	let rect = isdef(dParent) ? getRect(dParent) : null;
	if (nundef(w)) { w = rect ? rect.w : window.innerWidth; }
	if (nundef(h)) { h = rect ? rect.h : window.innerHeight; }
	return [w, h];
}

function getOptionsMinimalistic(dParent, handler, w = 0, h = 0, ifs = {}, options = {}, g) {
	[w, h] = detectArea(dParent, w, h);

	let defOptions = {
		isRegular: true, hugeFont: true, szPic: { w: 200, h: 200 }, gap: 15, shufflePositions: true,
		showPic: true, showLabels: true, luc: 'l', labelPos: 'bottom', language: g.language, keySet: g.vocab,
		w: w, h: h, fz: 24, fzText: 24, fzPic: 96, ifs: ifs, handler: handler, ifs: ifs, handler: handler,
	};
	//depr:
	options.language = options.language;
	addSimpleProps(g, options);
	addKeys(defOptions, options);
	//console.log(options.language,options.language)
	if (options.numRepeat > 1 && nundef(options.ifs.bg)) {
		let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
		let fg = isdef(options.colorKeys) ? 'black' : 'contrast';
		options.ifs.bg = bg;
		options.ifs.fg = fg;
	}
	return options;

}
function getOptionsNoArea(dParent, handler, w = 0, h = 0, ifs = {}, options = {}) {
	[w, h] = detectArea(dParent, w, h);

	let defOptions = {
		isRegular: true, hugeFont: true, szPic: { w: 200, h: 200 }, gap: 15,
		w: w, h: h, fz: 24, fzText: 24, fzPic: 96, ifs: ifs, handler: handler
	};

	copyKeys(defOptions, options);
	_extendOptions(options);
	return options;

}
function getOptions2(dParent, handler, w = 0, h = 0, ifs = {}, options = {}) {
	if (nundef(w) || w == 0) w = window.innerWidth * .82;
	if (nundef(h) || h == 0) h = window.innerHeight * .6;
	let dArea = getArea(dParent, { w: w, h: h });

	let defOptions = {
		isRegular: true, hugeFont: true, szPic: { w: 200, h: 200 }, gap: 15, dArea: dArea,
		w: w, h: h, fz: 24, fzText: 24, fzPic: 96, ifs: ifs, handler: handler
	};

	copyKeys(defOptions, options);
	_extendOptions(options);
	return options;

}
function getOptions1(dParent, handler, g, options, ifs) { // w = .9, h = .6, wItem = 200, hItem = 200, fzPic = 120, fz = 36, sizingOption = 'wGrid', gap = .1) {
	copySimpleProps(g, options);
	options.ifs = ifs;
	options.handler = handler;
	let rect = getRect(dParent);
	if (nundef(options.w)) options.w = rect.w;
	if (nundef(options.h)) options.h = rect.h;
	return options;
}
function calcRowsColsSizeAbWo(n, wmax, hmax, showLabels, wimax = 200, himax = 200, fw = 1, fh = 1) {
	let rows = n > 35 ? 6 : n > 28 ? 5 : n > 24 && !showLabels || n > 21 ? 4 : n > 8 ? 3 : n > 3 ? 2 : 1;
	let cols = Math.ceil(n / rows);
	return calcSizeAbWo(n, rows, cols, wmax, hmax, wimax, himax, fw, fh);
}
function calcSizeAbWo(n, rows, cols, wmax, hmax, wimax = 200, himax = 200, fw = 1, fh = 1) {
	//assumes either cols or rows MUST exist!!!!
	if (nundef(cols)) cols = Math.ceil(n / rows); else if (nundef(rows)) rows = Math.ceil(n / cols);
	let wi = wmax * fw / cols;
	let hi = hmax * fh / rows;
	wi = Math.min(wi, wimax);
	hi = Math.min(hi, himax);
	return [wi, hi, rows, cols];
}

//#region orig simplified calcRowsColsSize
function calcRowsColsSize(n, wmax, hmax, maxrows, maxcols, minsz = 50, maxsz = 200, wPercent = 1, hPercent = 1) {
	let sz;

	let dims = calcRowsColsX(n, maxrows, maxcols);
	//console.log('===>nach calcRowsColsX: rows='+rows,'cols'+cols);

	let hpic = hmax * hPercent / dims.rows;
	let wpic = wmax * wPercent / dims.cols;

	//console.log('hpic', hpic, 'wpic', wpic, ww, window.innerWidth, wh, window.innerHeight);
	sz = Math.min(hpic, wpic);

	sz = Math.max(minsz, Math.min(sz, maxsz));
	return [sz, dims.rows, dims.cols];
}












