function sample_idealGridLayout_orig(showLabels = true, showPic = true) {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, null, 100, 70, getUID());

	let n = 30;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen = n > 24 ? 9 : 15;
	let options = { shufflePositions: true, repeat: 2, szPic: { w: 200, h: 100 }, showLabels: showLabels, showPic: showPic, percentVertical: 30, maxlen: maxlen, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + options.N;

	console.log('items', items, '\noptions', options);
	//return [items,options];

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	console.log('rows', options.rows, 'cols', options.cols);
	_setRowsColsSize(options);
	makeItemDivs(items, options);

	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());

	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	let fzMax, fpMax;
	if (options.showLabels) {
		// fzMax = Math.floor(idealFontsize(options.longestLabel, wi - 2 * Math.ceil(options.padding), hi, 24).fz);
		fzMax = Math.floor(idealFontsize(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
		fpMax = options.showPic ? Math.min(hi / 2, wi * 2 / 3, hi - fzMax) : 0;
	} else { fzMax = 1; fpMax = options.showPic ? Math.min(hi * 2 / 3, wi * 2 / 3) : 0; }
	//let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	console.log('===>pad', options.padding, 'wi', wi, idealFontsize(options.longestLabel, wi, hi, 24));
	console.log('====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel, options.wLongest);

	options.fzPic = options.picStyles.fz = fpMax; //Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = fzMax; // Math.floor(fz);
	options.szPic = { w: wi, h: hi };

	for (const item of items) {
		let ui = lGet(item);
		mStyleX(ui.div, { wmin: wi, hmin: hi, padding: 0 });
		// mStyleX(ui.dPic, { fz: hi/2 }); 
		if (isdef(ui.dPic)) mStyleX(ui.dPic, { fz: fpMax });
		if (isdef(ui.dLabel)) mStyleX(ui.dLabel, { fz: fzMax });
	}
	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		console.log('OVERFLOWN!!!!!!!!!!!! vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontsize(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		console.log('fonts set to', fz, fzPic);
		console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}


	return [items, options];
}
function sample_idealGridLayout_try1(showLabels = true, showPic = false) {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, null, 100, 70, getUID());

	let n = 20;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen = n > 24 ? 9 : 15;
	let options = { shufflePositions: true, repeat: 2, szPic: { w: 200, h: 100 }, showLabels: showLabels, showPic: showPic, percentVertical: 30, maxlen: maxlen, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);

	let ifs = options.ifs = {};
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	//let fg = (i, item) => item.bg == 'random'?'contrast': colorIdealText(item.bg);
	let defIfs = { bg: bg }; //, fg: fg, contrast: .32, fz: 20, padding: 3 };
	let defOptions = { shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1 };
	addKeys(defIfs, ifs);
	addKeys(defOptions, options);

	//console.log('options',options);

	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + options.N;

	//console.log('items', items, '\noptions', options);
	//return [items,options];

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	//console.log('rows', options.rows, 'cols', options.cols);
	_setRowsColsSize(options);
	makeItemDivs(items, options);

	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());

	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	let fzMax, fpMax;
	if (options.showLabels) {
		// fzMax = Math.floor(idealFontsize(options.longestLabel, wi - 2 * Math.ceil(options.padding), hi, 24).fz);
		fzMax = Math.floor(idealFontsize(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
		fpMax = options.showPic ? Math.min(hi / 2, wi * 2 / 3, hi - fzMax) : 0;
	} else { fzMax = 1; fpMax = options.showPic ? Math.min(hi * 2 / 3, wi * 2 / 3) : 0; }
	//let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	//console.log('===>pad', options.padding, 'wi', wi, idealFontsize(options.longestLabel, wi, hi, 24));
	//console.log('====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel, options.wLongest);

	options.fzPic = options.picStyles.fz = fpMax; //Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = fzMax; // Math.floor(fz);
	options.szPic = { w: wi, h: hi };

	for (const item of items) {
		let ui = lGet(item);
		mStyleX(ui.div, { wmin: wi, hmin: hi, padding: 0 });
		// mStyleX(ui.dPic, { fz: hi/2 }); 
		if (isdef(ui.dPic)) mStyleX(ui.dPic, { fz: fpMax });
		if (isdef(ui.dLabel)) mStyleX(ui.dLabel, { fz: fzMax });
	}
	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		console.log('OVERFLOWN!!!!!!!!!!!! vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontsize(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		console.log('fonts set to', fz, fzPic);
		console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}


	return [items, options];
}


//from live.js:
function lAdd(item, uis, other) {
	let id = isString(item) ? item : item.id;
	let l = Live[id];


	if (isdef(other)) copyKeys(other, l);
	for (const k in uis) { l[k] = uis[k]; l.addUi(uis[k]); }
}


function sample_regular_uniform_grid_fill_vCenter_WORK() {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 70, getUID());

	let n = 30;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen = n > 24 ? 9 : 15;
	let options = { percentVertical: 30, maxlen: maxlen, szPic: { w: 200, h: 200 }, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	console.log('rows', options.rows, 'cols', options.cols);
	_setRowsColsSize(options);
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());
	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	// let fzMax = Math.floor(idealFontsize(options.longestLabel, wi-2*options.padding, hi, 24).fz);
	let fzMax = Math.floor(idealFontsize(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
	console.log('===>pad', options.padding, 'wi', wi, idealFontsize(options.longestLabel, wi, hi, 24));
	let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	console.log('=====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel);

	options.fzPic = options.picStyles.fz = fpMax; //Math.floor(fzPic)
	options.fzText = options.labelStyles.fz = fzMax; // Math.floor(fz);
	options.szPic = { w: wi, h: hi };

	for (const item of items) {
		let ui = lGet(item);
		mStyleX(ui.div, { wmin: wi, hmin: hi });
		// mStyleX(ui.dPic, { fz: hi/2 }); 
		mStyleX(ui.dPic, { fz: fpMax });
		mStyleX(ui.dLabel, { fz: fzMax });
	}
	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		console.log('vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontsize(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		console.log('fonts set to', fz, fzPic);
		console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}


	return [items, options];
}



function _correctFlexGrid(items, options, dGrid) {
	return;
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
			if (p < 1) break;
		}

		while (isOverflown(dGrid)) {
			console.log('hallo')
			let tx = 1, px = 0;
			_reduceFontsBy(tx, px, items, options);
			if (options.fzText < 4) break;
		}
	}

}
function _makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', border: '5px solid green', box: true
	});
	//for (const it of items) { mStyleX(lDiv(it), { flex: '0 0' }); }
	//setTimeout(() => _correctFlexGrid(items, options, dGrid), 10);
}
// BROKEN!!!

