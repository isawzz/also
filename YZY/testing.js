//test areas
function test09() {
	let areas;
	function prepare(dParent) {
		areas = makeAreas(dTable);
	}
	function presentState(state, dParent) {
		let trick = arrFlatten(state.pl1.trick).concat(arrFlatten(state.pl2.trick));
		let pl1Hand = state.pl1.hand;
		let pl2Hand = state.pl2.hand;
		let arrs = [trick, pl1Hand, pl2Hand];
		for (let i = 0; i < 3; i++) {
			let arr = arrs[i];
			let item = areas[i];
			let d = diContent(item);
			let id = 'h' + i;
			iMessage(item, '');
			// iMakeHand_test(d, arr, id);
			iH00(arr, d, { bg: 'blue' }, id);

		}
	}
	return {
		
	}

}
function presentState(state, dParent) {
	let trick = arrFlatten(state.pl1.trick).concat(arrFlatten(state.pl2.trick));
	let pl1Hand = state.pl1.hand;
	let pl2Hand = state.pl2.hand;
	let arrs = [trick, pl1Hand, pl2Hand];
	let items = makeAreas(dParent);
	for (let i = 0; i < 3; i++) {
		let arr = arrs[i];
		let item = items[i];
		let d = diContent(item);
		let id = 'h' + i;
		iMessage(item, '');
		// iMakeHand_test(d, arr, id);
		iH00(arr, d, { bg: 'blue' }, id);

	}
}
function makeAreas(dTable) {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '90%', padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	let layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};
	// areas.T.areaStyles.w='100%';

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
function rTest08() {
	let state = {
		pl1: { hand: [1, 2, 3, 4, 5], trick: [[6]] },
		pl2: { hand: [11, 12, 13, 14, 15], trick: [[16]] },
	};
	let trick = arrFlatten(state.pl1.trick).concat(arrFlatten(state.pl2.trick));
	let pl1Hand = state.pl1.hand;
	let pl2Hand = state.pl2.hand;
	let arrs = [trick, pl1Hand, pl2Hand];
	let items = rTest07_helper();
	for (let i = 0; i < 3; i++) {
		let arr = arrs[i];
		let item = items[i];
		let d = diContent(item);
		let id = 'h' + i;
		iMessage(item, '');
		// iMakeHand_test(d, arr, id);
		iH00(arr, d, { bg: 'blue' }, id);

	}
}
function rTest07() {
	let items = rTest07_helper();
	// let card = Card52._createUi('Q', 'H', 70, 110);
	// console.log(card);
	// let item = items[0];
	// let dContent = diContent(item);
	// console.log(item, dContent);
	//iAddContent(item,iDiv(card));

	for (let i = 0; i < 3; i++) {
		let arr = [0, 1, 2, 10, 11].map(x => 1 + (x + i * 13) % 52);
		let d = diContent(items[i]);
		let id = 'h' + i;
		// iMakeHand_test(d, arr, id);
		iH00(arr, d, { bg: 'blue' }, id);

	}
}
function rTest07_helper() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '90%', padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	let layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};
	// areas.T.areaStyles.w='100%';

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
function rTest06_clean_OK() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '90%', hmin: 400, padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	let layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};
	areas.T.areaStyles.w = '100%';

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
function rTest05() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '80%', h: 400, padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	// let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '80%', h: 400, padding: 10, display: 'inline-grid' }, 'dGrid');
	//mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });
	//let dGrid = mDiv100(dTable, { display: 'inline-grid' });//,'dGrid');


	let layout = ['T', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'random', rounding: 6 };//,box:true };
	let contentStyles = { bg: 'dimgray', lowerRounding: 6 };
	let messageStyles = { bg: 'dimgray', fg: 'yellow' };
	let titleStyles = { family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)

		// let dCell = mDiv(dGrid, { h:'100%', w:'100%', bg: 'random', 'grid-area': k, });
		// if (shadeAreaBackgrounds) { dCell.style.backgroundColor = palette[ipal]; ipal = (ipal + 1) % palette.length; }
		// if (a.showTitle) { 
		// 	dCell=mTitledDiv(a.title,dCell,{bg: 'green',},{h:'100%', w:'100%', bg: 'yellow',},a.id)
		// 	// dCell.innerHTML = makeAreaNameDomel(areaName); 
		// }else {dCell.id=a.id;}
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		// item.div = dCell;item.dTitle=dCell.children[0];item.dMessage=dCell.children[1];item.dContent=dCell.children[2];
		items.push(item);
	}
	return items;


}
function rTest04() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { bg: 'red', w: '80%', h: 400, padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	//mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });
	//let dGrid = mDiv100(dTable, { display: 'inline-grid' });//,'dGrid');
	let layout = ['T', 'H A'];
	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	createAreas(dGrid, x, 'dGrid');


}
function rTest03_OK() {
	setBackgroundColor('random');
	mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });
	let dGrid = mDiv100(dTable, { display: 'inline-grid' });//,'dGrid');
	let layout = ['T', 'H A'];
	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	createAreas(dGrid, x, 'a');


}
function rTest02() {
	setBackgroundColor('random');
	mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });

	let SPEC = { layout: ['T', 'H A'], showAreaNames: true };
	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) { if (!isEmpty(l)) arr.push(l); }
		m.push(arr);
	}
	console.log('m', m, '\ns', s); return;

}
function rTest01() {

	rAreas();
}




