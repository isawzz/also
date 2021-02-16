function presentItems(items, dParent, options={}) {
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











