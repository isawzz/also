function zazTest00(n = 144, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
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
	if (options.isRegular) makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	else makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)


	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}


function nu_zazTest07_regular() {
	let n = chooseRandom([2, 3, 4, 6, 8, 9]);
	//let n = chooseRandom([2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = {
		keyset: 'lifePlus', maxlen: 25, lang: 'D', 'luc': 'c',
		szPic: { w: 200, h: 200 }, minPadding:10, isRegular: true, isUniform: true,
	};
	let items = genItems(n, options);
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');

	//let d=mDiv100(dArea,{bg:'green'});	return;

	_extendOptions(dArea, options);

	let bestCombi = nu_bestRowsColsSize(items, options);
	nu_adjustOptionsToRowsColsSize(bestCombi, options);

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

function zazTest06_maxPicSize() {
	let n = chooseRandom(range(2, 14));//[2, 3, 4, 6, 8, 9, 12, 15, 16, 20, 24, 30, 36, 40, 42, 44, 48, 64, 72, 84, 100]);
	dTitle.innerHTML = 'N=' + n;

	let options = { keyset: 'lifePlus', maxlen: 18, lang: 'D', 'luc': 'c', minPadding: 4, szPic: { w: 200, h: 200 } };
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
	// if (options.isRegular) makeGridGrid(items, options, dGrid); //best if have reg option
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
	if (options.isRegular) makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	else makeFlexGrid(items, options, dGrid);
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
	[options.rows, options.cols, options.shape] = bestRowsColsWFit(n, options);
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
	[options.rows, options.cols, options.shape] = bestRowsColsWFit(n, options);

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
function zazTest00(n = 144, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
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
	if (options.isRegular) makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	else makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.log('options', options)


	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}












