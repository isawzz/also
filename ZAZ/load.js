//window.onclick = () => { clearElement(dTable); t82_Live(); }
window.onload = _loader;

async function _loader() {
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	Syms = await localOrRoute('Syms', '../assets/syms.yaml');
	let symsNo = await localOrRoute('Syms', '../assets/symsNo.yaml');
	for(const k in symsNo){ delete Syms[k.toLowerCase()]; }
	SymKeys = Object.keys(Syms);

	//dbInit:
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
