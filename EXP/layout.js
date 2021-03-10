
//#region grid layouts grid,flex,non

function makeGridGrid(items, options, dGrid) {
	//code grid layout:
	let wcol=options.isUniform?'1fr':'auto';
	mStyleX(dGrid, {
		display: 'grid', 'grid-template-columns': `repeat(${options.cols}, ${wcol})`, gap: options.gap,
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
		console.log('options',options.fzPic,options)
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		let newGap=Math.ceil(options.gap/2);
		while (ov > 0) {
			
			//let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			//let newGap = Math.ceil(Math.max(1, options.gap / 2 - pad));
			console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) {mStyleX(lDiv(it), { fz:4, margin: newGap, padding: newGap / 2, rounding:0 }); }
			ov = getVerticalOverflow(dGrid);
			if (ov && newGap == 1) {
				for (const it of items) { mStyleX(lDiv(it), { margin: 0, padding: 0 }); }
				break;
			}
			newGap = Math.ceil(newGap/2);
		}

	}
}
//#endregion


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

	//let longestLabelLen = arrMinMax(items,x=>x.label.length).max;

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

	//let longestLabelLen = arrMinMax(items,x=>x.label.length).max;

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

	//let longestLabelLen = arrMinMax(items,x=>x.label.length).max;

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
	// let tbc=items.filter(x=>x.label.length == longestLabelLen);
	// console.log('tbc',tbc)
	// for(const item of tbc){
	// 	console.log(lGet(item).dLabel)
	// 	lGet(item).dLabel.style.fontSize = options.labelStyles.fz-2+'px';
	// }

}

