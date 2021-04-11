
function test05_solCats(){
	console.log(DB);
	let data = genCats();
	let sample = new SolCatsClass(data);
	sample.prompt();

}

function registerItems(items) {
	for (const i of items) UIS[i.div.id] = i;
}
function test04_textItems() {
	clearElement(dTable);

	//mStyleX(dTable,{w:1000,h:800})
	let items = getRandomItems(24, 'object', true, false);
	registerItems(items); //=>schreibt zu UIS uid=>item
	items.map(x => x.div.onclick = togglePic)
	console.log('items', items)
	presentItems(items, dTable, 4);
}

function togglePic(ev) {
	//finde item
	let id = evToClosestId(ev);
	console.log(id)
	let item=UIS[id];
	console.log(item)
	if (isdef(item.pic)) removePic(item); else addPic(item,item.key);
}
function test03_2HandsRandom() {
	let h1 = iMakeHand([0, 1, 2, 3, 4], 'h1');
	let h2 = iMakeHand([13, 14, 15, 16, 17], 'h2');
	//console.log('DA', DA)

	setTimeout(test03_2Hands_transferStarts, 1000);
}

function test03_sortDeck() {
	let h1 = iMakeHand([7, 10, 21, 2, 43, 4], 'h1');
	//iSortHand(h1);
	setTimeout(()=>iSortHand(h1),2000);
}

function test03_2Hands() {
	let h1 = iMakeHand([0, 1, 2, 3, 4,5,6], 'h1');
	let h2 = iMakeHand([13, 14, 15, 16, 17], 'h2');
	//console.log('DA', DA)

	setTimeout(test03_2Hands_transferStarts, 1000);
}
function test03_2Hands_transferStarts() {

	let h1 = DA.h1.iHand;
	let n1 = h1.items.length;
	//console.log('hand h1 has', n1, 'cards');
	let h2 = DA.h2.iHand;
	let n2 = h2.items.length;
	//console.log('hand h2 has', n2, 'cards');
	//console.assert(n2 == DA.h2.deck.count());

	let c = chooseRandom(h2.items);
	DA.item = c;

	let w = c.w;
	let ov = w / 4;
	let xOffset = n1 * ov;
	console.log('w',w,'ov',ov,'xOffset',xOffset)

	iMoveFromTo(c, h2.div, h1.div, test03_2Hands_transfer, { x: xOffset, y: 0 });
}
function test03_2Hands_transfer() {
	//modify the deck object
	let deck1 = DA.h1.deck;
	let deck2 = DA.h2.deck;
	let item = DA.item;

	deck1.addTop(item.val);
	deck2.remove(item.val);

	iPresentHand(DA.h1);
	iPresentHand(DA.h2);
	iSortHand(DA.h1)

}
function test03_komischeBubbles(){
	let dover = mDover(dTable); mStyleX(dover, { bg: '#00000080' });

	item=i52(25);
	item.div=mText('hallo',dover,{padding:25});
	container = dover;
	mClass(container,'container');
	//item = iAppend52(15, dover);
	mClass(item.div,'bubble2')
	item.div.style.setProperty('--xStart', '0px'); //`rgb(${r},${g},${b})`);
	item.div.style.setProperty('--xEnd', '100px'); //`rgb(${r},${g},${b})`);
	item.div.style.setProperty('--yStart', '0px'); //`rgb(${r},${g},${b})`);
	item.div.style.setProperty('--yEnd', '-100px'); //`rgb(${r},${g},${b})`);
	dTable.addEventListener("mousemove", updateBubbleColors);

}

function updateBubbleColors(e) {
	const w = window.innerWidth / 255;
	const h = window.innerHeight / 255;
	const x = parseInt(e.pageX / w, 10);
	const y = parseInt(e.pageY / h, 10);

	const r = x;
	const g = (y - 255) * -1;
	const b = x <= y ? y - x : 0;

	container.style.setProperty('--colorEnd', `rgb(${r},${g},${b})`);
}

