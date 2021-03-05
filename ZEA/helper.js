function get3ColLine(dParent, idleft, idmiddle, idright, styles = {}) {
	let dOuter = mDiv(dParent);
	mStyleX(dOuter, { wmin: '100%', vpadding: 4, hpadding: 10, box: true, h: 30 });
	let dInner = mDiv(dOuter, { position: 'relative' });

	let l = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idleft)
	let r = mDiv(dInner, { w: '100%', align: 'center' }, idmiddle);
	let m = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idright)

	mStyleX(dOuter, styles);
	return dOuter;
}
function getArea(dParent, styles, id) {
	let defStyles = { display: 'inline-block' };
	styles = mergeOverride(defStyles, styles);
	let d = mDiv(dParent, styles, id);

	return d;
}
function getMainAreaPadding(dParent, padding = 10, bg = 'grey', styles = {}) {
	let aTable = percentOf(dParent, 100, 100);
	//console.log('in getMainAreaPadding',aTable);
	//let defAreaStyles = { w: aTable.w - padding, h: aTable.h - padding/2, bg: bg, layout: 'hcc',  };
	let defAreaStyles = { margin: padding, w: aTable.w - 2 * padding, h: aTable.h - 2 * padding, bg: bg, layout: 'hcc', };
	clearElement(dParent);
	let dArea = getArea(dParent, mergeOverride(defAreaStyles, styles));
	return dArea;

}
function getMainAreaPercent(dParent, bg = 'grey', wPercent = 94, hPercent = 96) {

	clearElement(dParent);
	let aTable = percentOf(dParent, wPercent, hPercent); //getRect(dTable);
	let dArea = getArea(dParent, { w: aTable.w, h: aTable.h, layout: 'hcc', bg: bg, });
	return dArea;

}
function getDivisors(n) {
	let x = Math.floor(Math.sqrt(n));

	let res = [];
	for (let i = 2; i <= x; i++) {
		let q = n / i;
		if (q == Math.round(q)) res.push(i);
	}
	return res;
}
function getStandardOptions(dArea, options) {
	defOptions = { maxlen: 14, wper: 80, hper: 80, fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E', minPadding: 0, minGap: 1, uniform: true };
	options = isdef(options) ? mergeOverride(defOptions, options) : defOptions;
	console.log('options', options);
	options.area = getRect(dArea);
	options.aRatio = options.area.w/options.area.h;
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';
	if (isdef(options.fzText)) {
		//labels are present!
		options.showLabels = true;
		if (options.labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles = { fz: options.fzText };
		if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length
	} else if (nundef(options.fzPic)) options.fzPic = 30;
	options.picStyles = { fz: options.fzPic };
	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true
	};

	//infer szPic if not given!
	if (nundef(options.szPic)) {
		if (isdef(options.fzText)) {
			//dann hab ich auch fzPic!!!
			let h = options.fzText * 1.14 + options.fzPic * 1.15 + options.minPadding * 2;
			let w = options.fzText * options.maxlen * (options.luc == 'u' ? .7 : .6) + options.minPadding * 2;
			options.szPic = {w:w,h:h};
		}else{
			let h = options.fzPic * 1.15 + options.minPadding * 2;
			let w = options.fzPic * 1.25 + options.minPadding * 2;
			options.szPic = {w:w,h:h};
		}
	}
	options.szRatio = options.szPic.w / options.szPic.h;

	return options;
}
function getLargestItemSize(items) {
	items.map(x => x.rect = getRect(lDiv(x)));
	let minMaxWidth = arrMinMax(items, x => x.rect.w);
	let minMaxHeight = arrMinMax(items, x => x.rect.h);
	// let sumWidth = arrSum(items,x=>x.rect.w)
	// let sumHeight = arrSum(items,x=>x.rect.h)
	let sz = { w: minMaxWidth.max, h: minMaxHeight.max };
	return sz;
}
function diffAreaWithOrWithoutUniformSize(items, options) {
	let szUni = options.szUniform = getLargestItemSize(items);
	let itemsArea = items.length * szUni.w * szUni.h;
	let containerArea = (options.area.w - szUni.w) * (options.area.h - szUni.h);
}
function getMinUniformSize(items, options) {
	let szMax = getLargestItemSize(items);
	//console.log('____________szMax', szMax)
	//try if fits in uniform size!
	let itemsArea = items.length * szMax.w * szMax.h;
	let containerArea = (options.area.w - szMax.w) * (options.area.h - szMax.h);
	//console.log('aItems',itemsArea,'aCont',containerArea);
	if (containerArea > itemsArea) {
		//they would fit in uniform size!!!
		//make them uniform size!
		items.map(x => mStyleX(lDiv(x), { wmin: szMax.w, hmin: szMax.h }));

	}
	return szMax;
}
function getFittingMaximizeMinimalExtraSpace(fittings) {
	let maxmin = 0, fitting;
	for (const f of fittings) {
		let minExtra = Math.min(f.wExtra, f.hExtra);
		if (minExtra > maxmin) { maxmin = minExtra; fitting = f; }
	}
	return fitting;
}
function getFittingPreferLandscape(fittings) {
	let best = fittings.filter(x => x.type == 'L');
	if (!isEmpty(best)) {
		fittings = best;
		console.log(best);
	}
	return getFittingMaximizeMinimalExtraSpace(fittings);
}
function maxSumColumns(ws, rows, cols) {
	let max = {};
	//console.log(ws,rows,cols)
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (nundef(max[c])) max[c] = 0;
			//console.log('w',r,c,'is',ws[r*c+c])
			if (ws[r * c + c] > max[c]) max[c] = ws[r * c + c];
		}
	}
	//console.log('cols ws:',max);
	let arr = Object.values(max);
	let sum = arr.reduce((a, b) => a + b, 0);
	//console.log('===>arr',arr,'sum',sum);
	return [arr, sum];
}
function getSLCombis(n) {
	let sq = Math.ceil(Math.sqrt(n));
	let res = [];
	for (let i = 2; i <= sq; i++) {
		let s = i;
		let l = Math.ceil(n / s);
		if (s <= l && s * l >= n) res.push({ s: s, l: l });
	}
	//teste die 2 letzten ob sie gleich sind!

	return res;
}

