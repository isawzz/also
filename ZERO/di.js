const FIVE_LANGUAGES = ['C', 'D', 'E', 'F', 'S'];
const EIGHT_LANGUAGES = ['C', 'D', 'E', 'F', 'I', 'L', 'R', 'S'];

async function checkText3(){
	let all=await route_path_text('../TEST/files/stage0/st3.txt');
	console.log('stage0_3',all)

	let lAll = all.split('\n');
	console.log('stage0_31',lAll);

	let lines = lAll.filter(x=>!isEmpty(x.trim()));
	//console.log('stage0_31 lines',li



}

async function makeDictionary() {
	//1. need all the em1 files
	let [s_info, byGroup, byCateg, categByKey] = await loadGroupsAndCategories();

	let emFiles = await loadLanguageFiles();

	//2. separate english one and delete from emFiles
	let engl = emFiles.E;
	delete emFiles.E;

	console.log('emFiles', emFiles)
	//3. check this
	// console.log('engl',engl);
	// console.log('emFiles',emFiles);

	//4. goto code
	let toBeEdited = {}, ki = {}, snew = {}, diEngl = {};
	let N = 2072;
	for (let i = 0; i < N; i++) {
		let line = engl.lines[i];

		if (!isNumber(line[0])) continue;
		let parts = line.split(',');
		let hex = unicodeNormalize(parts[1]);
		let key = parts[3].trim().toLowerCase();
		ki[i] = key;
		let tags = parts[4].split('|').map(x => x.trim().toLowerCase());

		//console.log('key',key,'tags',tags); return;
		//let sym = lookup(Syms, [key]);
		let o = snew[key] = { key: key, hex: hex, tags: tags, text: unicodeToText(hex), family: 'emoNoto', type: 'emo', cat: categByKey[key] };

		console.log(emFiles)
		for (const lang in emFiles) {
			let l2 = emFiles[lang].lines[i];
			let parts2 = l2.split(',');
			let kl = parts2[3].trim().toLowerCase();
			lookupSet(diEngl, [o.key, lang], kl);
			let tags2 = parts2[4].split('|').map(x => x.trim().toLowerCase());
			for (let it = 0; it < o.tags.length; it++) {
				lookupSet(diEngl, [o.tags[it], lang], tags2[it]);
			}
		}
	}
	console.log('result:', diEngl);
	console.log('word count', Object.keys(diEngl).length);
	let diSorted = {};
	let keys = Object.keys(diEngl);
	keys.sort();
	for (const k of keys) {
		diSorted[k] = diEngl[k];
	}
	console.log(diSorted);
	downloadAsYaml(diSorted, 'di');
}


function normalizeWord(s,allowNumbers=true) {
	//remove all whitespace characters
	s = s.toLowerCase();
	while (s.length > 0 && !isLetter(s[0])) s = s.substring(1);
	let snew = '';
	for (let i = 0; i < s.length; i++) {
		if (s[i] == '’') { snew += "'"; continue; }
		if (s[i] == '”') continue;
		if (!allowNumbers && isNumber(s[i])) continue;
		//noch ersetzungen? was ist mit : oder -?
		if (s[i] == ':') { return normalizeWord(s.substring(i)); }
		//if (s[i] == ':') { snew = ''; continue; }
		snew += s[i];
	}
	return snew.trim();
}



function arrChunkify1(arr, size) {
  return arr.reduce((memo, value, index) => {
    // Here it comes the only difference
    if (index % (arr.length / size) == 0 && index !== 0) memo.push([])
    memo[memo.length - 1].push(value)
    return memo
  }, [[]])
}

function arrChunkify(arr,size){
	let res=[];
	let i=0;
	let arr1=[];
	for(const a of arr){
		if (i==size){i=0;res.push(arr1);arr1=[];}
		arr1.push(a);
		i+=1;
	}
	if (arr1.length>0) res.push(arr1);
	return res;
}

