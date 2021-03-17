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
