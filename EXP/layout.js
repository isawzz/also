function allRowsCols(n, rmin, rmax, cmin, cmax) {
	let res = [];
	for (let r = rmin; r <= rmax; r++) {
		for (let c = cmin; c <= cmax; c++) {
			if (r * c >= n) res.push({ r: r, c: c });
		}
	}
	return res;
}
function getRowsColsSize(n, area, szPicIdeal, szPicMax) {
	//call this function if n might not fit into a perfect grid!
	let res = allRowsCols(n, 1, 15, 1, n);
	if (nundef(szPicIdeal)) szPicIdeal={w:100,h:100};
	if (nundef(szPicMax)) szPicMax={w:200,h:200};
	//console.log('possible row/col', res,'A',area,'szIdeal',szPicIdeal);
	let restminmax = -100000; let bestRows, bestCols;
	for (const res1 of res) {
		aw = res1.c * szPicIdeal.w;
		ah = res1.r * szPicIdeal.h;
		restw = area.w - aw;
		resth = area.h - ah;
		restmin = Math.min(restw, resth);
		//console.log('A',aw,ah,'r/c',res1,restw,resth)
		if (restmin > restminmax) {
			restminmax = restmin;
			bestRows = res1.r; bestCols = res1.c;
			//console.log('new restminmax is', bestRows, bestCols, restminmax)
		}
	}


	if (bestRows * bestCols < n) bestRows += 1;

	let maxWPic = area.w / bestCols;
	let maxHPic = area.h / bestRows;
	let wUnit = maxWPic / szPicIdeal.w;
	let hUnit = maxHPic / szPicIdeal.h;

	//the smaller one is the unit
	let unit = Math.min(wUnit, hUnit);
	//this unit should be multiplied again by szPic
	let wPic = unit * szPicIdeal.w;
	let hPic = unit * szPicIdeal.h;

	if (wPic > szPicMax.w) wPic = szPicMax.w;
	if (hPic > szPicMax.h) hPic = szPicMax.h;

	return [bestRows, bestCols, { w: wPic, h: hPic }];
}
function layoutFlex(items, dParent, cols, gap) {
	let dGrid = mDiv(dParent);
	let i = 0;
	for (const item of items) {
		let ui = lGet(item).div;
		mAppend(dGrid, ui); //lGet(item).div);
		//ui.style.flexGrow = 1;
		//i += 1; if (0 == i % cols) { mLinebreak(dGrid, 0); }
	}
	let gridStyles = { display: 'flex', flex: '0 1 auto', 'flex-wrap': 'wrap' };//, gap:gap,'place-content': 'space-between'};//, 'justify-content': 'space-between' };
	// gridStyles = mergeOverride({ 'place-content': 'center', hgap: gap, vgap: gap / 2, margin: 4, padding: 4 }, gridStyles);
	gridStyles = mergeOverride({ 'place-content': 'center', gap: gap, margin: 4, padding: 4 }, gridStyles);
	//gridStyles = mergeOverride({ 'place-content': 'stretch', gap:gap, margin: 4, padding: 4 }, gridStyles);
	mStyleX(dGrid, gridStyles);
	return dGrid;
}
function layoutGrid(items, dParent, cols, gap) {
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, lGet(x).div));

	let gridStyles = { display: 'grid', 'grid-template-columns': `repeat(${cols}, auto)` };
	gridStyles = mergeOverride({ 'place-content': 'center', gap: gap, margin: 4, padding: 4 }, gridStyles);
	mStyleX(dGrid, gridStyles);

	return dGrid;
}