//testing cards
function cTest03_2HandsRandom() {
	let h1 = iMakeHand_test(dTable, [33, 7, 1, 2, 3, 4], 'h1');
	let h2 = iMakeHand_test(dTable, [13, 14, 15, 16, 17], 'h2');
	//console.log('DA', DA)

	setTimeout(cTest03_2Hands_transferStarts, 1000);

}
function cTest03_2Hands_transferStarts() {

	let h1 = DA.h1.iHand;
	let n1 = h1.items.length;
	//console.log('hand h1 has', n1, 'cards');
	let h2 = DA.h2.iHand;
	let n2 = h2.items.length;
	//console.log('hand h2 has', n2, 'cards');
	//console.assert(n2 == DA.h2.deck.count());

	let c = chooseRandom(h2.items);
	DA.item = c;

	let w = c.w;
	let ov = w / 4;
	let xOffset = n1 * ov;
	console.log('w', w, 'ov', ov, 'xOffset', xOffset)

	iMoveFromTo(c, h2.div, h1.div, cTest03_2Hands_transfer, { x: xOffset, y: 0 });
}
function cTest03_2Hands_transfer() {
	//modify the deck object
	let deck1 = DA.h1.deck;
	let deck2 = DA.h2.deck;
	let item = DA.item;

	deck1.addTop(item.val);
	deck2.remove(item.val);

	iPresentHand_test(dTable, DA.h1);
	iPresentHand_test(dTable, DA.h2);
	iSortHand_test(dTable, DA.h1)

}
function cTest10() {
	//let SPEC = { layout: ['T T', 'H A'], showAreaNames: true };
	let layout = ['T', 'H A'];
	let x = createGridLayout(dTable, layout);
	console.log('x', x);
}
function cTest05() {
	setBackgroundColor('random')
	mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });

	let SPEC = { layout: ['T T', 'H A'], showAreaNames: true };
	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) { if (!isEmpty(l)) arr.push(l); }
		m.push(arr);
	}
	console.log('m', m, '\ns', s); return;

	//was ist diese m?
	let rows = SPEC.layout.length;
	let hCard = 110;
	let hTitle = 20;
	let gap = 4;
	let hGrid = rows * (hCard + hTitle) + gap * (rows + 1);
	let wGrid = '80%';

	let dGrid = mDiv(dTable, { h: hGrid, w: wGrid, 'grid-template-areas': s, bg: 'yellow' });




}
function cTest05B() {
	//let dParent = mDiv100(dTable,{bg:'green'});
	let dGridContainer = mDiv100(dTable, { bg: 'yellow' });

	let areas = mAreas(dGridContainer);
	areas.map(x => mCenterCenterFlex(x.div));
	let dGrid = dGridContainer.children[0];
	mStyleX(dGrid, { gap: 5, bg: 'blue', box: true, padding: 5 })
	console.log(dTrick, dGridContainer.children[0]);

	//what is the size of the content div in any of the areas?
	areas.map(x => mStyleX(x.div, { h: 110 }));
}
function cTest04_2HandsRandom() {
	// let h1 = iMakeHand([33, 7, 1, 2, 3, 4], dTable,{}, 'h1');
	let iarr = [33, 7, 1, 2, 3, 4], dParent = dTable, id = 'h1';
	let data = DA[id] = {};
	let h = data.deck = new Deck();
	h.init(iarr);
	//iPresentHand_test(dParent, data);
	let redo = true;
	h = data;
	if (nundef(h.zone)) {
		let nmax = 10, padding = 10;
		let sz = netHandSize(nmax);
		//h.zone = iHandZone_test(dParent);
		h.zone = mZone(dParent, { w: sz.w, h: sz.h, bg: 'random', padding: padding, rounding: 10 });
	} else {
		clearElement(h.zone);
	}
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	// return h;
	// return data;


	let h2 = iMakeHand([13, 14, 15, 16, 17], dParent, {}, 'h2');
	//console.log('DA', DA)

	setTimeout(cTest03_2Hands_transferStarts, 1000);

}



