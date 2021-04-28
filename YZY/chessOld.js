class GChess extends G2Player {
	createBoard() {
		this.board = new ChessBoard(this.rows, this.cols, this.controller.uiInteract.bind(this.controller));

	}
	setStartPosition() { this.board.setInitialPosition(); }
	startGame() {
		super.startGame();
		this.createBoard();
		this.setStartPosition();
		this.human.color = 'white';
		this.ai.color = 'black';
	}
	interact(ev) {
		let tile = evToItemC(ev);

		if (isdef(tile.label)) return; //illegal move!
		let pl = this.plTurn;

		addLabel(tile, pl.sym, { fz: 60, fg: pl.color });
		this.controller.evaluate(tile);
	}
	prompt() {
		let msg = this.plTurn == this.ai ? 'Ai thinking...' : 'Player on turn:';
		showInstruction(this.plTurn.color, msg, dTitle, false);


		this.controller.activateUi();
	}
	getPiece(state, idx) {
		let arr = state;
		let pieceKey = arr[idx];

	}
	getPlayerPieces(state, pl) {
		let pieces = [];
		for (let i = 0; i < state.length; i++) {
			if (state[i][0] == pl.color[0]) {
				//let [r,c]=
				pieces.push({ piece: state[i], idx: i });
				movesPerPiece[i] = Rook.getMoves(state, i, 8, 8);
				console.log('rook moves for piece', i, movesPerPiece[i]);
			}
		}
	}
	onSelect(ev) {
		let item = evToItemC(ev);
		if (item == this.selectedItem) return;
		else if (isdef(this.selectedItem)) unselectPreviousItemAndTargets(this.selectedItem);
		this.selectedItem = selectItemAndTargets(item);
	}
	activate() {
		let pl = this.plTurn;
		let opp = this.plOpp;
		let autoplay = false;
		let manual = true;
		if (!manual && (autoplay || pl == this.ai)) {
			if (this.ai == pl) uiActivated = false;
			//showCancelButton();

			//AIMinimax(this,this.afterComputerMove)		
			setTimeout(() => AIMinimax(this, this.afterComputerMove.bind(this)), 200);

			//console.log('halloooooooooooooooooo')

			// this.TO = setTimeout(() => {
			// 	AIMinimax(this,this.afterComputerMove.bind(this));
			// 	console.log('...sollte das gleich schreiben!!!')
			// }, 10); //DELAY
		} else {
			let state = this.getState();
			let [plPieces, avMoves] = this.getAvailableMoves(state, pl, opp);
			if (isEmpty(avMoves)) { this.controller.evaluate(true); }
			else this.activatePiecesThatCanMove(plPieces);
		}
	}
	getAvailableMoves(state, pl, opp) {
		let plPieces = getMovesPerPiece(state, pl, G.rows, G.cols);

		let rochadeMoves = getMoveRochade(state,pl,G.rows, G.cols);


		for (const p in plPieces) { plPieces[p].avMoves = []; }
		let avMoves = [];
		//clearChessPieces();
		for (const from in plPieces) {
			for (const to of plPieces[from].moves) {
				let move = { from: from, to: to };
				//console.log('checking move',move);
				let newState = G.applyMove(state, move, pl);
				//console.log('state',state,'newState',newState);
				//return;
				//check if in the new situation, king is in check or not!
				let isCheck = isKingInCheck(newState, pl, opp, G.rows, G.cols);
				if (to == 0) console.log('done!', to, isCheck)
				if (!isCheck) { avMoves.push(move); plPieces[from].avMoves.push(move.to); }
				//if yes, this move is discarded!
			}
		}
		console.log('avMoves', avMoves);
		return [plPieces, avMoves];
	}
	activateMoves(plPieces, avMoves) {
		for (const p in plPieces) { this.board.items[p].targets = []; }
		for (const m of avMoves) {
			let k = m.from;
			// let piece = plPieces[k];
			// piece.avMoves.push(m.to);
			let item = this.board.items[k];
			iEnableSelect(item, this.onSelect.bind(this));
			item.targets.push(m.to);
		}
	}
	activatePiecesThatCanMove(plPieces) {
		for (const k in plPieces) {
			let moves = plPieces[k].avMoves;
			if (isEmpty(moves)) continue;

			// show field bg in darker
			let item = this.board.items[k];
			iEnableSelect(item, this.onSelect.bind(this));
			item.targets = moves;
		}
	}
	afterComputerMove(iMove) {
		//console.log('CALLBACK!!!', iMove)
		//hide(mBy('bCancelAI'));
		let tile = this.board.items[iMove];
		this.interact({ target: iDiv(tile) });
	}
	eval(isEnd) {
		this.gameOver = isdef(isEnd);
		let state = this.getState();
		if (this.gameOver) {
			if (isKingInCheck(state, this.plTurn, this.plOpp, this.rows, this.cols)) {
				showFleetingMessage('CHECK MATE');
				this.winner = this.plOpp;
			} else {
				showFleetingMessage('' + this.plTurn.color + " can't move: draw!");
				this.tie = true;
			}
		}
	}
	applyMove(state, move, player) {
		state = jsCopy(state);
		let from = move.from;
		let to = move.to;
		state[to] = state[from];
		state[from] = null;
		return state;
	}
	heuristic(state){
		// einfach punkte zusammen zaehlen
		// aber schach sagen soll auch gut sein!
	}
	evalState(state, depth) {
		//soll draws ohne patt oder matt feststellen
		//zB wenn 3x hintereinander gleicher move : ignore
		//oder: wenn nur noch 2 kings da sind : ignore
		return { reached: false };
	}
	getState(){return this.board.getState();}
}
