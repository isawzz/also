// modifies options: add def options, set a few minor options, CREATE labelStyles, picStyles, outerStyles
function _extendOptions(dArea, options, defOptions) {

	//console.log('in _extend: options', options, 'def', defOptions)
	if (nundef(defOptions)) {
		defOptions = {
			szPic: { w: 100, h: 100 },
			showLabels: true, maxlen: 14, luc: 'c', labelPos: 'bottom', lang: 'E',
			fzText: 20, fzPic: 60,
			minPadding: 0, minGap: 1, isUniform: true, isRegular: true,
		};
	}
	addKeys(options, defOptions);

	options.area = getRect(dArea);
	options.aRatio = options.area.w / options.area.h;
	options.containerShape = options.area.w > options.area.h ? 'L' : 'P';

	if (nundef(options.labelStyles)) options.labelStyles = {};

	if (options.showLabels) {
		if (options.labelPos == 'bottom') options.labelBottom = true; else options.labelTop = true;
		options.labelStyles.fz = options.fzText;
	}

	options.picStyles = { fz: options.fzPic };

	options.outerStyles = {
		bg: 'random', display: 'inline-flex', 'flex-direction': 'column', 'place-content': 'center',
		padding: 0, box: true, rounding: 6,
	};

	return options;
}














function adjustToItemSize(options, w, h, wfix, hfix, adjustFont = true) {
	//wfix... no/undef,min,max,yes =>outerStyles.wmin,wmax,w or dont set it
	options.szPic.w = w;
	if (isdef(h)) options.szPic.h = h; else h = options.szPic.h; //h unchanged!
	if (isdef(wfix)) {
		if (wfix == 'min') options.outerStyles.wmin = w;
		else if (wfix == 'max') options.outerStyles.wmax = w;
		else options.outerStyles.w = w;
	}
	if (isdef(hfix)) {
		if (hfix == 'min') options.outerStyles.hmin = options.szPic.h;
		else if (hfix == 'max') options.outerStyles.hmax = options.szPic.h;
		else options.outerStyles.h = options.szPic.h;
	}
	if (adjustFont && isdef(wfix) && wfix != 'min') {
		//text font has to be ok for longest label

		let wn = w - options.minPadding * 2;
		let hn = h - options.minPadding * 2;

		console.log('w', w, 'wn', wn, 'h', h, 'hn', hn)

		let fz = options.showLabels == true ? (wn / options.longestLabelLen) * (options.luc != 'u' ? 1.9 : 1.7) : 0;
		let fzPic = Math.min(wn / 1.3, (hn - fz * 1.2) / 1.3);

		if (fzPic < fz * 2) { fz = Math.floor(hn / 4); fzPic = fz * 2; }

		fzTest = Math.min(hn / 3, idealFontsize(options.longestLabel, wn, hn - fzPic, fz, 4).fz);


		console.log('fzText', fz, 'comp', fzTest, 'fzPic', fzPic);

		options.fzPic = options.picStyles.fz = Math.floor(fzPic)
		options.fzText = options.labelStyles.fz = Math.min(Math.floor(fz), Math.floor(fzTest));
	}

}
function extendOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	_extendOptions(dArea, options, defOptions);
}
function getOptionsSize(dArea, options = {},) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	return _extendOptions(dArea, options, defOptions);
}

function getOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	return _extendOptions(dArea, options, defOptions);
}




function getOptionsFixedPicSize(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		maxlen: 14, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	options.fzText = options.showLabels ? 20 : 0;
	options.fzPic = options.showLabels ? 60 : 70;

	options = _extendOptions(dArea, options, defOptions);

	options.outerStyles = mergeOverride(options.outerStyles,
		{ w: options.szPic.w, h: options.szPic.h });

	return options;
}