function sample_fill_area_flex_uniform(N) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 200, h: 100 }, isRegular: false, isUniform: true, fillArea: true };
	_extendOptions_0(dArea, options);

	//console.log('fzPic',options.fzPic,'fz',options.fzText);

	let n = isdef(N) ? N : chooseRandom(range(1, 50)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	// let f = getFitting(items, options);
	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	//console.log('fzPic',options.fzPic,'fz',options.fzText);
	// options.outerStyles.h=options.szPic.h;
	// options.outerStyles.w=options.szPic.w;
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	options.szPic = { w: options.area.w / options.cols, h: options.area.h / options.rows };
	//console.log('fonts vor set', options.fzPic, options.fzText);
	_setRowsColsSize(options);
	//console.log('fonts nach set', options.fzPic, options.fzText);
	for (const item of items) {
		let live = lGet(item);
		if (options.isUniform) {
			mStyleX(live.div, { w: options.szPic.w, h: options.szPic.h, margin: options.gap / 2, padding: options.padding / 2 });
		} else {
			mStyleX(live.div, { margin: options.gap / 2, padding: options.padding });

			//es gibt noch mehr platz!
			//versuche zu grown!
		}
		mStyleX(live.dLabel, { fz: options.fzText });
		mStyleX(live.dPic, { fz: options.fzPic });
	}


	_makeFlexGrid(items, options, dGrid);

	//console.log('options', options)
	//console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	//console.log('============>SUM', options.labelSum);
}


//#region helpers.js aus ZAZ
function adjustToItemSize(options, w, h, wfix, hfix, adjustFont = true) {
	//wfix... no/undef,min,max,yes =>outerStyles.wmin,wmax,w or dont set it
	options.szPic.w = w;
	if (isdef(h)) options.szPic.h = h; else h = options.szPic.h; //h unchanged!
	if (isdef(wfix)) {
		if (wfix == 'min') options.outerStyles.wmin = w;
		else if (wfix == 'max') options.outerStyles.wmax = w;
		else options.outerStyles.w = w;
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

		let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
		let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

		if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

		fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);


		console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

		options.fzPic = options.picStyles.fz = Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	}

}
function extendOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	_extendOptions_0(dArea, options, defOptions);
}
function getOptionsSize(dArea, options = {},) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	return _extendOptions_0(dArea, options, defOptions);
}

function getOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	return _extendOptions_0(dArea, options, defOptions);
}




function getOptionsFixedPicSize(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		maxlen: 14, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	options.fzText = options.showLabels ? 20 : 0;
	options.fzPic = options.showLabels ? 60 : 70;

	options = _extendOptions_0(dArea, options, defOptions);

	options.outerStyles = mergeOverride(options.outerStyles,
		{ w: options.szPic.w, h: options.szPic.h });

	return options;
}


//#region layout.js
function _makeGridGrid(items, options, dGrid) {
	//code grid layout:
	mStyleX(dGrid, {
		display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
}
function makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', gap: options.gap, border: '5px solid red', box: true
	});
	for (const it of items) { mStyleX(lDiv(it), { flex: '1' }); }
	setTimeout(() => correctFlexGrid(items, options, dGrid, false), 10);
}
function correctFlexGrid(items, options, dGrid, done) {
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
		//console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			//console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		}
		if (!done) setTimeout(() => correctFlexGrid(items, options, dGrid, true), 10);
	}

}
function makeNoneGrid(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }
	mStyleX(dGrid, { border: '5px solid blue', box: true })
	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		//console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		//console.log('options',options.fzPic,options)
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		let newGap = Math.ceil(options.gap / 2);
		while (ov > 0) {

			//let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			//let newGap = Math.ceil(Math.max(1, options.gap / 2 - pad));
			//console.log('gap', options.gap / 2, 'newGap', newGap)
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
function calcRowsCols(num, rows, cols) {
	//=> code from RSG testFactory arrangeChildrenAsQuad(n, R);
	//console.log(num, rows, cols);
	const table = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
	};
	let shape = 'rect';
	if (isdef(rows) && isdef(cols)) {
		//do nothing!
	} else if (isdef(table[num])) {
		return table[num];
	} else if (isdef(rows)) {
		cols = Math.ceil(num / rows);
	} else if (isdef(cols)) {
		rows = Math.ceil(num / cols);
	} else if (num == 2) {
		rows = 1; cols = 2;
	} else if ([4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 49, 56, 64].includes(num)) {
		rows = Math.floor(Math.sqrt(num));
		cols = Math.ceil(Math.sqrt(num));
	} else if ([3, 8, 15, 24, 35, 48, 63].includes(num)) {
		let lower = Math.floor(Math.sqrt(num));
		console.assert(num == lower * (lower + 2), 'RECHNUNG FALSCH IN calcRowsCols');
		rows = lower;
		cols = lower + 2;
	} else if (num > 1 && num < 10) {
		shape = 'circle';
	} else if (num > 16 && 0 == num % 4) {
		rows = 4; cols = num / 4;
	} else if (num > 9 && 0 == num % 3) {
		rows = 3; cols = num / 3;
	} else if (0 == num % 2) {
		rows = 2; cols = num / 2;
	} else {
		rows = 1; cols = num;
	}
	//console.log(rows, cols, shape);
	return { rows: rows, cols: cols, recommendedShape: shape };
}
function calcRowsColsSize(n, wCont, hCont, percentGap = 10, rows = null, cols = null, wpMin = 50, hpMin = 50, wpMax = 200, hpMax = 200) {
	let dims = calcRowsCols(n, rows, cols);
	if (dims.rows < dims.cols && wCont < hCont) { let hlp = dims.rows; dims.rows = dims.cols; dims.cols = hlp; }
	let hpic = hCont / dims.rows;
	let wpic = wCont / dims.cols;

	let gap = options.gap = Math.min(wpic, hpic) * percentGap / 100;
	wpic -= gap * 1.25; hpic -= gap * 1.25;

	wpic = Math.max(wpMin, Math.min(wpic, wpMax));
	hpic = Math.max(hpMin, Math.min(hpic, hpMax));
	return [wpic, hpic, gap, dims.rows, dims.cols];
}


