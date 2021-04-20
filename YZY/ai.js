class SoloPlayer {
	constructor(user) {
		this.color = getColorDictColor(user.settings.userColor);
		this.id = user.id;
		this.score = 0;
	}
}
class AIPlayer {
	constructor(max_depth = -1) {
		this.id = getUID('AI');
		this.color = randomColor();
		this.type = 'ai';
		this.score = 0;
		// this.max_depth = max_depth;
		// this.nodes_map = new Map();
	}
	setData(o) { copyKeys(o, this); }
}

function AIMove(g, callback) {
	//console.log('AI starts moving!')
	let state = g.getState();
	state = boardToNode(state);
	let searchDepth = g.searchDepth;
	let iMove1, iMove2;
	console.log('==>AI search: mm13 (maxDepth',searchDepth+')');
	iMove1 = prepMM(state, mm13, g.evalState, searchDepth);

	//setTimeout(()=>{CANCEL_AI=true;},500);
	// if (!CANCEL_AI) {
	// 	iMove2 = prepMM(state, mm13, g.evalStateL2, searchDepth);
	// 	if (iMove1 != iMove2) { console.log('===>DIFFERENT VALUES!!!!! mmab1:' + iMove1, 'new:' + iMove2); }
	// 	else { console.log('OK! mmab9 returned', iMove1, 'new returned', iMove2); }
	// } else {
	// 	let m = F_MOVES(state);
	// 	iMove2 = chooseRandom(m);
	// 	console.log('clicked cancel! choosing random move!', iMove2);
	// }

	//console.log('AI MOVE FINISHED!')
	callback(iMove1);

}


