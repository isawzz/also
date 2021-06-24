function makeAreas(dParent,layout) {
	// setBackgroundColor('random');
	let dGrid = mDiv(dParent, { gap: 10, bg: 'white', w: '90%', padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	if (nundef(layout)) layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];
	let x = createGridLayout(dGrid, layout); //teilt dGrid in areas ein

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: true },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: false },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: false },
	};

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles, item.titleOnTop)
		//console.log('children', dCell.children);
		iRegister(item, item.id);
		if (item.titleOnTop) iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		else iAdd(item, { div: dCell, dTitle: dCell.children[2], dMessage: dCell.children[0], dContent: dCell.children[1] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
