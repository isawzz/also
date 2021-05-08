
//convert from number to different kinds of decks: i stands for item
function i52(i) { return isList(i) ? i.map(x => Card52.getItem(x)) : Card52.getItem(i); }
function iFaceUp(item) { Card52.turnFaceUp(item); }
function iFaceDown(item) { Card52.turnFaceDown(item); }
function iFace(item, faceUp) { if (isdef(faceUp)) faceUp ? iFaceUp(item) : iFaceDown(item); }
function iResize52(i, h) { let w = h * .7; return iResize(i, w, h); }
function iTableBounds(i) { return iBounds(i, dTable); }

//presentation of items or item groups(=layouts)
function iAppend52(i, dParent, faceUp) {
	let item = i52(i);
	iFace(item, faceUp);
	mAppend(dParent, item.div);
	return item;
}
function iHand52(i) {
	let hand = iSplay(i, dTable);

}
function iSplay52(i, iContainer, splay = 'right', ov = 20, ovUnit = '%', createiHand = true, rememberFunc = true) {
	let ilist = !isList(i) ? i : [i];
	let items = isNumber(i[0]) ? i52(ilist) : ilist;
	let res = iSplay(items, iContainer, null, 'right', 20, '%', true);
	return res;
}
function netHandSize(nmax, hCard, wCard, ovPercent = 20, splay = 'right') {

	let isHorizontal = splay == 'right' || splay == 'left';
	if (nundef(hCard)) hCard = 110;
	if (nundef(wCard)) wCard = Math.round(hCard * .7);
	return isHorizontal ? { w: wCard + (nmax - 1) * wCard * ovPercent / 100, h: hCard } : { w: wCard, h: hCard + (nmax - 1) * hCard * ovPercent / 100 };
}
function iHandZone(dParent, styles, nmax) {
	if (nundef(styles)) styles = { bg: 'random', rounding: 10 };
	if (isdef(nmax)) {
		console.log('nmax', nmax)
		let sz = netHandSize(nmax);
		styles.w = sz.w;
		styles.h = sz.h;
	}
	//console.log('________________', styles)
	return mZone(dParent, styles);
}
function iSortHand(dParent, h) {
	let d = h.deck;
	//console.log(d.cards());
	d.sort();
	//console.log(d.cards());

	iPresentHand(dParent, h);
}
function iPresentHand(h, dParent, styles, redo = true) {
	//console.log('zone styles',styles)
	if (nundef(h.zone)) h.zone = iHandZone(dParent, styles); else clearElement(h.zone);
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		//console.log('items',items)
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	return h;
}
function iMakeHand(iarr, dParent, styles, id) {
	let data = DA[id] = {};
	let h = data.deck = new Deck();
	h.init(iarr);
	iPresentHand(data, dParent, styles);
	return data;
}
function iRemakeHand(data) {
	let zone = data.zone;
	let deck = data.deck;

	let items = i52(deck.cards());
	clearElement(zone);
	data.iHand = iSplay(items, zone);
	return data;
}
function iH00_dep(iarr, dParent, styles, id) {
	function iH00Zone(dTable, nmax = 3, padding = 10) {
		let sz = netHandSize(nmax);
		//console.log('________________', sz)
		return mZone(dTable, { wmin: sz.w, h: sz.h, padding: padding, rounding: 10 });
	}
	//should return item={iarr,live.div,styles}
	let data = DA[id] = {};
	let h = data.deck = new Deck();
	h.init(iarr);
	// iPresentHand_test(dParent, data);
	// return data;
	h = data;
	if (nundef(h.zone)) h.zone = iH00Zone(dParent); else clearElement(h.zone);
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	return h;

}
function iH01(iarr, dParent, styles, id, overlap) {
	function iH01Zone(dTable, nmax = 7, padding = 10) {
		let sz = netHandSize(nmax);
		//console.log('________________', sz)
		return mZone(dTable, { wmin: sz.w, h: sz.h, padding: padding}); //, rounding: 10, bg:'blue' });
	}
	//should return item={iarr,live.div,styles}
	let h = isdef(Items[id]) ? Items[id] : { arr: iarr, styles: styles, id: id };
	if (nundef(h.zone)) h.zone = iH01Zone(dParent); else clearElement(h.zone);
	let items = i52(iarr);
	h.iHand = iSplay(items, h.zone,{},'right', overlap);
	return h;

}
function iH00(iarr, dParent, styles, id) {
	function iH00Zone(dTable, nmax = 7, padding = 10) {
		let sz = netHandSize(nmax);
		//console.log('________________', sz)
		return mZone(dTable, { wmin: sz.w, h: sz.h, padding: padding}); //, rounding: 10, bg:'blue' });
	}
	//should return item={iarr,live.div,styles}
	let h = isdef(Items[id]) ? Items[id] : { arr: iarr, styles: styles, id: id };
	if (nundef(h.zone)) h.zone = iH00Zone(dParent); else clearElement(h.zone);
	let items = i52(iarr);
	h.iHand = iSplay(items, h.zone);
	return h;

}
function iHandZone_test(dTable, nmax = 10, padding = 10) {
	let sz = netHandSize(nmax);
	//console.log('________________', sz)
	return mZone(dTable, { wmin: sz.w, h: sz.h, bg: 'random', padding: padding, rounding: 10 });
}
function iSortHand_test(dParent, h) {
	let d = h.deck;
	//console.log(d.cards());
	d.sort();
	//console.log(d.cards());

	iPresentHand_test(dParent, h);
}
function iPresentHand_test(dParent, h, redo = true) {
	if (nundef(h.zone)) h.zone = iHandZone_test(dParent); else clearElement(h.zone);
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	return h;
}
function iMakeHand_test(dParent, iarr, id) {
	let data = DA[id] = {};
	let h = data.deck = new Deck();
	h.init(iarr);
	iPresentHand_test(dParent, data);
	return data;
}


