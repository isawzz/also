async function _start() {
	zazTest00(chooseRandom(range(3, 100)), { wper: chooseRandom([25, 50, 75, 90]), hper: chooseRandom([25, 50, 75, 90]), 
		maxlen: 18, lang:chooseRandom(['E','D','F','S']), luc: 'c', szPic: { w: 100, h: 100 } }); //chooseRandom(range(1,100))); //12,32,56,100]));
	//zazTest59(97,25,25);
	//zazTest01(7,75,90);
	//zazTest01(43,25,50);
	mReveal(dMain);
}





