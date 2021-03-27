function _simpleOptions(options) {
	//_simpleOptions({w:sz,h:sz,fz:sz/4,fzPic:sz/2,bg:levelColors[i], fg: textColor});	
	options.showPic = isdef(options.fzPic);
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
		'justify-content': 'center', 'align-items': 'center',
		padding: 0, box: true, margin: options.margin, rounding: options.rounding,
	};

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
		isRegular: true, hugeFont: true, szPic: { w: 200, h: 200 }, gap: 15,
		showPic: true, showLabels: true, luc: 'l', labelPos: 'bottom', lang: 'E', keySet: 'all',
		w: w, h: h, fz: 24, fzText: 24, fzPic: 96, ifs: ifs, handler: handler, ifs: ifs, handler: handler,
	};
	addSimpleProps(g,options);
	addKeys(defOptions, options);
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
function calcRowsColsSizeAbWo(n, wmax, hmax, showLabels, wimax = 200, himax = 200, hper = 1, wper = 1) {
	let rows = n > 35 ? 6 : n > 28 ? 5 : n > 24 & !showLabels || n > 21 ? 4 : n > 8 ? 3 : n > 3 ? 2 : 1;
	let cols = Math.ceil(n / rows);
	let hi = hmax * hper / rows;
	let wi = wmax * wper / cols;
	hi = Math.min(hi, himax);
	wi = Math.min(wi, wimax);
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
	//picsPerLine = dims.cols;
	sz = Math.max(minsz, Math.min(sz, maxsz)); //Math.max(50, Math.min(sz, 200));
	return [sz, dims.rows, dims.cols]; //pictureSize, picsPerLine];
}