//animations of items or item groups(=layouts)
function anim1(elem, prop, from, to, ms) {
	if (prop == 'left') elem.style.position = 'absolute';
	if (isNumber(from)) from = '' + from + 'px';
	if (isNumber(to)) to = '' + to + 'px';
	// let kfStart={};
	// kfStart[prop]=from;
	// let kfEnd={};
	// kfEnd[prop]={};
	// elem.animate([{left: '5px'},{left: '200px'}], {
	// 	// timing options
	// 	duration: ms,
	// 	iterations: Infinity
	// });
}

class Card52 {
	static toString(c) { return c.rank + ' of ' + c.suit; }
	static _getKey(i) {
		if (i >= 52) return 'card_J1';
		let rank = Card52.getRank(i);
		let suit = Card52.getSuit(i);
		return 'card_' + rank + suit;

	}
	//returns index 0..51
	static _fromKey(k) {
		let ranks = 'A23456789TJQK';
		let suits = 'SHDC';
		//ex k='2H';
		let ir = ranks.indexOf(k[0]); //=> zahl zwischen 0 und 12
		let is = suits.indexOf(k[1]); //=> zahle zwischen 0 und 3
		//console.log(is)
		return is * 13 + ir;
	}
	static getRankValue(i) { if (nundef(i)) return null; let r = i % 13; return r == 0 ? 12 : r-1; }
	static getRank(i) {
		let rank = (i % 13);
		if (rank == 0) rank = 'A';
		else if (rank >= 9) rank = ['T', 'J', 'Q', 'K'][rank - 9];

		return rank;
	}
	static getSuit(i) {
		let s = ['S', 'H', 'D', 'C'][divInt(i, 13)];
		//if (!'SHDC'.includes(s)) console.log('SUIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		return s;
	}
	static turnFaceDown(c, color) {
		//console.log(c.faceUp)
		if (!c.faceUp) return;
		let svgCode = C52.card_2B; //C52 is cached asset loaded in _start
		c.div.innerHTML = svgCode;
		if (isdef(color)) c.div.children[0].children[1].setAttribute('fill', color);
		c.faceUp = false;
	}
	static turnFaceUp(c) {
		if (c.faceUp) return;
		c.div.innerHTML = C52[c.key];
		c.faceUp = true;
	}
	static getItem(i, h = 110, w) {
		//rank:A23456789TJQK, suit:SHDC, card_2H (2 of hearts)
		if (nundef(w)) w = h * .7;
		let c = Card52._createUi(i, undefined, w, h);
		c.i = c.val = i;
		return c;
	}
	static _createUi(irankey, suit, w, h) {
		//console.log('cardFace',rank,suit,w,h)

		//#region set rank and suit from inputs
		let rank = irankey;
		if (nundef(irankey) && nundef(suit)) {
			irankey = chooseRandom(Object.keys(C52));
			rank = irankey[5];
			suit = irankey[6];
		} else if (nundef(irankey)) {
			//face down card!
			irankey = '2';
			suit = 'B';
		} else if (nundef(suit)) {
			if (isNumber(irankey)) irankey = Card52._getKey(irankey);
			rank = irankey[5];
			suit = irankey[6];
		}
		//console.log('rank', rank, 'suit', suit); // should have those now!

		if (rank == '10') rank = 'T';
		if (rank == '1') rank = 'A';
		if (nundef(suit)) suit = 'H'; else suit = suit[0].toUpperCase(); //joker:J1,J2, back:1B,2B
		//#endregion

		//#region load svg for card_[rank][suit] (eg. card_2H)
		let cardKey = 'card_' + rank + suit;
		let svgCode = C52[cardKey]; //C52 is cached asset loaded in _start
		// console.log(cardKey, C52[cardKey])
		svgCode = '<div>' + svgCode + '</div>';
		let el = createElementFromHTML(svgCode);
		if (isdef(h) || isdef(w)) { mSize(el, w, h); }
		//console.log('__________ERGEBNIS:',w,h)
		//#endregion

		return { rank: rank, suit: suit, key: cardKey, div: el, w: w, h: h, faceUp: true }; //this is a card!
	}

