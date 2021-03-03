function addLabels(items, lang = 'E', lowerUpperCap = 'c') {
	let max = 0;
	for (const item of items) {
		let label = item.info[lang];
		if (label.length > max) { max = label.length; }
		item.label = lowerUpperCap == 'c' ? toNoun(label) : lowerUpperCap == 'l' ? label : label.toUpperCase();
	}
	return max;
}
function getFittingRect(fzText,fzPic,maxlen){
	let w=Math.max(fzPic*1.25,fzText*.75*maxlen);
	let h=fzPic+fzText+6;
	return {w:w,h:h};
}
function test62_fitRect() {
	let items = getItems(10); 
	let maxlen = addLabels(items);

	let sz = getFittingRect(20,80,maxlen);
	

}

function test63_widthOfW() {
	// let s='warum ist das so schwer';
	// let sz=getSizeWithStyles(s,{fz:100,family:'arial'});
	// console.log('sz',sz,'s',s.length,sz.w/s.length);
	// s='warum ist das so schwer'.toUpperCase();

	let s = 'hallo';
	let sz = getSizeWithStyles(s, { fz: 100 });
	console.log('sz', sz, 's', s.length, sz.w / s.length);

	s = 'Wwwww'; //s.toUpperCase(); //'HALLO'; //*3/4
	sz = getSizeWithStyles(s, { fz: 100 });
	console.log('sz', sz, 's', s.length, sz.w / s.length);

	s = 'WWWWW';
	sz = getSizeWithStyles(s, { fz: 100 });
	console.log('sz', sz, 's', s.length, sz.w / s.length);
}

function test64_multi() {
	Daat.tests = [];
	for (const n of [2, 9, 10, 25, 32, 42, 60, 100, 144]) {
		for (const len of [7, 9, 12, 160]) {
			Daat.tests.push({ n: n, wPercent: 80, hPercent: 80, len: len });
		}
		// for(const wPercent of [25,50,75,80,90]){
		// 	for(const hPercent of [25,50,75,80,90]){
		// 		Daat.tests.push({n:n,wPercent:wPercent,hPercent:hPercent});
		// 	}
		// }
	}
	Daat.iTest = 0;
	onclick = test64_present;
	test64_present();
}
function test64_present() {
	let t = Daat.tests[Daat.iTest];
	test65_pictures(t.n, t.wPercent, t.hPercent, t.len);
	Daat.iTest = (Daat.iTest + 1) % Daat.tests.length;
	console.log(Daat.iTest);
}

