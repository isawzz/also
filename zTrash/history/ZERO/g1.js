function showItemsCenterFlex(items, dParent, options = {}) {

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let dOuter = item.div = mDiv(dParent);
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);
		console.log(dOuter)

		if (options.labelTop) { item.dLabel = mText(item.label, dOuter, options.labelStyles);  }

		let dPic = item.dPic = mDiv(dOuter, { family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom) { item.dLabel = mText(item.label, dOuter, options.labelStyles); }


		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}


	return presentItems1(items, dParent, options);
}


function measureForArea(items, szCont, options) {
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let [rows, cols] = bestFitRowsCols(items.length);
	console.log('best fit ergibt: rows', rows, 'cols', cols)
	let [w, h, r, c] = calcRowsColsSizeNew(items.length, rows, cols);
	console.log('calcRowsColsSize ergibt: rows', r, 'cols', c);
	console.log('N=' + items.length, 'r=' + r, 'c=' + c, 'w=' + w, 'h=' + h)


	//fzPic 2/3 von h
	//fz min 8px max 20px, idealLongestLabelFit
}






























