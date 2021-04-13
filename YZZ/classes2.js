class Game2Player {
	constructor(name, o) {
		this.name = name;
		//console.log(this);
		//console.log('name',name,'o',o)
		copyKeys(o, this);
		this.maxLevel = isdef(this.levels) ? Object.keys(this.levels).length - 1 : 0;
		this.id = name;
		this.color = getColorDictColor(this.color);
	}
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }
	startGame() { }
	startRound() { dLineTopMiddle.innerHTML = 'Player: ' + PlayerOnTurn.id; }
	prompt() {

		// showInstruction(PlayerOnTurn.id, 'player:', dTitle, true);

		// let styles = { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		// let items = iGrid(3, 3, dTable, styles);

		this.controller.activateUi.bind(this.controller)();
	}
	activate() { }
	interact() { }
	eval(ev) {
		ev.cancelBubble = true;
		// let id = evToClosestId(ev);		let i = firstNumber(id);		let item = Pictures[i];
		let item = findItemFromEvent(Pictures, ev);
		Selected = { pic: item, feedbackUI: iDiv(item), sz: getRect(iDiv(item)).h };

		//console.log('item in eval',item,'Selected',Selected,'rect',getRect(iDiv(item)));
		//console.log('Selected', Selected.pic.key, 'id', id)

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
}

class GTTT extends Game2Player {
	startGame() {
		for (let i = 0; i < this.controller.players.length; i++) {
			let pl = this.controller.players[i];
			pl.symbol = ['X', 'O', '@', '+', 'U', '#'][i];
		}
		this.board();
	}
	board() {
		let styles = { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		this.rows = 3;
		this.cols = 3;
		let items = this.tiles = iGrid(this.rows, this.cols, dTable, styles);
		items.map(x => {
			let d = iDiv(x);
			mCenterFlex(d);
			d.onclick = this.controller.evaluate.bind(this.controller);
		});
		console.log(this.tiles)
	}
	prompt() {

		showInstruction('', 'click a field!', dTitle, false);
		if (isAI(PlayerOnTurn)){
			this.AIMove();
		}else{
			this.controller.activateUi.bind(this.controller)();
		}

	}
	AIMove() {
		let emptyTiles = this.possibleMoves = this.tiles.filter(x => nundef(x.label));
		let t=this.tiles;
		for(let i=0;i<this.rows;i++){
			let av=true;
			let sym;
			for(const j=0;j<this.cols;j++){
				//look if this row contains only one free tile and all other tiles belong to same user
				if (isdef(t.label)) {
					if (nundef(sym)) sym=t.label;
				}else if (!av) {
					
				} else av=false;
			}
		}
		let tile = chooseRandom(emptyTiles);
		let ev = { target: iDiv(tile) };
		console.log('AI clicked on tile',tile.row,tile.col)
		this.controller.evaluate(ev);
	}
	eval(ev) {
		let tile = evToItemC(ev);
		console.log('player', PlayerOnTurn.id, 'clicked', tile);

		//how to add a label to an item?
		addLabel(tile, PlayerOnTurn.symbol, { fz: 60, fg: PlayerOnTurn.userColor });

		this.endCondition = !firstCond(this.tiles, x => nundef(x.label));
		if (this.endCondition) {
			if (PlayerOnTurn.id == U.id) {
				winner = U;
			} else {
				winner = PlayerOnTurn;
			}
		} else {
			console.log('es gibt noch freie felder!!!');
		}

	}
}

class GKrieg extends Game2Player {
	startGame(players) {
		console.log('deal card...')
		console.log('determine player order...')
		console.log('show stats...')
		console.log('start move round...')
		console.log('prompt...')
	}
}