async function makeWordList() {
	let emFiles = await loadLanguageFiles();
	let engl = emFiles.E;
	let wlist = [], N = 2072, ki = {};
	for (let i = 0; i < N; i++) {
		let line = engl.lines[i];

		if (!isNumber(line[0])) continue;
		let parts = line.split(',');
		let hex = unicodeNormalize(parts[1]);
		let key = normalizeWord(parts[3]);
		if (key.length > 1) addIf(wlist, key);
		if (parts[3].includes('10')){
			console.log('ein 10 |'+parts[3]+'|',key)
		}
		//ki[i] = key;
		let tags = parts[4].split('|');//.map(x=>normalizeWord(x));
		tags.map(x => { x = normalizeWord(x); if (x.length > 1) addIf(wlist, x); });
	}
	// for (const w of getDDKeys()) {
	// 	let key = normalizeWord(w);
	// 	if (key.length > 1) { addIf(wlist, key); console.log('adding', key); }

	// }
	wlist.sort();
	console.log(wlist);

	let arrs = arrChunkify(wlist, 1000); 
	console.log('result',arrs)
	//downloadAsYaml(wlist, 'wordlist');
	for(let i=0;i<arrs.length;i++){
		downloadAsText(arrs[i],'_awords_'+i);
	}
}

//______ old di stuff aus test
function getDDKeys() {
	let DD = {
		yellow: 'gelb', green: 'grün', blue: 'blau', red: 'rot', pink: 'rosa', orange: 'orange', black: 'schwarz',
		white: 'weiss', violet: 'violett', '1st': 'erste', '2nd': 'zweite', '3rd': 'dritte', '4th': 'vierte', '5th': 'fünfte',
		add: 'addiere', subtract: 'subtrahiere', multiply: 'mutipliziere', plus: 'plus', minus: 'minus', times: 'mal',
		'divided by': 'dividiert durch', excellent: 'sehr gut', very: 'sehr', good: 'gut',
		'to the previous number': 'zur vorhergehenden zahl',
		'from the previous number': 'von der vorhergehenden zahl',
		'multiply the previous number by': 'multipliziere die vorhergehende zahl mit',
		'divide the previous number by': 'dividiere die vorhergehende zahl durch',
		'the previous number': 'die vorhergehende zahl', is: 'ist', what: 'was', equals: 'ist gleich', enter: "tippe",
		'to the power of': 'hoch', or: 'oder', less: 'kleiner', greater: 'grösser', than: 'als', equal: 'gleich', and: 'und',
		not: 'nicht', click: 'click', press: 'tippe', quite: 'ziemlich', 'not quite': 'nicht ganz',
		say: 'sage', write: 'schreibe', complete: 'ergänze', 'unequal': 'ungleich', except: 'ausser', 
		number: 'Zahl', color: 'farbe', eliminate: 'eliminiere', all: 'alle', with: 'mit', true: 'wahr', false: 'falsch',
		build: 'bilde', count: 'zähle', 'the red dots': 'die roten Punkte',
	};
	return Object.keys(DD);
}
function keyDiff(o1, o2) {
	let only1 = [], only2 = [], both = [];

	for (const k1 in o1) {
		if (isdef(o2[k1])) both.push(k1); else only1.push(k1);
	}
	for (const k2 in o2) if (nundef(o1[k2])) only2.push(k2);



	return [only1, only2, both];
}
function keyDiff1(o1, o2, fCompare) {
	let k1 = Object.keys(o1);
	let k2 = Object.keys(o2);
	let only1 = arrMinus(k1, k2);
	let only2 = arrMinus(k2, k1);
	let both = intersection(k1, k2);
	return [only1, only2, both];
}
function filterDict(o, pred) {
	let onew = {};
	for (const k in o) {
		if (pred(o[k], k)) onew[k] = o[k];
	}
	return onew;
}
function mapDictKeys(o, func) { let onew = {}; for (const k in o) { onew[func(k)] = o[k]; } return onew; }
function normalizeKey(k) {
	let k1 = k.trim().toLowerCase();
	replaceAll(k1, ' face', '');
	replaceAll(k1, 'face ', '');
	return k1;
}
function keyCompare(knew, kold) {
	return knew == kold || knew.includes(kold);
}
function checkAllKeysNormalized(o1, o2) {

}
async function rebuildSyms() {
	let [em1, s_info, byGroup, byCateg] = await loadAllSymbolInfoFiles(true);

	let sNew = mapDictKeys(filterDict(Syms, x => x.type == 'emo'), normalizeKey);

	//are

	// let infoNew=mapDictKeys(filterDict(s_info,(x,k)=>!k.includes('skin tone') && !startsWith(k,'woman') && !startsWith(k,'man')),normalizeKey);
	let infoNew = mapDictKeys(filterDict(s_info, (x, k) => !k.includes('skin tone')), normalizeKey);
	//let infoNew=mapDictKeys(s_info,normalizeKey);
	let [onlyInfo, onlySyms, infoSyms] = keyDiff(infoNew, sNew); //em1.E);
	console.log('s_info', onlyInfo, 'Syms', onlySyms, 'info+Syms', infoSyms);
	//let [onlySyms,onlyEm1_,symsEm1]=keyDiff(Syms,em1.E);
	// console.log('s_info',onlyInfo,'em1',onlyEm1,'em1-Syms',onlyEm1_,'Syms',onlySyms,'info+em1',infoEm1,'Syms+em1',symsEm1);

	return;

	//als erstes alle keys aus em1_.txt (alle emo types)
	//danach alle aus syms die nicht drin sind dazunehmen und umformen


	let DI = { E: {}, C: {}, D: {}, F: {}, I: {}, S: {}, L: {}, R: {} };
	let PI = {}; //key='key_for_water',info={}
	let snew = {};
	let sindex = {};
	// di.E.water.S = ['agua', 120];
	// di.S.agua = di.D.wasser = snew ['agua', 140];
	// sindex.water.key = 'key_for_water';
	// snew.key_for_water = {
	// 	hex: 'f3d3d', text: '$&124121;', family: 'emoNoto', type: 'emo', w,h
	// 	E: 'water', we: 144, cats: ['25', 'material'], tags: 'fountain|river'
	// };

	let engl = em1.E;
	let toBeEdited = {};
	for (let i = 0; i < 2071; i++) {
		let line = em1.E.lines[i];
		if (!isNumber(line[0])) continue;
		let parts = line.split(',');
		let hex = unicodeNormalize(parts[1]);
		let key = parts[2].trim().toLowerCase();
		ki[i] = key;
		let tags = parts[3].trim().toLowerCase();
		let sym = lookup(Syms, [key]);
		let o = snew[key] = { hex: hex, tags: tags, text: unicodeToText(hex), family: 'emoNoto', type: 'emo' };
		for (const lang in em1) {
			if (lang == 'E') continue;
			let l2 = em1[lang].lines[i];
			let parts2 = l2.split(',');

			lookupSet(di, ['E', o.word],)
		}
		if (sym && sym.type == 'emo') {
			//right now take as simple as possible! omit w,h assuming 125,118 for fz=100
			o.word = sym.E;
			o.cats = sym.cats;
			o.w = syms.w; o.h = syms.h;
			for (l of ['D', 'F', 'S', 'C']) {
				//o[l] = syms[l];
				lookupSet(di, ['E', o.word, l], syms[l]);
				lookupSet(di, [l, syms[l], l], syms[l]);

			}
		} else {
			console.log('need to edit word for', key);
			o.word = key;
			toBeEdited[key] = key;
		}


		//choice: nur diese oder auch icons?
	}
	for (let i = 0; i < 2071; i++) {
		for (const lang in em1) {
			let line = em1[lang].lines[i];
			if (!isNumber(line[0])) continue;

			//habe gsub,byCateg,Syms


			//wie soll eine entry ausschauen?
			//group,subgroup,key (=english key)

			//file1 ist symbols
			//rename groups and subgroups!
			//alles nur auf english: key,group,subgroup,
			//file2 ist dictionary 
			//ins dictionary kommen fuer jeden key und fuer jedes wort aus tags uebersetzung in alle sprachen
			//aber wie komm ich von say german to chinese fuer ein wort?
			//fuer jeden english key kommen alle anderen sprachen, (di[bee]={D:biene,....})
			//fuer jeden anderen key kommt nur engl entry, di[biene]=bee
			//dann kann ich di[di[biene]].C ist dann von deutsch zu chinesisch
			// ich kann ruhig auch kleinere version machen wenn das jetzt zuviel wird!


		}
	}

	return;
	let txt = await route_path_text('../emoji-test.txt');
	//console.log('text von dem file ist\n',txt);
	let lines = txt.split('\n');
	//let groups=txt.split('# group');
	//lines.map(x=>console.log('line:',x));
	let group, subgroup;
	let NMAX = 100, i = 0;
	let newSyms = {};
	for (const line of lines) {
		if (startsWith(line, '# group')) { group = stringAfter(line, ':').trim(); continue; }
		if (startsWith(line, '# subgroup')) { subgroup = stringAfter(line, ':').trim(); continue; }
		if (isEmpty(line)) continue;

		let hex = stringBefore(line, ';').trim();
		let rest = stringAfter(line, '#');
		let emo = stringBefore(rest, 'E').trim();
		let key = stringAfter(rest, '.');

		key = stringAfter(key, ' ').trim();

		let text = unicodeToText(hex);

		let sym = { hex: hex, key: key, emo: emo, group: group, subgroup: subgroup, text: text };
		if (isdef(Syms[key])) {
			let info =
				console.log('key existiert!', key, i);
			i += 1;
		} else {

		}

		// console.log('key:' + key + '|');
		// console.log('code', hex, emo); // ok!




		newSyms[key] = sym;
		//i += 1; if (i > NMAX) break;
	}
	//console.log(newSyms);
}
async function loadGroupsAndCategories() {
	let s_info = await route_path_yaml_dict('../assets/s_info.yaml');
	let all = {}, groups = [], subgroups = [], gdi = {}, gsCount = {}, subgroupEmotion = [], byCateg = {}, categByKey = {};
	for (const k in s_info) {

		// ********* exclusion of keys **************
		if (k.includes('skin tone')) continue;
		if (k.includes('family:') || k.includes('kiss:') || k.includes('holding hands') && k != 'people holding hands'
			|| k.includes('couple with heart:')) continue;

		let o = s_info[k];
		if (startsWith(o.subgroup, 'person-') && (startsWith(k, 'man') || startsWith(k, 'woman'))
			//['person-activity','person-role','person-fantasy','person-gesture','person-resting','person-sport'].includes(info.subgroup) && (startsWith(k, 'man') || startsWith(k, 'woman'))
			|| startsWith(k, 'man:') || startsWith(k, 'woman:')) continue;

		//only keep one closed book!
		if (o.group == 'Objects' && o.subgroup == 'book-paper' && includesAnyOf(k, ['green', 'blue', 'orange'])) continue;

		// ********* real groups **************
		//cat: animal,emotion,face,flag,fruit,hand,object,plant,vegetable,person,shape,sport,time
		//animal
		let categ = 'other';
		if (startsWith(o.subgroup, 'animal') || endsWith(o.subgroup, 'marine')) {
			//console.log('animal:',k,'.',o.subgroup)
			//console.log('?',o.subgroup)
			categ = 'animal';
			let no = ['front-facing', 'paws', ' face', ' nose'];
			let no2 = ['guide dog', 'service dog', 'poodle', 'hatching chick', 'T-Rex', 'black ', 'spiral', ' web'];
			if (includesAnyOf(k, no) || includesAnyOf(k, no2)) categ = 'animal2';
		} else if (startsWith(o.subgroup, 'plant')) categ = 'plant';
		//face
		else if (o.group == 'Smileys & Emotion' && o.subgroup.includes('face')) { categ = 'face'; }
		//emotion and shape (von smileys*emotion group)
		else if (o.group == 'Smileys & Emotion' && o.subgroup == 'emotion') {
			if (endsWith(k, 'heart') && isColorName(stringBefore(k, ' heart'))) categ = 'shape'; else categ = 'emotion';
		}
		//flag
		else if (o.group == 'Flags' && o.subgroup == 'country-flag') { categ = 'flag'; }
		//fruit,vegetable,food,drink
		else if (startsWith(o.subgroup, 'food')) {
			if (o.subgroup.includes('fruit')) categ = 'fruit';
			else if (o.subgroup.includes('vegetable')) categ = 'vegetable';
			else if (includesAnyOf(o.subgroup, ['asian', 'prepared', 'sweet'])) categ = 'food';
		}
		else if (o.subgroup == 'drink') categ = 'drink';

		//ueberlege ob food,drink in object gehen soll

		//hand
		else if (o.group == 'People & Body' && o.subgroup.includes('hand')) categ = 'hand';

		//object
		if (o.group == 'Food & Drink' && o.subgroup == 'dishware'
			|| o.group == 'Objects'
			|| o.group == 'Activities' && o.subgroup != 'sport' && !['performing arts', 'moon viewing ceremony', 'admission tickets'].includes(k)
			|| o.subgroup == 'hotel'
			|| o.subgroup == 'time' && !k.includes('o’clock') && !k.includes('-thirty')
			|| startsWith(o.subgroup, 'transport')
			|| startsWith(o.subgroup, 'sky') && k.includes(' ') && k != 'tornado'
		) categ = 'object';
		else if (startsWith(o.subgroup, 'place')) categ = 'place';
		else if (o.subgroup == 'time' && (k.includes('o’clock') || k.includes('-thirty'))) categ = 'time';
		else if (o.subgroup.includes('sport')) categ = 'sport';
		else if (o.subgroup == 'geometric') categ = 'shape';

		else if (startsWith(o.subgroup, 'person') && !includesAnyOf(o.subgroup, ['fantasy', 'symbol', 'sport', 'gesture'])) categ = 'person';

		lookupAddIfToList(byCateg, [categ], k.trim().toLowerCase());
		lookupSet(categByKey, [k.trim().toLowerCase()], categ);

		//console.assert(isdef(o.group));

		addIf(groups, o.group);
		addIf(subgroups, o.subgroup);
		lookupAddIfToList(gdi, [o.group], o.subgroup);

		lookupAddIfToList(all, [o.group, o.subgroup], k);

		// let c = lookup(gsCount, [info.group, info.subgroup]);
		// console.log(c,isdef(c))
		// if (isdef(c)) lookupSetOverride(gsCount, [info.group, info.subgroup], (c + 1));
		// else lookupSet(gsCount, [info.group, info.subgroup], 1);

		if (o.subgroup == 'emotion') addIf(subgroupEmotion, k);
	}

	//console.log('groups', groups);
	//console.log('subgroups', subgroups);
	// console.log('dict', gdi);
	// console.log('count', gsCount);
	// console.log('emotion', subgroupEmotion);
	//console.log('all', all);

	for (const c in byCateg) {
		byCateg[c].sort();
	}

	//console.log('by cat', byCateg);
	return [s_info, all, byCateg, categByKey];
}
async function loadLanguageFiles() {
	let em1 = {};
	for (const l1 of ['C', 'D', 'E', 'F', 'I', 'L', 'R', 'S']) {
		let fname = '../DATA/em1_' + l1 + '.txt';
		let s = await route_path_text(fname);
		//als naechstes split
		let lines = s.split('\n');
		console.assert(lines.length == 2071 || lines.length == 2072);
		em1[l1] = { lang: l1, fname: fname, sraw: s, lines: lines };
	}
	return em1;
}
async function loadAllSymbolInfoFiles(verbose = false) {
	let [s_info, byGroup, byCateg] = await loadGroupsAndCategories();
	let em1 = await loadLanguageFiles();
	if (verbose) {
		console.log('em1', em1);
		console.log('s_info', s_info);
		console.log('byGroup', byGroup);
		console.log('byCateg', byCateg);
	}
	return [em1, s_info, byGroup, byCateg];
}

