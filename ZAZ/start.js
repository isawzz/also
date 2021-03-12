async function _start() {
	//cycleThroughTestsOnClick();
	testOnClick(sample_fill_area_flex_uniform);

	// createSubtitledPage(BLUE);
	// sample_fill_area_flex_uniform(47);
	//sample_fill_area_flex_non_uniform(47);
	mReveal(dMain);
}

function testOnClick(test) {
	createSubtitledPage(BLUE);
	onclick = ()=>test();
	test();
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
function nextTest() {
	let f = Daat.fs[Daat.index];
	console.log('test:', f.name)
	f();
	Daat.index = (Daat.index + 1) % Daat.fs.length;
}

