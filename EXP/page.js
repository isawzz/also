//#region page aufbau
function createPageDivsFullVisibleArea(){
	clearElement(dMain);
	let dRightSide = mDiv(dMain, { display: 'flex', 'flex-direction': 'column', 'flex-grow': 10 });

	let table = mDiv(dRightSide, { bg: 'green' }, 'table'); //table.innerHTML='hallo';

	let ltop = get3ColLine(table, 'dLeft', 'dMiddle', 'dRight', { bg: 'red' });
	let ltitle = get3ColLine(table, 'dTitleLeft', 'dTitleMiddle', 'dTitleRight', { bg: 'green' });

	let hTable = percentVh(100) - 60 - 30; //die 10 sind abstand von footer, die 30 sind footer
	let wTable = percentVw(100) - 20; //die 20 sind padding (je 10) von get3ColLine
	
	let ltable = get3ColLine(table, 'dTableLeft', 'dTable', 'dTableRight', { bg: 'dimgray', w: wTable, h: hTable });
	ltable.id='lTable';
	mStyleX(ltable,{vpadding: 0, hpadding: 0, h: hTable});
	mSize(dTable.parentNode, '100%', '100%');
	mSize(dTable, '100%', '100%'); 

	let lfooter = get3ColLine(table, 'dFooterLeft', 'dFooterMiddle', 'dFooterRight', { bg: 'orange' });
	dFooterMiddle.innerHTML = 'HALLO'; //mStyleX(lfooter, { bottom: 0 })

	let rect = getRect(dTable);
	return rect;
}
//#endregion

//#region 
function get3ColLine(dParent, idleft, idmiddle, idright, styles = {}) {
	let dOuter = mDiv(dParent);
	mStyleX(dOuter, { wmin: '100%', vpadding: 4, hpadding: 10, box: true, h: 30 });
	let dInner = mDiv(dOuter, { position: 'relative' });

	let l = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idleft)
	let r = mDiv(dInner, { w: '100%', align: 'center' }, idmiddle);
	let m = mDiv(dInner, { display: 'inline-block', position: 'absolute', wmin: 20 }, idright)

	mStyleX(dOuter, styles);
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
function getMainAreaPercent(dParent, bg = 'grey', wPercent = 94, hPercent = 96) {

	clearElement(dParent);
	let aTable = percentOf(dParent, wPercent, hPercent); //getRect(dTable);
	let dArea = getArea(dParent, { w: aTable.w, h: aTable.h, layout: 'hcc', bg: bg, });
	return dArea;

}



