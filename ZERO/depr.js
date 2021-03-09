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
	options.rows=rows;
	options.cols=cols;
	options.szPic.w=wpic;
	options.outerStyles.w=options.szPic.w;
	options.outerStyles.h=options.szPic.h;

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
}function getOptionsFillContainer(dArea, szPic, fzPic, lang, fzText, luc, labelPos = 'bottom', minPadding=0, minGap=1, uniform=true) {
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
	if (nundef(szPic)){
		if (isdef(fzText)) {
			//dann hab ich auch fzPic!!!
			let h=fzText*1.14+fzPic*1.15+minPadding*2;
			//let w=

		}
	}
	options.szRatio=szPic.w/szPic.h;

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
		if (wExtraN >= 0 && hExtraL >= 0) { fitting.push({ type: 'N', wCols:wCols, rows: r.s, cols: r.l, wExtra: wExtraN, hExtra: hExtraL }) }
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
function presentItems1(items, dParent, options={}) {
	mStyleX(dParent, { display: 'flex', 'justify-content': 'center' });

	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let [rows,cols]=bestFitRowsCols(items.length);
	//console.log('best fit ergibt: rows',rows,'cols',cols)
	let [w,h,r,c] = calcRowsColsSizeNew(items.length,rows,cols);
	//console.log('calcRowsColsSize ergibt: rows',r,'cols',c);
	//console.log('N='+items.length,'r='+r,'c='+c,'w='+w,'h='+h)

	//eigentlich kann man erst jetzt die items stylen!

	c=cols;
	let gridStyles = {display:'grid','grid-template-columns':`repeat(${c}, auto)`}; //${w}px)`};
	gridStyles = mergeOverride({ 'place-content': 'center', gap: 4, margin: 4, padding: 4 },gridStyles);
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
