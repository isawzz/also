//grid layout
function testGrid(isUniform, fillArea = false, isRegular = true) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, 'dArea');

	//mStyleX(dArea,{display:'inline-flex','justify-content':'center','align-items':'center'});

	let options = { szPic: { w: 200, h: 200 }, isUniform: isUniform, fillArea: fillArea, isRegular: isRegular, };
	_extendOptions(dArea, options);
	let n = chooseRandom(_getRegularN(2, 100)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;
	presentGrid(dArea, items, options);
}
function presentGrid(dArea, items, options) {
	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	_setRowsColsSize(options);
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');
	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function sample_non_uniform_grid() { testGrid(false, false, true); }
function sample_regular_uniform_grid() { testGrid(true, false, true); }
function sample_non_uniform_grid_fill() { testGrid(false, true, true); }
function sample_regular_uniform_grid_fill() { testGrid(true, true, true); }
function sample_regular_uniform_grid2() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 80, 60, 'dArea');
	let options = { szPic: { w: 200, h: 200 }, isUniform: true, fillArea: false, isRegular: true, };
	_extendOptions(dArea, options);
	let n = chooseRandom(_getRegularN(2, 100)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;
	[options.rows, options.cols, options.szPic.w, options.szPic.h] = _bestRowsColsSize(items, options);
	_setRowsColsSize(options);
	makeItemDivs(items, options);
	let dGrid = mDiv(dArea, { hmax: options.area.h, fz: 2, padding: options.gap }, 'dGrid');
	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	_makeGridGrid(items, options, dGrid);
	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}

//plain divs layout
function sample_fill_area_none() {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');
	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions(dArea, options);
	let n = chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2 }, 'dGrid');
	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	_makeNoneGrid(items, options, dGrid);
}
//flex layout
function sample_fill_area_flex_uniform(n) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');
	let options = { maxlen: 12, szPic: { w: 100, h: 100 }, isRegular: false, isUniform: true, fillArea: true };
	_extendOptions(dArea, options);
	//console.log('options',options)
	if (nundef(n)) n = chooseRandom(range(1, 200));
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2 }, 'dGrid');
	mStyleX(dGrid, { display: 'flex', 'flex-flow': 'wrap', 'justify-content': 'space-between' });
	for (const item of items) { mAppend(dGrid, lDiv(item)); }//mStyleX(lDiv(item), { flex: '1 1 auto' }) }

	_makeNoneGrid(items, options, dGrid);

	
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
	// let max = 100, i = 0;
	// while (isOverflown(dGrid)) {
	// 	i += 1; if (i > max) { console.log('MAX REACHED!', options); break; }
	// 	_reduceSizeByFactor(items, options, .9);
	// }

}
function sample_fill_area_flex_non_uniform(N) {
	let dArea = getMainAreaPercent(dTable, YELLOW, 90, 50, 'dArea');
	let options = { szPic: { w: 100, h: 100 }, isRegular: false, isUniform: false, fillArea: true };
	_extendOptions(dArea, options);
	let n = isdef(N) ? N : chooseRandom(range(1, 200)); // 2, 20
	let items = genItems(n, options);
	dTitle.innerHTML = 'N=' + n;

	[options.rows, options.cols, options.szPic.w, options.szPic.h, options.or] = _bestRowsColsFill(items, options);
	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea, { fz: 2 }, 'dGrid');
	for (const item of items) { mAppend(dGrid, lDiv(item)); mStyleX(lDiv(item), { flex: '1' }) }
	_makeNoneGrid(items, options, dGrid);
	mStyleX(dGrid, { display: 'flex', 'flex-flow': 'row wrap', 'justify-content': 'space-between', 'align-content': 'stretch', border: '5px solid green', box: true, });
	while (isOverflown(dGrid)) {
		_reduceFontsBy(1, 1, items, options)
	}
}





