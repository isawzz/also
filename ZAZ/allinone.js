//#region regularUniform_givenPicSizeAndArea_minimizeGridHeight_preservePicRatio

function nu_adjustOptionsToRowsColsSize(bestCombi, options) {
	let [rows, cols, wb, hb, shape] = bestCombi;
	[options.rows, options.cols, options.shape] = [rows, cols, shape];
	console.log('options', options, '\nbest', rows, cols, wb, hb, shape);

	let idealGap = .1; let gap = options.gap = Math.min(wb, hb) * idealGap;
	let [wOffset, hOffset] = [gap / cols, gap / rows];
	console.log('wOffset', wOffset, 'hOffset', hOffset, '*.25', gap * .25);
	let offset = Math.max(wOffset, hOffset, gap * .25);
	let w = wb - gap - offset, h = hb - gap - offset;
	//w = wb - gap * 1.25, h = hb - gap * 1.25;

	options.szPic.w = w;
	options.szPic.h = h;

	// let [wfix, hfix, adjustFont] = [true, true, true];//wfix... no/undef,min,max,yes =>outerStyles.wmin,wmax,w or dont set it
	// if (isdef(wfix)) {
	// 	if (wfix == 'min') options.outerStyles.wmin = w;
	// 	else if (wfix == 'max') options.outerStyles.wmax = w;
	// 	else options.outerStyles.w = w; //das bedeutet isUniform!!!!!
	// }
	// if (isdef(hfix)) {
	// 	if (hfix == 'min') options.outerStyles.hmin = options.szPic.h;
	// 	else if (hfix == 'max') options.outerStyles.hmax = options.szPic.h;
	// 	else options.outerStyles.h = options.szPic.h;
	// }

	// if (adjustFont && isdef(wfix) && wfix != 'min') {
		//text font has to be ok for longest label

		options.outerStyles.padding = options.minPadding;
		let wn = w - options.minPadding * 2;
		let hn = h - options.minPadding * 2;

		console.log('w', w, 'wn', wn, 'h', h, 'hn', hn)

		//set font size for uniform: needs to match longest label
		let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
		let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

		if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

		//set font size for uniform: needs to match longest label
		fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);

		console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

		options.fzPic = options.picStyles.fz = Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	// }


}
function nu_findBestCombiOrShrink(items, options, combis) {
	bestCombi = firstCond(combis, x => options.area.w / x.cols > options.szPicTest.w && options.area.h / x.rows > options.szPicTest.h);
	if (isdef(bestCombi)) return bestCombi;
	options.szPicTest = { w: .9 * options.szPicTest.w, h: .9 * options.szPicTest.h };//otherwise, have to reduca the size
	return null;
}
function nu_bestRowsColsSize(items, options) {
	let combis = getSLCombis(items.length, options.isRegular, true);
	//combis.map(x => console.log(x));

	options.szPicTest = { w: options.szPic.w, h: options.szPic.h };
	let bestCombi = _safeLoop(nu_findBestCombiOrShrink, [items, options, combis]);

	console.log('--------BEST:', bestCombi.rows, bestCombi.cols, options.szPic, options.szPicTest);
	let [rows, cols, w, h] = [bestCombi.rows, bestCombi.cols, options.szPicTest.w, options.szPicTest.h]
	delete options.szPicTest;
	return [rows, cols, w, h, rows < cols ? 'L' : 'P'];
}
//#endregion



//#region regularUniform_givenPicSizeAndArea_minimizeGridHeight_preservePicRatio
function zazTest07_regularUniform_givenPicSizeAndArea_minimizeGridHeight_preservePicRatio() {
	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = {
		keyset: 'lifePlus', maxlen: 18, lang: 'D', 'luc': 'c',
		szPic: { w: 200, h: 200 }, minPadding:2, isRegular: true, isUniform: true,
	};
	let items = genItems(n, options);
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	//let d=mDiv100(dArea,{bg:'green'});	return;

	_extendOptions(dArea, options);

	let bestCombi = _bestRowsColsSize(items, options);
	_adjustOptionsToRowsColsSize(bestCombi, options);

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax:options.area.h, fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	
	console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

function _adjustOptionsToRowsColsSize(bestCombi, options) {
	let [rows, cols, wb, hb, shape] = bestCombi;
	[options.rows, options.cols, options.shape] = [rows, cols, shape];
	console.log('options', options, '\nbest', rows, cols, wb, hb, shape);

	let idealGap = .1; let gap = options.gap = Math.min(wb, hb) * idealGap;
	let [wOffset, hOffset] = [gap / cols, gap / rows];
	console.log('wOffset', wOffset, 'hOffset', hOffset, '*.25', gap * .25);
	let offset = Math.max(wOffset, hOffset, gap * .25);
	let w = wb - gap - offset, h = hb - gap - offset;
	//w = wb - gap * 1.25, h = hb - gap * 1.25;

	options.szPic.w = w;
	options.szPic.h = h;
	let [wfix, hfix, adjustFont] = [true, true, true];//wfix... no/undef,min,max,yes =>outerStyles.wmin,wmax,w or dont set it
	if (isdef(wfix)) {
		if (wfix == 'min') options.outerStyles.wmin = w;
		else if (wfix == 'max') options.outerStyles.wmax = w;
		else options.outerStyles.w = w; //das bedeutet isUniform!!!!!
	}
	if (isdef(hfix)) {
		if (hfix == 'min') options.outerStyles.hmin = options.szPic.h;
		else if (hfix == 'max') options.outerStyles.hmax = options.szPic.h;
		else options.outerStyles.h = options.szPic.h;
	}
	if (adjustFont && isdef(wfix) && wfix != 'min') {
		//text font has to be ok for longest label

		let wn = w - options.minPadding * 2;
		let hn = h - options.minPadding * 2;

		console.log('w', w, 'wn', wn, 'h', h, 'hn', hn)

		//set font size for uniform: needs to match longest label
		let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
		let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

		if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

		//set font size for uniform: needs to match longest label
		fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);

		console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

		options.fzPic = options.picStyles.fz = Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	}


}
function _findBestCombiOrShrink(items, options, combis) {
	bestCombi = firstCond(combis, x => options.area.w / x.cols > options.szPicTest.w && options.area.h / x.rows > options.szPicTest.h);
	if (isdef(bestCombi)) return bestCombi;
	options.szPicTest = { w: .9 * options.szPicTest.w, h: .9 * options.szPicTest.h };//otherwise, have to reduca the size
	return null;
}
function _bestRowsColsSize(items, options) {
	let combis = getSLCombis(items.length, options.isRegular, true);
	//combis.map(x => console.log(x));

	options.szPicTest = { w: options.szPic.w, h: options.szPic.h };
	let bestCombi = _safeLoop(_findBestCombiOrShrink, [items, options, combis]);

	console.log('--------BEST:', bestCombi.rows, bestCombi.cols, options.szPic, options.szPicTest);
	let [rows, cols, w, h] = [bestCombi.rows, bestCombi.cols, options.szPicTest.w, options.szPicTest.h]
	delete options.szPicTest;
	return [rows, cols, w, h, rows < cols ? 'L' : 'P'];
}
//#endregion