function getOverFits(n) {
	let sq = Math.ceil(Math.sqrt(n));
	let res = [];
	for (let i = 2; i <= sq; i++) {
		let s = i;
		let l = Math.ceil(n / s);
		if (s <= l && s * l > n) res.push({ s: s, l: l });
	}
	//teste die 2 letzten ob sie gleich sind!

	return res;
}
function getRegularFits(n) { let fs = getDivisors(n); return fs.map(x => ({ l: n / x, s: x })); }
function getSimpleFit(items, options) {
	let res = getRegularFits(items.length);

	if (isEmpty(res)) { options.isPrime = true; return []; }

	let szu = options.szUniform;

	let fittings = [];
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
		if (wExtraN >= 0 && hExtraL >= 0) { fittings.push({ type: 'N', wCols: wCols, rows: r.s, cols: r.l, wExtra: wExtraN, hExtra: hExtraL }) }
		if (wExtraL >= 0 && hExtraL >= 0) { fittings.push({ type: 'L', rows: r.s, cols: r.l, wExtra: wExtraL, hExtra: hExtraL }) }
		if (wExtraP >= 0 && hExtraP >= 0) { fittings.push({ type: 'P', rows: r.l, cols: r.s, wExtra: wExtraP, hExtra: hExtraP }) }
	}
	return fittings;
}
function getSimpleUniFit(items, options) {
	let res = getRegularFits(items.length);
	let szu = options.szUniform;

	let fitting = [];
	let area = options.area;
	for (const r of res) {
		let wExtraL = area.w - r.l * szu.w;
		let hExtraL = area.w - r.s * szu.h;
		let wExtraP = area.w - r.s * szu.w;
		let hExtraP = area.w - r.l * szu.h;
		if (wExtraL >= 0 && hExtraL >= 0) { fitting.push({ type: 'L', rows: r.s, cols: r.l, wExtra: wExtraL, hExtra: hExtraL }) }
		if (wExtraP >= 0 && hExtraP >= 0) { fitting.push({ type: 'P', rows: r.l, cols: r.s, wExtra: wExtraP, hExtra: hExtraP }) }
	}
	return fitting;
}
function getBestUniformRegularFit(items, options) {
	let fs = getDivisors(items.length); //nur relevant wenn grid will!
	let szMin = options.szUniform;
	//console.log('all regular fit candidates:',fs);

	let res = [];
	for (const f of fs) {
		res.push({ c: items.length / f, r: f });
		res.push({ r: items.length / f, c: f });
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
function computeGap(options) {
	let gap = Math.min((options.area.w - options.cols * options.szUniform.w) / (options.cols),
		(options.area.h - options.rows * options.szUniform.h) / (options.rows));
	if (gap > 12) gap = 12; else if (gap < 1) gap = 1;
	return gap;
}
function layoutRegularUniformGrid(items, dGrid, options) {
	clearElement(dGrid);
	options.gap = computeGap(options);
	mStyleX(dGrid, { display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap });
	for (const it of items) mAppend(dGrid, lDiv(it));
}
function scaleFonts(items, options) {
	//how big do the items end up being?
	let wNet = (options.area.w / options.cols) - options.gap;
	let hNet = (options.area.h / options.rows) - options.gap;
	//wieviel bleibt uebrig zu uniform size?
	let wExtra = wNet / options.szUniform.w;
	let hExtra = hNet / options.szUniform.h;
	let minFact = Math.min(wExtra, hExtra);
	//console.log('scaleFonts: wExtra', wExtra, 'hExtra', hExtra)
	if (minFact > 1.1) {
		minFact = 1 + (minFact - 1) * 3 / 4;
		console.log('MOD:::', minFact, wExtra, hExtra, wNet, hNet)
		let fzTextNew, fzPicNew;
		let oldfPic = options.picStyles.fz;
		fzPicNew = Math.min(wNet * .7, hNet * 2 / 3);
		if (fzPicNew > oldfPic) {
			items.map(x => lGet(x).dPic.style.fontSize = '' + fzPicNew + 'px');
		}
		options.picStyles.fz = fzPicNew;

		if (nundef(options.showLabels)) return;
		items.map(x => { fzTextNew = scaleLabelFont(x, minFact, options); });//fzPicNew = scalePicFont(x, minFact, options); });
		//console.log('old fText',options.labelStyles.fz,'=>',fzTextNew,'old fPic',options.picStyles.fz,'=>',fzPicNew);
		options.labelStyles.fz = fzTextNew;

		// } else if (minFact < .99){
		// 	console.log('MOD:::', minFact, wExtra, hExtra, wNet, hNet)
		// 	let fzTextNew, fzPicNew;
		// 	items.map(x => { fzTextNew = scaleLabelFont(x, minFact, options); fzPicNew = scalePicFont(x, minFact, options); });
		// 	options.labelStyles.fz = fzTextNew;
		// 	options.picStyles.fz = fzPicNew;

	} else if (hExtra > 1.2) {
		//only scale pictures
		let fzPicNew;
		items.map(x => { fzPicNew = scalePicFont(x, hExtra, options); });
		//options.labelStyles.fz = fzTextNew;
		options.picStyles.fz = fzPicNew;
	}



}
function scaleLabelFont(item, scaleFactor, options) {
	return scaleFont(item, scaleFactor, options, 'labelStyles', 'dLabel');
}
function scalePicFont(item, scaleFactor, options) {
	return scaleFont(item, scaleFactor, options, 'picStyles', 'dPic');
}
function scaleFont(item, scaleFactor, options, prop, ui) {
	let fz = lookup(options, [prop, 'fz']);
	fz *= scaleFactor;
	//lookupSetOverride(options, [prop, 'fz'], fz);
	mStyleX(lGet(item)[ui], { fz: fz });
	return fz;
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







//#region nein wieder nix:3

function getSizeAndOptions(items, dParent, options = {}) {

	let N = items.length;
	let areaAvailable = valf(options.area, getRect(dParent));

	//area ratio w/h, pic ratio wPic/hPic, ratio cols/rows
	//each ratio could be square,portrait,landscape

	//area ratio is given!
	let raArea = areaAvailable.w / areaAvailable.h; //3

	//fuer pic ratio brauch ich: wunsch
	let raPic = 1; //100/70; //1

	//cols vs rows kann ich von den 2 vorhergehenden ausrechnen
	let cols = N * raPic / raArea; //1/3 * 12 = 4
	let rows = Math.ceil(N / cols);

	let genaueTeiler = getDivisors(N); //nur relevant wenn grid will!
	let szPic = { w: areaAvailable.w / cols, h: areaAvailable.h / rows };
	console.log('______ teiler von', N, genaueTeiler);
	console.log('area', areaAvailable, 'rows', rows, 'cols', cols, szPic);


	options = correctOptions(options, rows, cols, szPic);
	return options;
}

function getSizeAndOptions2(items, dParent, options = {}) {

	//zuerst ausrechnen wieviel ich MINDESTENS brauch pro pic

	let [r, c, sz] = getRowsColsSize(items.length, options.area);
	console.log('__________', r, c, sz)


	let minmax = arrMinMax(items, x => x.label.length);
	let longest = minmax.max;
	let avg = (minmax.max + minmax.min) / 2;

	//die ratio depends on ob ueberhaupt das longestLabel in gefahr ist!
	let ratio = avg / longest;
	let rParent = getRect(dParent);
	let wAvailable = valf(options.wArea, rParent.w);
	let wTryFit = Math.ceil(wAvailable * ratio);
	let diff = wAvailable - wTryFit;
	//let wItemMax = getSizeWithStyles(longestLabel,)

	//#region testing
	// let options = {
	// 	wItem:100,hItem:100,fz:32,
	// 	//wItem:{min:50,ideal:100,max:300},	hItem:{min:50,ideal:120,max:250},	fz:{min:8,ideal:32,max:40},
	// 	area:getRect(dArea),

	// }
	// maxItemSize,maxFontSize
	// idealItemSize,idealFontSize
	// minItemSize,minFontSize 
	// canItemWidthGrow
	// canItemHeighGrow
	// canAreaWidthGrow
	// canAreaHeightGrow
	// canLabelFontShrink (for individual items if do not fit!)
	//#endregion

	//let wTry, lay;
	//lay = valf(options.layout, undefined);
	let [wTry, lay] = [wTryFit, 'grid'];
	//let [wTry, lay] = [wTryFit + diff / 2, 'flex'];
	console.log('available', wAvailable, 'useToFit', wTry, 'h', options.hArea, 'layout', lay);
	let newOptions = { area: { w: wTry, h: options.area.h }, wAreaMax: wAvailable, layout: lay };
	options = mergeOverride(options, newOptions);

	//auf der table mach ich jetzt eine area in der die items ewew presented werden sollen
	//der genaue size der gebraucht wird ist schwer zu ermitteln
	//wuesste ich allerdings den genauen size, dann koennte ich 

	// let dArea = getArea(dTable, { wmin: options.area.w, hmin: options.area.h, layout: 'hcc', bg: 'violet' });

	//have items and options, can calculate sizes,row,cols

	let [rows, cols, szPic] = getRowsColsSize(items.length, options.area);
	options = correctOptions(options, rows, cols, szPic);
	return options;
}

function addSizingOptions(n, options) {
	//TODO: das soll beide next funcs incorporaten!
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
function makeItemDivs3(items, options) {
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

	let needFlexGrid = options.layout == 'flex' || nundef(options.layout) && (rows * cols - items.length);

	mStyleX(dParent, { layout: 'fcc', margin: 'auto', });


	let dGrid = needFlexGrid ? layoutFlex(items, dParent, options) : layoutGrid(items, dParent, options);
	return dGrid;
}
function layoutFlex(items, dParent, options = {}) {
	let [cols, gap, wAreaMax] = [options.cols, options.gap, options.wAreaMax];
	console.log('layoutFlex!')
	console.log('===>parent width:', dParent.style.width)
	let dGrid = mDiv(dParent);
	if (isdef(wAreaMax)) mStyleX(dGrid, { w: wAreaMax });
	let i = 0;
	for (const item of items) {
		let ui = lGet(item).div;
		mAppend(dGrid, ui); //lGet(item).div);
		//ui.style.flexGrow = 1;
		//i += 1; if (0 == i % cols) { mLinebreak(dGrid, 0); }
	}
	let gridStyles = { display: 'flex', flex: '0 1 auto', 'flex-wrap': 'wrap' };//, gap:gap,'place-content': 'space-between'};//, 'justify-content': 'space-between' };
	// gridStyles = mergeOverride({ 'place-content': 'center', hgap: gap, vgap: gap / 2, margin: 4, padding: 4 }, gridStyles);
	// gridStyles = mergeOverride({ 'place-content': 'center', gap: gap, margin: 4, padding: 4 }, gridStyles);
	gridStyles = mergeOverride({ 'place-content': 'center', gap: gap }, gridStyles);
	//gridStyles = mergeOverride({ 'place-content': 'stretch', gap:gap, margin: 4, padding: 4 }, gridStyles);
	mStyleX(dGrid, gridStyles);
	return dGrid;
}
function layoutGrid(items, dParent, options) {
	let [cols, gap, wAreaMax] = [options.cols, options.gap, options.wAreaMax];
	console.log('layoutGrid!')
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, lGet(x).div));

	let gridStyles = { display: 'grid', 'grid-template-columns': `repeat(${cols}, auto)` };
	// gridStyles = mergeOverride({ 'place-content': 'center', gap: gap, margin: 4, padding: 4 }, gridStyles);
	gridStyles = mergeOverride({ 'place-content': 'center', gap: gap }, gridStyles);
	mStyleX(dGrid, gridStyles);

	return dGrid;
}


function idealElemFontSize(item, fzmin) {
	let i = 0;
	let ui = lGet(item);
	let wParent = item.rect.w;
	let fz = ui.options.labelStyles.fz;
	//console.log('fz', fz, 'wParent', wParent);
	while (i < 100) {
		i += 1;
		//console.log('trying fz', tStyles);
		let wText = getRect(ui.dLabel).w;
		if (wText > wParent - 4) {
			fz -= 1;
			mStyleX(ui.dLabel, { fz: fz });
		} else break;
	}
	return fz;
}

function nachkorrigieren(items, callback, options) {
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
				if (options.canGrow == true) {
					//adjust div sizes: gut wenn opacity 0 war
					mStyleX(ui.div, { wmin: wText + 8 });

					//adjust font sizes:
					// mStyleX(ui.div,{w:w});
					// mStyleX(ui.dLabel,{fz:fz-1})
				} else if (options.reduceFont == true) {
					//wie find ich einen font der da rein passt?
					//
					let fzIdeal = idealElemFontSize(item);
					//console.log('fzChanged to', fzIdeal);
					// mStyleX(ui.dLabel, { fz: fz * .75 });
				} else {
					ui.dLabel.style.width = (w - 10) + 'px';
					mClass(ui.dLabel, 'truncate');
				}

			}
		}

	}
	if (isdef(callback)) callback();

}


