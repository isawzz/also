function allRowsCols(n, rmin, rmax, cmin, cmax) {
	let res = [];
	for (let r = rmin; r <= rmax; r++) {
		for (let c = cmin; c <= cmax; c++) {
			if (r*c>=n) res.push({ r: r, c: c });
		}
	}
	return res;
}
function getRowsColsSize(n, area, szPicIdeal, szPicMax) {
	//call this function if n might not fit into a perfect grid!
	let res = allRowsCols(n, 1, 15, 1, n);
	//console.log('possible row/col', res);
	let restminmax = -1000; let bestRows, bestCols;
	for (const res1 of res) {
		aw = res1.c * szPicIdeal.w;
		ah = res1.r * szPicIdeal.h;
		restw = area.w - aw;
		resth = area.h - ah;
		restmin = Math.min(restw, resth);
		if (restmin > restminmax) {
			restminmax = restmin;
			bestRows = res1.r; bestCols = res1.c;
			//console.log('new restminmax is', bestRows, bestCols, restminmax)
		}
	}

	if (bestRows*bestCols < n) bestRows+=1;

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
		mAppend(dGrid, lGet(item).div);
		i += 1; if (0 == i % cols) { mLinebreak(dGrid, 0); }
	}
	let gridStyles = { display: 'flex', flex: '0 1 auto', 'flex-wrap': 'wrap' };
	gridStyles = mergeOverride({ 'place-content': 'center', hgap: gap, vgap: gap / 2, margin: 4, padding: 4 }, gridStyles);
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