//#region fitting.js
function getFitting(items, options) {

	let mimi = arrMinMax(items, x => x.label.length);
	let longestLabelLen = options.longestLabelLen = mimi.max;
	options.indexOfLongestLabelItem = mimi.imax;

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
	if (isdef(options.longestLabelLen)) fzText1 = (wb / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7);
	else fzText1 = 0;

	fzPic1 = Math.min(wb / 1.3, (hb - fzText1 * 1.2) / 1.3);

	if (fzPic1 < fzText1 * 2) { fzText1 = Math.floor(hb / 4); fzPic1 = fzText1 * 2; }
	//else if (fzPic1 > fzText1 * 4) { fzPic1 = Math.floor(Math.min(hb - fzText1 * 1.5, fzText1 * 3)); }

	options.fzText = options.labelStyles.fz = Math.min(40, fzText1);
	options.fzPic = options.picStyles.fz = Math.min(160, fzPic1);
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };
	options.isRegular = rows * cols == items.length;
	options.isCrowded = options.gap < 3;
	return fitting;
}
function bestRowsColsCombinedRatio(items, options, res) {
	let wa = options.area.w, ha = options.area.h, wp = options.szPic.w, hp = options.szPic.h;
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

	let maxcols = 0, maxrows = 0, wn = options.szPic.w, hn = options.szPic.h, wb, hb, gpix;
	while (maxcols * maxrows < n) {
		gpix = Math.round(wn * options.percentGap / 100);
		options.gap = gpix;
		wb = wn + gpix;
		hb = hn + gpix;

		maxcols = Math.floor(options.w / wb);
		maxrows = Math.floor(options.area.h / hb);
		if (maxcols * maxrows < n) {
			wn *= .9;
			hn *= .9;

		}

	}
	options.szPic = { w: wn, h: hn };

	console.log('maxcols', maxcols, options.w, '\nmaxrows', maxrows, options.area.h, '\nszPic', options.szPic, wb, 'gap', gpix)
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

	let maxcols = 0, maxrows = 0, wn = options.szPic.w, hn = options.szPic.h, wb, hb, gpix;
	while (maxcols * maxrows < n) {
		gpix = Math.round(wn * options.percentGap / 100);
		options.gap = gpix;
		wb = wn + gpix;
		hb = hn + gpix;

		maxcols = Math.floor(options.w / wb);
		maxrows = Math.floor(options.area.h / hb);
		if (maxcols * maxrows < n) {
			wn *= .9;
			hn *= .9;

		}

	}
	options.szPic = { w: wn, h: hn };

	console.log('maxcols', maxcols, options.w, '\nmaxrows', maxrows, options.area.h, '\nszPic', options.szPic, wb, 'gap', gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function getSLCombis(n, onlyRegular = false, addColsRows_cr = false) {
	let sq = Math.ceil(Math.sqrt(n));
	let res = [];
	for (let i = 1; i <= sq; i++) {
		let s = i;
		let l = Math.ceil(n / s);
		if (s <= l && s * l >= n) res.push({ s: s, l: l });
	}
	//console.log('res',res)
	if (onlyRegular) res = res.filter(x => x.s * x.l == n);

	if (addColsRows_cr) {
		let resX = [];
		for (const res1 of res) {
			resX.push({ rows: res1.s, cols: res1.l, s: res1.s, l: res1.l, sum: res1.s + res1.l });
			if (res1.s != res1.l) resX.push({ rows: res1.l, cols: res1.s, s: res1.s, l: res1.l, sum: res1.s + res1.l });
		}
		sortBy(resX, 'rows');
		sortBy(resX, 'sum');

		return resX;
	}

	return res;
}

//#endregion

function makeFlexGrid1(items, options, dGrid) {
	//code flex layout

	mStyleX(dGrid, {
		display: 'flex',// 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'column wrap', gap: options.gap, border: '5px solid red', box: true
	});
	//for (const it of items) { mStyleX(lDiv(it), { flex: '1 0 auto' }); }
	//setTimeout(() => correctFlexGrid1(items, options, dGrid, false), 10);
}
function correctFlexGrid1(items, options, dGrid, done) {
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
		//console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			//console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		}
		if (!done) setTimeout(() => correctFlexGrid(items, options, dGrid, true), 10);
	}

}
function getFitting1(items, options) {

	let n = items.length; let res = n > 3 ? getSLCombis(n) : [{ s: 1, l: n }];
	//let best = bestRowsColsCombinedRatio(items, options, res); //must use options.sizingPriority!!!
	let best = _bestRowsColsFill(items, options);

	let cols = options.cols = best.cols;
	let rows = options.rows = best.rows;
	//console.log('best combi',best);

	let idealGap = .1;
	let wb = Math.min(options.area.w / cols, 400);
	let hb = Math.min(options.area.h / rows, 400);

	let gap = options.gap = Math.min(wb, hb) * idealGap;
	wb -= gap * 1.25; hb -= gap * 1.25;

	let fz, fzPic;
	fz = hb / 4;
	fzPic = fz * 3;

	// if (isdef(options.longestLabelLen)) fzText1 = (wb / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7);
	// else fzText1 = 0;

	// fzPic1 = Math.min(wb / 1.3, (hb - fzText1 * 1.2) / 1.3);

	// if (fzPic1 < fzText1 * 2) { fzText1 = Math.floor(hb / 4); fzPic1 = fzText1 * 2; }

	options.fzText = options.labelStyles.fz = fz; //Math.min(36, fzText1);
	options.fzPic = options.picStyles.fz = fzPic; //Math.min(160, fzPic1);
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };
	options.isRegular = rows * cols == items.length;
	options.isCrowded = options.gap < 3;
	return fitting;
}
function getOptionsFillContainer(dArea, szPic, fzPic, lang, fzText, luc, labelPos = 'bottom', minPadding = 0, minGap = 1, uniform = true) {
	let options = { area: getRect(dArea) };
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(fzText)) {
		//labels are present!
		options.showLabels = true;
		if (labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: fzText };
		if (nundef(fzPic)) fzPic = Math.floor(fzText * 4 * (luc == 'u' ? .7 : .6)); //taking 4 as min word length
	} else if (nundef(fzPic)) fzPic = 30;
	options.picStyles = { fz: fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true
	};

	//infer szPic if not given!
	if (nundef(szPic)) {
		if (isdef(fzText)) {
			//dann hab ich auch fzPic!!!
			let h = fzText * 1.14 + fzPic * 1.15 + minPadding * 2;
			//let w=

		}
	}
	options.szRatio = szPic.w / szPic.h;

	return options;
}