function test03_splayHand() {
	let h = DA.hand = new Deck();
	h.init([3, 4, 5, 6, 13, 23]);

	console.log(h); let cards = h.cards(); console.log(cards);
	let zHand = DA.zone = iHandZone();
	let items = i52(h.cards());
	let handItem = DA.iHand = iSplay(items, zHand);

	let z = iHandZone();
	let item = DA.item = iAppend52(18, z);
	console.log('DA', DA)

	setTimeout(test03_addCard, 1000);
}
function test03_addCard() {

	let h = DA.hand;
	let n = h.count();
	console.log('hand has', n, 'cards');
	let c = DA.item;
	let w = c.w;
	let ov = w / 4;
	let xOffset = n * ov;

	//how to move the card to the hand?????
	iMoveFromTo(DA.item, DA.item.div.parentNode, DA.zone, transferElement, { x: xOffset, y: 0 });

	// clearElement(dTable);
	// console.log(h); cards = h.cards(); console.log(cards);
	// items = i52(h.cards())
	// iSplay(items, dTable);


}
function transferElement() {
	//modify the deck object
	let h = DA.hand;
	let item = DA.item;
	h.addTop(item.val);

	//resplay in same zone:
	let zHand = DA.zone;
	clearElement(zHand);
	let items = i52(h.cards());
	let handItem = DA.iHand = iSplay(items, zHand);


}

function test03_addToZone() {
	let items = i52([3, 13, 23]);
	let z1 = mZone(dTable);
	iAppend(z1, items[0]);
	iStyle(z1, { padding: 20, box: true });
	let item2 = i52(20);
	iAppend(z1, item2)
	iCenter(item2, -25, 0);


	return;
	let iHand = iSplay(items, z1.div, null, 'right', 20, '%', false, false);
	console.log(iHand);
	mStyleX(iHand.div, { padding: 20, rounding: 10, bg: 'pink' });

}

function test03_habenItemsEinZNachSplay() {
	let items = i52([3, 13, 23]);
	console.log(items)
	console.log(items[0].z); //undefined!
	iSplay(items, dTable);
	console.log(items[0].z); //undefined!

}
function test03_centerToCenter() {
	//create zones
	let styles = { w: 200, h: 200, bg: 'random' };
	mStyleX(dTable, { bg: 'yellow' });
	let z1 = mZone(dTable, styles); z1.id = 'z1';
	mLinebreak(dTable, 10);
	let z2 = mZone(dTable, styles); z2.id = 'z2';

	//layout
	let item1 = iAppend52(24, z1);
	let di1 = item1.div;
	mCenterAbs(di1);

	let item2 = iAppend52(28, z2);
	let di2 = item2.div;
	mCenterAbs(di2);

	console.log(di1.parentNode)
	//return;
	iMoveFromTo(item2, z2, z1);
	setTimeout(() => iMoveFromTo(item1, z1, z2), 1000);
	setTimeout(() => iMoveFromTo(item2, z1, z2), 2000);

	//make an overlay
	//let dover = mDover(dTable); mStyleX(dover, { bg: '#00000080' });
	//where should the item be placed?
	// let b = iTableBounds(item);
	// console.log('bounds', b);

	// dTable.style.position = 'relative';
	// di.style.position = 'absolute';
	// di.style.left = 0 + 'px';
	// di.style.top = 0 + 'px';
	// di.style.padding = '25px';
	// di.style.background='violet';

	//di.style.left=b.x+'px';
	//di.style.top=b.y+'px';

	//next the item should be placed in abs pos onto dover
	// mAppend(dover,di);


	// mStyleX(di, { z: 100 });

	//item should be moved to z2 center w/ animation
	// mAppend(z2, di);
	// mCenter(di);

}