//#region v2
function presentItems2(items, dParent, options, callback) {

	//set options
	//darstellung von items in AREA: calculate dims
	let rect = getRect(dParent); //console.log(rect);
	let AREA = { w: valf(options.wArea, rect.w), h: valf(options.hArea, rect.h) };
	console.log('rect dMiddle', rect.w, rect.h, 'area', AREA);
	// let AREA = { w: god(options, wArea, 800), h: god(options, hArea, 600) };
	let sz = { w: valf(options.w, 160), h: valf(options.h, 200) }
	let szMax = { w: 250, h: 250 };
	let [rows, cols, szPic] = getRowsColsSize(items.length, AREA, sz, szMax);
	//console.log('_________N=' + items.length, 'AREA', AREA, 'szPic', sz, '\n==>rows=' + rows, 'cols=' + cols, 'szPic', szPic);
	//console.log('N=' + items.length);

	//let longestLabel = arrMinMax(items,x=>x.label.length).max;

	let gap = 12;
	let wCorrect = Math.round((1 + 1 / (cols > 2 ? cols - 2 : cols)) * gap);
	let hCorrect = Math.round((1 + 1 / (rows > 2 ? rows - 2 : rows)) * gap);
	let wOuter = szPic.w - wCorrect;
	let hOuter = szPic.h - hCorrect;

	let factorPic = (options.labelBottom == true || options.labelTop == true) ? 2 / 3 : 3 / 4;
	let fzPic = Math.min(wOuter, hOuter) * factorPic;
	let fzTextMin = valf(options.fzMin, 9);
	let fzText = Math.min(22, Math.max(fzTextMin, hOuter * 1 / 9));
	fzPic = Math.min(fzPic, hOuter - fzText - 16);
	//console.log(fzPic);

	defOptions = {
		// labelBottom: valf(options.labelBottom, true),
		// labelTop: valf(options.labelTop, false),
		picStyles: { fz: fzPic },
		labelStyles: { fz: fzText, align: 'center' },
		outerStyles: {
			wmin: wOuter, h: hOuter, margin: valf(options.margin, 0),
			bg: valf(options.bg, 'random'), fg: valf(options.fg, 'contrast'),
			rounding: valf(options.rounding, '1vw'),
			layout: 'fvcc',
		},
	};
	options = mergeOverride(defOptions, options);
	//item div production:
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let dOuter = mCreate('div');
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		let dLabel;
		if (options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic = mDiv(dOuter, { family: item.info.family });
		dPic.innerHTML = item.info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { div: dOuter, dPic: dPic, options: options });
		if (isdef(dLabel)) lAdd(item, { dLabel: dLabel })
	}

	console.log(options.layout, 'rows', rows, 'cols', cols);
	let needFlexGrid = options.layout == 'flex' || nundef(options.layout) && (rows * cols - items.length);

	mStyleX(dParent, {
		layout: 'fcc', flex: '0 0 auto',
		w: AREA.w, // needFlexGrid ? AREA.w : 'auto',
		h: AREA.h, // needFlexGrid ? 'auto' : AREA.h,
		//overflow: 'hidden', bg: 'black', border: '10px solid black',
		margin: 'auto', patop: 10
	});

	console.log('rows', rows, 'cols', cols)
	let dGrid = needFlexGrid ? layoutFlex(items, dParent, cols, gap) : layoutGrid(items, dParent, cols, gap);
	//let b = getRect(dGrid);console.log('grid size:',b,'AREA',AREA)

	setTimeout(presentationComplete2, 100, items, callback);
	return dGrid;
}
function presentationComplete2(items, callback) {
	items.map(x => x.rect = getRect(lGet(x).div));
	let sample = lGet(items[0]);
	if (isdef(sample.dLabel)) {
		let fz = sample.options.labelStyles.fz;
		//let dGrid = sample.div.parentNode;
		//console.log('fz is', fz)

		for (const item of items) {
			let ui = lGet(item);
			let w = item.rect.w;
			let wText = getRect(ui.dLabel).w;
			//console.log('w',w,'wText',wText);

			if (wText > w - 4) {
				//adjust div sizes: gut wenn opacity 0 war
				mStyleX(ui.div, { wmin: wText + 8 });

				//adjust font sizes:
				// mStyleX(ui.div,{w:w});
				// mStyleX(ui.dLabel,{fz:fz-1})

			}
		}

	}
	if (isdef(callback)) callback();

}