async function downloadEmojiTestPlusSymsEmo() {
	let txt = await route_path_text('../DATA/emoji-test.txt');
	//console.log('text von dem file ist\n',txt);
	let lines = txt.split('\n');
	//let groups=txt.split('# group');
	//lines.map(x=>console.log('line:',x));
	let group, subgroup;
	let NMAX = 100, i = 0;
	let newSyms = {};
	for (const line of lines) {
		if (startsWith(line, '# group')) { group = stringAfter(line, ':').trim(); continue; }
		if (startsWith(line, '# subgroup')) { subgroup = stringAfter(line, ':').trim(); continue; }
		if (isEmpty(line)) continue;

		let hex = stringBefore(line, ';').trim();
		let rest = stringAfter(line, '#');
		let emo = stringBefore(rest, 'E').trim();
		let key = stringAfter(rest, '.');
		key = stringAfter(key, ' ').trim().toLowerCase();

		if (isdef(newSyms[key]) && hex.length > newSyms[key].hex) continue;

		let q = stringBetween(line, ';', '#').trim();
		q = (q.includes('fully'));

		let text = unicodeToText(hex);

		let sym = { hex: hex, key: key, emo: emo, group: group, subgroup: subgroup, text: text, q: q };
		if (isdef(Syms[key])) {
			let info = Syms[key];
			sym.info = info;
			console.log('key existiert!', key, i);
			i += 1;
		}

		// console.log('key:' + key + '|');
		newSyms[key] = sym;
		//i += 1; if (i > NMAX) break;
	}
	downloadAsYaml(newSyms, 'emoInfo');
	//console.log(newSyms);
}