function test03_centerToCenter_trial1() {
	//create zones
	let z1 = mZone(dTable); z1.id = 'z1';
	mLinebreak(dTable, 10);

	//layout
	let item = iAppend52(24, z1);
	let di = item.div;
	mCenterAbs(di);

	return;

	let z2 = mZone(dTable); z2.id = 'z2';
	let item2 = iAppend52(28, z2);
	let di2 = item2.div;
	mCenter(di2);

	console.log(di.parentNode)
	//return;
	di.onclick = moveFromTo(item2, z2, z1);

	//make an overlay
	//let dover = mDover(dTable); mStyleX(dover, { bg: '#00000080' });
	//where should the item be placed?
	// let b = iTableBounds(item);
	// console.log('bounds', b);

	// dTable.style.position = 'relative';
	// di.style.position = 'absolute';
	// di.style.left = 0 + 'px';
	// di.style.top = 0 + 'px';
	// di.style.padding = '25px';
	// di.style.background='violet';

	//di.style.left=b.x+'px';
	//di.style.top=b.y+'px';

	//next the item should be placed in abs pos onto dover
	// mAppend(dover,di);


	// mStyleX(di, { z: 100 });

	//item should be moved to z2 center w/ animation
	// mAppend(z2, di);
	// mCenter(di);

}

function test03_richtungCenter() {
	let d = mDover(dTable);
	let item = iAppend52(13, d);

	let di = item.div;
	di.style.position = 'absolute';
	let parent = d;
	let tablePos = getBounds(di, false, dTable);
	console.log('tablePos', tablePos.x, tablePos.y);

	mLinebreak(dTable, 100)
	let dParent = mDiv(dTable, { w: 200, h: 200, bg: 'yellow' });
	let center = actualCenter(dParent, false, dTable);
	let b = getBounds(dParent, false, dTable);
	console.log('center of yellow', center.x, center.y, b)
	let offset = { w: 35, h: 55 };
	center.x -= offset.w;
	center.y -= offset.h;

	item.div.animate([
		// keyframes
		{ position: 'absolute', left: '0px', top: '0px' },
		{ position: 'absolute', left: '' + center.x + 'px', top: center.y + 'px' },
	], {
		// timing options
		duration: 500,
		fill: 'forwards',

		// iterations: Infinity,
		// direction: 'alternate'		
	});




}
function test03_left() {
	let d = mDover(dTable);
	let item = iAppend52(13, d);
	item.div.animate([
		// keyframes
		{ position: 'absolute', left: '0px', top: '0px' },
		{ position: 'absolute', left: '220px', top: '110px' },
	], {
		// timing options
		duration: 500,
		fill: 'forwards',

		// iterations: Infinity,
		// direction: 'alternate'		
	});
}
function test03_rotate() {
	let d = mCanvas(dTable);
	let item = iAppend52(13, d);
	item.div.animate([
		// keyframes
		// { transform: 'rotate(-60deg)' },
		{ transform: 'rotate(90deg)' },
	], {
		// timing options
		duration: 500,

		// iterations: Infinity,
		// direction: 'alternate'		
	});
}
function test03_translate() {
	let d = mCanvas(dTable);
	let item = iAppend52(13, d);
	item.div.animate([
		// keyframes
		{ transform: 'translate(0px,0px)' },
		{ transform: 'translate(300px,200px)' }
	], {
		// timing options
		duration: 500,
		iterations: Infinity,
		direction: 'alternate'
	});
}

function test03_trash() {
	//mDover is same as mCanvas100
	//d is now covered by dover
	let dover = mDover(dTable); mStyleX(dover, { bg: 'pink' }); // table size wurde durch dou NICHT veraendert! dover only covers upper part of table!
	b = getBounds(dover); console.log('dover', b.width, b.height);

	//mStyleX(dover,{bg:'transparent'}); //now can see d again
	//alternatively:
	mRemoveStyle(dover, ['background-color']); //=>TODO: mRemoveStyleX mit bg,fg,...

	item = i52(35);
	mAppend(item.div, dover);
	anim1(item.div, 'left', 0, 200, 1000);

	// item=i52(25);
	// item.div=mText('hallo',dover,{padding:25});
	// container = dover;
	// mClass(container,'container');
	// //item = iAppend52(15, dover);
	// mClass(item.div,'bubble2')
	// item.div.style.setProperty('--xStart', '0px'); //`rgb(${r},${g},${b})`);
	// item.div.style.setProperty('--xEnd', '400px'); //`rgb(${r},${g},${b})`);
	// item.div.style.setProperty('--yStart', '0px'); //`rgb(${r},${g},${b})`);
	// item.div.style.setProperty('--yEnd', '-100px'); //`rgb(${r},${g},${b})`);
	// //dTable.addEventListener("mousemove", updateBubbleColors);



	//	item=iAppend52(14,d);
	// mPos(item.div,0,0);


}