//#region v1
function presentItems1(items, dParent, options) {

	//set options
	//darstellung von items in AREA: calculate dims
	let rect = getRect(dParent); //console.log(rect);
	let AREA = { w: valf(options.wArea, rect.w), h: valf(options.hArea, rect.h) };
	console.log('rect dMiddle', rect.w, rect.h, 'area', AREA);
	// let AREA = { w: god(options, wArea, 800), h: god(options, hArea, 600) };
	let sz = { w: valf(options.w, 160), h: valf(options.h, 200) }
	let szMax = { w: 250, h: 250 };
	let [rows, cols, szPic] = getRowsColsSize(items.length, AREA, sz, szMax);
	//console.log('_________N=' + items.length, 'AREA', AREA, 'szPic', sz, '\n==>rows=' + rows, 'cols=' + cols, 'szPic', szPic);
	//console.log('N=' + items.length);

	//let longestLabel = arrMinMax(items,x=>x.label.length).max;

	let gap = 12;
	let wCorrect = Math.round((1 + 1 / (cols > 2 ? cols - 2 : cols)) * gap);
	let hCorrect = Math.round((1 + 1 / (rows > 2 ? rows - 2 : rows)) * gap);
	let wOuter = szPic.w - wCorrect;
	let hOuter = szPic.h - hCorrect;

	let factorPic = (options.labelBottom == true || options.labelTop == true) ? 2 / 3 : 3 / 4;
	let fzPic = Math.min(wOuter, hOuter) * factorPic;
	let fzTextMin = valf(options.fzMin, 9);
	let fzText = Math.min(22, Math.max(fzTextMin, hOuter * 1 / 9));
	fzPic = Math.min(fzPic, hOuter - fzText - 16);
	//console.log(fzPic);

	defOptions = {
		// labelBottom: valf(options.labelBottom, true),
		// labelTop: valf(options.labelTop, false),
		picStyles: { fz: fzPic },
		labelStyles: { fz: fzText, align: 'center' },
		outerStyles: {
			wmin: wOuter, h: hOuter, margin: valf(options.margin, 0),
			bg: valf(options.bg, 'random'), fg: valf(options.fg, 'contrast'),
			rounding: valf(options.rounding, '1vw'),
			layout: 'fvcc',
		},
	};
	options = mergeOverride(defOptions, options);
	//item div production:
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let dOuter = mCreate('div');
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		let dLabel;
		if (options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic = mDiv(dOuter, { family: item.info.family });
		dPic.innerHTML = item.info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { div: dOuter, dPic: dPic, options: options });
		if (isdef(dLabel)) lAdd(item, { dLabel: dLabel })
	}

	console.log(options.layout, 'rows', rows, 'cols', cols);
	let needFlexGrid = options.layout == 'flex' || nundef(options.layout) && (rows * cols - items.length);

	mStyleX(dParent, {
		layout: 'fcc', flex: '0 0 auto',
		w: AREA.w, // needFlexGrid ? AREA.w : 'auto',
		h: AREA.h, // needFlexGrid ? 'auto' : AREA.h,
		overflow: 'hidden', bg: 'black', border: '10px solid black',
		margin: 'auto', patop: 10
	});

	console.log('rows', rows, 'cols', cols)
	let dGrid = needFlexGrid ? layoutFlex(items, dParent, cols, gap) : layoutGrid(items, dParent, cols, gap);
	//let b = getRect(dGrid);console.log('grid size:',b,'AREA',AREA)

	setTimeout(presentationComplete1, 100, items);
	return dGrid;
}
function presentationComplete1(items) {
	items.map(x => x.rect = getRect(lGet(x).div));
	let sample = lGet(items[0]);
	if (nundef(sample.dLabel)) {
		dTable.style.opacity = 1;
		return; //items dont have label ui
	}
	let fz = sample.options.labelStyles.fz;
	//let dGrid = sample.div.parentNode;
	//console.log('fz is', fz)

	for (const item of items) {
		let ui = lGet(item);
		let w = item.rect.w;
		let wText = getRect(ui.dLabel).w;
		//console.log('w',w,'wText',wText);

		if (wText > w - 4) {
			//adjust div sizes: gut wenn opacity 0 war
			mStyleX(ui.div, { wmin: wText + 8 });

			//adjust font sizes:
			// mStyleX(ui.div,{w:w});
			// mStyleX(ui.dLabel,{fz:fz-1})

		}
	}

	dTable.style.opacity = 1;

}