function test65_pictures(n = 20, wPercent = 80, hPercent = 80, len = 12) {

	//#region page aufbau
	clearElement(dMain)
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
	//#endregion

	//#region table preparation
	clearElement(dTable);
	mSize(dTable, '100%', '100%'); let rect = getRect(dTable);
	//console.log('dTable rect', rect);
	//#endregion

	//#region item preparation
	// only take items with label of max length 10?
	let items = getItems(n, x => x.D.length < len, 'all'); // cond is on Syms object!!!
	for (const item of items) { item.label = toNoun(item.info.D); item.id = lRegister(item); }
	//#endregion

	//#region area: dArea
	let aTable = percentOf(dTable, wPercent, hPercent); //getRect(dTable);
	let dArea = getArea(dTable, { w: aTable.w, h: aTable.h, layout: 'hcc', bg: 'grey', });
	//#endregion

	//#region options
	let options = { area: aTable, labelTop: true };

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
	options.outerStyles = { bg: 'random', display: 'inline-block', padding: 0, box: true };
	makeItemDivs(items, options);
	//#endregion

	//#region create grid div and append items
	let dGrid = mDiv100(dArea);
	items.map(x => mAppend(dGrid, lGet(x).div));
	//#endregion

	//#region resize all items to largest size
	//find largest item
	items.map(x => x.rect = getRect(lGet(x).div));
	let minMaxWidth = arrMinMax(items, x => x.rect.w);
	let wItem = minMaxWidth.max;
	//console.log('min and max width:', minMaxWidth);

	//next, each item should be resized to max size
	items.map(x => { x.rect.w = minMaxWidth.max; mStyleX(lGet(x).div, { w: minMaxWidth.max }) });
	items.map(x => x.rect = getRect(lGet(x).div)); //muss rect adjusten!!!
	//#endregion

	//#region count cols and rows
	//next, measure how much space remains to be distributed for margins;
	// if margins < minmargin, opfer ein ganzes item width noch dazu!
	//calc cols and rows
	//console.log(items.map(x => x.rect))
	let minMaxTop = arrMinMax(items, x => x.rect.y);
	//console.log('min and max top:', minMaxTop);
	let cols = items.filter(x => x.rect.y == minMaxTop.min).length;
	// console.log(items.map(x=>x.rect));
	let rows = Math.ceil(items.length / cols);
	//console.log('cols', cols, 'rows', rows);
	//#endregion

	//#region calc extraspace and distribute evenly
	let extraSpace = options.area.w - cols * (wItem);
	let gap = Math.floor(extraSpace / (cols));

	//console.log('cols', cols, 'w items', cols * wItem, 'area', options.area, 'extraSpace', extraSpace, 'gap', gap, 'wItem', wItem);
	if (gap < 8) { gap += wItem / cols; }
	items.map(x => mStyleX(lGet(x).div, { margin: gap / 2 }));
	//#endregion




	//mStyleX(dGrid, { display: 'flex', 'flex-wrap': 'wrap', 'align-items':'center'});
	//mStyleX(dArea,{display:'grid',gap:10});
	//mStyleX(dArea,{layout:'fhcc',gap:10});


	revealMain(); return;

}
function test66_pictures(n, w, h) {

	//#region page aufbau
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
	//#endregion

	//#region table preparation
	clearElement(dTable);
	mSize(dTable, '100%', '100%'); let rect = getRect(dTable);
	//console.log('dTable rect', rect);
	//#endregion

	//#region item preparation
	// only take items with label of max length 10?
	let items = getItems(chooseRandom([200]), x => x.D.length < 11); // cond is on Syms object!!!
	for (const item of items) { item.label = toNoun(item.info.D); item.id = lRegister(item); }
	//#endregion

	//#region area: dArea
	let aTable = percentOf(dTable, 80, 60); //getRect(dTable);
	let dArea = getArea(dTable, { w: aTable.w, h: aTable.h, layout: 'hcc', bg: 'grey', });
	//#endregion

	//#region options
	let options = { area: aTable, labelTop: true };

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
	options.outerStyles = { bg: 'random', display: 'inline-block', padding: 0, box: true };
	makeItemDivs(items, options);
	//#endregion

	//#region create grid div and append items
	let dGrid = mDiv100(dArea);
	items.map(x => mAppend(dGrid, lGet(x).div));
	//#endregion

	//#region resize all items to largest size
	//find largest item
	items.map(x => x.rect = getRect(lGet(x).div));
	let minMaxWidth = arrMinMax(items, x => x.rect.w);
	let wItem = minMaxWidth.max;
	console.log('min and max width:', minMaxWidth);

	//next, each item should be resized to max size
	items.map(x => { x.rect.w = minMaxWidth.max; mStyleX(lGet(x).div, { w: minMaxWidth.max }) });
	items.map(x => x.rect = getRect(lGet(x).div)); //muss rect adjusten!!!
	//#endregion

	//#region count cols and rows
	//next, measure how much space remains to be distributed for margins;
	// if margins < minmargin, opfer ein ganzes item width noch dazu!
	//calc cols and rows
	console.log(items.map(x => x.rect))
	let minMaxTop = arrMinMax(items, x => x.rect.y);
	//console.log('min and max top:', minMaxTop);
	let cols = items.filter(x => x.rect.y == minMaxTop.min).length;
	// console.log(items.map(x=>x.rect));
	let rows = Math.ceil(items.length / cols);
	//console.log('cols', cols, 'rows', rows);
	//#endregion

	//#region calc extraspace and distribute evenly
	let extraSpace = options.area.w - cols * (wItem);
	let gap = Math.floor(extraSpace / (cols));

	console.log('cols', cols, 'w items', cols * wItem, 'area', options.area, 'extraSpace', extraSpace, 'gap', gap, 'wItem', wItem);
	if (gap < 8) { gap += wItem / cols; }
	items.map(x => mStyleX(lGet(x).div, { margin: gap / 2 }));
	//#endregion




	//mStyleX(dGrid, { display: 'flex', 'flex-wrap': 'wrap', 'align-items':'center'});
	//mStyleX(dArea,{display:'grid',gap:10});
	//mStyleX(dArea,{layout:'fhcc',gap:10});


	revealMain(); return;

}

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

	console.log('dTable', dTable)
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







