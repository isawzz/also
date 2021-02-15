function presentItems(items, dParent, options={}) {
	mStyleX(dParent, { display: 'flex', 'justify-content': 'center' });

	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let [w,h,r,c] = calcRowsColsSizeNew(items.length);
	console.log('N='+items.length,'r='+r,'c='+c,'w='+w,'h='+h)

	let gridStyles = {display:'grid','grid-template-columns':`repeat(${c}, ${w}px)`};
	gridStyles = mergeOverride({ 'place-content': 'center', gap: 4, margin: 4, padding: 4 },gridStyles);
	mStyleX(dGrid, gridStyles);

	let b = getRect(dGrid);

	return { dGrid: dGrid, sz: b };
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
function layoutGrid1(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
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
function mCenterWrapper() {
	let html = `<table style="width: 100%;height:100%">
  <tr>
     <td style="text-align: center; vertical-align: middle;">
          <div></div>
     </td>
  </tr>
</table>`;
	let elem = createElementFromHTML(html);
	let dOuter = mCreate('div');
	mAppend(dOuter, elem);
	let dInner = elem.children[0].children[0].children[0].children[0];
	//console.log(dOuter, dInner)
	return [dOuter, dInner];
}
function centerWrap(dOuter, dInner) {
	let [outer, inner] = mCenterWrapper();
	mAppend(dOuter, outer);
	mAppend(inner, dInner);
}











