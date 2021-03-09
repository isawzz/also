//#region page aufbau
function createPageDivsFullVisibleArea(above, tableStyles, below, defs={bg:'random',fg:'contrast'}) {
	//console.log('defs',defs)
	clearElement(dMain);
	let dRightSide = mDiv(dMain, { display: 'flex', 'flex-direction': 'column', 'flex-grow': 10 });

	let table = mDiv(dRightSide, {}, 'table'); //table.innerHTML='hallo';

	for (const k in above) {
		let name = 'd' + capitalize(k);
		let ltop = get3ColLine(table, name + 'Left', name, name + 'Right', mergeOverride(defs,above[k]));
	}

	//sum up total heights of above,below
	let vals = Object.values(above);
	vals = vals.concat(Object.values(below));
	//console.log('vals', vals)
	let sum = arrSum(vals, 'h');
	// console.log('total height of lines is',sum)
	let hTable = percentVh(100) - sum; //die 10 sind abstand von footer, die 30 sind footer
	let wTable = percentVw(100) - 20; //die 20 sind padding (je 10) von get3ColLine
	if (nundef(tableStyles)) tableStyles = {};
	tableStyles = mergeOverride({ bg: 'dimgray', w: wTable, h: hTable, vpadding: 0, hpadding: 0 }, tableStyles);
	let ltable = get3ColLine(table, 'dTableLeft', 'dTable', 'dTableRight', tableStyles);
	ltable.id = 'lTable';
	mSize(dTable.parentNode, '100%', '100%');
	mSize(dTable, '100%', '100%');

	for (const k in below) {
		let name = 'd' + capitalize(k);
		let lbottom = get3ColLine(table, name + 'Left', name, name + 'Right', mergeOverride(defs,below[k]));
	}
	// let lfooter = get3ColLine(table, 'dFooterLeft', 'dFooterMiddle', 'dFooterRight', { bg: 'orange' });
	dFooter.innerHTML = 'HALLO'; //mStyleX(lfooter, { bottom: 0 })

	let rect = getRect(dTable);
	return rect;
}
function get3ColLine(dParent, idleft, idmiddle, idright, styles = {}) {
	let dOuter = mDiv(dParent);

	styles = mergeOverride({ wmin: '100%', vpadding: 4, hpadding: 10, box: true, h: 30 }, styles);
	mStyleX(dOuter, styles);
	// mStyleX(dOuter, { wmin: '100%', vpadding: 4, hpadding: 10, box: true, h: 30 });

	let dInner = mDiv(dOuter, { position: 'relative' });

	let l = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idleft)
	let r = mDiv(dInner, { w: '100%', align: 'center' }, idmiddle);
	let m = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idright)

	return dOuter;
}
function getArea(dParent, styles, id) {
	let defStyles = { display: 'inline-block' };
	styles = mergeOverride(defStyles, styles);
	let d = mDiv(dParent, styles, id);

	return d;
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

//#prefabs
function createSubtitledPage(bg='silver',title='Aristocracy',subtitle='a game by F. Ludos',footer='enjoy!'){
	baseColor=bg;
	mStyleX(dMain,{bg:baseColor});
	createPageDivsFullVisibleArea({
		title: { h: 50, family: 'AlgerianRegular', fz: 40 },
		subtitle: { h: 30, fz: 16 },
		titleLine: { h: 5, bg: '#00000080' },
	}, { bg: '#00000050' }, { footer: { h: 30 } }, {}); //table is above footer
	dTitle.innerHTML = title;
	dSubtitle.innerHTML = subtitle;
	dFooter.innerHTML = footer;

}

