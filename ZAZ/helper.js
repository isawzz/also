
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
function getOptionsFillContainer(dArea, options = {}) {
	defOptions = {
		szPic: { w: 100, h: 100 },
		showLabels: true, maxlen: 14, wper: 80, hper: 80, minPadding: 0, minGap: 1, uniform: true,
		fzText: 8, luc: 'c', labelPos: 'bottom', lang: 'E',
	};
	if (nundef(options.fzPic)) options.fzPic = Math.floor(options.fzText * 4 * (options.luc == 'u' ? .7 : .6)); //taking 4 as min word length

	options = _extendOptions(dArea, options, defOptions);

	return options;
}


function _extendOptions(dArea, options, defOptions) {

	//console.log('in _extend: options', options, 'def', defOptions)
	options = mergeOverride(defOptions, options);

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