	static show(icard, dParent, h = 110, w = undefined) {
		if (isNumber(icard)) {
			if (nundef(w)) w = h * .7;
			icard = Card52.getItem(icard, h, w);
		}
		mAppend(dParent, icard.div);
	}
}

class Deck {
	constructor(f) { this.data = []; if (isdef(f)) this['init' + f](); }
	init(arr) { this.data = arr; }
	initEmpty() { this.data = []; }
	initTest(n, shuffled = true) { this.data = range(0, n-1); if (shuffled) this.shuffle(); }
	init52(shuffled = true, jokers = 0) { this.data = range(0, 51 + jokers); if (shuffled) this.shuffle(); }
	initRandomHand52(n) { this.data = choose(range(0, 51), n); }
	addTop(i) { this.data.push(i); return this; }
	addBottom(i) { this.data.unshift(i); return this; }
	bottom() { return this.data[0]; }
	cards() { return this.data; }
	count() { return this.data.length; }
	clear() { this.data = []; }
	deal(n) { return this.data.splice(0, n); }
	dealDeck(n) { let d1 = new Deck(); d1.init(this.data.splice(0, n)); return d1; }
	popTop() { return this.data.pop(); }
	popBottom() { return this.data.shift(); }
	remTop() { this.data.pop(); return this; }
	remBottom() { this.data.shift(); return this; }
	remove(i) { removeInPlace(this.data, i); return this; }
	removeAtIndex(i) { return this.data.splice(i, 1)[0]; }
	removeFromIndex(i, n) { return this.data.splice(i, n); }
	setData(arr, shuffled = false) { this.data = arr; if (shuffled) this.shuffle(); }
	sort() {
		//console.log('cards:', this.data.join(','));
		this.data.sort((a, b) => Number(a) - Number(b));
		//console.log('cards:', this.data.join(','));
		return this;
	}
	shuffle() { shuffle(this.data); return this; }
	top() { return arrLast(this.data); }
	toString() { return this.data.toString(); }//.join(','); }
}










