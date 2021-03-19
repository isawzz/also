function interrupt(){
	uiActive = false;
	TO.clear();
}

function onClickTemple(){
	interrupt();
	menu();
}