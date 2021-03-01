async function _start() {

	let dRightSide = mDiv(dMain, { display: 'flex', 'flex-direction': 'column', 'flex-grow': 10 });

	let table = mDiv(dRightSide, {}, 'table');

	let ltop = get3ColLine(table, 'dLeft', 'dMiddle', 'dRight');//,{bg:'red'});
	let ltitle = get3ColLine(table, 'dTitleLeft', 'dTitleMiddle', 'dTitleRight');//,{bg:'green'});
	let ltable = get3ColLine(table, 'dTableLeft', 'dTable', 'dTableRight');//,{bg:'violet',h:'auto'});

	clearElement(dTable);

	let items = getItems1(chooseRandom([42]));
	for (const item of items) { item.label = item.info.S.toUpperCase(); item.id = lRegister(item); }

	//hier suche ich die options aus:
	let options = { labelTop: true, area:{w: window.innerWidth - 40, h: window.innerHeight - 80}, canGrow: true };

	let dArea = getArea(dTable, { w: options.area.w, h: options.area.h, layout: 'hcc', bg: 'violet' });

	options = getSizeAndOptions(items,dArea,options);

	makeItemDivs(items, options);

	console.log('options', options)

	let dGrid = layoutItems(items, dArea, options);
	//mStyleX(dGrid, { bg: 'yellow', padding: 8 });

	setTimeout(nachkorrigieren, 100, items, revealMain, options);
}









