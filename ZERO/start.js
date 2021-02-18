async function _start() {

	//t79_coolIdsSindVars();
	t80_tableInCenter(); //t81_singleUnicode();//t82_Live(); //t83_showPics_N_area_testNoParent();//t84_showPics_();//t86_showPicsCenterFlex();
	//t87_showPicsEmptyOptions(); //t89_showPics(); //t99_showPics();
	//t88_showPics_CLEAN();
	//t92_makeText(); //t95_showImages(); //t96_parseEmojiString(); //t98_base(); 
	//return;
}

//window.onclick = () => { clearElement(dTable); t82_Live(); }
window.onload = _loader;

async function _loader() {
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	Syms = await localOrRoute('Syms', '../assets/syms.yaml');
	SymKeys = Object.keys(Syms);

	if (BROADCAST_SETTINGS) {
		//console.log('...broadcasting ...')
		await dbInit('boardGames');
		_start0();
	} else { dbLoad('boardGames', _start0); }

}
async function _start0() {
	console.assert(isdef(DB));

	initLive();
	Speech = new SpeechAPI('E');
	KeySets = getKeySets();

	_start();

}

