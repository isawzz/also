async function _start() {

	createSubtitledPage('indigo'); revealMain();

	temple(dTitleLeft);
	loadUser('nil');

	menu(); //OIL(); //sample00(); //onClickTemple();
	// let keys = SymKeys.filter(x=>x.includes('bookmark') || x.includes('box'));
	// let app = new ItemViewerClass(dTable, dTitleRight,keys);
}


































//#region trash
function trash(){
	console.log(DB); createSubtitledPage('indigo'); mDiv(dTitleRight, { matop: -14 }, 'dRight'); revealMain();
	let d=mText('hello!',dTable,{fz:32});d.id='message';

	//menu();

	//titlebar(0);
	//onclick=()=>rev='off';
	//setInterval( checkFocus, 20000 );


	ifPageVisible.on('blur', function () {
		console.log('BLUR!!!!!!!!!!!!!!')
		//enterInterruptState();
		// console.log('stopping game', G.id)
		// _saveAll();
		return 'hallo'
	});

	ifPageVisible.on('focus', function () {
		console.log('FOCUS!!!!!!!!')
		// if (isdef(G.instance)) {
		// 	updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
		// 	setGame(G.id);
		// }
		// closeAux();
		// startGame();
		// console.log('restarting game', G.id)
	});

}
function checkFocus() {
  var info = document.getElementById("message");

  if ( document.hasFocus() ) {
    info.innerHTML = "The document has the focus.";
  } else {
    info.innerHTML = "The document doesn't have the focus.";
  }
}
var rev = "fwd";
function titlebar(val) {
	var msg = "YOUR TURN!!!";
	var res = " ";
	var speed = 100;
	var pos = val;
	msg = "   |-" + msg + "-|";
	var le = msg.length;
	if (rev == "fwd") {
		if (pos < le) {
			pos = pos + 1;
			scroll = msg.substr(0, pos);
			document.title = scroll;
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
		else {
			rev = "bwd";
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
	}
	else {
		if (pos > 0) {
			pos = pos - 1;
			var ale = le - pos;
			scrol = msg.substr(ale, le);
			document.title = scrol;
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
		else {
			rev = "fwd";
			timer = window.setTimeout("titlebar(" + pos + ")", speed);
		}
	}
}