function zazTest11() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true, padding: 0, };
	_extendOptions_0(dArea, options);

	let n = chooseRandom(range(1, 50)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	let f = getFitting1(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	makeFlexGrid1(items, options, dGrid);

	// if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	// else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	// else _makeNoneGrid(items, options, dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

//this one works!
function zazTest10_fillNone() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions_0(dArea, options);

	let n = chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	_makeNoneGrid(items, options, dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('============>SUM', options.labelSum);
}

function zazTest10() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions_0(dArea, options);

	let n = chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	// options = getOptionsFillContainer(dArea, arguments[1]);
	// options.isRegular=false;
	// options.isUniform = false;
	// options.fillArea = true;

	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else _makeNoneGrid(items, options, dGrid); //best if not regular
	// else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	// else _makeFlexGrid(items, options, dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest08_fillArea_BROKEN() {
	// let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	let n = 117;// chooseRandom([2, 3, 4, 6]);
	dTitle.innerHTML = 'N=' + n;

	let dArea = getMainAreaPercent(dTable, 'random', 80, 80); //getMainAreaPadding(dTable, 2, 'silver');
	dArea.id = 'dArea';
	let options = getOptionsFillContainer(dArea);

	console.log(options)

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) {
		//_makeGridGrid(items, options, dGrid); //best if have reg option
		mStyleX(dGrid, {
			display: 'grid', 'grid-template-columns': `repeat(${options.cols}, auto)`, gap: options.gap,
			border: '5px solid yellow', box: true
		});
	} else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

function _makeNoneGrid_vor_cleanup(items, options, dGrid) {
	options.szPic = { w: options.area.w / options.cols, h: options.area.h / options.rows };
	console.log('fonts vor set', options.fzPic, options.fzText)
	_setRowsColsSize(options);
	console.log('fonts nach set', options.fzPic, options.fzText)
	for (const item of items) {
		let live = lGet(item);
		if (options.isUniform) {
			mStyleX(live.div, { w: options.szPic.w, h: options.szPic.h, margin: options.gap / 2, padding: options.padding / 2 });
		} else {
			mStyleX(live.div, { margin: options.gap / 2, padding: options.padding });

			//es gibt noch mehr platz!
			//versuche zu grown!
		}
		mStyleX(live.dLabel, { fz: options.fzText });
		mStyleX(live.dPic, { fz: options.fzPic });
	}

	mStyleX(dGrid, { padding: 0, border: '5px solid blue', box: true })
	let ov = getVerticalOverflow(dGrid);
	console.log('overflow:', ov);
	//return;
	if (!options.isUniform) {
		console.log('in makeNoneGrid!!!')
		_tryGrow(items, options);
	}

	// let [fz,fzPic]=_sizeToFonts(options);
	// console.log('haaaaaaaaaaaaaa',options.padding,options.gap);
	// options.padding=100;options.gap=50;
	// for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.padding/2 }); }
	// mStyleX(dGrid, { border: '5px solid blue', box: true })
	// let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		console.log('overflow!', ov); return;
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

function sample_fill_area_v0() {

	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	let options = { szPic: { w: 200, h: 100 }, isRegular: false, isUniform: false, fillArea: true, padding: .01, };
	_extendOptions_0(dArea, options);

	let n = 117;// chooseRandom(range(1,200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsFill(items, options);
	//console.log('options', options.fzText, options.fzPic, options.szPic);
	_setRowsColsSize(options);
	//console.log('options', options.fzText, options.fzPic, options.szPic);

	let f = getFitting1(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2, padding: options.gap }, 'dGrid');
	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	// _makeGridGrid(items, options, dGrid);
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeNoneGrid(items, options, dGrid);
	console.log('options', options)
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

}


function zazTest09() {
	//just options
	let options = _genOptions({ n: 24, wper: 80, hper: 80, szPic: { w: 120, h: 120 }, padding: .01, gap: .02 });

	[options.rows, options.cols] = [4, 6];

	let items = options.items;

	// let bestCombi = nu_bestRowsColsSize(items, options);
	_setRowsColsSize(options);

	makeItemDivs(items, options);
	let dGrid = mDiv(options.dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	_makeGridGrid(items, options, dGrid);

	console.log(options)
}
function zazTest07_regularUniform_givenPicSizeAndArea_minimizeGridHeight_preservePicRatio() {
	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = {
		keyset: 'lifePlus', maxlen: 18, lang: 'D', 'luc': 'c',
		szPic: { w: 200, h: 200 }, padding: .025, gap: .1, isRegular: true, isUniform: true,
	};
	let items = genItems(n, options);
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	//let d=mDiv100(dArea,{bg:'green'});	return;

	_extendOptions_0(dArea, options);

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
function zazTest06_maxPicSize() {
	let n = chooseRandom(range(2, 14));//[2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = { keyset: 'lifePlus', maxlen: 18, lang: 'D', 'luc': 'c', padding: .025, gap: .1, szPic: { w: 200, h: 200 } };
	let items = genItems(n, options);

	let dArea = getMainAreaPercent(dTable, null, 100, 100, 'dArea');

	extendOptions(dArea, options);
	//console.log(options)

	let f = getFitting(items, options);

	console.log('fitting', f)

	adjustToItemSize(options, 200, 200, 'max', 'max');

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { fz: 2, padding: options.gap }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
	// if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	// else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	// else makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)

	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest05() {
	let n = chooseRandom(range(2, 200, 4));//[2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	let options = getOptionsFillContainer(dArea, arguments[1]);

	console.log(options)

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)

	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function zazTest04() {

	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: chooseRandom(['C', 'S']),
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 10,
		isRegular: true,
		showLabels: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	let [wp, hp, gap, rows, cols] = calcRowsColsSize(n, options.area.w, options.area.h, percentGap = 10);
	options.gap = gap;
	let fw = wp / options.szPic.w;
	let fh = 1;

	dTitle.innerHTML = 'N=' + options.N;

	options.outerStyles.w = options.szPic.w = wp;
	if (hp < options.szPic.h) { fh = hp / options.szPic.h; options.outerStyles.h = options.szPic.h = hp; }
	options.rows = rows;
	options.cols = cols;
	let fmin = Math.min(fw, fh);
	if (fmin != 1) {
		options.labelStyles.fz = options.fzText = options.fzText * fmin;
		options.picStyles.fz = options.fzPic = options.fzPic * fmin;
	}

	// console.log('gap', options.gap)
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { border: '5px solid yellow', box: true, fz: 2 }, 'dGrid');

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		'justify-items': 'center', wmax: options.w, overflow: 'hidden', padding: options.gap,
	});

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

}
function zazTest03() {

	let n = chooseRandom([36]); //2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: chooseRandom(['C', 'S']),
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 10,
		isRegular: true,
		showLabels: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	options.w = options.area.w;
	console.log('width is', options.w, options);
	[options.rows, options.cols, options.or] = bestRowsColsWFit(n, options);
	options.outerStyles.w = options.szPic.w;
	options.outerStyles.h = options.szPic.h;

	// console.log('gap', options.gap)
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { border: '5px solid yellow', box: true, fz: 2 }, 'dGrid');

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		'justify-items': 'center', wmax: options.w, overflow: 'hidden', padding: options.gap,
	});

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

}
function zazTest02() {
	createPageDivsFullVisibleArea({ top: { h: 30 }, title: { h: 30 } }, { bg: colorTrans('dimgray', .5) }, { footer: { h: 30 } }, {}); //table is above footer

	let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';
	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: 'S',
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 5,
		isRegular: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	options.w = options.area.w;
	//console.log('area width',options.w);
	//console.log(options);
	[options.rows, options.cols, options.or] = bestRowsColsWFit(n, options);

	//console.log('N', items.length, options);

	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { fz: 2, bg: 'blue', padding: 12 }, 'dGrid');

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: 12,
		border: '5px solid yellow', box: true, 'justify-items': 'center',
	});
}
function zazTest01(n, wper, hper, lang = 'E') { zazTest00(n, { wper: wper, hper: hper, lang: lang, maxlen: 18, luc: 'c', szPic: { w: 200, h: 100 } }); }
function zazTest00(n = 117, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
	createPageDivsFullVisibleArea({ top: { h: 30 }, title: { h: 30 } }, { bg: colorTrans('dimgray', .5) }, { footer: { h: 30 } }, {}); //table is above footer
	let dArea = getMainAreaPercent(dTable, 'random', wper, hper); //getMainAreaPadding(dTable, 2, 'silver');
	dArea.id = 'dArea';
	let options = getOptionsFillContainer(dArea, arguments[1]);

	console.log(options)

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id = 'dGrid'; mStyleX(dGrid, { fz: 2 })

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) _makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) _makeNoneGrid(items, options, dGrid); //best if not regular
	else _makeNoneGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)


	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}