function test03_basics() {

	// iAppend52(24,dTable);

	// mLinebreak(dTable);

	// let i=10;while(i--){let x=randomNumber(0,51);console.log(x);iAppend52(x,dTable,coin());}

	// mLinebreak(dTable);


	let b = getBounds(dTable); console.log(b.width, b.height); mStyleX(dTable, { bg: 'red' }); //height=0

	//let i = 10; while (i--) { iAppend52(24, dTable); mLinebreak(dTable); } //ja, zones gehen!

	let deck = range(0, 51).map(x => i52(x));
	iResize52(deck, 40);
	iSplay(deck, dTable)

	mLinebreak(dTable, 10);

	let d = mCanvas(dTable);
	let item = iAppend52(13, d);
	mRot(item.div, 45); //rotates around center!

	//wie kann ich das animaten?
	mLinebreak(dTable, 10);

	// let dou = mDiv100(dTable); mStyleX(dou, { bg: 'yellow' }); // der wird unter den anderen table plaziert!
	// b = getBounds(dou); console.log('dou',b.width, b.height);


}

function test02_showDeckFaceDown() {
	let hand = G.instance.players[0].hand;
	hand.showDeck(dTable); //,'right',0,false);
	console.log(hand[0].faceUp)
	hand.turnFaceDown();
}
function test02_turnDeckFaceDown() {
	let hand = G.instance.players[0].hand;
	showCards52(hand, 'down');
	console.log(hand[0].faceUp)
	hand.turnFaceDown();
}
function test02_turnCard() {
	let pl = G.instance.players[0];
	//console.log(pl.hand)
	let card = pl.hand.topCard();
	console.log(card);
	Card52.show(card, dTable);
	setTimeout(() => Card52.turnFaceDown(card), 1000)
	setTimeout(() => Card52.turnFaceUp(card), 2000)
}
function test02_show4Decks() {
	let hand = G.instance.players[0].hand.getIndices();
	console.log(hand)
	showCards52(hand, 'down');
	showCards52(hand);
	showCards52(hand, 'up');
	showCards52(hand, 'left');
	mLinebreak(dTable);
}
function test02_showCard() {
	G.instance.players[0].hand.map(x => Card52.show(x, dTable));
	mLinebreak(dTable, 25);
	G.instance.players[1].hand.map(x => Card52.show(x, dTable));
}

