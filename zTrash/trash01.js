function showItems(items, dParent, options = {}) {

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






