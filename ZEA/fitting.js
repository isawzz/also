function getFitting(items, options) {

	let n = items.length;
	let res = getSLCombis(n);
	console.log('N', n); res.map(x => console.log(x));

	let wa = options.area.w, ha = options.area.h, wp = options.szPic.w, hp = options.szPic.h;
	console.log('szPic', options.szPic, 'area', options.area, 'fzText', options.fzText, 'fzPic', options.fzPic);
	let aRatio;

	//wa/wp ist wieviele pics haben in 1 row platz (=cols)

	let rows, cols;
	cols = wa / wp;
	rows = ha / hp;
	aRatio = cols<rows?cols/rows:rows/cols;	
	console.log('aRatio', aRatio)

	let rmin = 20000, best;
	for (const r of res) { let rnew = Math.abs(aRatio - r.s / r.l); if (rnew < rmin) { rmin = rnew; best = r; } }
	if (options.or == 'L') { rows = best.l; cols = best.s; } else { rows = best.s; cols = best.l; }

	console.log('=>rows', rows,'cols',cols);

	let idealGap = .1;
	let wb = options.area.w / cols;
	let hb = options.area.h / rows;

	console.log('sz brut',wb,hb)


	let gap = options.gap = Math.min(wb, hb) * idealGap; 
	options.cols=cols;
	options.rows=rows;
	wb -= gap; hb -= gap;

	console.log('sz net',wb,hb,gap)

	let fw = wb / wp;
	let fh = hb / hp;
	let fmin = Math.min(fw, fh);
	options.labelStyles.fz *= fmin;
	options.picStyles.fz *= fmin;
	options.szPic = { w: wb, h: hb };
	let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols };

	return fitting;
}

function getBestFitting(items, options) {
	//ich koennte hier auch ALLE fits nehmen und dann das beste auswaehlen!
	//1. what is more important? regular or compact?	
	//soll ich alle in betracht ziehen oder nur regular falls es welche gibt?

	let szu = options.szUniform;

	fittings = getSimpleFit(items, options);

	if (isEmpty(fittings)) {
		let res = getOverFits(items.length);
		let aRatio = options.containerShape == 'L' ? options.area.h / options.area.w : options.area.w / options.area.h;
		let rmin = 20000, best;
		for (const r of res) { let rnew = Math.abs(aRatio - r.s / r.l); if (rnew < rmin) { rmin = rnew; best = r; } }
		let rows, cols;
		if (options.containerShape == 'L') { rows = best.l; cols = best.s; } else { rows = best.s; cols = best.l; }
		options.hasRegularFittings = false;
		let [wCols, wGrid] = maxSumColumns(items.map(x => x.rect.w), rows, cols);
		let wExtra = options.area.w - wGrid;
		let hExtra = options.area.h - rows * szu.h;
		let fitting = { type: rows > cols ? 'P' : 'L', rows: rows, cols: cols, wExtra: wExtra, hExtra: hExtra, wCols: wCols };
		fittings.push(fitting);
	} else options.hasRegularFittings = true;

	//console.log('fittings: N=' + items.length); fittings.map(x => console.log(x));
	options.fittings = fittings;

	let bestFitting = getFittingMaximizeMinimalExtraSpace(fittings);
	//console.log('best max min extra', bestFitting);

	bestFitting = getFittingPreferLandscape(fittings); //nicht gut wenn lange worte und uniform sizing!
	//console.log('best landscape', bestFitting);

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

	return bestFitting;
}