//#region v0
function presentItems0(items, dParent, options) {

	//set options
	//darstellung von items in AREA: calculate dims
	let rect = getRect(dTableBackground); console.log(rect);
	let AREA = { w: valf(options.wArea, rect.w), h: valf(options.hArea, rect.h) };
	// let AREA = { w: god(options, wArea, 800), h: god(options, hArea, 600) };
	let sz = { w: valf(options.w, 160), h: valf(options.h, 200) }
	let szMax = { w: 250, h: 250 };
	let [rows, cols, szPic] = getRowsColsSize(items.length, AREA, sz, szMax);
	//console.log('_________N=' + items.length, 'AREA', AREA, 'szPic', sz, '\n==>rows=' + rows, 'cols=' + cols, 'szPic', szPic);

	//let longestLabel = arrMinMax(items,x=>x.label.length).max;

	let gap = 12;
	let wCorrect = Math.round((1 + 1 / (cols > 2 ? cols - 2 : cols)) * gap);
	let hCorrect = Math.round((1 + 1 / (rows > 2 ? rows - 2 : rows)) * gap);
	let wPic = szPic.w - wCorrect;
	let hPic = szPic.h - hCorrect;
	options = {
		labelBottom: true,
		picStyles: { fz: Math.min(wPic, hPic) * 2 / 3 },
		labelStyles: { fz: Math.min(22, Math.max(9, hPic * 1 / 9)), align: 'center' },
		outerStyles: {
			wmin: wPic, h: hPic, margin: valf(options.margin, 0),
			bg: valf(options.bg, 'random'), fg: valf(options.fg, 'contrast'),
			rounding: valf(options.rounding, '1vw'),
			layout: 'fvcc',
		},
	};
	//item div production:
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let dOuter = mCreate('div');
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		let dLabel;
		if (options.labelTop) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic = mDiv(dOuter, { family: item.info.family });
		dPic.innerHTML = item.info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { div: dOuter, dPic: dPic, options: options });
		if (isdef(dLabel)) lAdd(item, { dLabel: dLabel })
	}

	mStyleX(dParent, { layout: 'fcc', flex: '0 0 auto', w: AREA.w, h: AREA.h + 10, margin: 'auto', patop: 10 });//, overflow: 'hidden', bg: 'black', border: '10px solid black' });

	let needFlexGrid = options.layout == 'flex' && (rows * cols - items.length);

	//let dGrid = layoutGrid(items, dParent, cols, gap);
	let dGrid = needFlexGrid ? layoutFlex(items, dParent, cols, gap) : layoutGrid(items, dParent, cols, gap);
	//let b = getRect(dGrid);console.log('grid size:',b,'AREA',AREA)

	setTimeout(presentationComplete0, 100, items);

	// setTimeout(() => { items.map(x => x.rect = getRect(lGet(x).div)); }, 200);//erst jetzt ist es richtig!!!
}
function presentationComplete0(items) {
	items.map(x => x.rect = getRect(lGet(x).div));
	let sample = lGet(items[0]);
	let fz = sample.options.labelStyles.fz;
	let dGrid = sample.div.parentNode;
	console.log('fz is', fz)

	for (const item of items) {
		let ui = lGet(item);
		let w = item.rect.w;
		let wText = getRect(ui.dLabel).w;
		//console.log('w',w,'wText',wText);

		if (wText > w - 4) {
			//adjust div sizes: gut wenn opacity 0 war
			mStyleX(ui.div, { w: w + 8 });

			//adjust font sizes:
			// mStyleX(ui.div,{w:w});
			// mStyleX(ui.dLabel,{fz:fz-1})

		}
	}

	dTable.style.opacity = 1;
	//setTimeout(()=>dTable.style.opacity=1,1000);
	// let tbc=items.filter(x=>x.label.length == longestLabel);
	// console.log('tbc',tbc)
	// for(const item of tbc){
	// 	console.log(lGet(item).dLabel)
	// 	lGet(item).dLabel.style.fontSize = options.labelStyles.fz-2+'px';
	// }

}

