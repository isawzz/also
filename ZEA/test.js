function t67_pictures(callback) {
	//return;
	let items = getItems(chooseRandom([64]), 'life'); //getItems(chooseRandom(range(1, 50)), 'life'); //getItems(['bee', 'cockroach']);// getItems(13, 'life'); 
	items[0] = getItems(['spider web'])[0];
	for (const item of items) { item.label = item.info.D.toUpperCase(); item.id = lRegister(item); }
	//console.log('Live', X = Live[items[0].id]);

	let longestLabel = arrMinMax(items, x => x.label.length).max;
	let fzMin = 20;
	let wmin = longestLabel * fzMin / 2;
	console.log('longest label is', longestLabel);

	console.log('dTable',dTable)
	presentItems2(items, dTable, {
		labelTop: true, fzMin: fzMin, wArea: 800, w: wmin, h: 100, bg: 'random',
		rounding: '1vw', fg: 'contrast', layout: 'grid'
	}, callback);
}
function t68_pictures() {
	//return;
	let items = getItems(chooseRandom([64]), 'life'); //getItems(chooseRandom(range(1, 50)), 'life'); //getItems(['bee', 'cockroach']);// getItems(13, 'life'); 
	items[0] = getItems(['spider web'])[0];
	for (const item of items) { item.label = item.info.D.toUpperCase(); item.id = lRegister(item); }
	//console.log('Live', X = Live[items[0].id]);

	let longestLabel = arrMinMax(items, x => x.label.length).max;
	let fzMin = 20;
	let wmin = longestLabel * fzMin / 2;
	console.log('longest label is', longestLabel);

	presentItems1(items, dTable, {
		labelTop: true, fzMin: fzMin, wArea: 800, w: wmin, h: 100, bg: 'random',
		rounding: '1vw', fg: 'contrast', layout: 'grid'
	});
}
function t69_Live() {
	//return;
	let items = getItems(chooseRandom([48, 64]), 'life'); //getItems(chooseRandom(range(1, 50)), 'life'); //getItems(['bee', 'cockroach']);// getItems(13, 'life'); 
	items[0] = getItems(['spider web'])[0];
	for (const item of items) { item.label = item.info.D.toUpperCase(); item.id = lRegister(item); }
	//console.log('Live', X = Live[items[0].id]);

	//set options
	//darstellung von items in AREA: calculate dims
	let AREA = { w: 800, h: 600 }, sz = { w: 160, h: 200 }, szMax = { w: 250, h: 250 };
	let [rows, cols, szPic] = getRowsColsSize(items.length, AREA, sz, szMax);
	//console.log('_________N=' + items.length, 'AREA', AREA, 'szPic', sz, '\n==>rows=' + rows, 'cols=' + cols, 'szPic', szPic);

	//let longestLabel = arrMinMax(items,x=>x.label.length).max;

	let gap = 12;
	let wCorrect = Math.round((1 + 1 / (cols > 2 ? cols - 2 : cols)) * gap);
	let hCorrect = Math.round((1 + 1 / (rows > 2 ? rows - 2 : rows)) * gap);
	let wPic = szPic.w - wCorrect;
	let hPic = szPic.h - hCorrect;
	let options = {
		labelBottom: true,
		picStyles: { fz: Math.min(wPic, hPic) * 2 / 3 },
		labelStyles: { fz: Math.min(22, Math.max(9, hPic * 1 / 10)), align: 'center' },
		outerStyles: { wmin: wPic, h: hPic, margin: 0, bg: 'random', rounding: '1vw', fg: 'contrast', layout: 'fvcc', },
	};
	//item div production:
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let dOuter = mCreate('div');
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		let dLabel;
		if (options.labelTop) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic = mDiv(dOuter, { family: item.info.family });
		dPic.innerHTML = item.info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { div: dOuter, dPic: dPic, options: options });
		if (isdef(dLabel)) lAdd(item, { dLabel: dLabel })
	}

	let dParent = dTable;
	mStyleX(dTable, { layout: 'fcc', flex: '0 0 auto', w: AREA.w, h: AREA.h + 10, margin: 'auto', patop: 10 });//, overflow: 'hidden', bg: 'black', border: '10px solid black' });

	let needFlexGrid = options.layout == 'flex' && (rows * cols - items.length);

	//let dGrid = layoutGrid(items, dParent, cols, gap);
	let dGrid = needFlexGrid ? layoutFlex(items, dParent, cols, gap) : layoutGrid(items, dParent, cols, gap);
	//let b = getRect(dGrid);console.log('grid size:',b,'AREA',AREA)

	setTimeout(correctTextSize, 100, items);

	// setTimeout(() => { items.map(x => x.rect = getRect(lGet(x).div)); }, 200);//erst jetzt ist es richtig!!!
}







