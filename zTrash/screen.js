function initScreen(){
	return;
	let h=window.innerHeight-60;
	let w=window.innerWidth-260;
	window.onresize=()=>mSize(dTable,'80vw',window.innerHeight-60);
	dTable=mDiv(dTable, { margin: 'auto', w: w, h: h, bg: 'skyblue', rounding:'1vw' },'dTable');
	show(dFooter);
}

function fullScreenView(){
	mClass(dMain,'layoutFullScreen');
	show(dFooter);
}

function endlessScreenView(){
	mClass(dMain,'layoutEndlessScreen');
	hide(dFooter);
}













