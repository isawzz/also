
function get3ColLine(dParent, idleft, idmiddle, idright, styles = {}) {
	let dOuter = mDiv(dParent);
	mStyleX(dOuter, { wmin: '100%', vpadding: 4, hpadding: 12, box: true, h: 30 });
	let dInner = mDiv(dOuter, { position: 'relative' });

	let l = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idleft)
	let r = mDiv(dInner, { w: '100%', align: 'center' }, idmiddle);
	let m = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idright)

	mStyleX(dOuter, styles);
	return dOuter;
}
function getRowsColsSize(n, area, szPicIdeal, szPicMax) {
	//call this function if n might not fit into a perfect grid!
	let res = allRowsCols(n, 1, 15, 1, n);

	let szPicDefined = isdef(szPicIdeal);
	let szPicMaxDefined = isdef(szPicMax);
	if (nundef(szPicIdeal)) szPicIdeal = { w: 100, h: 100 };
	if (nundef(szPicMax)) szPicMax = { w: 500, h: 500 };
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

	let wPic, hPic;
	if (szPicDefined) {
		let wUnit = maxWPic / szPicIdeal.w;
		let hUnit = maxHPic / szPicIdeal.h;

		//the smaller one is the unit
		let unit = Math.min(wUnit, hUnit);
		//this unit should be multiplied again by szPic
		wPic = unit * szPicIdeal.w;
		hPic = unit * szPicIdeal.h;
	} else {

		wPic = maxWPic;
		hPic = maxHPic;
		console.log('not defined', wPic, hPic)
	}


	if (wPic > szPicMax.w) wPic = szPicMax.w;
	if (hPic > szPicMax.h) hPic = szPicMax.h;

	return [bestRows, bestCols, { w: wPic, h: hPic }];
}

function correctOptions(options, rows, cols, szPic) {
	let gap = 8;
	let wCorrect = gap * (cols - 1) / cols; // gap*(cols+1); // Math.round((1 + 1 / (cols > 1 ? cols : cols+1)) * gap);
	let hCorrect = gap * (rows - 1) / rows; // Math.round((1 + 1 / (rows > 1 ? rows : rows+1)) * gap);
	let wOuter = szPic.w - wCorrect;
	let hOuter = szPic.h - hCorrect;

	let factorPic = (options.labelBottom == true || options.labelTop == true) ? 2 / 3 : 3 / 4;
	let fzPic = Math.min(wOuter, hOuter) * factorPic;
	let fzTextMin = valf(options.fzMin, 9);
	let fzText = Math.min(22, Math.max(fzTextMin, hOuter * 1 / 9));
	fzPic = Math.min(fzPic, hOuter - fzText - 16);
	//console.log(fzPic);

	szProps = options.canGrow ? { w: 'wmin', h: 'hmin' } : { w: 'w', h: 'h' };
	defOptions = {
		// labelBottom: valf(options.labelBottom, true),
		// labelTop: valf(options.labelTop, false),
		picStyles: { fz: fzPic },
		labelStyles: { fz: fzText, align: 'center' },
		outerStyles: {
			margin: valf(options.margin, 0),
			bg: valf(options.bg, 'random'), fg: valf(options.fg, 'contrast'),
			rounding: valf(options.rounding, '1vw'),
			layout: 'fvcc',
		},
		rows: rows,
		cols: cols,
		gap: gap,
	};
	defOptions.outerStyles[szProps.w] = wOuter;
	defOptions.outerStyles[szProps.h] = hOuter;
	options = mergeOverride(defOptions, options);
	return options;
}
function makeItemDivs(items, options) {
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

}
function layoutItems(items, dParent, options) {
	let [rows, cols, gap] = [options.rows, options.cols, options.gap];
	let AREA = getRect(dParent);

	console.log(options.layout, 'rows', rows, 'cols', cols);
	let needFlexGrid = options.layout == 'flex' || nundef(options.layout) && (rows * cols - items.length);

	mStyleX(dParent, {
		layout: 'fcc', //flex: '1 1 auto',
		//wmin: AREA.w, // needFlexGrid ? AREA.w : 'auto', //
		//h: needFlexGrid ? 'auto' : AREA.h, //AREA.h, // 
		//overflow: 'hidden', bg: 'black', border: '10px solid black',
		margin: 'auto',
	});

	let dGrid = needFlexGrid ? layoutFlex(items, dParent, cols, gap) : layoutGrid(items, dParent, cols, gap);
	return dGrid;
}
function nachkorrigieren(items, callback,options) {
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
				if (options.canGrow==true) {
					//adjust div sizes: gut wenn opacity 0 war
					mStyleX(ui.div, { wmin: wText + 8 });

					//adjust font sizes:
					// mStyleX(ui.div,{w:w});
					// mStyleX(ui.dLabel,{fz:fz-1})
				} else if (options.reduceFont==true) {
					//wie find ich einen font der da rein passt?
					//
					//let fzNew = 
					mStyleX(ui.dLabel, { fz: fz*.75 });
				} else {
					mStyleX(ui.dLabel, { 'text-overflow': 'ellipsis' });
				}

			}
		}

	}
	if (isdef(callback)) callback();

}


//#region old
function getTable2(dParent, styles, id) {
	let d = mDiv(dParent, styles, id);
	mClass(d, 'flexWrap');
	return d;
}
function getArea2(dParent, styles, id) {
	let defStyles = { display: 'inline-block' };
	styles = mergeOverride(defStyles, styles);
	let d = mDiv(dParent, styles, id);

	return d;
}