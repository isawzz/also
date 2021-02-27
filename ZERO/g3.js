function presentItems(items, dParent, options={}) {
	mStyleX(dParent, { display: 'flex', 'justify-content': 'center' });

	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let [rows,cols]=bestFitRowsCols(items.length);
	//console.log('best fit ergibt: rows',rows,'cols',cols)
	let [w,h,r,c] = calcRowsColsSizeNew(items.length,rows,cols);
	//console.log('calcRowsColsSize ergibt: rows',r,'cols',c);
	//console.log('N='+items.length,'r='+r,'c='+c,'w='+w,'h='+h)
	console.log('N='+items.length);

	//eigentlich kann man erst jetzt die items stylen!

	c=cols;
	let gridStyles = {display:'grid','grid-template-columns':`repeat(${c}, auto)`}; //${w}px)`};
	gridStyles = mergeOverride({ 'place-content': 'center', gap: 4, margin: 4, padding: 4 },gridStyles);
	mStyleX(dGrid, gridStyles);

	let b = getRect(dGrid);

	return { dGrid: dGrid, sz: b };
}
function calcBestEinteilungPerfectFit(n, area, szPic, szMax) {
	//call this function if you know n can be fit into a perfect grid!
	let res = idealRowsCols(n, 1, 15, 1, n);
	console.log('possible row/col', res);
	let restminmax = -1000; let bestRows, bestCols;
	for (const res1 of res) {
		aw = res1.c * szPic.w;
		ah = res1.r * szPic.h;
		restw = area.w - aw;
		resth = area.h - ah;
		restmin = Math.min(restw, resth);
		if (restmin > restminmax) {
			restminmax = restmin;
			bestRows = res1.r; bestCols = res1.c;
			console.log('new restminmax is', bestRows, bestCols, restminmax)
		}
	}
	let maxWPic = area.w / bestCols;
	let maxHPic = area.h / bestRows;
	let wUnit = maxWPic / szPic.w;
	let hUnit = maxHPic / szPic.h;

	//the smaller one is the unit
	let unit = Math.min(wUnit, hUnit);
	//this unit should be multiplied again by szPic
	let wPic = unit * szPic.w;
	let hPic = unit * szPic.h;

	if (wPic > szMax.w) wPic = szMax.w;
	if (hPic > szMax.h) hPic = szMax.h;

	return [bestRows, bestCols, { w: wPic, h: hPic }];
}
function getRowsColsSize(n, area, szPic, szMax) {
	//call this function if n might not fit into a perfect grid!
	let res = allRowsCols(n, 1, 15, 1, n);
	console.log('possible row/col', res);
	let restminmax = -1000; let bestRows, bestCols;
	for (const res1 of res) {
		aw = res1.c * szPic.w;
		ah = res1.r * szPic.h;
		restw = area.w - aw;
		resth = area.h - ah;
		restmin = Math.min(restw, resth);
		if (restmin > restminmax) {
			restminmax = restmin;
			bestRows = res1.r; bestCols = res1.c;
			console.log('new restminmax is', bestRows, bestCols, restminmax)
		}
	}

	if (bestRows*bestCols < n) bestRows+=1;

	let maxWPic = area.w / bestCols;
	let maxHPic = area.h / bestRows;
	let wUnit = maxWPic / szPic.w;
	let hUnit = maxHPic / szPic.h;

	//the smaller one is the unit
	let unit = Math.min(wUnit, hUnit);
	//this unit should be multiplied again by szPic
	let wPic = unit * szPic.w;
	let hPic = unit * szPic.h;

	if (wPic > szMax.w) wPic = szMax.w;
	if (hPic > szMax.h) hPic = szMax.h;

	return [bestRows, bestCols, { w: wPic, h: hPic }];
}