function nu_adjustOptionsToRowsColsSize(bestCombi, options) {
	let [rows, cols, wb, hb, shape] = bestCombi;
	[options.rows, options.cols, options.or] = [rows, cols, shape];
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

	options.padding = _calcPadGap(options.padding, w, h);

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

function _getFirstFittingCombi(items, options, combis) {
	let wArea = options.area.w;
	let hArea = options.area.h;

	let wIdeal = options.szPicTest.w; //starts at wBrut!
	let hIdeal = options.szPicTest.h; //starts at wBrut!

	for (const res of combis) {
		let colsFit = wArea / res.cols > wIdeal;

		if (colsFit) {
			let rowsFit = hArea / res.rows > hIdeal;
			if (rowsFit) return res;

		}
		// console.log('test fit:', wArea / res.cols, wIdeal, colsFit, res.cols);
	}
	return null;
}
function _findBestCombiOrShrink(items, options, combis) {
	bestCombi = _getFirstFittingCombi(items, options, combis);
	if (isdef(bestCombi)) return bestCombi;
	//otherwise, have to reduca the size
	options.szPicTest = { w: .9 * options.szPicTest.w, h: .9 * options.szPicTest.h };
	return null;
}

function zazTest03_newSample() {

	let n = chooseRandom([36]); //2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42]);

	let dArea = getMainAreaPercent(dTable, null, 100, 100);
	dArea.id = 'dArea';

	options = getOptionsFixedPicSize(dArea, {
		N: n,
		maxlen: 12,
		keyset: 'lifePlus',
		lang: chooseRandom(['C', 'S']),
		luc: 'l',
		szPic: { w: 100, h: 100 },
		percentGap: 10,
		isRegular: true,
		showLabels: true,
	});
	let items = getItemsMaxLen(n, options.maxlen, options.keyset, options.lang, options.luc);

	options.w = options.area.w;
	console.log('width is', options.w, options);
	let [wpic, hpic, rows, cols] = calcRowsColsSize(n, options.area.w, options.area.h);
	options.rows = rows;
	options.cols = cols;
	options.szPic.w = wpic;
	options.outerStyles.w = options.szPic.w;
	options.outerStyles.h = options.szPic.h;

	// console.log('gap', options.gap)
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { border: '5px solid yellow', box: true, fz: 2 }, 'dGrid');

	mStyleX(dGrid, {
		display: 'inline-grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		'justify-items': 'center', wmax: options.w, overflow: 'hidden', padding: options.gap,
	});

	for (const it of items) { mAppend(dGrid, lDiv(it)); }

}


