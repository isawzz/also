async function _start() {
	// cycleThroughTestsOnClick();
	//testOnClick(sample_idealGridLayout);

	createSubtitledPage(BLUE);
	[items,options] = sample_idealGridLayout(true,false);
	setTimeout(() => nachbearbeitung(items,options), 10);

	// sample_regular_uniform_grid_fill()
	// sample_fill_area_flex_uniform(47);
	//sample_fill_area_flex_non_uniform(47);
}
function rectToSize(r){return {w:r.w,h:r.h}}
function nachbearbeitung(items,options) {
	//nachbearbeitung!

	let dGrid = mBy(options.idGrid);
	let dArea = mBy(options.idArea);
	let gRect = getRect(dGrid);
	let aRect = getRect(dArea);
	let itemRect = getRect(lDiv(items[0]));
	let [gsz,asz,itemsz]=[rectToSize(gRect),rectToSize(aRect),rectToSize(itemRect)]

	console.log('grid:',gsz,'area',asz,'item',itemsz);
	let extra = options.area.h - gRect.h;
	let pv=valf(options.percentVertical,50);

	let matop = extra*pv/100;
	mStyleX(dGrid, { matop: matop });
	mReveal(dMain);
}
function testOnClick(test) {
	createSubtitledPage(BLUE);
	onclick = ()=>nextTest(test);
	nextTest(test);
}

function cycleThroughTestsOnClick() {
	Daat = {
		index: 0,
		fs: [sample_non_uniform_grid,
			sample_regular_uniform_grid,
			sample_regular_uniform_grid2,
			sample_non_uniform_grid_fill,
			sample_regular_uniform_grid_fill,
			sample_fill_area_none,
			sample_fill_area_flex_uniform,
			sample_fill_area_flex_non_uniform],
	};

	createSubtitledPage(BLUE);
	onclick = nextTest;
	nextTest();
}
function nextTest(f) {
	if (nundef(f))  f = Daat.fs[Daat.index];
	console.log('test:', f.name);
	//dMain.style.opacity=0;
	let [items,options] = f();
	setTimeout(() => nachbearbeitung(items,options), 20);
	console.log('options',options)
	if (isdef(Daat.index)) Daat.index = (Daat.index + 1) % Daat.fs.length;
}

