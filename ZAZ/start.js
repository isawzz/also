async function _start() {

	//repairSubgroups(); return; //instead of person-role, makes subgroups job,jobman,role
	//showGroupsSubgroups();

	createSubtitledPage('seagreen'); revealMain();
	console.log(DB);
	let data = genCats();
	let sample = new SolCatsClass(data);
	sample.prompt();


}

function nachbearbeitung(items, options) {

	let dGrid = mBy(options.idGrid);
	let dArea = mBy(options.idArea);
	let gRect = getRect(dGrid);
	let aRect = getRect(dArea);
	let itemRect = getRect(lDiv(items[0]));
	let [gsz, asz, itemsz] = [rectToSize(gRect), rectToSize(aRect), rectToSize(itemRect)]

	//console.log('grid:',gsz,'area',asz,'item',itemsz);
	let extra = options.area.h - gRect.h;
	let pv = valf(options.percentVertical, 50);

	let matop = extra * pv / 100;
	mStyleX(dGrid, { matop: matop });
	mReveal(dMain);
}
function testOnClick(test) {
	createSubtitledPage(BLUE);
	onclick = () => nextTest(test);
	nextTest(test);
}
function cycleThroughTestsOnClick() {
	DA = {
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
	if (nundef(f)) f = DA.fs[DA.index];
	console.log('test:', f.name);
	//dMain.style.opacity=0;
	let [items, options] = f();
	setTimeout(() => nachbearbeitung(items, options), 20);
	console.log('options', options)
	if (isdef(DA.index)) DA.index = (DA.index + 1) % DA.fs.length;
}
function showGroupsSubgroups() {
	for (const group in ByGroupSubgroup) {
		let g = ByGroupSubgroup[group];
		for (const sub in g) {
			s = g[sub];
			console.log('', group, sub, s);
		}
	}
	console.log(ByGroupSubgroup);

}