function test01_modifyUser() {
	lookupAddToList(U, ['games', 'gAristocracy', 'running'], 2);
	changeUserTo('mia');

}
data = {
	"id": "boardGames",
	"users": {
		"nil": {
			"id": "nil",
			"seq": [
				"gTicTacToe",
				"gAristocracy",
				"gGoalNumber",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gAbacus",
			"settings": {
				"samplesPerGame": 20,
				"minutesPerUnit": 13,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 10,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "lifePlus",
				"showTime": true,
				"spokenFeedback": false,
				"silentMode": true,
				"switchGame": true,
				"trials": 2,
				"showHint": true,
				"categories": [
					"nosymemo"
				],
				"pressControlToUnfreeze": false,
				"reducedAnimations": true,
				"levelBadges": false
			},
			"games": {
				"gTouchPic": {
					"startLevel": 3
				},
				"gPremem": {
					"startLevel": 0
				},
				"gTouchColors": {
					"startLevel": 0
				},
				"gMissingLetter": {
					"startLevel": 2
				},
				"gSteps": {
					"startLevel": 0
				},
				"gSayPic": {
					"startLevel": 0
				},
				"gMem": {
					"startLevel": 1
				},
				"gMissingNumber": {
					"startLevel": 2
				},
				"gWritePic": {
					"startLevel": 2
				},
				"gAnagram": {
					"startLevel": 3
				},
				"gElim": {
					"startLevel": 2
				},
				"gAbacus": {
					"startLevel": 0
				}
			}
		},
		"guest0": {
			"id": "guest",
			"seq": [
				"gTouchPic",
				"gPremem",
				"gTouchColors",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gTouchPic",
			"settings": {
				"samplesPerGame": 10,
				"minutesPerUnit": 10,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 5,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "best25",
				"showTime": false,
				"spokenFeedback": true,
				"silentMode": false,
				"switchGame": true,
				"trials": 2,
				"showHint": true
			},
			"games": {
				"gTouchPic": {
					"startLevel": 0
				}
			}
		},
		"test0": {
			"id": "test0",
			"seq": [
				"gTouchPic",
				"gPremem",
				"gTouchColors",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gAbacus",
			"settings": {
				"samplesPerGame": 10,
				"minutesPerUnit": 10,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 5,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "best25",
				"showTime": false,
				"spokenFeedback": true,
				"silentMode": false,
				"switchGame": true,
				"trials": 2,
				"showHint": true
			},
			"games": {
				"gTouchPic": {
					"startLevel": 3
				},
				"gPremem": {
					"startLevel": 0
				},
				"gTouchColors": {
					"startLevel": 0
				},
				"gMissingLetter": {
					"startLevel": 2
				},
				"gSteps": {
					"startLevel": 0
				},
				"gSayPic": {
					"startLevel": 0
				},
				"gMem": {
					"startLevel": 1
				},
				"gMissingNumber": {
					"startLevel": 2
				},
				"gWritePic": {
					"startLevel": 2
				},
				"gAnagram": {
					"startLevel": 3
				},
				"gElim": {
					"startLevel": 0
				},
				"gAbacus": {
					"startLevel": 0
				}
			}
		},
		"gul": {
			"id": "gul",
			"seq": [
				"gTouchPic",
				"gPremem",
				"gTouchColors",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gTouchPic",
			"settings": {
				"samplesPerGame": 25,
				"minutesPerUnit": 20,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 5,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "best100",
				"showTime": true,
				"spokenFeedback": true,
				"silentMode": false,
				"switchGame": true,
				"trials": 2,
				"showHint": true
			},
			"games": {
				"gTouchPic": {
					"startLevel": 3
				},
				"gPremem": {
					"startLevel": 3
				},
				"gTouchColors": {
					"startLevel": 2
				},
				"gMissingLetter": {
					"startLevel": 2
				},
				"gSteps": {
					"startLevel": 0
				},
				"gSayPic": {
					"startLevel": 0
				},
				"gMem": {
					"startLevel": 1
				},
				"gMissingNumber": {
					"startLevel": 2
				},
				"gWritePic": {
					"startLevel": 2
				},
				"gAnagram": {
					"startLevel": 0
				},
				"gElim": {
					"startLevel": 1
				},
				"gAbacus": {
					"startLevel": 0
				}
			}
		}
	},
	"settings": {
		"minutesPerUnit": 15,
		"samplesPerLevel": 1,
		"trials": 3,
		"showLabels": "toggle",
		"incrementLevelOnPositiveStreak": 5,
		"decrementLevelOnNegativeStreak": 3,
		"language": "E",
		"vocab": "best25",
		"spokenFeedback": true,
		"silentMode": false,
		"categories": [
			"nosymemo"
		],
		"pressControlToUnfreeze": false,
		"reducedAnimations": true,
		"levelBadges": false,
		"showHint": true,
		"games": {
			"gTouchPic": {
				"levels": {
					"0": {
						"numPics": 2
					},
					"1": {
						"numPics": 4
					},
					"2": {
						"numPics": 9
					},
					"3": {
						"numPics": 16
					},
					"4": {
						"numPics": 25
					},
					"5": {
						"numPics": 36
					}
				}
			},
			"gMissingLetter": {
				"levels": {
					"0": {
						"numMissing": 1,
						"posMissing": "start"
					},
					"1": {
						"numMissing": 2,
						"posMissing": "start"
					},
					"2": {
						"numMissing": 1,
						"posMissing": "random"
					},
					"3": {
						"numMissing": 2,
						"posMissing": "random"
					},
					"4": {
						"numMissing": 3,
						"posMissing": "random"
					},
					"5": {
						"numMissing": 5,
						"posMissing": "random"
					}
				}
			},
			"gMissingNumber": {
				"numMissing": 1,
				"minNum": 0,
				"maxNum": 99,
				"steps": 1,
				"posMissing": "end",
				"ops": [
					"plus"
				],
				"seqLen": 5,
				"levels": {
					"0": {
						"maxNum": 10
					},
					"1": {
						"maxNum": 10,
						"ops": [
							"minus"
						]
					},
					"2": {
						"maxNum": 10,
						"ops": [
							"plus",
							"minus"
						]
					},
					"3": {
						"maxNum": 25,
						"ops": [
							"plus",
							"minus"
						]
					},
					"4": {
						"maxNum": 50,
						"steps": [
							1,
							2,
							3
						],
						"ops": [
							"plus"
						]
					},
					"5": {
						"maxNum": 50,
						"steps": [
							1,
							2
						],
						"ops": [
							"plus",
							"minus"
						]
					},
					"6": {
						"posMissing": "notStart",
						"maxNum": 99,
						"steps": [
							1,
							2
						],
						"ops": [
							"plus",
							"minus"
						]
					},
					"7": {
						"posMissing": "notStart",
						"maxNum": 99,
						"steps": [
							1,
							2,
							3,
							4,
							5
						],
						"ops": [
							"plus",
							"minus"
						]
					},
					"8": {
						"posMissing": "notStart",
						"maxNum": 99,
						"steps": [
							3,
							4,
							5,
							6,
							7,
							8,
							9,
							10
						],
						"ops": [
							"plus",
							"minus"
						]
					}
				}
			},
			"gSteps": {
				"contrast": 0.22,
				"colors": [
					"blue1",
					"violet",
					"lightgreen",
					"pink",
					"red",
					"yellow"
				],
				"levels": {
					"0": {
						"numPics": 9,
						"numColors": 1,
						"numRepeat": 1,
						"numSteps": 2
					},
					"1": {
						"numPics": 9,
						"numColors": 1,
						"numRepeat": 1,
						"numSteps": 3
					},
					"2": {
						"numPics": 4,
						"numColors": 3,
						"numRepeat": 1,
						"numSteps": 2
					},
					"3": {
						"numPics": 4,
						"numColors": 1,
						"numRepeat": 2,
						"numSteps": 2
					},
					"4": {
						"numPics": 6,
						"numColors": 1,
						"numRepeat": 2,
						"numSteps": 2
					},
					"5": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 2,
						"numSteps": 2
					},
					"6": {
						"numPics": 4,
						"numColors": 1,
						"numRepeat": 4,
						"numSteps": 2
					},
					"7": {
						"numPics": 2,
						"numColors": 4,
						"numRepeat": 3,
						"numSteps": 2
					}
				}
			},
			"gSet": {
				"contrast": 0.22,
				"colors": [
					"blue",
					"violet",
					"lightgreen",
					"pink",
					"red",
					"yellow"
				],
				"levels": {
					"0": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 2,
						"numSteps": 2
					},
					"1": {
						"numPics": 4,
						"numColors": 1,
						"numRepeat": 4,
						"numSteps": 2
					},
					"2": {
						"numPics": 2,
						"numColors": 4,
						"numRepeat": 3,
						"numSteps": 2
					}
				}
			},
			"gElim": {
				"contrast": 0.22,
				"colors": [
					"blue",
					"violet",
					"lightgreen",
					"pink",
					"red",
					"yellow"
				],
				"levels": {
					"0": {
						"numPics": 3,
						"numColors": 3,
						"numRepeat": 1
					},
					"1": {
						"numPics": 3,
						"numColors": 1,
						"numRepeat": 3
					},
					"2": {
						"numPics": 2,
						"numColors": 2,
						"numRepeat": 2
					},
					"3": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 2
					},
					"4": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 3
					}
				}
			},
			"gTouchColors": {
				"contrast": 0.32,
				"colors": [
					"red",
					"blue",
					"yellow",
					"green"
				],
				"levels": {
					"0": {
						"numPics": 2,
						"numColors": 2
					},
					"1": {
						"numPics": 3,
						"numColors": 3
					},
					"2": {
						"numPics": 4,
						"numColors": 3
					},
					"3": {
						"numPics": 4,
						"numColors": 4
					},
					"4": {
						"numPics": 5,
						"numColors": 4
					}
				}
			},
			"gPremem": {
				"trials": 1,
				"levels": {
					"0": {
						"numPics": 2,
						"numRepeat": 2
					},
					"1": {
						"numPics": 3,
						"numRepeat": 3
					},
					"2": {
						"numPics": 6,
						"numRepeat": 2
					},
					"3": {
						"numPics": 8,
						"numRepeat": 2
					},
					"4": {
						"numPics": 12,
						"numRepeat": 2
					},
					"5": {
						"numPics": 18,
						"numRepeat": 2
					}
				}
			},
			"gMem": {
				"levels": {
					"0": {
						"numPics": 2,
						"numRepeat": 1
					},
					"1": {
						"numPics": 4,
						"numRepeat": 1
					},
					"2": {
						"numPics": 9,
						"numRepeat": 1
					},
					"3": {
						"numPics": 2,
						"numRepeat": 1
					},
					"4": {
						"numPics": 4,
						"numRepeat": 1
					},
					"5": {
						"numPics": 4,
						"numRepeat": 1
					},
					"6": {
						"numPics": 6,
						"numRepeat": 1
					}
				}
			},
			"gSayPic": null,
			"gInno": {
				"levels": {
					"0": {
						"maxWordLength": 3
					},
					"1": {
						"maxWordLength": 4
					},
					"2": {
						"maxWordLength": 5
					},
					"3": {
						"maxWordLength": 6
					},
					"4": {
						"maxWordLength": 7
					},
					"5": {
						"maxWordLength": 8
					}
				}
			},
			"gWritePic": {
				"levels": {
					"0": {
						"maxWordLength": 4
					},
					"1": {
						"maxWordLength": 6
					},
					"2": {
						"maxWordLength": 8
					},
					"3": {
						"maxWordLength": 100
					}
				}
			},
			"gAnagram": {
				"levels": {
					"0": {
						"maxWordLength": 3
					},
					"1": {
						"maxWordLength": 4
					},
					"2": {
						"maxWordLength": 5
					},
					"3": {
						"maxWordLength": 6
					},
					"4": {
						"maxWordLength": 7
					},
					"5": {
						"maxWordLength": 8
					}
				}
			},
			"gAbacus": {
				"numMissing": 1,
				"minNum": 0,
				"maxNum": 10,
				"minFactor": 2,
				"maxFactor": 3,
				"posMissing": "end",
				"ops": [
					"plus",
					"minus",
					"mult"
				],
				"levels": {
					"0": {
						"ops": [
							"plus",
							"minus",
							"mult"
						]
					},
					"1": {
						"maxNum": 10,
						"maxFactor": 4,
						"ops": [
							"mult"
						]
					},
					"2": {
						"maxNum": 9,
						"maxFactor": 9,
						"ops": [
							"mult"
						]
					},
					"3": {
						"maxNum": 99,
						"ops": [
							"plus",
							"minus",
							"mult"
						]
					},
					"4": {
						"maxNum": 99,
						"ops": [
							"plus",
							"minus",
							"mult"
						]
					}
				}
			}
		}
	},
	"games": {
		"1": {
			"id": "1",
			"game": "aristocracy",
			"players": {
				"nil": {
					"hand": ["HQ", "HK", "S2"]
				},
				"mac": {
					"hand": ["CQ", "H4", "S3"]
				}
			},
			"data": {
				"market": ["SQ", "DK", "C2"]
			}
		}
	}
};

