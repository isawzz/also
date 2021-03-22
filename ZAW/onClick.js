function interrupt(){
	uiActivated = false;
	TO.clear();
}

function onClickTemple(){
	interrupt();
	menu();
}