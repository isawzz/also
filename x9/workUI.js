class GKriegFront {
	constructor(hPlayer, dParent) { this.hPlayer = hPlayer; this.dParent = dParent; this.setup(); }
	write() { write('front', ...arguments); }
	setup() { this.areas = makeAreas(this.dParent); }
	clear() { this.areas.map(x => clearElement(diContent(x))); }
	clearZones() { for (const k of ['t0', 't1', 'h0', 'h1']) this.clearZones(k); }
	clearZone(k) { clearElement(this.getZoneDiv(k)); }
	getZoneDiv(k) { return this.hands[k].zone; }
	getTrickZoneDiv(iPlayer) { return this.getZoneDiv('t' + iPlayer); }
	getHandZoneDiv(iPlayer) { return this.getZoneDiv('h' + iPlayer); }
	getPlayerCards(iPlayer) { return this.hands['h' + iPlayer].iHand.items; }
	getTrickCards() {
		let res = [];
		let t0 = this.hands.t0;
		if (isdef(t0.iHand.items)) {
			//console.log('trick0 non empty t0:',t0);//,t0.iHand,t0.items)
			res = res.concat(t0.iHand.items);
		}
		let t1 = this.hands.t1;
		if (isdef(t1.iHand.items)) {
			//console.log('trick1 non empty t1:',t1);//,t0.iHand,t0.items)
			res = res.concat(t1.iHand.items);
		}
		//console.log('res is',res)
		return res;
	}
	animatePlayerMove(iPlayer, callback) {
		//need to get last item of this.hands[kFrom].iHand.items: this will be the card!!!
		let cards = this.getPlayerCards(iPlayer);
		let c = arrLast(cards);
		// let w = c.w;
		// let ov = w / 4;
		//console.log('______\ncard', c);
		//console.log('hands', this.hands);
		// need center of target zone
		let dSource = this.hands['h' + iPlayer].zone; // this.getHandZoneDiv(iPlayer);
		let key = 't' + iPlayer;
		let trick = this.hands[key];
		let pos1 = lookup(this, ['pos1', key]);
		let dTarget, offset;
		//console.log('target pos', pos1); //trick.posOfFirstCard)
		if (isdef(pos1)) {
			//console.log(this.area[0])
			//console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhh')
			dTarget = trick.zone; //diContent(this.areas[0]);
			offset = { x: pos1.x-10, y: pos1.y-10 };
		} else {
			dTarget = trick.zone; // this.getZoneDiv(iPlayer);
			let empty = nundef(trick.iHand.items);
			//console.log('empty', empty); //this.hands['t' + iPlayer]);
			offset = { x: empty ? 0 : 0, y: 0 };//getCenter(dTarget); // n1 * ov;
		}
		//console.log('w', w, 'ov', ov, 'xOffset', offset);

		aMove(iDiv(c), dSource, dTarget, callback, offset, 500, 'EASE', 1);

	}
	animateResolve(iWinner, callback) {
		//all cards from dTrick need to be moved to player hand!
		let cards = this.getTrickCards();
		let dSource = this.hands.t0.zone;  //iDiv(this.areas[0]); // this.getHandZoneDiv(iPlayer);
		let dTarget = this.hands['h' + iWinner].zone; //iDiv(this.areas[1]);;//// this.getZoneDiv(iPlayer);
		//console.log(dSource,dTarget)
		let offset = { x: 0, y: 0 };//getCenter(dTarget); // n1 * ov;
		//console.log('w', w, 'ov', ov, 'xOffset', offset);

		let trickCards = this.getTrickCards();
		let iLast = trickCards.length, i = 0;
		//console.log('trickCards',trickCards,'iLast',iLast,'i',i);
		for (const c of trickCards) {
			dSource = iDiv(c);
			//console.log(c);
			i++; let f;
			if (i == iLast) {
				f = callback;
				//console.log('callback coming up!')
			} else {
				//console.log('...')
				f = null;//() => console.log('just moving', c);
			}
			//let f = i == iLast ? callback : () => console.log('just moving', c); 
			iMoveFromToPure(c, dSource, dTarget, f, offset);
		}

	}
	presentState(state) {
		this.write('present', jsCopy(state))
		this.clear();
		let trick1 = arrFlatten(state.pl1.trick)
		let trick2 = arrFlatten(state.pl2.trick);

		let pl1Hand = state.pl1.hand;
		let pl2Hand = state.pl2.hand;
		// let arrs = [[{trick1:trick1}, {trick2:trick2}], [{pl1Hand:pl1Hand}], [{pl2Hand:pl2Hand}]];
		let arrs = [[trick1, trick2], [pl1Hand], [pl2Hand]];
		let hands = [];
		for (let i = 0; i < 3; i++) {
			let area = this.areas[i];
			let d = diContent(area);
			iMessage(area, '');
			for (let j = 0; j < arrs[i].length; j++) {
				let arr = arrs[i][j]; //arr is an object {key:cardArr} cardArr can be empty!
				//if (isEmpty(arr)) continue;
				//let key =
				let id = 'a' + i + '_h' + j;
				let what = iH01(arr, d, {}, id, i == 0 ? 20 : 0); //iH00(arr, d, {}, id);
				hands.push(what);
				//console.log('iH00 returns', what)
			}
		}
		//turn around all the cards in tricks except last one!
		for (let i = 0; i < 2; i++) {
			let cards = hands[i].iHand.items;
			if (isEmpty(hands[i].arr)) continue;
			//console.log('cards', cards, 'hands[i]', hands[i])
			for (let j = 0; j < cards.length - 1; j++) {
				Card52.turnFaceDown(cards[j]);
			}
		}
		//console.log('hands', hands);
		this.hands = {};
		let handNames = ['t0', 't1', 'h0', 'h1'];
		if (nundef(this.pos1)) { this.pos1 = {}; }
		for (let i = 0; i < 4; i++) {
			let hi = hands[i];
			this.hands[handNames[i]] = hi;
			hi.key = handNames[i];
			if (!isEmpty(hi.arr)) {
				//console.log('_________hi',hi);
				let hih = hi.iHand;
				//console.log(hih);
				this.pos1[handNames[i]] = getRect(iDiv(hih),hi.zone);
				//console.log(hi)
			}
		}

	}
}

function makeAreas(dParent) {
	// setBackgroundColor('random');
	let dGrid = mDiv(dParent, { gap: 10, bg: 'white', w: '90%', padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	let layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];
	let x = createGridLayout(dGrid, layout); //teilt dGrid in areas ein

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: true },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: false },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles, titleOnTop: false },
	};

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles, item.titleOnTop)
		//console.log('children', dCell.children);
		iRegister(item, item.id);
		if (item.titleOnTop) iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		else iAdd(item, { div: dCell, dTitle: dCell.children[2], dMessage: dCell.children[0], dContent: dCell.children[1] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