function mCenterAbs_v0(d) {
	let dParent = d.parentNode;
	if (nundef(dParent)) return;
	let b = getBounds(dParent);
	let b1 = getBounds(d);
	let h = b.height;
	let h1 = b1.height;
	let hdiff = h - h1;
	d.style.top = (hdiff / 2) + 'px';
	let w = b.width;
	let w1 = b1.width;
	console.log('zone w:', w, 'item w:', w1);
	let wdiff = w - w1;
	d.style.left = (wdiff / 2) + 'px';
	d.style.position = 'absolute';
	console.log('parent position', dParent.style.position)
	if (isEmpty(dParent.style.position)) dParent.style.position = 'relative';
	console.log('d', d)

}
function aTranslateBy_v0(d, x, y, ms) {
	// d.addEventListener('animationend', () => {
	// 	console.log('Animation ended');
	// });
	let a = d.animate([
		{ transform: `translate(${x}px,${y}px)` }
	], {
		duration: ms,
		//endDelay: 100,
		// fill: 'forwards'
	});
	return a;
}
function aTranslateBy_v1(d, x, y, ms) {
	let a = d.animate({ transform: `translate(${x}px,${y}px)` }, ms);
	// let a = d.animate([{ transform: `translate(${x}px,${y}px)` }], ms);
	//{		duration: ms,	});
	return a;
}
function aMoveTo(d, dTarget, x, y, ms) {
	let bi = iTableBounds(d);
	let b1 = iTableBounds(d.parentNode);
	let b2 = iTableBounds(dTarget);
	d.animate([

		//das ergibt dasselbe wie das mit pos abs!!!
		// { position: 'relative', left: `${0}px`, top: `${0}px`}, 
		// { position: 'relative', left: `${-10}px`, top: `${b2.y}px`}, 

		// { transform: `translate(${x+b2.x}px,${y+b2.y}px)` }

		{ position: 'absolute', left: `${bi.x}px`, top: `${bi.y}px` },
		// { position: 'absolute', left: `${0}px`, top: `${0}px`}, 
		{ position: 'absolute', left: `${x + b2.x}px`, top: `${y + b2.y}px` },

		// { position: 'absolute', left: '220px', top: '110px' },
	], {
		duration: ms,
		fill: 'forwards'
	});



}
function moveFromTo_v0(item, d1, d2) {
	let bi = iTableBounds(item);
	let b1 = iTableBounds(d1);
	let b2 = iTableBounds(d2);
	console.log('item', bi);
	console.log('d1', b1);
	console.log('d2', b2);
	mStyleX(dTable, { bg: 'yellow' });

	//animate item to go translateY by d2.y-d1.y
	let dist = { x: b2.x - b1.x, y: b2.y - b1.y };

	item.div.style.zIndex = 100;
	let a = aTranslateBy(item.div, dist.x, dist.y, 500);
	a.onfinish = () => { mAppend(d2, item.div); item.div.style.zIndex = item.z = iZMax(); };
	//setTimeout(()=>{mAppend(d2,item.div);item.div.style.zIndex=item.z=iZMax();},600);
	return;

	//nach einer zeit remove translation and change parent
	setTimeout(() => {
		console.log(item.div);
		let d = item.div;
		mRemove(d);
	}, 1500);
	setTimeout(() => {
		let item = iAppend52(28, d2);
		mCenterAbs(item.div);
		// mAppend(d2,item.div);
		// aTranslateBy(item.div,-dist.x,-dist.y,500);
		// mRemoveStyle(d,['transform','left','position','top','margin','margin-top','margin-left'])
		//mCenter(d)
	}, 1500);

	// let t=1000;
	// III=d1;
	// aMoveTo(item.div,d2,-10,0,t);
	// setTimeout(()=>console.log(item.div.parentNode),t+500);
}
