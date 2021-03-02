async function _start() {

	let dRightSide = mDiv(dMain, { display: 'flex', 'flex-direction': 'column', 'flex-grow': 10 });

	let table = mDiv(dRightSide, { bg: 'green' }, 'table'); //table.innerHTML='hallo';

	let ltop = get3ColLine(table, 'dLeft', 'dMiddle', 'dRight', { bg: 'red' });
	let ltitle = get3ColLine(table, 'dTitleLeft', 'dTitleMiddle', 'dTitleRight', { bg: 'green' });

	let hTable = percentVh(100) - 60 - 30; //die 10 sind abstand von footer, die 30 sind footer
	let wTable = percentVw(100) - 20; //die 20 sind padding (je 10) von get3ColLine
	let ltable = get3ColLine(table, 'dTableLeft', 'dTable', 'dTableRight', { bg: 'dimgray', w: wTable, h: hTable });
	mSize(dTable.parentNode, '100%', '100%');

	let lfooter = get3ColLine(table, 'dFooterLeft', 'dFooterMiddle', 'dFooterRight', { bg: 'orange' });
	dFooterMiddle.innerHTML = 'HALLO'; //mStyleX(lfooter, { bottom: 0 })

	clearElement(dTable);
	mSize(dTable, '100%', '100%'); let rect = getRect(dTable);
	//console.log('dTable rect', rect);

	// only take items with label of max length 10?
	let items = getItems(chooseRandom([200]), x => x.D.length < 11); // cond is on Syms object!!!
	for (const item of items) { item.label = toNoun(item.info.D); item.id = lRegister(item); }

	let aTable = percentOf(dTable, 80, 60); //getRect(dTable);

	let options = { area: aTable, labelTop: true };

	let dArea = getArea(dTable, { w: options.area.w, h: options.area.h, layout: 'hcc', bg: 'grey', padding: 4, rounding: 6 });


	//i have the items
	//i could calc for each item the text measure for font 20
	//or i could see what the longest label is and so what would be the minimum width for each item for fontsize 20
	//or i could do nothing else than just adding all the items to a flex box filling area
	//using a pleasant font for both pic and text
	let fzPic = 50;
	let fzText = 16;
	//now make the item divs with these sizes
	lookupSet(options, ['picStyles', 'fz'], fzPic);
	lookupSet(options, ['labelStyles', 'fz'], fzText);
	options.outerStyles = { bg: 'random', display: 'inline-block', padding: 2, rounding: 6 }
	makeItemDivs(items, options);

	let dGrid = mDiv100(dArea);
	items.map(x => mAppend(dGrid, lGet(x).div));

	//find largest item
	items.map(x => x.rect = getRect(lGet(x).div));

	let minMaxWidth = arrMinMax(items, x => x.rect.w);
	console.log('min and max width:', minMaxWidth);
	//how long is the label?

	//next, each item should be resized to max size
	items.map(x => { x.rect.w = minMaxWidth.max; mStyleX(lGet(x).div, { w: minMaxWidth.max }) });

	items.map(x => x.rect = getRect(lGet(x).div)); //muss rect adjusten!!!

	//next, measure how much space remains to be distributed for margins;
	// if margins < minmargin, opfer ein ganzes item width noch dazu!
	//calc min top
	let minMaxTop = arrMinMax(items, x => x.rect.y);
	console.log('min and max top:', minMaxTop);
	let cols = items.filter(x => x.rect.y == minMaxTop.min).length;
	// console.log(items.map(x=>x.rect));
	let rows = Math.ceil(items.length / cols);
	console.log('cols', cols, 'rows', rows);



	//mStyleX(dGrid, { display: 'flex', 'flex-wrap': 'wrap', 'align-items':'center'});
	//mStyleX(dArea,{display:'grid',gap:10});
	//mStyleX(dArea,{layout:'fhcc',gap:10});


	revealMain(); return;

}






async function _start02() {
	let dRightSide = mDiv(dMain, { display: 'flex', 'flex-direction': 'column', 'flex-grow': 10 });

	let table = mDiv(dRightSide, { bg: 'green' }, 'table'); //table.innerHTML='hallo';

	let ltop = get3ColLine(table, 'dLeft', 'dMiddle', 'dRight', { bg: 'red' });
	let ltitle = get3ColLine(table, 'dTitleLeft', 'dTitleMiddle', 'dTitleRight', { bg: 'green' });

	let hTable = percentVh(100) - 60 - 30; //die 10 sind abstand von footer, die 30 sind footer
	let wTable = percentVw(100) - 20; //die 20 sind padding (je 10) von get3ColLine
	let ltable = get3ColLine(table, 'dTableLeft', 'dTable', 'dTableRight', { bg: 'violet', w: wTable, h: hTable });
	mSize(dTable.parentNode, '100%', '100%');

	let lfooter = get3ColLine(table, 'dFooterLeft', 'dFooterMiddle', 'dFooterRight', { bg: 'orange' });
	dFooterMiddle.innerHTML = 'HALLO'; //mStyleX(lfooter, { bottom: 0 })

	clearElement(dTable);
	mSize(dTable, '100%', '100%'); let rect = getRect(dTable);
	//console.log('dTable rect', rect);

	let items = getItems(chooseRandom([200]));
	for (const item of items) { item.label = item.info.S.toUpperCase(); item.id = lRegister(item); }

	let aTable = percentOf(dTable, 80, 50); //getRect(dTable);

	let options = { area: aTable };

	let dArea = getArea(dTable, { w: options.area.w, h: options.area.h, layout: 'hcc', bg: 'yellow', padding: 4 });

	options = getSizeAndOptions1(items, dArea, options);

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
