//#region old
function getSizeAndOptions1(items, dParent, options = {}) {


	let [r, c, sz] = getRowsColsSize(items.length, options.area);
	console.log('__________', r, c, sz)


	let minmax = arrMinMax(items, x => x.label.length);
	let longest = minmax.max;
	let avg = (minmax.max + minmax.min) / 2;

	//die ratio depends on ob ueberhaupt das longestLabel in gefahr ist!
	let ratio = avg / longest;
	let rParent = getRect(dParent);
	let wAvailable = valf(options.wArea, rParent.w);
	let wTryFit = Math.ceil(wAvailable * ratio);
	let diff = wAvailable - wTryFit;
	//let wItemMax = getSizeWithStyles(longestLabel,)

	//#region testing
	// let options = {
	// 	wItem:100,hItem:100,fz:32,
	// 	//wItem:{min:50,ideal:100,max:300},	hItem:{min:50,ideal:120,max:250},	fz:{min:8,ideal:32,max:40},
	// 	area:getRect(dArea),

	// }
	// maxItemSize,maxFontSize
	// idealItemSize,idealFontSize
	// minItemSize,minFontSize 
	// canItemWidthGrow
	// canItemHeighGrow
	// canAreaWidthGrow
	// canAreaHeightGrow
	// canLabelFontShrink (for individual items if do not fit!)
	//#endregion

	//let wTry, lay;
	//lay = valf(options.layout, undefined);
	let [wTry, lay] = [wTryFit, 'grid'];
	//let [wTry, lay] = [wTryFit + diff / 2, 'flex'];
	console.log('available', wAvailable, 'useToFit', wTry, 'h', options.hArea, 'layout', lay);
	let newOptions = { area: { w: wTry, h: options.area.h }, wAreaMax: wAvailable, layout: lay };
	options = mergeOverride(options, newOptions);

	//auf der table mach ich jetzt eine area in der die items ewew presented werden sollen
	//der genaue size der gebraucht wird ist schwer zu ermitteln
	//wuesste ich allerdings den genauen size, dann koennte ich 

	// let dArea = getArea(dTable, { wmin: options.area.w, hmin: options.area.h, layout: 'hcc', bg: 'violet' });

	//have items and options, can calculate sizes,row,cols

	let [rows, cols, szPic] = getRowsColsSize(items.length, options.area);
	options = correctOptions(options, rows, cols, szPic);
	return options;
}

function layoutItems_messy(items, dParent, options) {
	let [rows, cols, gap] = [options.rows, options.cols, options.gap];
	let AREA = getRect(dParent);

	//console.log(options.layout, 'rows', rows, 'cols', cols);
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