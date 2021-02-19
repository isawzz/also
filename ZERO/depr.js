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


	return presentItems(items, dParent, options);
}
