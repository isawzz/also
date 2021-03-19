function canAct() { return uiActive; }
function createContainers(list,dArea){
	let i = 0;
	let containers = [];
	for (const cat of list) {
		let cont = mTitledDiv(cat, dArea, { w: 150, h: 300, bg: 'random', rounding: 12, display: 'inline-block', margin: 12 },
			{}, 'c' + i);
		i += 1;
		containers.push({label:cat,div:cont});
	}
	return containers;
}
function getDiv(x){ return isdef(x.info)? lDiv(x):isdef(x.div)?x.div:x;}
function getDivs(list) { 
	if (isdef(list[0].info)) return list.map(x=>lDiv(x));
	else if (isdef(list[0].div)) return list.map(x => x.div); 
	else return list;
}
function rectToSize(r) { return { w: r.w, h: r.h } }
function revealMain() { mReveal(dMain); }