//testing board
function bTest01() {
	let arr = [1, 1, 1, 1, 2, 1, 0, 1, 0], rows = 3, cols = 3, irow = 0;// =>1
	console.log(bFullRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, 1, 2, 1, 1, 1, 0], rows = 3, cols = 3, irow = 2;// =>null
	console.log(bFullRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, 1, 2, 1, 1, 1, 0], rows = 3, cols = 3, icol = 0;// =>1
	console.log(bFullCol(arr, icol, rows, cols));
	console.log('____________')
	arr = [1, 1, 0, 2, 1, 1, 1, 0, 1], rows = 3, cols = 3;// =>1
	console.log(bFullDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 2, 1, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bFullDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 2, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bFullDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 2, 1, 2, 1, 2, 1, 2, 2], rows = 3, cols = 3;// =>1
	console.log(bFullDiag2(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 0, 1, 0, 0, 1], rows = 3, cols = 3;// =>0
	console.log(bFullDiag2(arr, rows, cols));
	console.log('============================')
}
function bTest02() {
	let arr = [1, null, 1, 1, 2, 1, 0, 1, 0], rows = 3, cols = 3, irow = 0;// =>1
	console.log(bPartialRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, 1, 0, 1, 1, 1, 2], rows = 3, cols = 3, irow = 2;// =>null
	console.log(bPartialRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, null, 2, 1, 1, 1, 0], rows = 3, cols = 3, icol = 0;// =>1
	console.log(bPartialCol(arr, icol, rows, cols));
	console.log('____________')
	arr = [1, 1, 0, 2, null, 1, 1, 0, 1], rows = 3, cols = 3;// =>1
	console.log(bPartialDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 2, 1, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bPartialDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 2, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bPartialDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 2, 1, 2, null, 2, 1, 2, 2], rows = 3, cols = 3;// =>1
	console.log(bPartialDiag2(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 0, 1, 0, 0, 1], rows = 3, cols = 3;// =>0
	console.log(bPartialDiag2(arr, rows, cols));
}
//connect4 tests: stride
function bTest03() {
	let arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	let arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	[0, 0, 0, 'O', 'O', 'O', 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	[0, 'O', 'O', 'O', 'O', 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	[0, 0, 0, 'O', 'O', 'O', 'O']]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');

}
function bTest04() {
	let arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 0, 0, 0, 0, 0, 0],
	['O', 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	let arrf = arrFlatten(arr), rows = 6, cols = 7, icol = 0, stride = 4;// =>1
	console.log('stride in col', icol + ':', bStrideCol(arrf, icol, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'O', 0, 0],
	['O', 'X', 0, 0, 'X', 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, icol = 4, stride = 4;// =>1
	console.log('stride in col', icol + ':', bStrideCol(arrf, icol, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 'X', 0, 'X', 0, 0],
	[0, 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'X', 0, 0],
	['O', 'X', 0, 0, 'O', 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, icol = 4, stride = 4;// =>1
	console.log('stride in col', icol + ':', bStrideCol(arrf, icol, rows, cols, stride));
	console.log('____________');
}
function bTest05() {
	let arr = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		['O', 0, 0, 0, 0, 0, 0],
		[0, 'O', 0, 0, 0, 0, 0],
		['O', 'X', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	let arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 2, icol = 0, stride = 4;// =>1
	console.log('stride in diag', irow, icol + ':', bStrideDiagFrom(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
	arr = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 'X', 0],
		['O', 0, 0, 0, 0, 0, 'X'],
		[0, 'O', 0, 0, 0, 0, 0],
		['O', 'X', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 1, icol = 5, stride = 4;// =>1
	console.log('stride in diag', irow, icol + ':', bStrideDiagFrom(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
	arr = [
		[0, 0, 0, 0, 0, 0, 'X'],
		[0, 0, 0, 0, 0, 'X', 0],
		['O', 0, 0, 0, 'X', 0, 'X'],
		[0, 'O', 0, 'X', 0, 0, 0],
		['O', 'X', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 0, icol = 6, stride = 4;// =>1
	console.log('stride in diag2', irow, icol + ':', bStrideDiag2From(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
	arr = [
		[0, 0, 0, 0, 0, 0, 'X'],
		[0, 0, 0, 0, 0, 'X', 0],
		['O', 0, 0, 'O', 'X', 0, 'X'],
		[0, 'O', 'O', 'X', 0, 0, 0],
		['O', 'O', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 2, icol = 3, stride = 4;// =>1
	console.log('stride in diag2', irow, icol + ':', bStrideDiag2From(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
}
function bTest06() {
	let pos = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 'X', 0, 0, 0, 0, 0],
		[0, 'X', 0, 'O', 0, 0, 0],
		['O', 'X', 0, 'O', 0, 0, 0],
		['O', 'X', 0, 'O', 0, 0, 0]];

	let arr = arrFlatten(pos);
	let str = bStrideCol(arr, 1, 6, 7, 4);
	console.log('stride', str)
	let w = checkWinnerC4(arr, 6, 7, 4);
	printState(arr)
	console.log('w', w);

}
function bTest07() {
	let arr = [0, 0, 0, 0, 0, 0, 0, "X", 0, 0, 0, 0, 0, 0, "X", 0, 0, "X", "X", 0, "O", "X", 0, "X", "O", "O", "O", "X", "O", "X", "O", "O", "O", "X", "O", "O", "X", "O", "O", "O", "X", "O"];
	let w = checkWinnerC4(arr, 6, 7, 4);
	printState(arr)
	console.log('w', w);
}
function bTest08() {
	let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "X", 0, 0, 0, "X", 0, 0, "O", 0, 0, 0, "O", "X", 0, "O", 0, 0, 0, "O", "X", "O", "O", "O", "O", 0];
	let w = checkWinnerC4(arr, 6, 7, 4);
	printState(arr)
	console.log('w', w);
}
function bTest09() {
	let pos = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 'X', 0, 0, 0],
		[0, 'X', 0, 'O', 0],
		['O', 'X', 0, 'O', 0]];

	let arr = arrFlatten(pos);
	let nei = bNei(arr, 6, 5, 5);
	console.log(nei)
	nei = bNei(arr, 0, 5, 5);
	console.log(nei)
	nei = bNei(arr, 24, 5, 5);
	console.log(nei)
}
function bTest10() {
	let pos = [
		[0, 1, 2, 3, 4, 5],
		[6, 7, 8, 9, 10, 11],
		[12, 13, 14, 15, 16, 17],
		[18, 19, 20, 21, 22, 23],
		[24, 25, 26, 27, 28, 29]];

	let arr = arrFlatten(pos);
	printState(arr);
	let nei = bNei(arr, 6, 6, 6);
	console.log(nei);
	nei = bNei(arr, 7, 6, 6);
	console.log(nei);
	nei = bNei(arr, 16, 6, 6);
	console.log(nei);
}

function btest11_fractions() {

	let a = math.fraction(1, 4);
	let b = math.fraction(1, 4);
	let c = math.multiply(a, b);
	console.log(a, b, c);
	let d = math.add(a, b);
	console.log(d)
	let e = math.multiply(2, a);
	console.log(e)
}

//test krieg game!
function kriegTest00(game) {
	game.load({ pl1: { hand: ['TH', 'KH'] }, pl2: { hand: ['9C', 'QC'] } }); game.deck.sort(); game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	for (let i = 0; i < 2; i++) { game.make_random_move(); game.make_random_move(); game.print_state(); if (game.is_out_of_cards()) { console.log('game over!'); break; } }

}
function kriegTest01(game) {
	game.load({ pl1: { hand: ['TH', 'QH'] }, pl2: { hand: ['9C', 'KC'] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state();
	for (let i = 0; i < 8; i++) {
		game.make_random_moveX();
		game.print_state();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over!'); break; }
	}

}

function kriegTest02(game) {
	game.load({ pl1: { hand: ['TH'], trick: [['2H']] }, pl2: { hand: ['9C', 'KC'] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');
	for (let i = 0; i < 12; i++) {
		game.make_random_move();
		game.print_state('move:');
		game.resolve();
		game.swap_turn();
		if (i % 2 == 0) game.print_state('after resolve:');

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over!'); break; }
	}

}

function kriegTest03(game) {
	game.load({ pl1: { hand: ['TH'], trick: [['2H']] }, pl2: { hand: ['9C'], trick: [['KC']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');

	//es sollte resolve passieren! und dann sollte 0 dran sein!
	//return;

	for (let i = 0; i < 10; i++) {
		game.make_random_move();
		game.print_state('move:');
		game.resolve();
		game.swap_turn();
		if (i % 2 == 1) game.print_state('after resolve:');

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over!'); break; }
	}

}

function kriegTest04(game) {
	game.load({ pl1: { name: 'felix', hand: ['TH'], trick: [['2H']] }, pl2: { name: 'max', hand: ['9C'], trick: [['2C']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');

	for (let i = 0; i < 2; i++) {
		game.make_random_move();
		game.print_state('move:');

		//only resolve if second player has played!!!!!!!!!
		console.log('turn', game.iturn)
		if (game.iturn == 1) {
			game.resolve();
			game.swap_turn();
			game.print_state('after resolve:');
		} else game.swap_turn();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over! winner', game.winner().name); break; }
	}

}

function kriegTest05(game) {
	game.load();//{ pl1: { name:'felix',hand: ['TH'], trick: [['2H']] }, pl2: { name:'max',hand: ['9C'], trick: [['2C']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');

	for (let i = 0; i < 25; i++) {
		game.make_random_move();
		game.print_state('move:');

		//only resolve if second player has played!!!!!!!!!
		console.log('turn', game.iturn)
		if (game.iturn == 1) {
			game.resolve();
			game.swap_turn();
			game.print_state('after resolve:');
		} else game.swap_turn();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over! winner', game.winner().index); break; }
	}

}

function kriegTest06(game) {
	game.load();//{ pl1: { name:'felix',hand: ['TH'], trick: [['2H']] }, pl2: { name:'max',hand: ['9C'], trick: [['2C']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');
	let front = new GKriegFront();
	front.presentState(game.get_state(), dTable);
	return;

	for (let i = 0; i < 25; i++) {
		game.make_random_move();
		game.print_state('move:');

		//only resolve if second player has played!!!!!!!!!
		console.log('turn', game.iturn)
		if (game.iturn == 1) {
			game.resolve();
			game.swap_turn();
			game.print_state('after resolve:');
		} else game.swap_turn();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over! winner', game.winner().index); break; }
	}

}
function kriegTest00UI() {
	setBackgroundColor('random');
	clearElement(dTable)
	let back = new GKriegBack();
	back.load({ pl1: { name: 'felix', hand: ['TH', 'KH'] }, pl2: { name: 'tom', hand: ['9C', 'QC'] } }); back.deck.sort(); back.print_state();
	let front = new GKriegFront(130);
	front.presentState(back.get_state(), dTable);

	mLinebreak(dTable, 50);
	mButton('Move!', () => kriegTest00UI_engine(back, front), dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);

}
function kriegTest00UI_engine(back, front) {
	if (back.is_out_of_cards()) { console.log('!!!!!!!!!!!!!!!!'); front.presentGameover(back.winner(), kriegTest00UI); return; }

	clearTable(dTable);
	back.make_random_moveX();
	back.make_random_moveX();
	back.print_state();
	front.presentState(back.get_state(), dTable);
	if (back.is_out_of_cards()) { console.log('game over!'); front.presentGameover(back.winner(), kriegTest00UI); return; }

	mLinebreak(dTable, 50);
	mButton('Move!', () => kriegTest00UI_engine(back, front), dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
}



























