window.onload = _loader;

async function _loader() {
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	Syms = await localOrRoute('Syms', '../assets/syms.yaml');
	SymKeys = Object.keys(Syms);

	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await dbInit('boardGames');
		_start();
	} else { dbLoad('boardGames', _start); }

}
async function _start() {
	console.assert(isdef(DB));

	initLive();
	dTable = mBy('dTable');
	Speech = new SpeechAPI('E');

	KeySets = getKeySets();

	t99();
	return;
	//test10_syms(); return;

	//show('freezer');
	//console.log('English to German Nouns:', EdDict);
	//recomputeBestED();
	//generateWordFiles(); //step 1 works!!!
	//let symNew = await makeNewSyms(); downloadAsYaml(symNew,'symNew')
	//return;

	//console.log('hallo');	mText('&#129427;',dTable,{fz:100,family:'segoe UI symbol'}); 	return;
	//showPicsS(null, {}, {}, ['zebra'], ['zebra']); return;

	//test04_textItems(); return;
	//let x=substringOfMinLength(' ha a ll adsdsd',3,3);console.log('|'+x+'|');return;
	// test06_submit(); return;
	//addonScreen(); return;
	//onclick=()=>test05_popup('think about the passcode!',24001); return;
	//test05_popup(); return; //test04_blankPageWithMessageAndCountdownAndBeep();return;
	// test12_vizOperationOhneParentDiv(); return;
	//test12_vizNumberOhneParentDiv();return;
	//test12_vizArithop(); return;
	//test11_zViewerCircleIcon(); return;
	//test11_zItemsX(); return;
	//test03_maShowPictures(); return;
	//let keys = symKeysByType.icon;	keys=keys.filter(x=>x.includes('tower'));	console.log(keys);	iconViewer(keys);	return;

	//onClickTemple(); return;
	if (ALLOW_CALIBRATION) show('dCalibrate');
	if (SHOW_FREEZER) show('freezer'); else startUnit();

}