function _start01() {

	getTable2(dMain, { bg: 'green' }, 'dTable')
	let d1 = getArea2(dTable, { w: 400, h: 400, bg: 'violet', margin: 10 }, 'd1');
	mLinebreak(dTable)
	let d2 = getArea2(dTable, { w: 2400, h: 400, bg: 'violet', padding: 10 }, 'd2');

	let dsub = getArea2(d2, { w: 2400, h: 400, bg: 'red' }, 'dsub');

	let d4 = getArea2(dTable, { w: 50, h: 50, bg: 'violet', margin: 10 }, 'd4');
	let d3 = getArea2(dTable, { w: 400, h: 400, bg: 'violet', margin: 10 }, 'd3');
	mLinebreak(dTable)
	let d5 = getArea2(dTable, { w: 400, h: 400, bg: 'violet', margin: 10 }, 'd5');


}
async function _start00() {
	let table = getTable1(dMain, { bg: 'green', margin: 25 });
	let area = getArea1(table, { bg: 'blue', w: 500, h: 500, layout: 'hcc' });
	let items = getItems1(9);
	let [rows, cols, szPic] = getRowsColsSize(items.length, area.w, area.h);

	mDiv(dMain, { bg: 'green', margin: 10 }, 'dTable');
	mDiv100(dTable, { bg: 'seagreen', margin: 10 }, 'dGridContainer');

	let dParent = dGridContainer;

	presentItems3(items, dGridContainer, {
		labelTop: true, fzMin: 8, wArea: 400, hArea: 400, w: 100, h: 100, bg: 'random',
		rounding: '1vw', fg: 'contrast', layout: 'grid'
	}, revealMain);


}
function revealMain() { mReveal(dMain); }
function getItems1(n) {
	let items = getItems(n, 'life'); //getItems(chooseRandom(range(1, 50)), 'life'); //getItems(['bee', 'cockroach']);// getItems(13, 'life'); 
	items[0] = getItems(['spider web'])[0];
	for (const item of items) { item.label = item.info.D.toUpperCase(); item.id = lRegister(item); }
	//console.log('Live', X = Live[items[0].id]);

	let longestLabel = arrMinMax(items, x => x.label.length).max;
	let fzMin = 20;
	let wmin = longestLabel * fzMin / 2;
	// console.log('longest label is', longestLabel);
	return items;
	console.log('zea!');

	// mDiv(dMain, { 'min-height': '100vh', display: 'flex', bg: 'red' }, 'dTable');
	// //mDiv(dMain, { display: 'flex', bg: 'red' }, 'dTable');
	// t67_pictures(() => { mReveal(dMain); console.log(dTable); });
}
function getContainer(dParent, w, h) {

}
function presentItems3(items, dParent, options, callback) {

	//set options
	//darstellung von items in AREA: calculate dims
	let rect = getRect(dParent); //console.log(rect);
	let AREA = { w: valf(options.wArea, rect.w), h: valf(options.hArea, rect.h) };
	console.log('rect dMiddle', rect.w, rect.h, 'area', AREA);
	// let AREA = { w: god(options, wArea, 800), h: god(options, hArea, 600) };
	let sz = { w: valf(options.w, 160), h: valf(options.h, 200) }
	let szMax = { w: 250, h: 250 };
	let [rows, cols, szPic] = getRowsColsSize(items.length, AREA, sz, szMax);
	//console.log('_________N=' + items.length, 'AREA', AREA, 'szPic', sz, '\n==>rows=' + rows, 'cols=' + cols, 'szPic', szPic);
	//console.log('N=' + items.length);

	//let longestLabel = arrMinMax(items,x=>x.label.length).max;

	let gap = 12;
	let wCorrect = Math.round((1 + 1 / (cols > 2 ? cols - 2 : cols)) * gap);
	let hCorrect = Math.round((1 + 1 / (rows > 2 ? rows - 2 : rows)) * gap);
	let wOuter = szPic.w - wCorrect;
	let hOuter = szPic.h - hCorrect;

	let factorPic = (options.labelBottom == true || options.labelTop == true) ? 2 / 3 : 3 / 4;
	let fzPic = Math.min(wOuter, hOuter) * factorPic;
	let fzTextMin = valf(options.fzMin, 9);
	let fzText = Math.min(22, Math.max(fzTextMin, hOuter * 1 / 9));
	fzPic = Math.min(fzPic, hOuter - fzText - 16);
	//console.log(fzPic);

	defOptions = {
		// labelBottom: valf(options.labelBottom, true),
		// labelTop: valf(options.labelTop, false),
		picStyles: { fz: fzPic },
		labelStyles: { fz: fzText, align: 'center' },
		outerStyles: {
			wmin: wOuter, h: hOuter, margin: valf(options.margin, 0),
			bg: valf(options.bg, 'random'), fg: valf(options.fg, 'contrast'),
			rounding: valf(options.rounding, '1vw'),
			layout: 'fvcc',
		},
	};
	options = mergeOverride(defOptions, options);
	//item div production:
	for (let i = 0; i < items.length; i++) {
		let item = items[i];

		let dOuter = mCreate('div');
		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		let dLabel;
		if (options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		let dPic = mDiv(dOuter, { family: item.info.family });
		dPic.innerHTML = item.info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }

		if (isdef(options.handler)) dOuter.onclick = options.handler;

		lAdd(item, { div: dOuter, dPic: dPic, options: options });
		if (isdef(dLabel)) lAdd(item, { dLabel: dLabel })
	}

	console.log(options.layout, 'rows', rows, 'cols', cols);
	let needFlexGrid = options.layout == 'flex' || nundef(options.layout) && (rows * cols - items.length);

	mStyleX(dParent, {
		layout: 'fcc', flex: '0 0 auto',
		w: AREA.w, // needFlexGrid ? AREA.w : 'auto',
		h: AREA.h, // needFlexGrid ? 'auto' : AREA.h,
		//overflow: 'hidden', bg: 'black', border: '10px solid black',
		margin: 'auto', patop: 10
	});

	console.log('rows', rows, 'cols', cols)
	let dGrid = needFlexGrid ? layoutFlex(items, dParent, cols, gap) : layoutGrid(items, dParent, cols, gap);
	//let b = getRect(dGrid);console.log('grid size:',b,'AREA',AREA)

	callback();
	//setTimeout(presentationComplete3, 100, items, callback);
	return dGrid;
}
function presentationComplete3(items, callback) {
	items.map(x => x.rect = getRect(lGet(x).div));
	let sample = lGet(items[0]);
	if (isdef(sample.dLabel)) {
		let fz = sample.options.labelStyles.fz;
		//let dGrid = sample.div.parentNode;
		//console.log('fz is', fz)

		for (const item of items) {
			let ui = lGet(item);
			let w = item.rect.w;
			let wText = getRect(ui.dLabel).w;
			//console.log('w',w,'wText',wText);

			if (wText > w - 4) {
				//adjust div sizes: gut wenn opacity 0 war
				mStyleX(ui.div, { wmin: wText + 8 });

				//adjust font sizes:
				// mStyleX(ui.div,{w:w});
				// mStyleX(ui.dLabel,{fz:fz-1})

			}
		}

	}
	if (isdef(callback)) callback();

}
















