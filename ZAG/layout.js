function myShowPics(handler, ifs = {}, options = {}, keys, labels) {
	options.showPic = true; //if (nundef(options.showLabels)) options.showLabels = G.showLabels;
	options.wimax = options.himax = 200;
	options.w = window.innerWidth - 180; options.h = window.innerHeight - 220;
	Pictures = showPictures(dTable, handler, ifs, options, keys, labels);
}
function myShowLabels(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	options.wimax = 200; options.himax = 50;
	options.w = window.innerWidth - 180; options.h = 50; options.fz = 22;
	options.showPic = false; options.showLabels = true;
	return showPictures(dTable, onClickPictureHandler, ifs, options, keys, labels);
}
function showPictures(dParent, handler, ifs = {}, options = {}, keys, labels) {
	//O
	// console.log('vorher',options.fz)
	options = getOptionsMinimalistic(dParent, handler, options.w, options.h, ifs, options, G);
	// console.log('nachher',options.fz)
	//console.log(options)
	//I
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//console.log('ERROR?keys',keys[0])
	let items = genItemsFromKeys(keys, options);
	//console.log(items)
	if (isdef(labels)) {
		options.showLabels = true;
		for (let i = 0; i < items.length; i++) item[i].label = labels[i % labels.length];
	}
	//L
	let dArea = mDiv(dParent);
	let rect = myPresent(dArea, items, options);
	//mStyleX(dArea,{bg:'white'});
	//console.log(rect);
	return items;
}
function getStandardFz(wi, hi, showPic, showLabels, wLongest) {
	//console.log('getStandardFz',wi,hi,showPic,showLabels,wLongest);
	let hText = showPic ? hi / 3 : hi; 
	return showLabels ? idealFontSize(wLongest, wi, hText) : 0; 
}
function getStandardFzPic(wi, hi, showLabels) { return Math.min(wi * .8, showLabels ? hi * .6 : hi * .75); }
function myPresent(dArea, items, options) {
	let showLabels = options.showLabels;
	let w = options.w * valf(options.fw, .9); 
	let h = options.h * valf(options.fh, .7); 

	let wi, hi, rows, cols;
	if (isdef(options.rows) || isdef(options.cols)) {
		[wi, hi, rows, cols] = calcSizeAbWo(items.length, options.rows, options.cols, w, h, options.wimax, options.himax);
	} else[wi, hi, rows, cols] = calcRowsColsSizeAbWo(items.length, w, h, showLabels, options.wimax, options.himax);

	let gap = wi * .1; if (cols > 1) wi -= gap; if (rows > 1) hi -= gap;
	let fzPic = options.fzPic = getStandardFzPic(wi, hi, showLabels);
	let fz = getStandardFz(wi,hi,options.showPic,options.showLabels,options.wLongest);
	options.szPic = { w: wi, h: hi };
	if (nundef(options.ifs)) options.ifs = {};
	let outerStyles = {
		w: wi, h: hi, margin: gap / 2, rounding: 6,
		bg: valf(options.ifs.bg, 'random'), fg: 'contrast', display: 'inline-flex', 'flex-direction': 'column',
		'justify-content': 'center', 'align-items': 'center', 'vertical-align':'top',
	};
	let picStyles = { fz: fzPic };
	let labelStyles = { fz: fz };
	for (const item of items) {
		for (const k in options.ifs) if (isdef(item[k])) outerStyles[k] = item[k];
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPic) {
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			} else {
				labelStyles['text-shadow'] = sShade;
				labelStyles.fg = anyColorToStandardString('black', options.contrast); //'#00000080' '#00000030' 
			}
		}
		let dOuter = mCreate('div', outerStyles, item.id);
		dOuter.onclick = options.handler;
		picStyles.family = item.info.family;
		let dLabel, dPic;
		if (options.showPic) { dPic = mDiv(dOuter, picStyles); dPic.innerHTML = item.info.text; }
		if (showLabels) dLabel = mText(item.label, dOuter, labelStyles);
		if (options.showRepeat) addRepeatInfo(dOuter, item.iRepeat, wi);
		iAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });
	}
	if (isdef(options.numColors) && options.numColors > 1){
		mStyleX(dArea, { display: 'inline-grid',gap:gap, 'grid-template-columns': `repeat(${cols},${wi}px)` });
	}
	items.map(x => mAppend(dArea, iDiv(x)));
	return getRect(dArea);
}











