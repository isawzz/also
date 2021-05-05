function mAreas(dParent, SPEC = { layout: ['T T', 'H A'], showAreaNames: true }) {
	//let d = mDiv(dParent, { w: '100%', h: '100%', hmin: 270, bg: 'red', display: 'grid' }); //d.style.display = 'inline-grid'; //d.style.justifyContent = 'center'
	
	let d=dParent;
	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) { if (!isEmpty(l)) arr.push(l); }
		m.push(arr);
	}
	//console.log(m);
	console.log('s', s)
	d.style.gridTemplateAreas = s;// eg. '"z z z" "a b c" "d e f"';

	if (SPEC.collapseEmptySmallLetterAreas) { collapseSmallLetterAreas(m, d); }
	else fixedSizeGrid(m, d);

	SPEC.areas = { T: 'dTrick', H: 'dHuman', A: 'dAI' };
	let palette = getTransPalette9(); //getPalette(color);//palette.length-1;
	let ipal = 1;

	let result = [];
	for (const k in SPEC.areas) {
		let areaName = SPEC.areas[k];
		let dCell = mDiv(d, { h:'100%', w:'100%', bg: 'red', 'grid-area': k, });

		if (SPEC.shadeAreaBackgrounds) { dCell.style.backgroundColor = palette[ipal]; ipal = (ipal + 1) % palette.length; }
		if (SPEC.showAreaNames) { 
			dCell=mTitledDiv(areaName,dCell,{bg: 'green',},{h:'100%', w:'100%', bg: 'yellow',},areaName)
			// dCell.innerHTML = makeAreaNameDomel(areaName); 
		}else {dCell.id=areaName;}
		//UIS[areaName] = { elem: d1, children: [] };
		// d.appendChild(d1);
		//mStyleX(dCell,{padding:50,box:true})
		result.push({ name: areaName, div: dCell });
	}
	return result;
}

function makeAreaNameDomel(areaName) { return `<div style='width:100%'>${areaName}</div>`; }
function mArea() {

}
function collapseSmallLetterAreas(m, d) {
	//how many columns does this grid have?
	let rows = m.length;
	let cols = m[0].length;
	//console.log(m);

	let gtc = [];
	for (let c = 0; c < cols; c++) {
		gtc[c] = 'min-content';
		for (let r = 0; r < rows; r++) {
			let sArea = m[r][c];
			//console.log(c, r, m[r], m[r][c]);
			if (sArea[0] == sArea[0].toUpperCase()) gtc[c] = 'auto';
		}
	}
	let cres = gtc.join(' ');
	//console.log('cols', cres);
	d.style.gridTemplateColumns = gtc.join(' '); //'min-content 1fr 1fr min-content';// 'min-content'.repeat(rows);

	let gtr = [];
	for (let r = 0; r < rows; r++) {
		gtr[r] = 'min-content';
		for (let c = 0; c < cols; c++) {
			let sArea = m[r][c];
			//console.log(r, c, m[r], m[r][c]);
			if (sArea[0] == sArea[0].toUpperCase()) gtr[r] = 'auto';
		}
	}
	let rres = gtr.join(' ');
	//console.log('rows', rres);
	d.style.gridTemplateRows = gtr.join(' '); //'min-content 1fr 1fr min-content';// 'min-content'.repeat(rows);

	// d.style.gridTemplateRows = '1fr 1fr min-content min-content';// 'min-content'.repeat(cols);

}
function fixedSizeGrid(m, d) {
	let rows = m.length;
	let cols = m[0].length;
	d.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)'; // gtc.join(' '); //'min-content 1fr 1fr min-content';// 'min-content'.repeat(rows);
	d.style.gridTemplateRows = 'repeat(' + rows + ',1fr)'; // //'min-content 1fr 1fr min-content';// 'min-content'.repeat(rows);
}
function mAreas_dep(dTable, SPEC = { layout: ['T T', 'H A'], showAreaNames: true }) {
	let d = mDiv(dTable, { w: '100%', h: '100%', hmin: 270, bg: 'red', display: 'grid' }); //d.style.display = 'inline-grid'; //d.style.justifyContent = 'center'

	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) { if (!isEmpty(l)) arr.push(l); }
		m.push(arr);
	}
	//console.log(m);
	console.log('s', s)
	d.style.gridTemplateAreas = s;// eg. '"z z z" "a b c" "d e f"';

	if (SPEC.collapseEmptySmallLetterAreas) { collapseSmallLetterAreas(m, d); }
	else fixedSizeGrid(m, d);

	SPEC.areas = { T: 'dTrick', H: 'dHuman', A: 'dAI' };
	let palette = getTransPalette9(); //getPalette(color);//palette.length-1;
	let ipal = 1;

	let result = [];
	for (const k in SPEC.areas) {
		let areaName = SPEC.areas[k];
		let dCell = mDiv(d, { h:'100%', w:'100%', bg: 'red', 'grid-area': k, });

		if (SPEC.shadeAreaBackgrounds) { dCell.style.backgroundColor = palette[ipal]; ipal = (ipal + 1) % palette.length; }
		if (SPEC.showAreaNames) { 
			dCell=mTitledDiv(areaName,dCell,{bg: 'green',},{h:'100%', w:'100%', bg: 'yellow',},areaName)
			// dCell.innerHTML = makeAreaNameDomel(areaName); 
		}else {dCell.id=areaName;}
		//UIS[areaName] = { elem: d1, children: [] };
		// d.appendChild(d1);
		//mStyleX(dCell,{padding:50,box:true})
		result.push({ name: areaName, div: dCell });
	}
	return result;
}
class GKriegFront {
	constructor(hPlayer, dParent) {
		this.hPlayer = hPlayer;
		let dGrid = mDiv100(dParent, { bg: 'yellow' });
		let areas = this.areas = mAreas(dGrid);
		areas.map(x=>mCenterCenterFlex(x.div));
		console.log(areas);
	}
	clear(){
		this.areas.map(x=>clearElement(x.div));
	}
	presentState(state) {
		this.clear();
		this.showTrick(dTrick);
		this.showHands();
	}
	showTrick(dParent) {
		clearElement(dTrick)
		console.log('hallo!')
		//mCenterFlex(dParent)
		let idx = G.back.turn();
		let pl = G.players[idx], opp = G.players[idx == 0 ? 1 : 0];
		let bpl = G.back.player(), bopp = G.back.opponent();
		let order = [opp, pl];
		for (let i = 0; i < Math.max(bpl.trick.length, bopp.trick.length); i++) {
			let hand = [];
			if (bopp.trick.length > i) hand = hand.concat(bopp.trick[i]);
			if (bpl.trick.length > i) hand = hand.concat(bpl.trick[i]);
			let h = iMakeHand(hand, dParent, {  }, getUID());
			console.log('i',i,'hand',hand, h);
			let d=h.zone;
			//mStyleX(d,{matop:50,h:'100%'})
		}
	}
	showHands(){
		let human = firstCond(G.back.players, x => x.name == G.human.id);
		console.log('human player is', human);
		console.log('human',human)
		let hpl = iMakeHand(human.hand, dHuman, { hpadding: 10, hmargin: 10 }, getUID());

		let ai = firstCond(G.back.players, x => x.name == G.ai.id);
		console.log('human player is', ai);
		hpl = iMakeHand(ai.hand, dAI, { hpadding: 10, hmargin: 10 }, getUID());
	}
}
function isBoard(x) { return false; }
function isCardHand(x) { return isList(x) && !isEmpty(x) && isNumber(x[0]); }
function isPlayer(x) { return isdef(x.hand) }
