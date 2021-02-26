function layoutFlex1(items, dParent, or, gap) {
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, lGet(x).div));

	let gridStyles = { display: 'flex', flex: '0 1 auto', 'flex-wrap': 'wrap' };

	//nop: this line DOES NOT WORK AS EXPECTED!!!!!!
	if (or == 'v') { gridStyles['flex-flow']= 'column wrap';}// gridStyles['writing-mode'] = 'vertical-lr'; }
	gridStyles = mergeOverride({ 'place-content': 'center', gap: gap, margin: 4, padding: 4 }, gridStyles);
	mStyleX(dGrid, gridStyles);

	return dGrid;

}
function layoutGrid(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {

	let dims = calcRowsCols(elist.length, rows, cols);
	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${dims.cols}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!
	mStyleX(dGrid, parentStyle);
	let b = getRect(dGrid);
	return b;// { w: b.width, h: b.height };
}
function layoutFlex(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	// console.log(elist, elist.length)
	// let dims = calcRowsCols(elist.length, rows, cols);
	// console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	if (containerStyles.orientation == 'v') {
		// console.log('vertical!');
		// parentStyle['flex-flow']='row wrap';
		parentStyle['writing-mode'] = 'vertical-lr';
	}
	parentStyle.display = 'flex';
	parentStyle.flex = '0 0 auto';
	parentStyle['flex-wrap'] = 'wrap';
	mStyleX(dGrid, parentStyle);
	let b = getRect(dGrid);
	return b;// { w: b.width, h: b.height };

}


function layoutGrid(elist, dGrid, containerStyles, { rows, cols, sz, isInline = false } = {}) {
	console.log(elist.length,rows,cols,sz);rows=undefined;
	let [r,c,s] = calcRowsColsSize(elist.length, rows, cols);
	console.log('dims', r,c,s);

	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${6}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	mStyleX(dGrid, parentStyle);
	let b = getRect(dGrid);
	return { w: b.w, h: b.h };

}
function presentItems1(items, dParent, rows) {
	mStyleX(dParent, { display: 'flex', 'justify-content': 'center' })

	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = {};// { 'place-content': 'center', gap: 4, margin: 4, padding: 4 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: rows, isInline: true });

	return { dGrid: dGrid, sz: gridSize };
}
function layoutGrid(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	//console.log(elist, elist.length)
	let dims = calcRowsCols(elist.length, rows, cols);
	//console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${dims.cols}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	//console.log('parentStyle', parentStyle)

	mStyleX(dGrid, parentStyle);
	let b = getRect(dGrid);
	return { w: b.w, h: b.h };

}
function showItemsTableWrapper(items, dParent, options = {}) {

	let sz = idealItemSize(items, options);//labels are added!

	//assume items should all be visible
	let wOther = 50;
	let wc = window.innerWidth - wOther;
	let hOther = 250;
	let hc = window.innerHeight - hOther;
	let szCont = { w: wc, h: hc };

	let wi=sz.w,hi=sz.h,n=items.length;

	//total area: do I have to make the items smaller?
	let ai=wi*hi*n;
	let ac=wc*hc;

	console.log('area needed min:',ai,'\narea container:',ac);
	wfit=Math.floor(wc/wi);
	hfit=Math.floor(hc/hi);
	console.log('fit w:',wfit,'\nfit h:',hfit);
	//find perfect fit: 
	let res=ideaRowsCols(n,1,hfit,1,wfit);
	console.log('moeglich:',res);

	let rows=4;
	console.log('=====>n',n)
	if (isEmpty(res)) rows=Math.floor(Math.sqrt(n));
	else{
		let minmax=arrMinMax(res,x=>Math.abs(x.r-x.c));
		rows=res[minmax.imin].r;

	}

	// let rows=!isEmpty(res) ?res[0].r:Math.floor(Math.sqrt(n));

	//pre layout
	dParent = mDiv(dParent);
	// mStyleX(dParent,{display:'flex','align-items':'center'});
	// dParent = mDiv(dParent);
	// //mStyleX(dGrid, { display: 'grid', 'grid-template-columns': `repeat(auto-fit,${sz.w}px)` });
	// mStyleX(dParent, { display: 'grid', 'grid-template-columns': `repeat(3,${sz.w}px)` });

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let dOuter = item.div = mDiv(dParent);

		if (options.labelOnTop)		item.dLabel = options.label ? mText(item.label, dOuter, options.labelStyles) : null;

		let dPic = item.dPic = mDiv(dOuter, { family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (!options.labelOnTop)		item.dLabel = options.label ? mText(item.label, dOuter, options.labelStyles) : null;

		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}

	presentItems(items, dParent, rows);
	return dParent;
}
function preLayout(d, sz, options) {
	if (options.layout == 'grid1') {
		let cols = isdef(options.cols) ? options.cols : 'auto-fit';
		mStyleX(d, { display: 'inline-grid', 'grid-template-columns': `repeat(${cols},${sz.w}px)` });
	} else if (options.layout == 'grid2') {
		let rows = isdef(options.rows) ? options.rows : 'auto-fit';
		mStyleX(d, { display: 'inline-grid', 'grid-template-rows': `repeat(${rows},${sz.h}px)` });
	}else if (options.layout == 'grid3') {
		//let rows = isdef(options.rows) ? options.rows : 'auto-fit';
		mStyleX(d, { display: 'inline-grid', 'grid-template-cols': `repeat(3,1fr)` });
	}

}
function postLayout(d,options){
	if (options.layout == 'grid1') {
		mStyleX(d, { 'justify-content': 'center' });
	} else if (options.layout == 'grid2') {
		//mStyleX(d, { 'align-items': 'center' });
	}

}






