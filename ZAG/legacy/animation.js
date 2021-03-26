function anim1(item, ms, callback) {

	//console.log(item,ms,callback)
	//let a = aTranslateBy(iDiv(item), 100,100, ms);
	//let a = aRotate(iDiv(item), ms);
	let a = aRotateAccel(iDiv(item), ms);
	a.onfinish = callback;
}











