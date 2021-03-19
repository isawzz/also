async function _start() {

	//console.log(DB);

	createSubtitledPage('indigo'); 
	mDiv(dTitleRight, { matop: -14 }, 'dRight');
	revealMain();

	// dSubtitle.innerHTML = 'phase: King'
	loadUser(null, dRight);
	loadGame('gAristo', dTitle);
	loadTable(null, dRight);
	// let data = genCats();
	// let sample = new SolCatsClass(data);
	// sample.prompt();

	//onclick=toggleTheme;
	//setTheme(false);
}

