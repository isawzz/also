async function _start() {
	testOnClick(zazTest09); //zazTest02();
	//zazTest00(chooseRandom(range(1, 24)), { showLabels:true, fzText:20, fzPic:80, wper: chooseRandom([25, 50, 75, 90]), hper: chooseRandom([25, 50, 75, 90]), maxlen: 18, lang:chooseRandom(['E','D','F','S']), luc: 'c' }); //chooseRandom(range(1,100))); //12,32,56,100]));
	//zazTest01(4,50,25);
	//zazTest01(7,75,90);
	//zazTest01(43,25,50);
	mReveal(dMain);
}

function testOnClick(test) {
	createSubtitledPage(BLUE);
	onclick = test;
	test();
}



