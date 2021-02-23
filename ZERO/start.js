async function _start() {

	console.log('next reassemble chunks into 1 big file!')
	checkText3();
	//let d=await makeWordList();
	//let d=await makeDictionary();

	//t70_showSym(); return;
	// let x=endsWith('TOP arrow arrow', 'marine');console.log(x);//return;
	// x=isColorName(stringBefore('beating heart',' heart'));console.log(x);
	
	//let x=includesAnyOf('green book',['green','blue','orange']); console.log('x',x);return;
	// loadGroupsAndCategories(); //t72_manTeacher();
	//t77_singleUnicode();
	//rebuildSyms(); 
	//downloadEmojiTestPlusSymsEmo();//t74_mCombinedUnicode(); //t74_combinedUnicode(); //t75_singleUnicode();
	//t80_tableGrowHeight();
	//t78_rightSidebarBehavior();//t78_sidebarBehavior();
	//t79_coolIdsSindVars();
	//t81_singleUnicode();//t82_Live(); //t83_showPics_N_area_testNoParent();//t84_showPics_();//t86_showPicsCenterFlex();
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

