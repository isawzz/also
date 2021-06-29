//window.onclick = () => { clearElement(dTable); t82_Live(); }
window.onload = _loader; // _loader | _testing

async function _testing() {
	let s='"a a b c" "d d e c" "f g e h"';	console.log(getRandomLetterMapping(s));	console.log('_____\n',s,'\n',getLetterSwapEncoding(s));
	//serverTest00_postData();
}

async function _loader() {
	Daat = {};
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	symbolDict = Syms = await localOrRoute('syms', '../assets/allSyms.yaml');
	SymKeys = Object.keys(Syms);
	ByGroupSubgroup = await localOrRoute('gsg', '../assets/symGSG.yaml');
	WordP = await route_path_yaml_dict('../assets/math/allWP.yaml');

	DB = await route_path_yaml_dict('./DB.yaml');
	console.assert(isdef(DB));

	DA = {}; Items = {};
	Speech = new SpeechAPI('E');
	KeySets = getKeySets();
	TOMan = new TimeoutManager();

	_start();
}

//#region new db helpers and other helpers

var BlockServerSend1 = false;
async function dbSaveX(callback) {
	if (USELIVESERVER) {
		//console.log('no saving!'); 
		return;
	}
	if (BlockServerSend1) { setTimeout(() => dbSaveX(callback), 1000); }
	else {
		let path = './MZZ/DB.yaml';
		let resp = await postData('http://localhost:3000/db', { obj: DB, path: path });
		BlockServerSend1 = false;
		//console.log('DB saved...');
		if (callback) callback();
	}
}
async function dbLoadX() {	DB = await route_path_yaml_dict('./DB.yaml');}


//#region optional not used
async function addGroupInfo() {
	let symbolDict = SymbolDict = await localOrRoute('symbolDict', '../assets/symbolDict.yaml');
	let sInfo = SInfo = await localOrRoute('sInfo', '../assets/s_info.yaml');

	for (const k in Syms) {
		let old = symbolDict[k];
		let info = sInfo[k];

		if (isdef(old) && isdef(old.group)) {
			Syms[k].group = old.group;
			Syms[k].subgroup = old.subgroups;
		} else {
			Syms[k].subgroup = info.subgroup; //console.log('no subgroups', old, info); }
			Syms[k].group = info.group; //console.log('no group', old, info); }
		}
	}
	//console.log('example', Syms[chooseRandom(SymKeys)]);
	for (const k in Syms) {
		if (nundef(Syms[k].group) || nundef(Syms[k].subgroup)) {
			console.log('IMMER NOCH KEIN GROUP INFO!!!!', k, Syms[k], sInfo[k], symbolDict[k]);
		}
	}
	//console.log(Syms)
	// let symsNo = await localOrRoute('symsNo', '../assets/symsNo.yaml');
	// for(const k in symsNo){ delete Syms[k.toLowerCase()]; }
	// SymKeys = Object.keys(Syms);
	// symbolDict = await localOrRoute('symbolDict', '../assets/symbolDict.yaml');
}
async function _dbLoadX(callback) {
	let path = './DB.yaml';
	DB = await route_path_yaml_dict(path);
	if (isdef(callback)) callback();
}
async function _dbInitX(dir = '../DATA/') {
	let users = await route_path_yaml_dict(dir + 'users.yaml');
	let settings = await route_path_yaml_dict(dir + 'settings.yaml');
	let addons = await route_path_yaml_dict(dir + 'addons.yaml');
	let games = await route_path_yaml_dict(dir + 'games.yaml');
	//let speechGames = await route_path_yaml_dict(dir + '_speechGames.yaml');
	let tables = await route_path_yaml_dict(dir + 'tables.yaml');

	DB = {
		id: 'boardGames',
		users: users,
		settings: settings,
		games: games,
		tables: tables,
		//speechGames: speechGames,
		addons: addons,
	};
	dbSaveX();
}
async function _loader_dep() {
	Daat = {};
	if (CLEAR_LOCAL_STORAGE) localStorage.clear();

	C52 = await localOrRoute('C52', '../assets/c52.yaml');
	symbolDict = Syms = await localOrRoute('syms', '../assets/allSyms.yaml');
	SymKeys = Object.keys(Syms);
	ByGroupSubgroup = await localOrRoute('gsg', '../assets/symGSG.yaml');
	WordP = await route_path_yaml_dict('../assets/math/allWP.yaml');

	if (BROADCAST_SETTINGS) {
		//console.log('...broadcasting ...')
		await _dbInitX();
		_start0();
	} else { dbLoadX(_start0); }

}
async function _start0() {
	console.assert(isdef(DB));

	DA = {}; Items = {};
	Speech = new SpeechAPI('E');
	KeySets = getKeySets();
	TOMan = new TimeoutManager();

	_start();

}
