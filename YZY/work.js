

class GKriegBack {
	load(state) {
		this.history=[];
		let deck = this.deck = new Deck('52');
		let n = 4;
		this.pl1 = { hand: deck.deal(n), trick: [], index: 0 }; if (isdef(state) && isdef(state.pl1)) addKeys(state.pl1, this.pl1);
		this.pl2 = { hand: deck.deal(n), trick: [], index: 1 }; if (isdef(state) && isdef(state.pl2)) addKeys(state.pl2, this.pl2);
		this.players = [this.pl1, this.pl2];
		this.iturn = 0;
		if (nundef(state)) return;
		/* example of a state:
		{
			pl1: { hand: ['TH', 'QH'], trick: [['QH']] },
			pl2: { hand: ['TC', 'QC'], trick: [['KC']] },
		},
		*/
		if (isdef(state.pl1.hand)) this.pl1.hand = parseHand(state.pl1.hand, deck);
		if (isdef(state.pl2.hand)) this.pl2.hand = parseHand(state.pl2.hand, deck);
		if (isdef(state.pl1.trick)) state.pl1.trick.map(x => this.pl1.trick.push(parseHand(x, deck)));
		if (isdef(state.pl2.trick)) state.pl2.trick.map(x => this.pl2.trick.push(parseHand(x, deck)));
		if (isdef(state.deck)) this.deck.setData(parseHand(state.deck));

		if (!isEmpty(this.pl1.trick)) {
			let len1 = this.pl1.trick.length;
			let len2 = this.pl2.trick.length;

			if (len1 > len2) this.iturn = 1;
			else {
				this.resolve();
				this.iturn = 0;
			}
		}
		
	}
	get_state() { return { pl1: this.pl1, pl2: this.pl2, deck: this.deck } };
	turn() { return this.iturn; }
	top(pl) { return Card52.getRankValue(arrFirstOfLast(pl.trick)); }
	get_moves() {
		let pl = this.player()
		let moves = [];
		if (this.in_trick()) { moves.push([arrLast(pl.hand)]); }//console.log('in_trick') }
		else if (this.is_war()) {
			let x = arrTakeFromEnd(pl.hand, 3);
			moves.push(x);
			//console.log('hand',pl.hand,'x',x,'moves',jsCopy(moves)); 
			//console.log('is_war');
		}
		else if (this.in_war()) { moves.push(arrTakeFromEnd(pl.hand, 3)); }//console.log('in_war') }
		else { moves.push([arrLast(pl.hand)]); } //console.log('first!') }
		return moves;
	}
	make_random_move() {
		let moves = this.get_moves();
		//console.log('moves',arrString(moves)); 
		let move = chooseRandom(moves);
		//console.log('move chosen',move)
		this.make_move(move);
	}
	make_move(move) {
		// a move is a list of integers (=cards)
		let pl = this.player();
		pl.trick.push(move);
		move.map(x => removeInPlace(pl.hand, x));
		//console.log('hand',arrString(pl.hand),'trick in make_move',arrString(pl.trick));
		//this.print_state();
		this.lastMove = move;
	}
	resolve() {
		let result = this._resolve();
		this.push_history(this.iturn, this.lastMove, result);//add move to history!
		return result!=null;
	}
	swap_turn() { this.iturn = this.iturn == 0 ? 1 : 0; }
	make_random_moveX() {
		let moves = this.get_moves();
		let move = chooseRandom(moves);
		this.make_moveX(move);
	}
	make_moveX(move) {
		this.make_move(move);
		let result = this._resolve();
		this.push_history(this.iturn, move, result);//add move to history!
		this.swap_turn();
	}
	_resolve() {
		//console.log('...resolve')
		let pl = this.player(), opp = this.opponent();
		if (this.in_trick()) return null;
		let t1 = this.top(pl); let t2 = this.top(opp);
		//console.log('resolve: compare t1', t1, 't2', t2);
		if (isdef(t1) && isdef(t2)) {
			if (t1 > t2) { return this.add_trick_from_to(opp, pl); }
			else if (t2 > t1) { return this.add_trick_from_to(pl, opp); }
			else return null;
		}
		return null;
	}
	add_trick_from_to(plFrom, plTo) {
		let t1 = plFrom.trick;
		let t2 = plTo.trick;
		let iLoser = plFrom.index;
		let iWinner = plTo.index;
		let cards1 = arrFlatten(plFrom.trick); //console.log('cards from loser:', cards1);//, plFrom);
		let cards2 = arrFlatten(plTo.trick); //console.log('cards from winner:', cards2);//, plTo);
		let cards = cards1.concat(cards2);
		//console.log('cards', cards)
		plTo.hand = cards.concat(plTo.hand);
		plFrom.trick = [];
		plTo.trick = [];
		return { iWinner: iWinner, winnerTrick: t2, iLoser: iLoser, loserTrick: t1, cards: cards };
	}
	undo() {
		let hist = this.pop_history();
		if (hist == null) { return null; }
		let move = hist.move;
		this.iturn = hist.iturn;
		// console.log('move is',hist,'this.iturn',this.iturn)
		let pl = this.player();
		pl.hand.push(move);
		move.map(x => removeInPlace(pl.trick, x));

		if (isdef(hist.result)) {
			let plWin = this.players[hist.iWinner];
			let plLose = this.players[hist.iLoser];
			plWin.trick = hist.winnerTrick;
			plLose.trick = hist.loserTrick;
			plWin.hand = arrTake(plWin.hand, plWin.hand.length - hist.cards.length);
		}

		//this.print_state();
	}
	print_state(comment = '') {
		if (nundef(this.history)) this.history = [];
		let state = jsCopy(this.get_state());

		console.log('____' + comment + ' #' + this.history.length, 'turn=' + this.iturn);
		console.log('pl1: hand:' + arrString(this.pl1.hand, iToValue), 'trick', arrString(this.pl1.trick, iToValue), 'top', this.top(this.pl1));
		console.log('pl2: hand:' + arrString(this.pl2.hand, iToValue), 'trick', arrString(this.pl2.trick, iToValue), 'top', this.top(this.pl2));
		//console.log('deck',this.deck.data.toString());

		//console.log('state',state)


		//console.log('________ #' + this.history.length, 'turn', this.turn(), '\npl1', this.pl1.hand, 'played', arrFlatten(this.pl1.trick), '\npl2', this.pl2.hand, 'played', arrFlatten(this.pl2.trick), '\ndeck', this.deck.data);
	}
	player() { return this.players[this.iturn]; }
	opponent() { return this.players[(this.iturn + 1) % this.players.length]; }
	push_history(iturn, move, result) { if (nundef(this.history)) this.history = []; this.history.push({ iturn: iturn, move: move, result: result }); return this.history; }
	pop_history() { if (nundef(this.history)) this.history = []; return this.history.pop(); }
	is_war() { let pl = this.player(), opp = this.opponent(); return pl.trick.length > 0 && pl.trick.length == opp.trick.length && this.top(pl) == this.top(opp); }
	in_war() { let pl = this.player(), opp = this.opponent(); return pl.trick.length == opp.trick.length - 1 && pl.trick.length >= 1; }
	in_trick() { let pl = this.player(), opp = this.opponent(); return pl.trick.length == 0 && opp.trick.length == 1; }
	is_out_of_cards() { return this._is_out_of_cards(this.player()) || this._is_out_of_cards(this.opponent()); }
	player_is_out_of_cards() { return this._is_out_of_cards(this.player()); }
	_is_out_of_cards(pl) { return (isEmpty(pl.trick) && isEmpty(pl.hand)); }
	winner() { return firstCond(this.players, x => !isEmpty(x.hand) || !isEmpty(x.trick)); }
}
