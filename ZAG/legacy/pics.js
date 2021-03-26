
//#region new API
function _createDivs(items, ifs, options) {
	//options needs to have showPics,showLabels
	if (nundef(options.textPos)) options.textPos = 'none';

	let w = isdef(options.w) ? options.w : options.sz;
	let h = isdef(options.h) ? options.h : options.sz;

	let padding = (isdef(ifs.padding) ? ifs.padding : 1);

	//console.log('padding',padding)

	let bo = ifs.border;
	bo = isdef(bo) ? isString(bo) ? firstNumber(bo) : bo : 0;

	let wNet = w - 2 * padding - 2 * bo;
	let hNet = h - 2 * padding - 2 * bo;

	let pictureSize = wNet;
	options.center = true;
	//options.showLabels=false;
	let picStyles = { w: wNet, h: isdef(options.center) ? hNet : hNet + padding }; //if no labels!

	let textStyles, hText;
	if (options.showLabels) {
		let longestLabel = findLongestLabel(items);
		let oneWord = longestLabel.label.replace(' ', '_');

		let maxTextHeight = options.showPics ? hNet / 2 : hNet;
		textStyles = idealFontDims(oneWord, hNet, maxTextHeight, 22, 8);
		hText = textStyles.h;

		pictureSize = hNet - hText;
		picStyles = { w: pictureSize, h: pictureSize };

		delete textStyles.h;
		delete textStyles.w;
	}

	let outerStyles = { rounding: 10, margin: w / 12, display: 'inline-block', w: w, h: h, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	if (options.showLabels == true && options.textPos == 'none' && nundef(options.h)) delete outerStyles.h;
	outerStyles = mergeOverride(outerStyles, ifs);
	let pic, text;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;
		let d = mDiv();
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPics) {
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			} else {
				textStyles['text-shadow'] = sShade;
				textStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			}
		}
		//add pic if needed
		if (options.showPics) {
			pic = zPic(k, null, picStyles, true, false);
			delete pic.info;
			mAppend(d, pic.div);
		}
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
		if (isdef(pic)) { item.pic = pic; item.fzPic = pic.innerDims.fz; }
		if (isdef(text)) item.text = text;
		item.isSelected = false;
		item.isLabelVisible = options.showLabels;
		item.dims = parseDims(w, w, d.style.padding);
		if (options.showRepeat) addRepeatInfo(d, item.iRepeat, w);
	}

}
function createStandardItems(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	//#region prelim: default ifs and options, keys & infos
	//console.log('ifs', jsCopy(ifs)); console.log('options', jsCopy(options));

	// let showLabels = G.labels == true;
	if (nundef(Settings)) Settings = {};// language: 'E' };
	let infos = keys.map(k => (isdef(G.language) ? getRandomSetItem(G.language, k) : symbolDict[k]));

	//correct for language!!!! take best from Syms[k]

	//ifs and options: defaults
	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, padding: 3 };
	let defOptions = { showLabels: G.labels == true, shufflePositions: true, sameBackground: true, 
		showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = mergeOverride(defIfs, ifs);
	options = mergeOverride(defOptions, options);
	//console.log('keys', keys); console.log('ifs', ifs); 
	//console.log('options', options);
	//#endregion

	//#region phase1: make items: hier jetzt mix and match
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);
	//console.log('____________ options.rows', options.rows)
	items.map(x => x.label = x.label.toUpperCase());
	//#endregion phase1

	return [items, ifs, options];
}
function getRandomItems(n, keyOrSet, text = true, pic = true, styles = {}) {
	let keys = getRandomKeys(n, keyOrSet);
	//console.log(keys)
	if (pic == true) return getPics(() => console.log('click'), styles, { showLabels: text }, keys);
	else return getLbls(() => console.log('click'), styles, { showLabels: text }, keys);
}
function getPics(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items;
	[items, ifs, options] = createStandardItems(onClickPictureHandler, ifs, options, keys, labels);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepPics(items, ifs, options);
	return items;
}
function getLbls(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items;
	[items, ifs, options] = createStandardItems(onClickPictureHandler, ifs, options, keys, labels);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepLbls(items, ifs, options);
	return items;
}
function getPic(key, sz, bg, label) {
	let items, ifs = { bg: bg }, options = { sz: sz };
	if (isdef(label)) options.showLabels = true; else options.showLabels = false;
	[items, ifs, options] = createStandardItems(null, ifs, options, [key], isdef(label) ? [label] : undefined);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepPics(items, ifs, options);
	return items[0];
}
function getLbl(key, sz, bg, label) {
	let items, ifs = { bg: bg }, options = { sz: sz };
	if (isdef(label)) options.showLabels = true; else options.showLabels = false;
	[items, ifs, options] = createStandardItems(null, ifs, options, [key], isdef(label) ? [label] : undefined);
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	prepLbls(items, ifs, options);
	return items[0];
}
function presentItems(items, dParent, rows) {
	//#region phase3: prep container for items
	//mClass(dParent, 'flexWrap'); //frage ob das brauche????
	//#endregion

	//#region phase4: add items to container!
	let dGrid = mDiv(dParent);
	items.map(x => mAppend(dGrid, x.div));
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4 };
	let gridSize = layoutGrid(items, dGrid, gridStyles, { rows: rows, isInline: true });
	// console.log('size of grid',gridSize,'table',getRect(dTable))

	//#endregion


	//console.log('*** THE END ***', Pictures[0]);
	return { dGrid: dGrid, sz: gridSize };
}
function replaceLabel(item, label) { }
function replacePic(item, key) { }
function replacePicAndLabel(item, key, label) {
	//if item has both pic and label, replace them
	//if item has only pic, replace it and add label from new key
	//if item has onlt text, resize it and add both pic and label
	//if label param is missing, use default label param from key
	//console.log('item',item,'key',key,'label',label)
	let div = iDiv(item);
	//console.log(item);
	let newItem = getPic(key, item.sz, item.bg, label);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	mAppend(div, newItem.div.children[0]);
	item.pic = newItem.pic;
	item.text = newItem.text;
}
function addLabel(item, label) { }
function removeLabel(item) {
	//console.log('old item',item);
	let div = iDiv(item);
	let newItem = getPic(item.key, item.sz, item.bg);
	//console.log('newItem',newItem);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	item.pic = newItem.pic;
	delete item.text;
}
function addPic(item, key) {
	let div = iDiv(item);
	//console.log(item);
	let newItem = getPic(key, item.sz, item.bg, item.label);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	mAppend(div, newItem.div.children[0]);
	item.pic = newItem.pic;
	item.text = newItem.text;

}
function removePic(item) {
	//if item does not have a label, add the label for its key
	let div = iDiv(item);
	//console.log(item);
	let newItem = getLbl(item.key, item.sz, item.bg, item.label);
	clearElement(div);
	mAppend(div, newItem.div.children[0]);
	delete item.pic;
	item.text = newItem.text;
}
function showLbls(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items = getLbls(onClickPictureHandler, ifs, options, keys, labels);
	presentItems(items, dTable, 1);
	return items;
}
function showPics(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items = getPics(onClickPictureHandler, ifs, options, keys, labels);
	presentItems(items, dTable, options.rows);
	return items;
}


