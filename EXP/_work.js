function sample_regular_uniform_grid_fill_vCenter_WORK() {
	let [isUniform, fillArea, isRegular] = [true, true, true];
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 70, getUID());

	let n = 30;// _getRandomRegularN(1, 56);// 8;// chooseRandom(_getRegularN(2, 10));
	let maxlen=n>24?9:15;
	let options = { percentVertical:30, maxlen:maxlen, szPic: { w: 200, h: 200 }, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions(dArea, options);
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
	let wi = (wa / options.cols) - 1.25*options.gap;
	let hi = ha / options.rows - 1.25*options.gap;
	wi = Math.min(200, wi); wi = Math.round(wi);
	hi = Math.min(200, hi); hi = Math.round(hi);
	// let fzMax = Math.floor(idealFontsize(options.longestLabel, wi-2*options.padding, hi, 24).fz);
	let fzMax = Math.floor(idealFontsize(options.wLongest, wi-2*options.padding, hi, 24).fz); //or longestLabel!
	console.log('===>pad',options.padding,'wi',wi,idealFontsize(options.longestLabel, wi, hi, 24));
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
