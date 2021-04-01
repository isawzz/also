function clearTimeouts() {
	clearTimeout(TOMain); //console.log('TOMain cleared')
	//clearTimeout(TOLong); console.log('TOLong cleared')
	clearTimeout(TOFleetingMessage);
	clearTimeout(TOTrial);
	if (isdef(TOList)) { for (const k in TOList) { TOList[k].map(x => clearTimeout(x)); } }
}
function enterInterruptState() {
	//haTO true; //when using TaskChain
	//chainCancel();
	//restartQ();
	clearTimeouts();
	if (isdef(G.instance)) G.instance.clear();
	auxOpen = true;
}

//#region control open and close of aux
function openAux() {
	enterInterruptState();

	show(dAux);
	show('dGo');


}
function closeAux() {
	hide(dAux);
	hide('dGo');
	//if (ALLOW_CALIBRATION) show('dCalibrate');
	show('dGear');
	show('dTemple');
	if (SettingsChanged) {
		updateSettings();
		//console.log('...saving because closeAux SettingsChanged!!!!')
		dbSave('boardGames');
	}
	SettingsChanged = false;
	auxOpen = false;
}


//#region aux buttons: computer, gear, temple
function onClickComputer() { }
function onClickCalibrate() {
	if (isCal) {
		if (auxOpen) { closeAux(); }
		exitCalibrationMode();
	} else {
		if (auxOpen) { closeAux(); enterCalibrationMode('all'); }
		else { enterCalibrationMode(1); }
	}
}


function onClickGear() {
	//console.log('opening settings: ui will be interrupted!!!')
	openAux();
	hide('dGear');
	hide('dCalibrate');
	createSettingsUi(dAux);
}
function onClickTemple() {
	//console.log('opening menu: ui will be interrupted!!!')
	openAux();
	hide('dTemple');
	createMenuUi(dAux);
}

function onClickMenuItem(ev){ onClickGo(ev);}

function onClickGo(ev) {

	if (isVisible('dTemple')) {
		closeAux();
		startGame();

	} else {
		//console.log(ev)
		let item = isdef(ev)?evToItemC(ev):null;
		let gKey = nundef(ev) ? SelectedMenuKey : isString(ev) ? ev : item.o.id; // divKeyFromEv(ev);

		//console.log('==>gKey', gKey, SelectedMenuKey);

		if (gKey != SelectedMenuKey) {
			if (isdef(SelectedMenuKey)) toggleItemSelection(SelectedMenuItem);
			SelectedMenuKey = gKey;
			SelectedMenuItem =  firstCond(MenuItems, x => x.o.id == SelectedMenuKey);
			//console.log('ONCLICK:',MenuItems,gKey,MenuItems[gKey])
			toggleItemSelection(SelectedMenuItem);
		} else {
			closeAux();
			//updateUserScore();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
			setGame(gKey);
			startGame();

		}
	}


}

function onClickBadgeX(ev) {
	enterInterruptState();
	let i = 0;
	if (isNumber(ev)) { i = ev; }
	else { let id = evToClosestId(ev); i = stringAfter(id, '_'); i = Number(i); }
	setBadgeLevel(i);
	updateStartLevelForUser(G.id, i, 'onClickBadgeX');
	// revertToBadgeLevel(ev);
	saveUser();
	//console.log('reverted to', G.level);
	auxOpen = false;
	TOMain = setTimeout(startGame, 100);
}

//# region divControls
function onClickStartButton() { startGame(); }
function onClickNextButton() { startRound(); }
function onClickRunStopButton(b) { if (StepByStepMode) { onClickRunButton(b); } else { onClickStopButton(b); } }
function onClickRunButton(b) { b.innerHTML = 'Stop'; mStyleX(bRunStop, { bg: 'red' }); StepByStepMode = false; startRound(); }
function onClickStopButton(b) { b.innerHTML = 'Run'; mStyleX(bRunStop, { bg: 'green' }); StepByStepMode = true; }

//#region freezers
function onClickFreezer() { console.log('YEP! onClickFreezer!!!!!!!'); hide('freezer'); startUnit(); }
function onClickFreezer2(ev) {
	//if (G.flags.pressControlToUnfreeze && !ev.ctrlKey) { console.log('*** press control!!!!'); return; }
	clearTable(); mRemoveClass(mBy('freezer2'), 'aniSlowlyAppear'); hide('freezer2'); auxOpen = false;
	//if (Username == 'test') _changeUserTo();
	//else _startUnit();
	startUnit();
}


//#region helpers
function divKeyFromEv(ev) {
	//console.log('ev',ev)
	let id = evToClosestId(ev);
	//console.log('id found is',id)
	let div = mBy(id);
	return div.key;
}


//#region new API
function interrupt(){
	//console.log('iiiiiiiiiiiiiiiiiiiiiiii')
	uiActivated = false;
	clearTimeouts(); //legacy
	TOMan.clear();
}

function onClickTemple(){	interrupt();	menu();}
function onClickTemple() {
	//console.log('opening menu: ui will be interrupted!!!')
	openAux();
	hide('dTemple');
	createMenuUi(dAux);
}

function onClickBadgeX(ev) {
	//console.log('haaaaaaaaaaaaaaaalo',ev)
	interrupt(); //enterInterruptState();
	let item = evToItem(ev);
	setBadgeLevel(item.index);
	userUpdate(['games',G.id,'startLevel'],item.index);
	auxOpen = false;
	TOMain = setTimeout(G.startGame.bind(G), 100);
}