function ty01(){

}
function yRandomPic(ifs,options){
	//make a random key,
}

function yPics(ifs,options) {
	let keys = choose(SymKeys, n);
	console.log(keys)
	showPicsS(keys);

}
function showPicsS(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items = getPicsS(onClickPictureHandler, ifs, options, keys, labels);
	presentItems(items, dTable, options.rows);
	return items;
}
function getPicsS(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	let items;
	[items, ifs, options] = createStandardItemsS(onClickPictureHandler, ifs, options, keys, labels);
	console.log(items)
	// prepX(Pictures, ifs, options);
	prepDims(items, options);
	// prepPics(items, ifs, options);
	options.showPics = true;
	_createDivs(items, ifs, options);
	return items;
}
function createStandardItemsS(onClickPictureHandler, ifs = {}, options = {}, keys, labels) {
	if (nundef(Settings)) Settings = {};
	let lang = isdef(G.language) ? G.language : 'E';
	let defShowLabels = isdef(G.labels) && G.labels == true;

	let infos = keys.map(k => Syms[k]);
	infos.map(x => x.best = x['best' + lang]);
	console.log(infos.map(x => x.best));

	let bg = isdef(options.colorKeys) ? 'white' : (i) => options.sameBackground ? computeColor('random') : 'random';
	let fg = (i, info, item) => colorIdealText(item.bg);
	let defIfs = { bg: bg, fg: fg, label: isdef(labels) ? labels : (i, info) => info.best, contrast: .32, fz: 20, padding: 10 };
	let defOptions = { showLabels: defShowLabels, shufflePositions: true, sameBackground: true, showRepeat: false, repeat: 1, onclick: onClickPictureHandler, iStart: 0 };
	ifs = mergeOverride(defIfs, ifs);
	options = mergeOverride(defOptions, options);
	let items = zItems(infos, ifs, options);
	if (options.repeat > 1) items = zRepeatEachItem(items, options.repeat, options.shufflePositions);
	if (isdef(options.colorKeys)) items = zRepeatInColorEachItem(items, options.colorKeys);
	items.map(x => x.label = x.label.toUpperCase());
	return [items, ifs, options];
}
function _createDivsS(items, ifs, options) {
	//options needs to have showPics,showLabels
	if (nundef(options.textPos)) options.textPos = 'none';

	let w = isdef(options.w) ? options.w : options.sz;
	let h = isdef(options.h) ? options.h : options.sz;

	let padding = (isdef(ifs.padding) ? ifs.padding : 1);

	let bo = ifs.border;
	bo = isdef(bo) ? isString(bo) ? firstNumber(bo) : bo : 0;

	let wNet = w - 2 * padding - 2 * bo;
	let hNet = h - 2 * padding - 2 * bo;

	let pictureSize = wNet;
	options.center = true;
	//options.showLabels=false;
	let picStyles = { w: wNet, h: isdef(options.center) ? hNet : hNet + padding }; //if no labels!

	let textStyles, hText;
	if (options.showLabels) {
		let longestLabel = findLongestLabel(items);
		let oneWord = longestLabel.label.replace(' ', '_');

		let maxTextHeight = options.showPics ? hNet / 2 : hNet;
		textStyles = idealFontDims(oneWord, hNet, maxTextHeight, 22, 8);
		hText = textStyles.h;

		pictureSize = hNet - hText;
		picStyles = { w: pictureSize, h: pictureSize };

		delete textStyles.h;
		delete textStyles.w;
	}

	let outerStyles = { rounding: 10, margin: w / 12, display: 'inline-block', w: w, h: h, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	if (options.showLabels == true && options.textPos == 'none' && nundef(options.h)) delete outerStyles.h;
	outerStyles = mergeOverride(outerStyles, ifs);
	let pic, text;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;
		let d = mDiv();
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			if (options.showPics) {
				picStyles['text-shadow'] = sShade;
				picStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			} else {
				textStyles['text-shadow'] = sShade;
				textStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
			}
		}
		//add pic if needed
		if (options.showPics) {
			pic = zPicS(item, null, picStyles, true, false);
			delete pic.info;
			mAppend(d, pic.div);
		}
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
		iDiv(item) = d;
		if (isdef(pic)) { item.pic = pic; item.fzPic = pic.innerDims.fz; }
		if (isdef(text)) item.text = text;
		item.isSelected = false;
		item.isLabelVisible = options.showLabels;
		item.dims = parseDims(w, w, d.style.padding);
		if (options.showRepeat) addRepeatInfo(d, item.iRepeat, w);
	}

}
function zPicS(item, dParent, styles = {}) {
	let w = styles.w, h = styles.h, padding = styles.padding, hpadding = styles.hpadding, wpadding = styles.wpadding;
	if (isdef(styles.sz)) {
		if (nundef(w)) w = styles.sz;
		if (nundef(h)) h = styles.sz;
	}
	let stylesNew = jsCopy(styles);
	if (isdef(w)) {
		if (isdef(padding)) { w -= 2 * padding; }//stylesNew.padding=0;}
		else if (isdef(wpadding)) { w -= 2 * wpadding; }//stylesNew.wpadding=0;}
		stylesNew.w = w;
	}
	if (isdef(h)) {
		if (isdef(padding)) { h -= 2 * padding; }//stylesNew.padding=0;}
		else if (isdef(hpadding)) { h -= 2 * hpadding; }//stylesNew.hpadding=0;}
		stylesNew.h = h;
	}
	// console.log('old',styles)
	// console.log('new:',stylesNew)
	return _zPicS(item, dParent, stylesNew);
}
function detectItemInfoKey(itemInfoKey) {
	let item, info, key;
	if (isString(itemInfoKey)) { key = itemInfoKey; info = Syms[key]; item = { info: info, key: key }; }
	else if (isDict(itemInfoKey)) {
		if (isdef(itemInfoKey.info)) { item = itemInfoKey; info = item.info; key = item.info.key; }
		else { info = itemInfoKey; key = info.key; item = { info: info, key: key }; }
	}
	return [item, info, key];
}
function _zPicS(itemInfoKey, dParent, styles = {}) {
	let [item, info, key] = detectItemInfoKey(itemInfoKey);

	let outerStyles = isdef(styles) ? jsCopy(styles) : {};
	outerStyles.display = 'inline-block';
	let family = info.family;
	let wInfo = info.w;
	let hInfo = info.h; if (info.type == 'icon' && hInfo == 133) hInfo = 110;
	info.fz = 100;

	let innerStyles = { family: family };
	let [padw, padh] = isdef(styles.padding) ? [styles.padding, styles.padding] : [0, 0];

	let dOuter = isdef(dParent) ? mDiv(dParent) : mDiv();
	let d = mDiv(dOuter);
	d.innerHTML = info.text;

	let wdes, hdes, fzdes, wreal, hreal, fzreal, f;

	if (isdef(styles.w) && isdef(styles.h) && isdef(styles.fz)) {
		[wdes, hdes, fzdes] = [styles.w, styles.h, styles.fz];
		let fw = wdes / wInfo;
		let fh = hdes / hInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, fh, ffz);
	} else if (isdef(styles.w) && isdef(styles.h)) {
		[wdes, hdes] = [styles.w, styles.h];
		let fw = wdes / wInfo;
		let fh = hdes / hInfo;
		f = Math.min(fw, fh);
	} else if (isdef(styles.w) && isdef(styles.fz)) {
		[wdes, fzdes] = [styles.w, styles.fz];
		let fw = wdes / wInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fw, ffz);
	} else if (isdef(styles.h) && isdef(styles.fz)) {
		[hdes, fzdes] = [styles.h, styles.fz];
		let fh = hdes / hInfo;
		let ffz = fzdes / info.fz;
		f = Math.min(fh, ffz);
	} else if (isdef(styles.h)) {
		hdes = styles.h;
		f = hdes / hInfo;
	} else if (isdef(styles.w)) {
		wdes = styles.w;
		f = wdes / wInfo;
	} else {
		mStyleX(d, innerStyles);
		mStyleX(dOuter, outerStyles);
		return dOuter;
	}
	fzreal = Math.floor(f * info.fz);
	wreal = Math.round(f * wInfo);
	hreal = Math.round(f * hInfo);
	wdes = Math.round(wdes);
	hdes = Math.round(hdes);
	padw += isdef(styles.w) ? (wdes - wreal) / 2 : 0;
	padh += isdef(styles.h) ? (hdes - hreal) / 2 : 0;

	//console.log('padh',padh)
	//console.log('====>>>>', family, '\nw.info', wInfo, '\nh.info', hInfo, '\nfactor', f, '\nw', wreal, '\nh', hreal);

	if (!(padw >= 0 && padh >= 0)) {
		console.log(info)
		console.log('\nstyles.w', styles.w, '\nstyles.h', styles.h, '\nstyles.fz', styles.fz, '\nstyles.padding', styles.padding, '\nwInfo', wInfo, '\nhInfo', hInfo, '\nfzreal', fzreal, '\nwreal', wreal, '\nhreal', hreal, '\npadw', padw, '\npadh', padh);
	}
	//console.assert(padw >= 0 && padh >= 0, 'BERECHNUNG FALSCH!!!!', padw, padh, info, '\ninfokey', infokey);


	innerStyles.fz = fzreal;
	innerStyles.weight = 900;
	innerStyles.w = wreal;
	innerStyles.h = hreal;
	mStyleX(d, innerStyles);

	outerStyles.padding = '' + padh + 'px ' + padw + 'px';
	outerStyles.w = wreal; //das ist groesse von inner!
	outerStyles.h = hreal;
	mStyleX(dOuter, outerStyles);

	return {
		info: info, key: info.key, div: dOuter, outerDims: { w: wdes, h: hdes, hpadding: padh, wpadding: padw },
		innerDims: { w: wreal, h: hreal, fz: fzreal }, bg: dOuter.style.backgroundColor, fg: dOuter.style.color
	};

}
