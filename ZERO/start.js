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

	//t92_makeText(); //t95_showImages(); //t96_parseEmojiString(); //t98_base(); 
	t99_showPics();
	//return;

}
