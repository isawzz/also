function zazTest01(n,wper,hper,lang='E'){
	zazTest00(n, { wper: wper, hper: hper, lang:lang, maxlen: 18, luc: 'c', szPic: { w: 100, h: 100 } }); //chooseRandom(range(1,100))); //12,32,56,100]));
	//zazTest00(240, { maxlen: 18, luc: 'c', szPic: { w: 100, h: 100 } }); //chooseRandom(range(1,100))); //12,32,56,100]));
	//zazTest00(chooseRandom([2,300]), { maxlen: 18, luc: 'c', szPic: { w: 100, h: 100 } }); //chooseRandom(range(1,100))); //12,32,56,100]));
	// zazTest00(chooseRandom(range(1, 150)), { maxlen: 18, luc: 'c', szPic: { w: 100, h: 100 } }); //chooseRandom(range(1,100))); //12,32,56,100]));
}

function zazTest00(n = 144, { maxlen, wper, hper, szPic, fzText, fzPic, luc, labelPos, lang, minPadding, minGap, uniform } = {}) {
	let tableRect = createPageDivsFullVisibleArea({ top: 30, title: 30 }, { footer: 30 }); //table is above footer
	let dArea = getMainAreaPercent(dTable, 'silver', wper, hper); //getMainAreaPadding(dTable, 2, 'silver');
	dArea.id='dArea';
	let options = getStandardOptions(dArea, arguments[1]);
	let items = getItemsMaxLen(n, options.maxlen, 'lifePlus', options.lang, options.luc);
	let f = getFitting(items, options);

	makeItemDivs(items, options);
	let dGrid = mDiv100(dArea); dGrid.id='dGrid'; mStyleX(dGrid,{fz:2})

	for (const it of items) { mAppend(dGrid, lDiv(it)); }
	//console.log(options.rows, options.cols, 'reg', options.isRegular, 'crowd', options.isCrowded)
	if (options.isRegular) makeGridGrid(items, options, dGrid); //best if have reg option
	else if (coin()) makeNoneGrid(items, options, dGrid); //best if not regular
	else makeFlexGrid(items, options, dGrid);
	//console.log(dGrid);

	console.assert(!isOverflown(dGrid), '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
}












