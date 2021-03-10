//#region regularUniform_givenPicSizeAndArea_minimizeGridHeight_preservePicRatio
function nu_non_uniform() {

	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, 'dArea');

	let options = { szPic: { w: 200, h: 200 }, isRegular: true, isUniform: false, fillArea: false, };
	_extendOptions(dArea, options);

	//let n = chooseRandom([2, 3, 4, 6, 8, 9]);
	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;
	let items = genItems(n, options);

	let bestCombi = nu_bestRowsColsSize(items, options);
	nu_adjustOptionsToRowsColsSize(bestCombi, options);

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

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

	options.padding = 4; //options.padding = calcPadding(options.minPadding,w,h);

	options.outerStyles.padding = options.padding;

	let wn = w - options.padding * 2;
	let hn = h - options.padding * 2;

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
		szPic: { w: 200, h: 200 }, minPadding: '2%', isRegular: true, isUniform: true,
	};
	let items = genItems(n, options);
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	//let d=mDiv100(dArea,{bg:'green'});	return;

	_extendOptions(dArea, options);

	let bestCombi = _bestRowsColsSize(items, options);
	_adjustOptionsToRowsColsSize(bestCombi, options);

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');

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

		options.padding = 4;//calcPadding(options.minPadding,w,h);
		options.outerStyles.padding = options.padding;
		console.log('padding', options.padding);

		let wn = w - options.padding * 2;
		let hn = h - options.padding * 2;

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



//#region 1. adaptive strategies, fill area 
function sampleFillArea() {
	//let n = chooseRandom([2, 3, 4, 6, 8, 9]);
	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, 'dArea');

	let options = { szPic: { w: 200, h: 200 }, isRegular: true, isUniform: false, fillArea: false, };
	_extendOptions(dArea, options);

	let items = genItems(n, options);

}
function makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', gap: options.gap, border: '5px solid red', box: true
	});
	for (const it of items) { mStyleX(lDiv(it), { flex: '1' }); }
	setTimeout(() => correctFlexGrid(items, options, dGrid), 10);
}
function correctFlexGrid(items, options, dGrid) {
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	//console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {
		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		//console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let n1 = Math.floor(others.length > 50 ? others.length / 5 : others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		}
	}

}
function makeNoneGrid(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }
	mStyleX(dGrid, { border: '5px solid blue', box: true })
	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		console.log('options', options.fzPic, options)
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		let newGap = Math.ceil(options.gap / 2);
		while (ov > 0) {

			//let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			//let newGap = Math.ceil(Math.max(1, options.gap / 2 - pad));
			console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) { mStyleX(lDiv(it), { fz: 4, margin: newGap, padding: newGap / 2, rounding: 0 }); }
			ov = getVerticalOverflow(dGrid);
			if (ov && newGap == 1) {
				for (const it of items) { mStyleX(lDiv(it), { margin: 0, padding: 0 }); }
				break;
			}
			newGap = Math.ceil(newGap / 2);
		}

	}
}



//#region all
// modifies options: add def options, set a few minor options, CREATE labelStyles, picStyles, outerStyles
function _calcFontPicFromText(options, overrideExisting = true) {
	if (nundef(options.fzPic) || overrideExisting) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length
	return options.fzPic;
}
function _calcPadding(options, w, h) {
	if (isString(options.minPadding)) { // has a %
		let pad = Math.min(w, h) * firstNumber(options.minPadding) / 100;
		console.log('pad', padding);
		options.padding = pad;
	} else options.padding = options.minPadding;
	return options.padding;
}
function _extendOptions(dArea, options, defOptions) {
	if (nundef(defOptions)) {
		defOptions = {
			szPic: { w: 100, h: 100 },
			showLabels: true, maxlen: 25, luc: 'c', labelPos: 'bottom', lang: 'D',
			fzText: 20, fzPic: 60,
			minPadding: '1%', minGap: '10%', isUniform: true, isRegular: true, fillArea: false,
		};
	}

	addKeys(options, defOptions);
	
	_calcFontPicFromText(options, false);
	//_calcPadding(options, w, h);

	options.area = getRect(dArea);
	options.aRatio = options.area.w / options.area.h;
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';

	if (nundef(options.labelStyles)) options.labelStyles = {};

	if (options.showLabels) {
		if (options.labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles.fz = options.fzText;
	}

	options.picStyles = { fz: options.fzPic };

	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true, rounding: 6,
	};

	return options;
}
function _extendOptionsFillArea(dArea, options) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 25, minPadding: '1%', idealGap: '1%',
		isUniform: true, fillArea: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	_extendOptions(dArea, options, defOptions);

}

function genOptions(opt = {}) {
	let defOptions = {
		szPic: { w: 100, h: 100 }, wper: 80, hper: 80, n: 20,
		showLabels: true, maxlen: 25, luc: 'c', labelPos: 'bottom', lang: 'D',
		fzText: 20, fzPic: 60,
		minPadding: '1%', minGap: '10%', isUniform: true, isRegular: true, fillArea: false,
	};
	addKeys(opt, defOptions);

	if (nundef(opt.dArea)) opt.dArea = getMainAreaPercent(dTable, YELLOW, opt.wper, opt.hper, 'dArea');

	if (nundef(opt.items)) opt.items = genItems(opt.n,opt);

	_calcFontPicFromText(opt, false);
	//_calcPadding(opt, w, h);

	opt.area = getRect(opt.dArea);
	opt.aRatio = opt.area.w / opt.area.h;
	opt.containerShape = opt.area.w > opt.area.h ? 'L' : 'P';

	if (nundef(opt.labelStyles)) opt.labelStyles = {};

	if (opt.showLabels) {
		if (opt.labelPos == 'bottom') opt.labelBottom = true; else opt.labelTop = true;
		opt.labelStyles.fz = opt.fzText;
	}

	opt.picStyles = { fz: opt.fzPic };

	opt.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true, rounding: 6,
	};

	return opt;
}


function makeGridGrid(items, options, dGrid) {
	let wcol = options.isUniform ? '1fr' : 'auto';
	let display = options.fillArea ? 'grid' : 'inline-grid';
	mStyleX(dGrid, {
		display: display,
		'grid-template-columns': `repeat(${options.cols}, ${wcol})`,
		gap: options.gap,
		border: '5px solid yellow', box: true
	});
}


function _setRowsColsSize(options) {
	let [rows, cols, wb, hb, shape] = [options.rows,options.cols,options.szPic.w,options.szPic.h,options.rows<options.cols?'L':'P'];
	[options.rows, options.cols, options.shape] = [rows, cols, shape];

	let idealGap = .1; 
	let gap = options.gap = Math.min(wb, hb) * idealGap;
	let [wOffset, hOffset] = [gap / cols, gap / rows];
	//console.log('wOffset', wOffset, 'hOffset', hOffset, '*.25', gap * .25);
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

	options.padding = 4; //options.padding = calcPadding(options.minPadding,w,h);

	options.outerStyles.padding = options.padding;

	let wn = w - options.padding * 2;
	let hn = h - options.padding * 2;

	//console.log('w', w, 'wn', wn, 'h', h, 'hn', hn)

	//set font size for uniform: needs to match longest label
	let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
	let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

	if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

	//set font size for uniform: needs to match longest label
	fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);

	//console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

	options.fzPic = options.picStyles.fz = Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	// }


}



