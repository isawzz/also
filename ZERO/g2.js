function infoToItem(x) { return { info: x, key: x.key }; }
function detectItems(n) {
	// if (isNumber(n)) n=choose(symbolKeys,n);
	// if (isString(n[0])) n=n.map(x=>symbolDict[x]);
	if (isNumber(n)) n = choose(SymKeys, n);
	if (isString(n[0])) n = n.map(x => Syms[x]);
	if (nundef(n[0].info)) n = n.map(x => infoToItem(x));
	return n;
}
function showPictureGrid(n = 9, dParent, ifs = {}, options = {}) {
	//k could actually be number,key list,info list or item list
	//n = ['bee', 'cockroach'];
	let items = detectItems(n);
	console.log('item', items[0]);
	console.log(dTable);

	//mach einfach ein div
	for (let i = 0; i < items.length; i++) {
		let info = items[i].info;
		let d = mDiv(dParent, { align:'center', w: 200, h: 200, bg: 'random' });
		d.innerHTML = info.D;

		//let dpic=mDiv(d,{fz:100,family:'noto3'});
		let dpic = mDiv(d, { fz: 100, family: 'emoNoto', display:'inline', bg:'yellow' });
		dpic.innerHTML = info.text;
		console.log(getRect(dpic));
	}

}




















