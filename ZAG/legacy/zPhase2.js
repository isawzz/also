function _prep1(items, ifs, options) {
	options.showPics = true;
	return _createDivs(items, ifs, options);
}
function _prepText1(items, ifs, options) {
	options.showLabels = true;
	options.showPics = false;
	return _createDivs(items, ifs, options);
}

// phase 2: prep items for container: determine size and position of items, set a min(fit content) and a max(limited by container & layout)
function prepDims(items, options) {
	//console.log('rows',options.rows,'n',items.length)
	let [sz, rows, cols] = calcRowsColsSize(items.length, options.rows, options.cols);
	//console.log('picSz=' + sz, 'options.sz', options.sz,'rows',rows,'cols',cols)
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = sz);
}
function prepPics(items,ifs,options){
	options.showPics = true;
	return _createDivs(items, ifs, options);
	// _prep1(items, ifs, options);
}
function prepLbls(items,ifs,options){
	options.showLabels = true;
	options.showPics = false;
	return _createDivs(items, ifs, options);
	// _prepText1(items, ifs, options);
}
function prepX(items, ifs, options) {
	//console.log('rows',options.rows,'n',items.length)
	let [sz, rows, cols] = calcRowsColsSize(items.length, options.rows, options.cols);
	//console.log('picSz=' + sz, 'options.sz', options.sz,'rows',rows,'cols',cols)
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = sz);
	_prep1(items, ifs, options);
}
function prepareItemsForContainerRegularGrid(items, ifs, options, desRows, desCols) {
	//console.log('desRows',desRows,'n',items.length)
	let [sz, rows, cols] = calcRowsColsSize(items.length, desRows, desCols);
	//console.log('picSz=' + sz, 'options.sz', options.sz,'rows',rows,'cols',cols)
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = sz);
	_prep1(items, ifs, options);
}
function prepareTextItemsForContainerRegularGrid(items, ifs, options, desRows, desCols) {
	let [sz, rows, cols] = calcRowsColsSize(items.length, desRows, desCols);
//console.log('textSz=' + sz, 'options.sz', options.sz)
	if (nundef(options.sz)) options.sz = sz;
	if (nundef(options.rows)) options.rows = rows;
	if (nundef(options.cols)) options.cols = cols;
	items.map(x => x.sz = sz);
	_prepText1(items, ifs, options);
}


function findLongestLabel(items) {
	let longestLabel = '';
	let maxlen = 0;
	let iLongest = -1;
	for (let i = 0; i < items.length; i++) {
		let label = items[i].label;

		if (isdef(label)) {
			let tlen = label.length;
			if (tlen > maxlen) { maxlen = tlen; longestLabel = label; iLongest = i; }
		}
	}

	return { label: longestLabel, len: maxlen, i: iLongest };

}

function calcRowsColsSize(n, rows, cols, dParent, wmax, hmax, minsz = 50, maxsz = 200) {

	//berechne outer dims
	let ww, wh, hpercent, wpercent;
	if (isdef(dParent)) {
		let b = getBounds(dParent);
		ww = b.width;
		wh = b.height;
		hpercent = .9;
		wpercent = .9;
	} else if (isdef(wmax) && isdef(hmax)) {
		ww = wmax;
		wh = hmax;
		hpercent = .6;
		wpercent = .6;
	} else {
		ww = window.innerWidth;
		wh = window.innerHeight;
		hpercent = .56;
		wpercent = .64;
	}

	//console.log(ww,wh)
	let sz;//, picsPerLine;
	//if (lines <= 1) lines = undefined;

	//console.log('===>vor calcRowsColsX: rows='+rows,'cols'+cols);
	let dims = calcRowsColsX(n, rows, cols);
	//console.log('===>nach calcRowsColsX: rows='+rows,'cols'+cols);

	let hpic = wh * hpercent / dims.rows;
	let wpic = ww * wpercent / dims.cols;

	//console.log('hpic', hpic, 'wpic', wpic, ww, window.innerWidth, wh, window.innerHeight);
	sz = Math.min(hpic, wpic);
	//picsPerLine = dims.cols;
	sz = Math.max(minsz, Math.min(sz, maxsz)); //Math.max(50, Math.min(sz, 200));
	return [sz, dims.rows, dims.cols]; //pictureSize, picsPerLine];
}


function _prep1_dep(items, ifs, options) {
	let sz = options.sz;
	let padding = (isdef(ifs.padding) ? ifs.padding : 1);

	let bo = ifs.border;
	bo = isdef(bo) ? isString(bo) ? firstNumber(bo) : bo : 0;

	let szNet = sz - 2 * padding - 2 * bo;

	let pictureSize = szNet;
	let picStyles = { w: szNet, h: isdef(options.center) ? szNet : szNet + padding }; //if no labels!
	let textStyles, hText;
	if (options.showLabels) {
		let longestLabel = findLongestLabel(items);
		let oneWord = longestLabel.label.replace(' ', '_');

		textStyles = idealFontsize(oneWord, szNet, szNet / 2, 22, 8); //, 'bold');	textStyles.weight='bold'
		hText = textStyles.h;

		pictureSize = szNet - hText;
		picStyles = { w: pictureSize, h: pictureSize };

		delete textStyles.h;
		delete textStyles.w;
	}

	let outerStyles = { rounding: 10, margin: sz / 12, display: 'inline-block', w: sz, h: sz, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	outerStyles = mergeOverride(outerStyles, ifs);
	let pic, text;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;
		let d = mDiv();
		//add pic
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			picStyles['text-shadow'] = sShade;
			picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
		}

		//console.log('::::::::::::::',picStyles)
		pic = zPic(k, null, picStyles, true, false);
		delete pic.info;
		mAppend(d, pic.div);
		//add text if needed
		if (options.showLabels) {
			textStyles.fg = item.fg;
			text = zText1Line(item.label, null, textStyles, hText);
			mAppend(d, text.div);
		}
		//style container div
		outerStyles.bg = item.bg;
		outerStyles.fg = item.fg;
		mStyleX(d, outerStyles);
		//console.log('===>iGroup',item.iGroup,i)
		d.id = getUID(); // 'pic' + (i + item.iGroup); //$$$$$
		d.onclick = options.onclick;
		//complete item info
		item.id = d.id;
		item.row = Math.floor(item.index / options.cols);
		item.col = item.index % options.cols;
		item.div = d;
		item.pic = pic;
		if (isdef(text)) item.text=text;
		item.isSelected = false;
		item.isLabelVisible = options.showLabels;
		item.dims = parseDims(sz, sz, d.style.padding);
		//console.log('index', item.index, 'row', item.row, 'col', item.col)
		if (options.showRepeat) addRepeatInfo(d, item.iRepeat, sz);
		let fzPic = firstNumber(item.div.children[0].children[0].style.fontSize);
		let docfz = item.pic.innerDims.fz;
		console.assert(docfz == fzPic, 'fzPic is ' + fzPic + ', docfz is ' + docfz);
		if (docfz != fzPic) {
			console.log('item', item)
		}
		item.fzPic = fzPic;

		//console.log('picSize',sz)
	}

}