function bestRowsColsWFit_canOverflowHeight(n = 24, options) {// { w = 800, h = 500, szPic = { w: 100, h: 100 }, szMax = { w: 200, h: 200 }, isUniform = true, isRegular = true, keepRatio = true, rowRange=[2,4] } = {}) {
	//uniformSize, regularLayout,
	let combis = getSLCombis(n, true); //TODO: da sollt es schon so eine variant geben die nur regulars returned!
	combis.map(x => console.log(x));

	//how many fit in width?
	defOptions = { percentGap: 5, szPic: { w: 100, h: 100 }, w: 800 };
	options = mergeOverride(defOptions, options);

	//console.log(options);

	let gpix = Math.round(options.szPic.w * options.percentGap / 100);
	options.gap = gpix;
	let wb = options.szPic.w + gpix;
	let hb = options.szPic.h + gpix;

	let maxcols = Math.floor(options.w / wb);

	console.log('maxcols', maxcols, options.w, wb, gpix)
	let lCombis = combis.filter(x => x.l <= maxcols);

	console.log('landscape:'); lCombis.map(x => console.log(x));

	if (!isEmpty(lCombis)) { let c = arrLast(lCombis); return [c.s, c.l, 'L']; }
	let pCombis = combis.filter(x => x.s <= maxcols);

	console.log('portrait:'); pCombis.map(x => console.log(x));

	if (!isEmpty(pCombis)) { let c = arrLast(pCombis); return [c.s, c.l, 'L']; }

}
function getStandardOptions_SizingPriority(dArea, options) {
	// if (nundef(options.sizingPriority)) {
	// 	let fzp = valf(options.fzPic, null), fzt = valf(options.fzText, null), szp = valf(options.szPic, null);
	// 	if (szp || !fzt && !fzp) { options.sizingPriority = 'size'; }
	// 	else {
	// 		options.sizingPriority = 'font';
	// 		//if (!fzt) { options.fzText = fzp / 3; } else if (!fzp) { options.fzPic = 2 * options.fzText; }
	// 	}
	// }
	//by now I have 

	defOptions = { szPic: { w: 100, h: 100 }, showLabels: true, maxlen: 14, wper: 80, hper: 80, fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E', minPadding: 0, minGap: 1, uniform: true };
	options = isdef(options) ? mergeOverride(defOptions, options) : defOptions;
	options.area = getRect(dArea);
	options.aRatio = options.area.w / options.area.h;
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(options.fzText)) {
		//labels are present!
		if (options.labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: options.fzText };
		if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length
		//console.log('hab den pic font inferred:', options.fzPic, 'fzText', options.fzText)
	} else if (nundef(options.fzPic)) options.fzPic = 30;

	//console.log('fzText', options.fzText, 'fzPic', options.fzPic, 'szPic', options.szPic);

	options.picStyles = { fz: options.fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true, rounding: 6,
	};

	return options;
}
function makeNoneGrid_0(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }

	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		if (ov > 0) {
			let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			let newGap = Math.max(1, options.gap / 2 - pad);
			console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) {
				mStyleX(lDiv(it), { margin: newGap, padding: newGap / 2 });
			}
		}
	}
	// console.log('overflow',isOverflown(dGrid));
	// if (isOverflown(dGrid)){
	// 	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap/2, padding: 1 }); }
	// }
}
function correctFlexGrid_0(items, options, dGrid) {
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {
		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		// for (const it of others) {
		// 	if (coin()) continue;
		// 	// for (const it of others) {
		// 	// for (const it of arrTake(others, Math.floor(items.length / 2))) {
		// 	// for (const it of arrTake(items, Math.floor(items.length / 2))) {
		// 	let d = lDiv(it);
		// 	let r = getRect(d);
		// 	mStyleX(lDiv(it), { wmin: r.w + p });
		// }
		console.log('correctur!!!', p)
	}
}
function getOptionsFillContainer(dArea, szPic, fzPic, lang, fzText, luc, labelPos = 'bottom', minPadding = 0, minGap = 1, uniform = true) {
	let options = { area: getRect(dArea) };
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(fzText)) {
		//labels are present!
		options.showLabels = true;
		if (labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: fzText };
		if (nundef(fzPic)) fzPic = Math.floor(fzText * 4 * (luc == 'u' ? .7 : .6)); //taking 4 as min word length
	} else if (nundef(fzPic)) fzPic = 30;
	options.picStyles = { fz: fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true
	};

	//infer szPic if not given!
	if (nundef(szPic)) {
		if (isdef(fzText)) {
			//dann hab ich auch fzPic!!!
			let h = fzText * 1.14 + fzPic * 1.15 + minPadding * 2;
			//let w=

		}
	}
	options.szRatio = szPic.w / szPic.h;

	return options;
}
function getFittings(items, options) {
	let res = getRegularFits(items.length);

	let szu = options.szUniform;

	let fitting = [];
	let area = options.area;
	for (const r of res) {
		//calc max label for each column, then sum them up to get grid width!
		//this only makes sense for landscape!
		//if this is landscape, will take rows=r.s, cols=r.l
		let [wCols, wGrid] = maxSumColumns(items.map(x => x.rect.w), r.s, r.l);
		//console.log('for',r.l,'columns, grid width would be',wGrid);
		let wExtraN = area.w - wGrid;
		let wExtraL = area.w - r.l * szu.w;
		let hExtraL = area.w - r.s * szu.h;
		let wExtraP = area.w - r.s * szu.w;
		let hExtraP = area.w - r.l * szu.h;
		if (wExtraN >= 0 && hExtraL >= 0) { fitting.push({ type: 'N', wCols: wCols, rows: r.s, cols: r.l, wExtra: wExtraN, hExtra: hExtraL }) }
		if (wExtraL >= 0 && hExtraL >= 0) { fitting.push({ type: 'L', rows: r.s, cols: r.l, wExtra: wExtraL, hExtra: hExtraL }) }
		if (wExtraP >= 0 && hExtraP >= 0) { fitting.push({ type: 'P', rows: r.l, cols: r.s, wExtra: wExtraP, hExtra: hExtraP }) }
	}
	return fitting;
}


