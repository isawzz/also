function interrupt(){
	uiActivated = false;
	TO.clear();
}

function onClickTemple(){
	interrupt();
	menu();
}

function onClickBadgeX(ev) {
	console.log('haaaaaaaaaaaaaaaalo',ev)
	interrupt(); //enterInterruptState();
	let item = evToItem(ev);
	setBadgeLevel(item.index);
	userUpdate(['games',G.id,'startLevel'],item.index);
	auxOpen = false;
	TOMain = setTimeout(G.startGame.bind(G), 100);
}
