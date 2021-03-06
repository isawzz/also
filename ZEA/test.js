function makeGridGrid(items, options, dGrid) {
	//code grid layout:
	mStyleX(dGrid, { display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap });
}
function makeFlexGrid(items, options, dGrid) {
	//code flex layout
	mStyleX(dGrid, {
		display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
		'flex-flow': 'row wrap', gap: options.gap
	});
	for (const it of items) { mStyleX(lDiv(it), { flex: '1' }); }
}
function makeNoneGrid(items, options, dGrid) {
	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap / 2, padding: options.gap / 2 }); }

	let ov = getVerticalOverflow(dGrid);
	if (ov > 0) {
		console.log('overflow!', ov)
		options.fzPic = options.picStyles.fz = options.fzPic * .9;//*fact;
		for (const it of items) { mStyleX(lGet(it).dPic, { fz: options.fzPic }); }
		ov = getVerticalOverflow(dGrid);
		if (ov > 0) {
			let pad = Math.max(ov / (options.rows * 2 + 1), options.gap / 4);
			let newGap = Math.max(1, options.gap / 2 - pad);
			console.log('gap', options.gap / 2, 'newGap', newGap)
			for (const it of items) {
				mStyleX(lDiv(it), { margin: newGap, padding: newGap / 2 });
			}
		}
	}
	// console.log('overflow',isOverflown(dGrid));
	// if (isOverflown(dGrid)){
	// 	for (const it of items) { mStyleX(lDiv(it), { margin: options.gap/2, padding: 1 }); }
	// }
}
function test60_2_clean(n = 144, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
	let tableRect = createPageDivsFullVisibleArea({ top: 30, title: 30 }, { footer: 30 }); //table is above footer
	let dArea = getMainAreaPercent(dTable, 'silver', wper, hper); //getMainAreaPadding(dTable, 2, 'silver');
	let options = getStandardOptions(dArea, arguments[1]);
	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting1(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea);

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	else makeFlexGrid(items, options, dGrid);
	console.log(dGrid);

	console.assert(!isOverflown(dGrid),'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}
function getVerticalOverflow(element) {
	return element.scrollHeight - element.clientHeight;
}
function isOverflown(element) {
	return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
function correctJA(items, options) {
	//console.log('rect ist', getRect(lDiv(items[0])));
	console.log('sz', options.szPic)
	// let sz = { w: options.szPic.h, h: options.szPic.h };// getRect(lDiv(items[0]));
	let mx = options.szPic.h;

	console.log('fzPic', options.fzPic, 'fzText', options.fzText);
	let area = options.area;
	//berechne ungefaehr wieviel con area gecovered ist!
	let aa = area.w * area.h;
	// let ai = mx*mx * items.length;
	//the rest space will be a full rectangle on bottom of area
	// let diff=aa-ai;
	// let sq=Math.sqrt(aa - ai);

	//let mp = Math.sqrt(Math.sqrt(aa - ai));
	//let sp=Math.min(sq/items.length,Math.min(sz.w,sz.h)/10);
	//let sp1=Math.log(Math.log((Math.min(sz.w,sz.h)/10)));
	// sp1=Math.log((Math.min(sz.w,sz.h)));
	sp1 = mx * .05;// Math.sqrt(mx); // - 3;
	sp1 = Math.ceil(sp1);

	if (sp1 > options.gap) {
		console.log('N', items.length, 'sp1', sp1);

		// let abb={2:2,3:3,4:4,5:5,6:7,7:7,8:8,9:9,10:14,11:16,12:17,13:18,14:20,15:22};
		// sp1=sp1<=2?2:sp1<=15?abb[sp1]:20;
		// console.log('   =>sp1',sp1);

		//console.log('--------aa',aa,'new',(sz.w+2*sp1)*(sz.h+2*sp1),'sp1',sp1)
		while (sp1 > 1 && aa < (items.length) * (mx + sp1) * (mx + sp1)) {
			sp1 -= 1;
			console.log('--------aa', aa, 'new', (items.length) * (mx + sp1) * (mx + sp1), 'sp1', sp1)
		}
		console.log('   =>sp1', sp1);
	} else sp1 = options.gap;

	//sp1=getBaseLog(Math.pow(ai,3),2);
	//console.log('A', aa, 'cov', ai, 'per item:', sq / items.length,'1%',Math.min(sz.w,sz.h)/10, '=>sp',sp1);
	for (const it of items) { mStyleX(lDiv(it), { margin: sp1, padding: sp1 }); }
}
function test60_2_v1(n = 144, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
	let tableRect = createPageDivsFullVisibleArea({ top: 30, title: 30 }, { footer: 30 }); //table is above footer
	let dArea = getMainAreaPercent(dTable, 'silver', wper, hper); //getMainAreaPadding(dTable, 2, 'silver');
	let options = getStandardOptions(dArea, arguments[1]);
	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea);

	//code grid layout:
	//mStyleX(dGrid, { display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap });

	//code flex layout
	// mStyleX(dGrid, {
	// 	display: 'flex', 'justify-content': 'space-between', 'align-content': 'stretch',
	// 	'flex-flow': 'row wrap', gap: options.gap
	// });
	// for (const it of items) { mStyleX(lDiv(it), { flex: '1' }); }

	//code no layout
	//for (const it of items) { mStyleX(lDiv(it), { margin: 4, padding:4 }); }

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	console.log('rect ist', getRect(lDiv(items[0])));
	setTimeout(() => correct00(items, options), 10)

}
function correct00(items, options) {
	console.log('rect ist', getRect(lDiv(items[0])));
	let sz = getRect(lDiv(items[0]));
	let area = options.area;
	//berechne ungefaehr wieviel con area gecovered ist!
	let aa = area.w * area.h;
	let ai = sz.w * sz.h * items.length;
	//the rest space will be a full rectangle on bottom of area
	let diff = aa - ai;
	let sq = Math.sqrt(aa - ai);

	//let mp = Math.sqrt(Math.sqrt(aa - ai));
	//let sp=Math.min(sq/items.length,Math.min(sz.w,sz.h)/10);
	//let sp1=Math.log(Math.log((Math.min(sz.w,sz.h)/10)));
	// sp1=Math.log((Math.min(sz.w,sz.h)));
	sp1 = Math.sqrt((Math.min(sz.w, sz.h))) - 3;
	sp1 = Math.ceil(sp1);

	console.log('N', items.length, 'sp1', sp1);

	let abb = { 2: 2, 3: 3, 4: 4, 5: 6, 6: 8, 7: 8, 8: 10, 9: 12, 10: 20 };
	sp1 = sp1 <= 2 ? 2 : sp1 <= 10 ? abb[sp1] : 20;

	console.log('   =>sp1', sp1);

	//console.log('--------aa',aa,'new',(sz.w+2*sp1)*(sz.h+2*sp1),'sp1',sp1)
	let mx = Math.max(sz.w, sz.h);
	while (sp1 > 1 && aa < (items.length + 2) * (mx + 4 * sp1) * (mx + 4 * sp1)) {
		sp1 -= 1;
		//console.log('--------aa',aa,'new',(sz.w+2*sp1)*(sz.h+2*sp1),'sp1',sp1)
	}

	//sp1=getBaseLog(Math.pow(ai,3),2);
	//console.log('A', aa, 'cov', ai, 'per item:', sq / items.length,'1%',Math.min(sz.w,sz.h)/10, '=>sp',sp1);
	for (const it of items) { mStyleX(lDiv(it), { margin: sp1, padding: sp1 }); }
}
function getBaseLog(x, b) {
	return Math.log(x) / Math.log(b);
}
function test60_2(n = 144, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
	//#region page and items 
	//console.log('_________',n,len,'w',wper,'h',hper)
	let tableRect = createPageDivsFullVisibleArea();
	//let dArea = getMainAreaPadding(dTable, 2, 'silver');
	let dArea = getMainAreaPercent(dTable, 'silver', wper, hper);

	//szPic = {w:100,h:200};
	let options = getStandardOptions(dArea, arguments[1]);
	//console.log(options);

	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	//#endregion

	let f = getFitting(items, options);

	//console.log('fitting',f);

	//welche passt am besten?
	//berechne standard pic size wenn es nicht gegeben ist!

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea);
	//console.log('....',options.cols)
	mStyleX(dGrid, { display: 'grid', 'grid-template-columns': `repeat(${options.cols}, 1fr)`, gap: options.gap });
	for (const it of items) mAppend(dGrid, lDiv(it));


}
function test60_1_clean(n = 144, len = 14, wper = 80, hper = 80, fzText = 8, fzPic) {
	//console.log('_________',n,len,'w',wper,'h',hper)
	let tableRect = createPageDivsFullVisibleArea();
	//let dArea = getMainAreaPadding(dTable, 2, 'silver');
	let dArea = getMainAreaPercent(dTable, 'silver', wper, hper);

	let luc = 'l'; //lower case labels
	let items = getItemsMaxLen(n, len, 'lifePlus', 'D', luc);

	if (nundef(fzPic)) fzPic = Math.floor(fzText * 4 * (luc == 'u' ? .7 : .6));
	let options = getStandardOptions(dArea, fzPic, fzText, 'bottom');
	let area = options.area;
	options.containerShape = area.w > area.h ? 'L' : 'P';

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea);
	items.map(x => mAppend(dGrid, lDiv(x)));

	options.szUniform = getLargestItemSize(items); //hier wird rect zu items gegeben! =>ist aber NICHT uniform size sondern min size!!!

	let fitting = getBestFitting(items, options);
	//console.log(items)
	console.log(fitting)
	console.log(options)

	if (options.fits && options.isUniform) { layoutRegularUniformGrid(items, dGrid, options); }
	else if (options.fits) {

		//non uniform fit but regular!

		//erstmal: haben die items jetzt schon einen size?
		console.log(lDiv(items[0]), items[0].rect);

		//can choose to 
		// 1. overflow
		// 2. irregular fit
		//when?
		// 3. regular fit that is NOT uniform sized!
		// 4. reduce font if fontSize can be reduced or to 
		// 5. display ellipsis for oversized items!
	}

	let rg = getRect(dGrid);
	//console.log('grid rect vor scale',rg)

	scaleFonts(items, options);
	setTimeout(correctGap, 10, dGrid, items, options);

}
function correctGap(dGrid, items, options) {
	console.log('ITEM RECT', items[0].rect)
	let rg = getRect(dGrid); console.log('grid rect NACH scale', rg)
	let rect = getRect(lDiv(items[0]));
	//console.log('...new size of items:', rect);
	let oldGap = firstNumber(dGrid.style.gap);
	options.szUniform = { w: rect.w, h: rect.h };
	let gap = computeGap(options);
	//console.log('oldGap',oldGap,'new gap',gap);

	dGrid.style.gridGap = '' + gap + 'px';
	setTimeout(correct2, 10, dGrid);
	options.gridGap = gap;
	options.dGrid = dGrid;
	items.map(x => x.rect = getRect(lDiv(x)));
	console.log('>ITEM RECT', items[0].rect)
}
function correct2(dGrid) {
	rg = getRect(dGrid); console.log('grid rect NACH gap correction', rg)
	revealMain();
}
function test60_alt1(n = 144, len = 14, wper = 80, hper = 80, fzText = 8, fzPic) {
	//console.log('_________',n,len,'w',wper,'h',hper)
	let tableRect = createPageDivsFullVisibleArea();
	//let dArea = getMainAreaPadding(dTable, 2, 'silver');
	let dArea = getMainAreaPercent(dTable, 'silver', wper, hper);

	let luc = 'l'; //lower case labels
	let items = getItemsMaxLen(n, len, 'lifePlus', 'D', luc);

	if (nundef(fzPic)) fzPic = Math.floor(fzText * 4 * (luc == 'u' ? .7 : .6));
	let options = getStandardOptions(dArea, fzPic, fzText, 'bottom');
	let area = options.area;
	options.containerShape = area.w > area.h ? 'L' : 'P';


	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea);
	items.map(x => mAppend(dGrid, lDiv(x)));

	let szu = options.szUniform = getLargestItemSize(items); //hier wird rect zu items gegeben! =>ist aber NICHT uniform size sondern min size!!!

	//#region testing
	//original code:
	// [options.rows, options.cols, options.fits] = getBestUniformRegularFit(items, options);
	// console.log('fit:', options.rows, options.cols, options.fits)

	//fuer h muss ich den largest nehmen, fuer w kann items width aufaddieren
	//so total item size will be: sum(rect.w von items)*szUniform.h
	let sumWidth = arrSum(items, ['rect', 'w']);
	let sumText = arrSum(items, ['label', 'length']);
	let minText = arrMinMax(items, x => x.label.length);
	//console.log('N',items.length,'sumW',sumWidth,'sumText',sumText,'wtapprox',sumText*20*.7);
	let avgText = sumText / items.length;
	//console.log('minText',minText);
	//console.log('fzPic sollte nicht mehr als',4*20*.67,'sein',fzText,fzPic)

	//console.log('sum of all width:',sumWidth);
	let aItems = sumWidth * szu.h;
	let aItemsa = items.length * szu.w * szu.h;
	let aCont = (area.w) * (area.h);
	let aConta = (area.w - szu.w) * (area.h - szu.h);
	//console.log('aItemsa',aItemsa,'aItems',aItems,'aCont',aCont,'aConta',aConta);

	//was ist wenn kleinste items nicht in groessten container reiinpassen?
	//soll ich dann fonts verkleinern?
	//wie gross waer denn der fitting font?

	//gibt es regular fits die reinpassen?
	let fits = getRegularFits(items.length);
	console.log('fits', fits);
	//soll ich jetzt fuer jeden fit testen ob sich ausgeht?
	//the most regular fit will be the last one!
	//what is the shape of items?
	//height of items ist fix, so filter by 

	let fittings = getSimpleUniFit(items, options);
	//#endregion
	fittings = getSimpleFit(items, options);
	console.log(fittings)
	if (isEmpty(fittings)) {

		let res = getOverFits(items.length);
		//welcher von denen ist der beste?
		let aRatio = options.containerShape == 'L' ? options.area.h / options.area.w : options.area.w / options.area.h;
		let rmin = 20000, best;
		for (const r of res) {
			let rnew = Math.abs(aRatio - r.s / r.l);
			console.log('testing', r, 'diff', rnew)
			if (rnew < rmin) { rmin = rnew; best = r; }
		}

		console.log('______over fits'); res.map(x => console.log(x))
		console.log('aRatio', aRatio)
		console.log('best fit:', best);
		//best hab ich jetzt, je nach landscape or portrait area muss ich es so oder so nehmen!
		let rows, cols;
		if (options.containerShape == 'L') { rows = best.l; cols = best.s; } else { rows = best.s; cols = best.l; }

		//#region trash
		// if (options.isPrime==true){
		// 	console.log('!!!!!!!!!!! no fitting!!!!!!!!!!!! PRIME!!!!');
		// 	let l=Math.ceil(Math.sqrt(items.length));
		// 	let s=Math.ceil(items.length/l);

		// 	let A=options.area;
		// 	// if width of area is same as height should count as more rows than cols
		// 	//if w/h>4/3 
		// 	let isLandscape = (A.w/A.h>=4/3); 
		// 	let [rows,cols]=isLandscape?[s,l]:[l,s];

		// 	//hier sollte eine bessere aufteilung finden! ev. entsprechend ideal pic size


		// 	fittings.push({rows:rows,cols:cols});
		// }else{
		// 	//has fittings but they do not fit (sz. 2x13 oder sowas)
		// 	console.log('!!!!!!!!!!! no fitting!!!!!!!!!!!!')

		// }

		//simplest: just do the row*col rule!
		//hier muss jetzt alternative fittings finden!!!
		//aber wie?
		// er kommt hierher wenn primzahl oder einfach nicht genug platz: VERIFY!!!!
		//#endregion
		options.hasRegularFittings = false;

		//muss noch ein fitting daraus machen!!!
		//wo hab ich die cols widths calculated???
		let [wCols, wGrid] = maxSumColumns(items.map(x => x.rect.w), rows, cols);
		//console.log('for',r.l,'columns, grid width would be',wGrid);
		let wExtra = area.w - wGrid;
		let hExtra = area.h - rows * szu.h;

		let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols, wExtra: wExtra, hExtra: hExtra, wCols: wCols };
		fittings.push(fitting);

	} else options.hasRegularFittings = true;

	console.log('fittings:'); fittings.map(x => console.log(x));
	options.fittings = fittings;

	let bestFitting = getFittingMaximizeMinimalExtraSpace(fittings);
	console.log('best max min extra', bestFitting);

	bestFitting = getFittingPreferLandscape(fittings); //nicht gut wenn lange worte und uniform sizing!
	console.log('best landscape', bestFitting);

	[options.rows, options.cols] = [bestFitting.rows, bestFitting.cols];
	options.fits = true;
	options.fitting = options.bestFitting = bestFitting;

	options.isUniform = bestFitting.type != 'N';
	if (!options.isUniform) {
		let wCols = bestFitting.wCols;
		let wmm = arrMinMax(wCols); // hier gibt es ein PROBLEM!!! wenns kein wCols gibt!
		options.minColWidth = wmm.min;
		options.maxColWidth = wmm.max;
	}

	if (options.fits && options.isUniform) { layoutRegularUniformGrid(items, dGrid, options); }
	else if (options.fits) {

		//non uniform fit but regular!

		//erstmal: haben die items jetzt schon einen size?
		console.log(lDiv(items[0]), items[0].rect);

		//can choose to 
		// 1. overflow
		// 2. irregular fit
		//when?
		// 3. regular fit that is NOT uniform sized!
		// 4. reduce font if fontSize can be reduced or to 
		// 5. display ellipsis for oversized items!
	}
	scaleFonts(items, options);
}
function test60_pageVisibleArea(n = 20, len = 8, wper = 80, hper = 80) {
	//console.log('_________',n,len,'w',wper,'h',hper)
	let tableRect = createPageDivsFullVisibleArea();
	//let dArea = getMainAreaPadding(dTable, 2, 'silver');
	let dArea = getMainAreaPercent(dTable, 'yellow', wper, hper);

	let items = getItemsMaxLen(n, len, 'lifePlus', 'S', 'l');

	let options = getStandardOptions(dArea, 60, 20, 'bottom');

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea);
	items.map(x => mAppend(dGrid, lDiv(x)));

	// options.szUniform = getMinUniformSize(items, options); //findet size der fuer alle items passt
	options.szUniform = getLargestItemSize(items); //hier wird rect zu items gegeben!
	[options.rows, options.cols, options.fits] = getBestUniformRegularFit(items, options);

	if (options.fits) { layoutRegularUniformGrid(items, dGrid, options); }
	else {
		//erstmal: haben die items jetzt schon einen size?
		console.log(lDiv(items[0]), items[0].rect);

		//can choose to 
		// 1. overflow
		// 2. irregular fit
		//when?
		// 3. regular fit that is NOT uniform sized!
		// 4. reduce font if fontSize can be reduced or to 
		// 5. display ellipsis for oversized items!
	}
	scaleFonts(items, options);
}
function test60_pictures(n = 20, wPercent = 80, hPercent = 80, len = 12) {

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
	mSize(dTable, '100%', '100%'); let rect = getRect(dTable);
	//#endregion

	//#region table preparation
	clearElement(dTable);
	//console.log('dTable rect', rect);
	//#endregion

	//#region item preparation
	// only take items with label of max length 10?
	let items = getItems(n, x => x.D.length < len, 'all'); // cond is on Syms object!!!
	for (const item of items) { item.label = toNoun(item.info.D); }
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
function getFittingRect(fzText, fzPic, maxlen) {
	let w = Math.max(fzPic * 1.25, fzText * .75 * maxlen);
	let h = fzPic + fzText + 6;
	return { w: w, h: h };
}
function test62_fitRect() {
	let items = getItems(10);
	let maxlen = addLabels(items);

	let sz = getFittingRect(20, 80, maxlen);


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
	for (const item of items) { item.label = toNoun(item.info.D); }
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
	for (const item of items) { item.label = toNoun(item.info.D); }
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
	for (const item of items) { item.label = item.info.D.toUpperCase(); }
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
	for (const item of items) { item.label = item.info.D.toUpperCase(); }
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
	for (const item of items) { item.label = item.info.D.toUpperCase(); }
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






