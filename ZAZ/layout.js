function makeGridGrid(items, options, dGrid) {
	//code grid layout:
	mStyleX(dGrid, {
		display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap,
		border: '5px solid yellow', box: true
	});
}
function makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', gap: options.gap, border: '5px solid red', box: true
	});
	for (const it of items) { mStyleX(lDiv(it), { flex: '1' }); }
	setTimeout(() => correctFlexGrid(items, options, dGrid, false), 10);
}
function correctFlexGrid(items, options, dGrid, done) {
	for (const item of items) item.rect = getRect(lDiv(item));
	let r1 = items[options.indexOfLongestLabelItem].rect;
	let r2 = items[items.length - 1].rect;
	//console.log('correctFlexGrid: rects', r1, r2)
	if (r2.w > r1.w * 3) {

		let iLastRow = getObjectsWithSame(items, ['rect', 'y'], items[items.length - 1], false);
		if (iLastRow.length > 2) return;
		let iFirstRow = getObjectsWithSame(items, ['rect', 'y'], items[0]);
		if (iFirstRow.length + 3 < iLastRow.length) return;
		let others = arrWithout(items, iLastRow);
		//console.log('iLastRow', iLastRow.map(x => x.label));
		let rest = (options.area.w / r2.w) * (r2.w - r1.w);
		let p = rest / (others.length / 2);
		let n1 = Math.floor(others.length > 50 ? others.length / 5 : others.length / 2);
		let half = choose(others, Math.floor(others.length / 2));
		//console.log('adding', p, 'to', half.length, 'items');
		for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		while (isOverflown(dGrid)) {
			p /= 2;
			//console.log('still overflow!!!!!!', p);
			for (const it of half) { mStyleX(lDiv(it), { wmin: it.rect.w + p }); }
		}
		if (!done) setTimeout(() => correctFlexGrid(items, options, dGrid, true), 10);
	}

}
function makeNoneGrid(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }
	mStyleX(dGrid, { border: '5px solid blue', box: true })
	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		//console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		//console.log('options',options.fzPic,options)
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		let newGap = Math.ceil(options.gap / 2);
		while (ov > 0) {

			//let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			//let newGap = Math.ceil(Math.max(1, options.gap / 2 - pad));
			//console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) { mStyleX(lDiv(it), { fz: 4, margin: newGap, padding: newGap / 2, rounding: 0 }); }
			ov = getVerticalOverflow(dGrid);
			if (ov && newGap == 1) {
				for (const it of items) { mStyleX(lDiv(it), { margin: 0, padding: 0 }); }
				break;
			}
			newGap = Math.ceil(newGap / 2);
		}

	}
}
function calcRowsCols(num, rows, cols) {
	//=> code from RSG testFactory arrangeChildrenAsQuad(n, R);
	//console.log(num, rows, cols);
	const table = {
		2: { rows: 1, cols: 2 },
		5: { rows: 2, cols: 3 },
		7: { rows: 2, cols: 4 },
		11: { rows: 3, cols: 4 },
	};
	let shape = 'rect';
	if (isdef(rows) && isdef(cols)) {
		//do nothing!
	} else if (isdef(table[num])) {
		return table[num];
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
function calcRowsColsSize(n, wCont, hCont, percentGap=10, rows=null, cols=null, wpMin = 50, hpMin = 50, wpMax = 200, hpMax = 200) {
	let dims = calcRowsCols(n, rows, cols);
	if (dims.rows < dims.cols && wCont < hCont) { let hlp = dims.rows; dims.rows = dims.cols; dims.cols = hlp; }
	let hpic = hCont / dims.rows;
	let wpic = wCont / dims.cols;

	let gap = options.gap = Math.min(wpic, hpic) * percentGap/100;
	wpic -= gap * 1.25; hpic -= gap * 1.25;
	
	wpic = Math.max(wpMin, Math.min(wpic, wpMax));
	hpic = Math.max(hpMin, Math.min(hpic, hpMax));
	return [wpic, hpic, gap, dims.rows, dims.cols];
}