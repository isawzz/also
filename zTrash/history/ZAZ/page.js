//#region page aufbau
function createPageDivsFullVisibleArea(above, tableStyles, below, defs = { bg: 'random', fg: 'contrast' }) {
	//console.log('defs',defs)
	clearElement(dMain);
	let dRightSide = mDiv(dMain, { display: 'flex', 'flex-direction': 'column', 'flex-grow': 10 });

	let table = mDiv(dRightSide, {}, 'table'); //table.innerHTML='hallo';

	for (const k in above) {
		let name = 'd' + capitalize(k);
		let ltop = get3ColLine(table, name + 'Left', name, name + 'Right', mergeOverride(defs, above[k]));
	}

	//sum up total heights of above,below
	let vals = Object.values(above);
	vals = vals.concat(Object.values(below));
	//console.log('vals', vals)
	let sum = arrSum(vals, 'h');
	// console.log('total height of lines is',sum)
	let hTable = percentVh(100) - sum;// + 4;//??????? //die 10 sind abstand von footer, die 30 sind footer
	let wTable = percentVw(100) - 20; //die 20 sind padding (je 10) von get3ColLine
	if (nundef(tableStyles)) tableStyles = {};
	tableStyles = mergeOverride({ bg: 'dimgray', w: wTable, h: hTable, vpadding: 0, hpadding: 0 }, tableStyles);
	let ltable = get3ColLine(table, 'dTableLeft', 'dTable', 'dTableRight', tableStyles);
	ltable.id = 'lTable';
	mSize(dTable.parentNode, '100%', '100%');
	mSize(dTable, '100%', '100%');

	for (const k in below) {
		let name = 'd' + capitalize(k);
		let lbottom = get3ColLine(table, name + 'Left', name, name + 'Right', mergeOverride(defs, below[k]));
	}
	// let lfooter = get3ColLine(table, 'dFooterLeft', 'dFooterMiddle', 'dFooterRight', { bg: 'orange' });
	dFooter.innerHTML = 'HALLO'; //mStyleX(lfooter, { bottom: 0 })

	let rect = getRect(dTable);
	return rect;
}
function get3ColLine(dParent, idleft, idmiddle, idright, styles = {}) {
	let dOuter = mDiv(dParent);

	let middleStyles = { fz: styles.fz, family: styles.family };
	delete styles.fz; delete styles.family;
	styles = mergeOverride({ wmin: '100%', vpadding: 4, hpadding: 10, box: true, h: 30 }, styles);
	//console.log(jsCopy(styles))
	mStyleX(dOuter, styles);

	// mStyleX(dOuter, { wmin: '100%', vpadding: 4, hpadding: 10, box: true, h: 30 });

	let dInner = mDiv(dOuter, { position: 'relative' });

	let l = mDiv(dInner, { family: 'arial', fz: 16, display: 'inline-block', position: 'absolute', wmin: 20 }, idleft)
	let m = mDiv(dInner, { fz: middleStyles.fz, family: middleStyles.family, w: '100%', align: 'center' }, idmiddle);
	let r = mDiv(dInner, { family: 'arial', fz: 16, display: 'inline-block', position: 'absolute', wmin: 20, top: 0, right: 0 }, idright);

	//mBy(idright).innerHTML=idright;console.log('????????????????????');

	return dOuter;
}
function getArea(dParent, styles, id) {
	let defStyles = { display: 'inline-block' };
	styles = mergeOverride(defStyles, styles);
	let d = mDiv(dParent, styles, id);

	return d;
}
function getMainArea(dParent, styles = {}) {
	clearElement(dParent);
	let dArea = getArea(dParent, styles);
	return dArea;

}
function getMainAreaPadding(dParent, padding = 10, bg = 'grey', styles = {}) {
	let aTable = percentOf(dParent, 100, 100);
	//console.log('in getMainAreaPadding',aTable);
	//let defAreaStyles = { w: aTable.w - padding, h: aTable.h - padding/2, bg: bg, layout: 'hcc',  };
	let defAreaStyles = { margin: padding, w: aTable.w - 2 * padding, h: aTable.h - 2 * padding, bg: bg, layout: 'hcc', };
	clearElement(dParent);
	let dArea = getArea(dParent, mergeOverride(defAreaStyles, styles));
	return dArea;

}
function getMainAreaPercent(dParent, bg = 'grey', wPercent = 94, hPercent = 96, id) {
	//console.log('clearing parent',dParent)
	clearElement(dParent);
	let aTable = percentOf(dParent, wPercent, hPercent); //getRect(dTable);
	let dArea = getArea(dParent, { w: aTable.w, h: aTable.h, layout: 'hcc', bg: bg }, id);
	return dArea;

}
function setPageBackground(bg, fg = 'white', isBase = true) {
	bg = colorHex(bg);
	//console.log('setting bg to', bg)
	if (isBase) DA.baseColor = bg;
	mStyleX(dMain, { bg: bg, fg: isdef(fg) ? fg : 'contrast' });
}
//#prefabs
function createSubtitledPage(bg = 'silver', title = 'Aristocracy', subtitle = '', footer = 'a game by F. Ludos') {

	setPageBackground(bg);
	createPageDivsFullVisibleArea({
		title: { h: 42, family: 'AlgerianRegular', fz: 36 },
		subtitle: { h: 30, fz: 16 },
		titleLine: { h: 5, bg: '#00000080' },
	}, { bg: '#00000050' }, { footer: { h: 30,fz:16 } }, {}); //table is above footer
	dTitle.innerHTML = title;
	dSubtitle.innerHTML = subtitle;
	dFooter.innerHTML = footer;

	addDummy();
}
function addDummy() {
	let b = mButton('', null, dTitleRight, { opacity: 0, h: 0, w: 0, padding: 0, margin: 0, outline: 'none', border: 'none', bg: 'transparent' });
	b.id = 'dummy';
	// let b=createElementFromHTML(`<button id="dummy" style="height: 0px; width: 0px; padding: 0; margin: 0; border: none; outline: none; background-color: transparent; color: transparent">dummy</button>`);
	// mAppend(dFooterLeft,b);

}

function toggleTheme() {
	let bg = colorHex(dMain.style.backgroundColor);
	let lum = getBrightness(bg);
	console.log('current:\nbg', bg, '\nbaseColor', DA.baseColor, '\nlum', lum);
	if (bg != DA.baseColor) setPageBackground(DA.baseColor, 'white', false);
	else if (lum <= .5) setPageBackground(colorLighter(bg), 'black', false);
	else setPageBackground(colorDarker(bg, 1), 'white', false);
}
function setTheme(isDark = true) {
	let bg = dMain.style.backgroundColor;
	let lum = getBrightness(bg);
	console.log('bg is', bg, 'lum', lum)
	if (isDark) {
		if (lum < .5) return;
		else {
			bg = colorDarker(bg);
			setPageBackground(bg);
			// mStyleX(dMain, { bg: bg });
			// let fg = 'pink';
			// let flum = getBrightness(fg);
			// console.log('background:', bg, 'lum:', lum, 'fg', fg, 'lum:', flum);
			// //let fg = 
			// //meaureLuminosity of bg
		}
	} else if (lum > .5) return; else { setPageBackground(colorLighter(bg)); }

}
