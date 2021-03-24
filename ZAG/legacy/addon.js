//#region API

// =>start.js has initAddons das ist user independent! :init addon feature
// =>controller.js has if (isTimeForAddon()) { exitToAddon(startRound); return; }
// =>index.html hat ein freezer named dAddons

//reads DB,U
//writes AD,ADS

//#endregion

function addonFeatureInit() {
	ADS = null;
	if (USE_ADDONS == true) {
		//console.assert(isdef(DB.addons));
		ADS = jsCopy(lookup(DB, ['addons'])); //get readonly copy! 
		//hier die classes ...
		let di = { aPasscode: APasscode, aAddress: AAddress, aPassword: APassword, 
			aExercise: APasscode, aMeditation: APasscode, };
		for (const k in ADS) { ADS[k].cl = di[k]; }

		//console.log('...addons loaded...');//, ADS);
	}
}

function isTimeForAddon() {
	//console.log('WAS IST DA LOOOOOOOOOOOOOOOOOOOOOOS>>>?')
	//return true if addon feature initialized and there are available addons and any of them is ready to run
	//otherwise return false
	//side effects: AD is instantiated (if U.avAddons non-empty)

	if (nundef(ADS)) return false; //addon feature not used

	if (isEmpty(U.avAddons)) return false; //this user doesn't have available addons!

	if (isdef(AD) && AD.running && AD.checkEndCondition()) {
		console.log('END!')
		AD.die();
		//console.log(U,U.addons,AD,AD.key,U.addons[AD.key]);
		U.addons[AD.key].open = false;
		AD = null;
	}

	if (isdef(AD)) return AD.isTimeForAddon(); //if addon already activated, just check if it says time to run

	//if addons are available to that user but none is instantiated yet, look for open addons!
	let open = allCondDict(U.addons, x => x.open == true);
	//console.log('user', U.id, 'open addons', open);
	if (isEmpty(open)) {
		console.log('open is empty! choosing a random addon!')
		//no addon is open, choose random addon among the available ones???
		//============================================================= HERE ==================================
		//randomly select an available addon and open it!
		let k = chooseRandom(U.avAddons);
		AD = new ADS[k].cl(k, ADS[k], {});

	} else if (open.length == 1) {
		//instantiate this addon and run its timerFunction to see if it is time
		let k = open[0];
		AD = new ADS[k].cl(k, ADS[k], U.addons[k]);
	} else {
		//choose easliest time in open addons or a random one if no time info available!!!
		//ne leichter: mach einfach random
		let k = chooseRandom(open); // firstCond(open,x=>U.addons[x].)
		AD = new ADS[k].cl(k, ADS[k], U.addons[k]);

	}

	//by now there should be an AD
	//console.log('created Addon:', AD)
	//console.assert(isdef(AD));
	return AD.isTimeForAddon();

}
function exitToAddon(callback) {
	AD.callback = callback;
	enterInterruptState(); auxOpen = false;
	AD.run();
	//addonScreen();
	//console.log('Addon is',AD)
}