class Deck1 extends Array {
	initTest(n, shuffled = true) { range(0, n).map(x => this.push(Card52.getItem(x))); if (shuffled) this.shuffle(); }
	initEmpty() { }
	init52(shuffled = true, jokers = 0) {
		range(0, 51 + jokers).map(x => this.push(Card52.getItem(x)));
		//this.__proto__.faceUp = true;
		//console.log(this.__proto__)
		if (shuffled) this.shuffle();
	}
	add(otherDeck) { while (otherDeck.length > 0) { this.unshift(otherDeck.pop()); } return this; }
	count() { return this.length; }
	static transferTopFromToBottom(d1, d2) { let c = d1.pop(); d2.putUnderPile(c); return c; }
	deal(n) { return this.splice(0, n); }
	getIndices() { return this.map(x => x.i); }
	log() { console.log(this); }
	putUnderPile(x) { this.push(x); }
	putOnTop(x) { this.unshift(x); }
	showDeck(dParent, splay, ovPercent = 0, faceUp = undefined, contStyles = {}) {
		//console.log('aaaaaaaaaaaaaaaaaaaaaaaaa')
		if (isdef(faceUp)) { if (faceUp == true) this.turnFaceUp(); else this.turnFaceDown(); }
		// splayout(this, dParent, {bg:'random',padding:0}, ovPercent, splay);
		splayout(this, dParent, contStyles, ovPercent, splay);
	}
	shuffle() { shuffle(this); }
	topCard() { return this[this.length - 1]; }
	turnFaceUp() {
		if (isEmpty(this) || this[0].faceUp) return;
		//if (this.__proto__.faceUp) return;
		this.map(x => Card52.turnFaceUp(x));
		//this.__proto__.faceUp = true;
	}
	turnFaceDown() {
		if (isEmpty(this) || !this[0].faceUp) return;
		//if (!this.__proto__.faceUp) return;
		//console.log(this[0])
		this.map(x => Card52.turnFaceDown(x));
		//this.__proto__.faceUp = false;
	}
}

function splayout(elems, dParent, w, h, x, y, overlap = 20, splay = 'right') {
	function splayRight(elems, d, x, y, overlap) {
		//console.log('splayRight', elems, d)
		for (const c of elems) {
			mAppend(d, c);
			mStyleX(c, { position: 'absolute', left: x, top: y });
			x += overlap;
		}
		return [x, y];
	}
	function splayLeft(elems, d, x, y, overlap) {
		x += (elems.length - 2) * overlap;
		let xLast = x;
		for (const c of elems) {
			mAppend(d, c);
			mStyleX(c, { position: 'absolute', left: x, top: y });
			x -= overlap;
		}
		return [xLast, y];
	}
	function splayDown(elems, d, x, y, overlap) {
		for (const c of elems) {
			mAppend(d, c);
			mStyleX(c, { position: 'absolute', left: x, top: y });
			y += overlap;
		}
		return [x, y];
	}
	function splayUp(elems, d, x, y, overlap) {
		y += (elems.length - 1) * overlap;
		let yLast = y;
		for (const c of elems) {
			mAppend(d, c);
			mStyleX(c, { position: 'absolute', left: x, top: y });
			y -= overlap;
		}
		return [x, yLast];
	}

	if (isEmpty(elems)) return { w: 0, h: 0 };

	mStyleX(dParent, { display: 'block', position: 'relative' });

	//phase 4: add items to container
	[x, y] = (eval('splay' + capitalize(splay)))(elems, dParent, x, y, overlap);

	let isHorizontal = splay == 'right' || splay == 'left';
	let sz = { w: (isHorizontal ? (x - overlap + w) : w), h: (isHorizontal ? (y - overlap + h) : h) };

	return sz;

}