function calcRowsColsSizeNew(n, rows, cols, dParent, wmax, hmax, minsz = 50, maxsz = 200) {

	//berechne outer dims
	let ww, wh, hpercent, wpercent;
	if (isdef(dParent)) {
		let b = getBounds(dParent);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else if (isdef(wmax) && isdef(hmax)) {
		ww = wmax;
		wh = hmax;
		hpercent = .9;
		wpercent = .9;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .9;
		wpercent = .9;
	}
	let dims = calcRowsColsX(n, rows, cols);
	if (dims.rows < dims.cols && ww < wh) { let h = dims.rows; dims.rows = dims.cols; dims.cols = h; }
	let hpic = wh * hpercent / dims.rows;
	let wpic = ww * wpercent / dims.cols;
	hpic = Math.max(minsz, Math.min(hpic, maxsz));
	wpic = Math.max(minsz, Math.min(wpic, maxsz));
	return [wpic, hpic, dims.rows, dims.cols];
}
function calcRowsColsSize_0(n, rows, cols, dParent, wmax, hmax, minsz = 50, maxsz = 200) {

	//berechne outer dims
	let ww, wh, hpercent, wpercent;
	if (isdef(dParent)) {
		let b = getBounds(dParent);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else if (isdef(wmax) && isdef(hmax)) {
		ww = wmax;
		wh = hmax;
		hpercent = .9;
		wpercent = .9;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .56;
		wpercent = .64;
	}

	//console.log(ww,wh)
	let sz;//, picsPerLine;
	//if (lines <= 1) lines = undefined;

	//console.log('===>vor calcRowsColsX: rows='+rows,'cols'+cols);
	let dims = calcRowsColsX(n, rows, cols);
	//console.log('===>nach calcRowsColsX: rows='+rows,'cols'+cols);

	let hpic = wh * hpercent / dims.rows;
	let wpic = ww * wpercent / dims.cols;

	//console.log('hpic', hpic, 'wpic', wpic, ww, window.innerWidth, wh, window.innerHeight);
	sz = Math.min(hpic, wpic);
	//picsPerLine = dims.cols;
	sz = Math.max(minsz, Math.min(sz, maxsz)); //Math.max(50, Math.min(sz, 200));
	return [sz, dims.rows, dims.cols]; //pictureSize, picsPerLine];
}
function calcRowsColsX(num, rows, cols) {
	const tableOfDims = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
		40: { rows: 5, cols: 8 },
	};
	if (isdef(rows) || isdef(cols)) return calcRowsCols(num, rows, cols);
	else if (isdef(tableOfDims[num])) return tableOfDims[num];
	else return calcRowsCols(num, rows, cols);
}
function calcRowsCols_0(num, rows, cols) {
	//=> code from RSG testFactory arrangeChildrenAsQuad(n, R);
	//console.log(num, rows, cols);
	let shape = 'rect';
	if (isdef(rows) && isdef(cols)) {
		//do nothing!
	} else if (isdef(rows)) {
		cols = Math.ceil(num / rows);
	} else if (isdef(cols)) {
		rows = Math.ceil(num / cols);
	} else if (num == 2) {
		rows = 1; cols = 2;
	} else if ([4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 49, 56, 64].includes(num)) {
		rows = Math.floor(Math.sqrt(num));
		cols = Math.ceil(Math.sqrt(num));
	} else if ([3, 8, 15, 24, 35, 48, 63].includes(num)) {
		let lower = Math.floor(Math.sqrt(num));
		console.assert(num == lower * (lower + 2), 'RECHNUNG FALSCH IN calcRowsCols');
		rows = lower;
		cols = lower + 2;
	} else if (num > 1 && num < 10) {
		shape = 'circle';
	} else if (num > 16 && 0 == num % 4) {
		rows = 4; cols = num / 4;
	} else if (num > 9 && 0 == num % 3) {
		rows = 3; cols = num / 3;
	} else if (0 == num % 2) {
		rows = 2; cols = num / 2;
	} else {
		rows = 1; cols = num;
	}
	//console.log(rows, cols, shape);
	return { rows: rows, cols: cols, recommendedShape: shape };
}


function mCenterWrapper() {
	let html = `<dTable style="width: 100%;height:100%">
  <tr>
     <td style="text-align: center; vertical-align: middle;">
          <div></div>
     </td>
  </tr>
	</dTable>`;
	let elem = createElementFromHTML(html);
	let dOuter = mCreate('div');
	mAppend(dOuter, elem);
	let dInner = elem.children[0].children[0].children[0].children[0];
	//console.log(dOuter, dInner)
	return [dOuter, dInner];
}
function centerWrap(elem) {
	//console.log('_________',elem.parentNode)
	let dParent = elem.parentNode;

	let [outer, inner] = mCenterWrapper();
	mAppend(dParent, outer);
	mAppend(inner, elem);
}
function presentItems1(items, dParent, options = {}) {
	mStyleX(dParent, { display: 'flex', 'justify-content': 'center' });

	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let [rows, cols] = bestFitRowsCols(items.length);
	//console.log('best fit ergibt: rows',rows,'cols',cols)
	let [w, h, r, c] = calcRowsColsSizeNew(items.length, rows, cols);
	//console.log('calcRowsColsSize ergibt: rows',r,'cols',c);
	//console.log('N='+items.length,'r='+r,'c='+c,'w='+w,'h='+h)

	//eigentlich kann man erst jetzt die items stylen!

	c = cols;
	let gridStyles = { display: 'grid', 'grid-template-columns': `repeat(${c}, auto)` }; //${w}px)`};
	gridStyles = mergeOverride({ 'place-content': 'center', gap: 4, margin: 4, padding: 4 }, gridStyles);
	mStyleX(dGrid, gridStyles);

	let b = getRect(dGrid);

	return { dGrid: dGrid, sz: b };
}
function showItemsTableWrapper(items, dParent, options = {}) {

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let [dOuter, dInner] = mCenterWrapper();
		item.div = dOuter;

		if (options.labelTop) item.dLabel = mText(item.label, dInner, options.labelStyles);

		let dPic = item.dPic = mDiv(dInner, { family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom) item.dLabel = mText(item.label, dInner, options.labelStyles);

		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}


	return presentItems1(items, dParent, options);
}

function getBestUniformRegularFit1(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
	}
	let area = options.area;
	let aratio = area.w / area.h;
	let pratio = szMin.w / szMin.h;
	let best, mindiff = 1000, foundFit = false;
	for (const r of res) {
		//console.log(r);
		//console.log(r,wi);
		let ratio = r.c / r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(aratio - ratio);
		//console.log('ratio',ratio)
		if (rdiff < mindiff) {

			let fits = r.r * szMin.h <= area.h && r.c * szMin.w <= area.w;
			if (fits) {
				mindiff = rdiff;
				best = [r.r, r.c]; foundFit = true;
				//console.log('fitting:', best, fits);
			}
		}
	}
	return [best[0], best[1], foundFit];
}
function getBestUniformRegularFitTotalerBloedsinn(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
	}
	let area = options.area;
	let aratio = area.w / area.h;
	let pratio = szMin.w / szMin.h;
	let best, nofitBest, fitmindiff = 1000, mindiff = 1000, foundFit = false;
	for (const r of res) {
		//console.log(r);
		//console.log(r,wi);
		let ratio = r.c / r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(aratio - ratio);
		//console.log('ratio',ratio)
		if (rdiff < fitmindiff) {

			let fits = r.r * szMin.h <= area.h && r.c * szMin.w <= area.w;
			if (fits) {
				mindiff = fitmindiff = rdiff;
				best = [r.r, r.c]; foundFit = true;
				//console.log('fitting:', best, fits);
			} else {
				mindiff = rdiff;
				nofitbest = [r.r, r.c];
				//console.log('non-fitting:', nofitbest, false);
			}

			//
			//console.log('new best:',rdiff,best)
		}
	}
	return [best[0], best[1], foundFit];
}
function getBestUniformRegularFitJustLandscape(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
	}
	let area = options.area;
	let aratio = area.w / area.h;
	let pratio = szMin.w / szMin.h;
	let best, bestNoFit, minDiffFits = 100000, minDiffNoFit = 100000, foundFit = false;
	for (const r of res) {
		//console.log(r);
		//console.log(r,wi);
		let ratio = r.c / r.r;//r.c*wi.w/(r.r*wi.h);
		//console.log('ratio',ratio)
		rdiff = Math.abs(aratio - ratio);
		//console.log('ratio',ratio)
		let fits = false;
		if (rdiff < minDiffFits) {

			fits = r.r * szMin.h <= area.h && r.c * szMin.w <= area.w;
			if (fits) {
				console.log('FOUND A FIT!!!!!!!!!!!!')
				minDiffFits = rdiff;
				best = [r.r, r.c]; foundFit = true;
				//console.log('fitting:', best, fits);
			}
		}
		if (!fits && rdiff < minDiffNoFit) {
			minDiffNoFit = rdiff;
			bestNoFit = [r.r, r.c];
		}
	}
	if (nundef(best)) return [bestNoFit[0], bestNoFit[1], false];
	else return [best[0], best[1], foundFit];
}
