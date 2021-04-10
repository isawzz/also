// OIL paradigm: options - items - layout
function sample00() {
	//options
	let n = _getRandomRegularN(2, 40);
	let options = {
		n: n,
		wper: 80, hper: 80, //dParent: dTable, is default!
		shufflePositions: true, repeat: 4, //colorKeys: ['red', 'blue', 'green'],
		szPic: { w: 100, h: 100 },
		showLabels: true, showPic: true, percentVertical: 30, maxlen: n < 10 ? 9 : 6,
		isUniform: true, fillArea: true, isRegular: true,
		handler: _standardHandler(modifyColorkey),
	};
	_extendOptions(options);

	//items
	let items = genItems(options.n, options);
	console.log('n', options.n, options.maxlen, options.N,)

	//dims&divs
	//grid
	present00(items, options);
	return [items, options];
}
function present00(items, options) {
	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	console.log('present00: rows', options.rows, 'cols', options.cols);

	let fzOrig = options.fzOrig = options.fzText;
	//console.log('fzText',options.fzText)
	_setRowsColsSize(options);

	if (options.fixTextFont == true) {
		_setTextFont(items, options, (options.fzOrig + options.fzText) / 2);
		//console.log('fzText',options.fzText)
	}

	makeItemDivs(items, options);
	//console.log('fzText',options.fzText)

	let dGrid = mDiv(options.dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());

	options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); }
	_makeGridGrid(items, options, dGrid);
	//console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	//console.log('fzText',options.fzText)
	// options.fzOrig = options.fzText;

	let wa = options.area.w, ha = options.area.h;
	let wi = (wa / options.cols) - 1.25 * options.gap;
	let hi = ha / options.rows - 1.25 * options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	let fzMax, fpMax;
	if (options.showLabels) {
		// fzMax = Math.floor(idealFontDims(options.longestLabel, wi - 2 * Math.ceil(options.padding), hi, 24).fz);
		fzMax = Math.floor(idealFontDims(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
		fpMax = options.showPic ? Math.min(hi / 2, wi * 2 / 3, hi - fzMax) : 0;
	} else { fzMax = 1; fpMax = options.showPic ? Math.min(hi * 2 / 3, wi * 2 / 3) : 0; }
	//let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	//console.log('===>pad', options.padding, 'wi', wi, idealFontDims(options.longestLabel, wi, hi, 24));
	//console.log('====>item size', wi, hi, 'fz', fzMax, 'fzPic', fpMax, 'lw', options.longestLabel, options.wLongest);
	//console.log('===>pad', options.padding, 'wi', wi, 'wnet',wi-2*options.padding, 'fz',fzMax );

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
	//console.log('fzText',options.fzText);

	if (options.fzText < options.fzOrig && options.fixTextFont == true) _setTextFont(items, options, (options.fzOrig + options.fzText) / 2)

	mStyleX(dGrid, { display: 'inline-grid', wmax: options.area.w, hmax: options.area.h });

	//_checkOverflow(items, options, dGrid);
	if (isOverflown(dGrid)) {
		let factor = .9;
		//console.log('OVERFLOWN!!!!!!!!!!!! vorher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
		w = options.szPic.w * factor;
		h = options.szPic.h * factor;
		fz = options.fzText * factor; // idealFontDims(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
		fzPic = options.fzPic * factor;
		options.fzPic = options.picStyles.fz = fzPic; //Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = fz; // Math.floor(fz);
		options.szPic = { w: w, h: h };
		options.padding *= factor;
		options.gap *= factor;
		mStyleX(dGrid, { gap: options.gap / 2 });
		for (const item of items) { let ui = lGet(item); mStyleX(ui.dLabel, { fz: fz }); mStyleX(ui.div, { padding: options.padding, w: w, h: h }); mStyleX(ui.dPic, { fz: fzPic }); }
		//console.log('fonts set to', fz, fzPic);
		//console.log('...nachher', options.szPic, options.fzText, options.fzPic, options.padding, options.gap);
	}

	//console.log('fzText',options.fzText)

	return [items, options];

}

function sample_idealGridLayout(showLabels = true, showPic = true) {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, null, 100, 70, getUID());

	let n = 10;// _getRandomRegularN(1, 56);
	let maxlen = n > 24 ? 9 : 15;
	let options = {
		shufflePositions: true, repeat: 4, //colorKeys: ['red', 'blue', 'green'],
		szPic: { w: 100, h: 100 },
		showLabels: showLabels, showPic: showPic, percentVertical: 30, maxlen: maxlen,
		isUniform: isUniform, fillArea: fillArea, isRegular: isRegular,
		handler: _standardHandler(modifyColorkey),
	};
	_extendOptions_0(dArea, options);

	//console.log('options', options);

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
		// fzMax = Math.floor(idealFontDims(options.longestLabel, wi - 2 * Math.ceil(options.padding), hi, 24).fz);
		fzMax = Math.floor(idealFontDims(options.wLongest, wi - 2 * options.padding, hi, 24).fz); //or longestLabel!
		fpMax = options.showPic ? Math.min(hi / 2, wi * 2 / 3, hi - fzMax) : 0;
	} else { fzMax = 1; fpMax = options.showPic ? Math.min(hi * 2 / 3, wi * 2 / 3) : 0; }
	//let fpMax = Math.min(hi / 2, wi * 2 / 3, hi - fzMax);
	//console.log('===>pad', options.padding, 'wi', wi, idealFontDims(options.longestLabel, wi, hi, 24));
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
		fz = options.fzText * factor; // idealFontDims(options.longestLabel, w, h, 22).fz; //options.fzText;// * factor;
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

