function anim1(item, ms, callback) {

	//console.log(item,ms,callback)
	//let a = aTranslateBy(item.div, 100,100, ms);
	//let a = aRotate(item.div, ms);
	let a = aRotateAccel(item.div, ms);
	a.onfinish = callback;
}











