async function _start() {
	t87_showPicsEmptyOptions(); //t89_showPics(); //t99_showPics();
	//t88_showPicsClean();
	//t92_makeText(); //t95_showImages(); //t96_parseEmojiString(); //t98_base(); 
	//return;
}

window.onclick = () => { clearElement(dTable); t87_showPicsEmptyOptions(); }
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
	//dTable = initTable();mStyleX(dTable,{w:'100%'})
	Speech = new SpeechAPI('E');
	KeySets = getKeySets();

	_start()

}

function initTable() {
	let table = mBy('table');
	clearElement(table);

	dLineTableOuter = mDiv(table); dLineTableOuter.id = 'lineTableOuter';
	dLineTable = mDiv(dLineTableOuter); dLineTable.id = 'lineTable';
	dLineTableLeft = mDiv(dLineTable); dLineTableLeft.id = 'lineTableLeft';
	dLineTableMiddle = mDiv(dLineTable); dLineTableMiddle.id = 'lineTableMiddle';
	mClass(dLineTableMiddle, 'flexWrap');
	dLineTableRight = mDiv(dLineTable); dLineTableRight.id = 'lineTableRight';

	mGap(table, 10);

	dTable = dLineTableMiddle;
	return dTable;
	// dTitle = dLineTitleMiddle;
	//console.log(dTable,dTitle)
}