//ideal grid layout shortcuts
function samplePicsAndText() { return sample_idealGridLayout(true, true) }
function sampleJustPics() { return sample_idealGridLayout(false) }
function sampleJustText() { return sample_idealGridLayout(true, false) }


//grid layout
function testGrid(isUniform, fillArea = false, isRegular = true) {

	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, getUID());

	//mStyleX(dArea,{display:'inline-flex','justify-content':'center','align-items':'center'});

	let options = { szPic: { w: 200, h: 200 }, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);
	let n = chooseRandom(_getRegularN(2, 100)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;
	presentGrid(dArea, items, options);
	return [items, options];
}
function presentGrid(dArea, items, options) {

	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);

	_setRowsColsSize(options);
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID());
	options.idGrid = dGrid.id;
	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	return dGrid;
}
function sample_non_uniform_grid() { return testGrid(false, false, true); }
function sample_regular_uniform_grid() { return testGrid(true, false, true); }
function sample_non_uniform_grid_fill() { return testGrid(false, true, true); }
function sample_regular_uniform_grid_fill() { return testGrid(true, true, true); }
function sample_regular_uniform_grid_fill_vCenter() {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, getUID());
	let options = { szPic: { w: 200, h: 200 }, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions_0(dArea, options);
	let n = chooseRandom(_getRegularN(2, 10));
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;
	dGrid = presentGrid(dArea, items, options);
	return [items, options];
}
function sample_regular_uniform_grid2() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, getUID());
	let options = { szPic: { w: 200, h: 200 }, isUniform: true, fillArea: false, isRegular: true, };
	_extendOptions_0(dArea, options);
	let n = chooseRandom(_getRegularN(2, 100)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;
	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	_setRowsColsSize(options);
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, getUID()); options.idGrid = dGrid.id;
	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log(options.idArea, options.idGrid)
	return [items, options];
}

//plain divs layout
function sample_fill_area_none() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, getUID());
	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions_0(dArea, options);
	let n = chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2 }, getUID()); options.idGrid = dGrid.id;
	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	_makeNoneGrid(items, options, dGrid);
	return [items, options];
}
//flex layout
function sample_fill_area_flex_uniform(n) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');
	let options = { maxlen: 12, szPic: { w: 100, h: 100 }, isRegular: false, isUniform: true, fillArea: true };
	_extendOptions_0(dArea, options);
	//console.log('options',options)
	if (nundef(n)) n = chooseRandom(range(1, 200));
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2 }, getUID()); options.idGrid = dGrid.id;
	mStyleX(dGrid, { display: 'flex', 'flex-flow': 'wrap', 'justify-content': 'space-between' });
	for (const item of items) { mAppend(dGrid, lDiv(item)); }//mStyleX(lDiv(item), { flex: '1 1 auto' }) }

	_makeNoneGrid(items, options, dGrid);

	realTimeIfTrue(() => _checkOverflow(items, options, dGrid), 1);

	return [items, options];

	// let max = 100, i = 0;
	// while (isOverflown(dGrid)) {
	// 	i += 1; if (i > max) { console.log('MAX REACHED!', options); break; }
	// 	_sizeByFactor(items, options, dGrid, .9);
	// }


	// n is items.length already!
	// let max=20,i=0;
	// while (!isOverflown(dGrid)) {
	// 	i += 1; if (i > max) { console.log('MAX REACHED!', options); break; }
	// 	options.gap += 1;
	// 	mStyleX(dGrid,{'column-gap':i});
	// 	//for (const item of items) { mStyleX(lDiv(item), { hmargin: options.gap / 2 }); }
	// }
	// mStyleX(dGrid,{'column-gap':i-1});
	// return;
	// console.log('gap', options.gap, 'margin', options.outerStyles.margin, lDiv(items[0]).style.margin);
	// let totalWidth = n * (options.gap + options.szPic.w);
	// let wGrid = options.area.w;
	// //wie oft geht wGrid in totalWidth: ceil ist rows
	// let rows = totalWidth / wGrid;
	// console.log('tw', totalWidth, 'wGrid', wGrid, 'es sind', rows, 'rows', options);
	// let wReal = Math.ceil(rows) * wGrid;
	// let wb = wReal / n;
	// let gapReal = wb - options.szPic.w;
	// console.log('old gap', options.gap / 2, 'newGap', gapReal / 2)
	// for (const item of items) { mStyleX(lDiv(item), { hmargin: 1 + gapReal / 2 }); }



	// for(const item of items){
	// 	let ui = lGet(item);
	// 	ui.div.style.minWidth=ui.div.style.width;
	// 	ui.div.style.width='auto';

	// }
	//_reduceFontsBy(-1,0,items,options);

	// mStyleX(dGrid, { display: 'flex', 'flex-flow': 'row wrap', 'justify-content': 'space-evenly', 'align-content': 'stretch', border: '5px solid green', box: true, });

}
function sample_fill_area_flex_non_uniform(N) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, getUID());
	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions_0(dArea, options);
	let n = isdef(N) ? N : chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2 }, getUID()); options.idGrid = dGrid.id;
	for (const item of items) { mAppend(dGrid, lDiv(item)); mStyleX(lDiv(item), { flex: '1' }) }
	_makeNoneGrid(items, options, dGrid);
	mStyleX(dGrid, { display: 'flex', 'flex-flow': 'row wrap', 'justify-content': 'space-between', 'align-content': 'stretch', border: '5px solid green', box: true, });
	while (isOverflown(dGrid)) {
		_reduceFontsBy(1, 1, items, options)
	}

	return [items, options];

}





