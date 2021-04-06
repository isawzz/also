function getKeySets() {
	let ks = localStorage.getItem('KeySets');

	makeCategories();	//console.log('Categories',Categories)

	if (isdef(ks)) { return JSON.parse(ks); }

	//console.log('hallo'); return [];
	let res = {};
	for (const k in Syms) {
		let info = Syms[k];
		if (nundef(info.cats)) continue;
		for (const ksk of info.cats) {
			//console.log('ksk',ksk,'k',k);
			lookupAddIfToList(res, [ksk], k);
		}
	}
	localStorage.setItem('KeySets', JSON.stringify(res));
	return res;

}
function getGSGElements(gCond, sCond) {
	let keys = [];
	let byg = ByGroupSubgroup;
	for (const gKey in byg) {
		if (!gCond(gKey)) continue;

		for (const sKey in byg[gKey]) {
			if (!sCond(sKey)) continue;

			keys = keys.concat(byg[gKey][sKey]);
		}
	}
	return keys.sort();
}
function makeCategories() {
	//console.log(ByGroupSubgroup);
	let keys = Categories = {
		animal: getGSGElements(g => g == 'Animals & Nature', s => startsWith(s, 'animal')),
		clothing: getGSGElements(g => g == 'Objects', s => s == 'clothing'),
		emotion: getGSGElements(g => g == 'Smileys & Emotion', s => startsWith(s, 'face') && !['face-costume', 'face-hat'].includes(s)),
		food: getGSGElements(g => g == 'Food & Drink', s => startsWith(s, 'food')),
		'game/toy': (['sparkler', 'firecracker', 'artist palette', 'balloon', 'confetti ball'].concat(ByGroupSubgroup['Activities']['game'])).sort(),
		gesture: getGSGElements(g => g == 'People & Body', s => startsWith(s, 'hand')),
		job: ByGroupSubgroup['People & Body']['job'],
		mammal: ByGroupSubgroup['Animals & Nature']['animal-mammal'],
		music: getGSGElements(g => g == 'Objects', s => startsWith(s, 'musi')),
		object: getGSGElements(g => g == 'Objects', s => true),
		place: getGSGElements(g => g == 'Travel & Places', s => startsWith(s, 'place')),
		plant: getGSGElements(g => g == 'Animals & Nature' || g == 'Food & Drink', s => startsWith(s, 'plant') || s == 'food-vegetable' || s == 'food-fruit'),
		sport: ByGroupSubgroup['Activities']['sport'],
		tool: getGSGElements(g => g == 'Objects', s => s == 'tool'),
		transport: getGSGElements(g => g == 'Travel & Places', s => startsWith(s, 'transport')),
	};

	let incompatible = Daat.incompatibleCats = {
		animal: ['mammal'],
		clothing: ['object'],
		emotion: ['gesture'],
		food: ['plant', 'animal'],
		'game/toy': ['object', 'music'],
		gesture: ['emotion'],
		job: ['sport'],
		mammal: ['animal'],
		music: ['object', 'game/toy'],
		object: ['music', 'clothing', 'game/toy', 'tool'],
		place: [],
		plant: ['food'],
		sport: ['job'],
		tool: ['object'],
		transport: [],
	}
	//console.log('categories', keys);

}


function genCats(n) {
	//console.log('???????',Daat.incompatibleCats)
	let di = {};
	let cats = Object.keys(Categories);
	//console.log('cats available:',cats)
	for (let i = 0; i < n; i++) {
		let cat = chooseRandom(cats);
		let incompat = Daat.incompatibleCats[cat];
		//console.log('cats',cats,'\ncat',cat,'\nincompat',incompat)
		cats = arrMinus(cats, incompat);
		removeInPlace(cats, cat);
		//console.log('cats after minus',cats);
		di[cat] = Categories[cat];
	}
	return di;
}
function extendByGSGToObjects() {
	// let bgsg = {};
	// let flatByFriendly = {};
	// for (const gname in ByGroupSubgroup) {
	// 	let group = ByGroupSubgroup[kg];
	// 	let gnew = bgsg[gname] = {};
	// 	for (const sname in group) {
	// 		let keys = group[sname];
	// 		let friendly = startsWith(sname, 'animal') ? stringAfter(sname, '-') :
	// 			startsWith(sname, 'plant')? stringAfter(sname,'-')
	// 		gnew[sname] = { keys: keys, friendly: friendly };
	// 	}
	// }
}
function repairSubgroups() {
	let job = ["construction worker", "detective", "guard", "man astronaut", "man farmer",
		"man firefighter", "man judge", "man mechanic", "man office worker", "man pilot",
		"man technologist", "police officer", "woman artist", "woman cook", "woman factory worker",
		"woman health worker", "woman scientist", "woman singer", "woman student", "woman teacher",
	];
	let jobman = ["man artist", "man singer", "man cook", "woman pilot", "woman farmer", "woman technologist", "woman office worker", "man teacher",
		"man factory worker", "man student", "man scientist", "woman judge", "man health worker", "woman mechanic"]
	let role = ["breast-feeding", "ninja", "person in tuxedo", "person wearing turban", "person with skullcap", "person with veil", "pregnant woman", "prince", "princess", "woman with headscarf"];

	console.log(ByGroupSubgroup['People & Body']['person-role']);
	//return;
	for (const k of ByGroupSubgroup['People & Body']['person-role']) {

		let info = Syms[k];
		// if (job.includes(k)) info.subgroup = 'job';
		// console.log(k, job.includes(k),info.subgroup, );
		// continue;

		let newsub = job.includes(k) ? 'job' : jobman.includes(k) ? 'job-other' : 'role';
		info.subgroup = newsub;
		lookupAddIfToList(ByGroupSubgroup, ['People & Body', newsub], k);
	}
	downloadAsYaml(Syms, 'newSyms');
	downloadAsYaml(ByGroupSubgroup, 'symsGSG');
}


//#region old stuff: DELETE? keys: KeySets, Categories, 
function genCats_sample() {
	let di = {
		sport: ByGroupSubgroup['Activities']['sport'],
		mammal: ByGroupSubgroup['Animals & Nature']['animal-mammal'],
		job: ByGroupSubgroup['People & Body']['job'],
	};
	return di;
}
function getEmoSets_orig() {
	var emoSets = {
		nosymbols: { name: 'nosymbols', f: o => o.group != 'symbols' && o.group != 'flags' && o.group != 'clock' },
		nosymemo: { name: 'nosymemo', f: o => o.group != 'smileys-emotion' && o.group != 'symbols' && o.group != 'flags' && o.group != 'clock' },
		all: { name: 'all', f: _ => true },
		activity: { name: 'activity', f: o => o.group == 'people-body' && (o.subgroup == 'person-activity' || o.subgroup == 'person-resting') },
		animal: { name: 'animal', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroup, 'animal') },
		body: { name: 'body', f: o => o.group == 'people-body' && o.subgroup == 'body-parts' },
		clock: { name: 'clock', f: o => o.group == 'clock' },
		drink: { name: 'drink', f: o => o.group == 'food-drink' && o.subgroup == 'drink' },
		emotion: { name: 'emotion', f: o => o.group == 'smileys-emotion' },
		family: { name: 'family', f: o => o.group == 'people-body' && o.subgroup == 'family' },
		fantasy: { name: 'fantasy', f: o => o.group == 'people-body' && o.subgroup == 'person-fantasy' },
		food: { name: 'food', f: o => o.group == 'food-drink' && startsWith(o.subgroup, 'food') },
		fruit: { name: 'fruit', f: o => o.group == 'food-drink' && o.subgroup == 'food-fruit' },
		game: { name: 'game', f: o => (o.group == 'activities' && o.subgroup == 'game') },
		gesture: { name: 'gesture', f: o => o.group == 'people-body' && (o.subgroup == 'person-gesture' || o.subgroup.includes('hand')) },
		kitchen: { name: 'kitchen', f: o => o.group == 'food-drink' && o.subgroup == 'dishware' },
		math: { name: 'math', f: o => o.group == 'symbols' && o.subgroup == 'math' },
		misc: { name: 'misc', f: o => o.group == 'symbols' && o.subgroup == 'other-symbol' },
		// gesture: { name: 'gesture', f: o => o.group == 'people-body' && o.subgroup == 'person-gesture' },
		// hand: { name: 'hand', f: o => o.group == 'people-body' && o.subgroup.includes('hand') },
		//o=>o.group == 'people-body' && o.subgroup.includes('role'),
		//objects:
		object: {
			name: 'object', f: o =>
				(o.group == 'food-drink' && o.subgroup == 'dishware')
				|| (o.group == 'travel-places' && o.subgroup == 'time')
				|| (o.group == 'activities' && o.subgroup == 'event')
				|| (o.group == 'activities' && o.subgroup == 'award-medal')
				|| (o.group == 'activities' && o.subgroup == 'arts-crafts')
				|| (o.group == 'activities' && o.subgroup == 'sport')
				|| (o.group == 'activities' && o.subgroup == 'game')
				|| (o.group == 'objects')
				|| (o.group == 'activities' && o.subgroup == 'event')
				|| (o.group == 'travel-places' && o.subgroup == 'sky-weather')
		},

		person: { name: 'person', f: o => o.group == 'people-body' && o.subgroup == 'person' },
		place: { name: 'place', f: o => startsWith(o.subgroup, 'place') },
		plant: { name: 'plant', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroup, 'plant') },
		punctuation: { name: 'punctuation', f: o => o.group == 'symbols' && o.subgroup == 'punctuation' },
		role: { name: 'role', f: o => o.group == 'people-body' && o.subgroup == 'person-role' },
		shapes: { name: 'shapes', f: o => o.group == 'symbols' && o.subgroup == 'geometric' },
		sport: { name: 'sport', f: o => o.group == 'people-body' && o.subgroup == 'person-sport' },
		sports: { name: 'sports', f: o => (o.group == 'activities' && o.subgroup == 'sport') },
		sternzeichen: { name: 'sternzeichen', f: o => o.group == 'symbols' && o.subgroup == 'zodiac' },
		symbols: { name: 'symbols', f: o => o.group == 'symbols' },
		time: { name: 'time', f: o => (o.group == 'travel-places' && o.subgroup == 'time') },
		//toolbar buttons:
		toolbar: {
			name: 'toolbar', f: o => (o.group == 'symbols' && o.subgroup == 'warning')
				|| (o.group == 'symbols' && o.subgroup == 'arrow')
				|| (o.group == 'symbols' && o.subgroup == 'av-symbol')
				|| (o.group == 'symbols' && o.subgroup == 'other-symbol')
				|| (o.group == 'symbols' && o.subgroup == 'keycap')
		},

		transport: { name: 'transport', f: o => startsWith(o.subgroup, 'transport') && o.subgroup != 'transport-sign' },
		vegetable: { name: 'vegetable', f: o => o.group == 'food-drink' && o.subgroup == 'food-vegetable' },
	};
	return emoSets;
}
function getEmoSets() {
	var emoSets = {
		animal: { name: 'animal', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroup, 'animal') },
		//activity: { name: 'activity', f: o => o.cats.includes('action') && o.group == 'people-body' && (o.subgroup == 'person-activity' || o.subgroup == 'person-resting') },
		body: { name: 'body', f: o => o.group == 'people-body' && o.subgroup == 'body-parts' && !(o.key.includes('mechan')) },
		//clock: { name: 'clock', f: o => o.group == 'clock' },
		drink: { name: 'drink', f: o => o.group == 'food-drink' && o.subgroup == 'drink' && o.key != 'ice' },
		emotion: { name: 'emotion', f: o => o.group == 'smileys-emotion' },
		family: { name: 'family', f: o => o.group == 'people-body' && o.subgroup == 'family' },
		fantasy: { name: 'fantasy', f: o => o.group == 'people-body' && o.subgroup == 'person-fantasy' },
		food: { name: 'food', f: o => o.group == 'food-drink' && startsWith(o.subgroup, 'food') },
		fruit: { name: 'fruit', f: o => o.group == 'food-drink' && o.subgroup == 'food-fruit' },
		game: { name: 'game', f: o => (o.group == 'activities' && o.subgroup == 'game') },
		gesture: { name: 'gesture', f: o => o.group == 'people-body' && (o.subgroup == 'person-gesture' || o.subgroup.includes('hand')) },
		kitchen: { name: 'kitchen', f: o => o.group == 'food-drink' && o.subgroup == 'dishware' },
		math: { name: 'math', f: o => o.group == 'symbols' && o.subgroup == 'math' },
		misc: { name: 'misc', f: o => o.group == 'symbols' && o.subgroup == 'other-symbol' },
		// gesture: { name: 'gesture', f: o => o.group == 'people-body' && o.subgroup == 'person-gesture' },
		// hand: { name: 'hand', f: o => o.group == 'people-body' && o.subgroup.includes('hand') },
		//o=>o.group == 'people-body' && o.subgroup.includes('role'),
		//objects:
		object: {
			name: 'object', f: o =>
				(o.group == 'food-drink' && o.subgroup == 'dishware')
				|| (o.group == 'travel-places' && o.subgroup == 'time')
				|| (o.group == 'activities' && o.subgroup == 'event')
				|| (o.group == 'activities' && o.subgroup == 'award-medal')
				|| (o.group == 'activities' && o.subgroup == 'arts-crafts')
				|| (o.group == 'activities' && o.subgroup == 'sport')
				|| (o.group == 'activities' && o.subgroup == 'game')
				|| (o.group == 'objects')
				|| (o.group == 'activities' && o.subgroup == 'event')
				|| (o.group == 'travel-places' && o.subgroup == 'sky-weather')
		},

		person: { name: 'person', f: o => o.group == 'people-body' && o.subgroup == 'person' },
		place: { name: 'place', f: o => startsWith(o.subgroup, 'place') },
		plant: { name: 'plant', f: o => startsWith(o.group, 'animal') && startsWith(o.subgroup, 'plant') },
		punctuation: { name: 'punctuation', f: o => o.group == 'symbols' && o.subgroup == 'punctuation' },
		role: { name: 'role', f: o => o.group == 'people-body' && o.subgroup == 'person-role' },
		shapes: { name: 'shapes', f: o => o.group == 'symbols' && o.subgroup == 'geometric' },
		sport: { name: 'sport', f: o => o.group == 'people-body' && o.subgroup == 'person-sport' },
		sports: { name: 'sports', f: o => (o.group == 'activities' && o.subgroup == 'sport') },
		sternzeichen: { name: 'sternzeichen', f: o => o.group == 'symbols' && o.subgroup == 'zodiac' },
		symbols: { name: 'symbols', f: o => o.group == 'symbols' },
		time: { name: 'time', f: o => (o.group == 'travel-places' && o.subgroup == 'time') },
		//toolbar buttons:
		toolbar: {
			name: 'toolbar', f: o => (o.group == 'symbols' && o.subgroup == 'warning')
				|| (o.group == 'symbols' && o.subgroup == 'arrow')
				|| (o.group == 'symbols' && o.subgroup == 'av-symbol')
				|| (o.group == 'symbols' && o.subgroup == 'other-symbol')
				|| (o.group == 'symbols' && o.subgroup == 'keycap')
		},

		transport: { name: 'transport', f: o => startsWith(o.subgroup, 'transport') && o.subgroup != 'transport-sign' },
		vegetable: { name: 'vegetable', f: o => o.group == 'food-drink' && o.subgroup == 'food-vegetable' },
	};
	return emoSets;
}
function getCatSets() {
	CatSets = {};
	let emoSets = getEmoSets();
	for (const k in emoSets) {
		let set = emoSets[k];
		let name = set.name;
		let f = set.f;

		for (const k1 in Syms) {
			let o = Syms[k1];
			if (nundef(o.group) || nundef(o.subgroup)) { console.log('!!!!!!!!!!!!', k1, o); return; continue; }
			let passt = f(o);
			if (!passt) continue;
			if (passt) { lookupAddToList(CatSets, [name], k1); }
		}
	}
	//console.log(CatSets);
}
function getKeysIn(group, subgroup) {
	let gsublower = lookup(ByGroupSubgroup, [group.toLowerCase(), subgroup]);
	let gsub = lookup(ByGroupSubgroup, [group, subgroup]);
	return gsub.filter(x => isdef(Syms[x]));
}
async function loadGroupsAndCategories() {
	console.log('haaaaaaaaaaaaaaaaaa')
	let s_info = await route_path_yaml_dict('../assets/s_info.yaml');
	ByGroupSubgroup = {};
	let symsCorrected = {};
	for (const k in Syms) {
		let kCorrect = k;
		let info = Syms[k];
		let si = s_info[k];
		if (nundef(info.group) && nundef(si)) {
			for (const sk in s_info) {
				let si1 = s_info[sk];
				if (si1.hex == info.hex || si1.hexcode == info.hexcode) {
					si = si1;
					console.log('===>', si1)
					console.log('key', k, 'needs to be corrected to', sk);
					kCorrect = sk;
					break;
				}
			}
			console.log('!!!NOT FOUND IN S_INFO:', k, 'syms', info, 'si', si);
		}
		if (isdef(si) && isdef(si.group) && isdef(si.subgroup)) { info.group = si.group; info.subgroup = si.subgroup; }
		else if (isdef(info.group)) {
			let correctGroups = {
				'animals-nature': 'Animals & Nature',
				'food-drink': 'Food & Drink',
				'people-body': 'People & Body',
				'smileys-emotion': 'Smileys & Emotion',
				'travel-places': 'Travel & Places',
				'activities': 'Activities',
				'objects': 'Objects',
			}
			if (isdef(correctGroups[info.group])) info.group = correctGroups[info.group];
		} else {
			console.log('there is no group information for', k, info)
		}
		lookupAddIfToList(ByGroupSubgroup, [info.group, info.subgroup], k);
		symsCorrected[kCorrect] = info;
	}

	let ds = {};
	let groups = Object.keys(ByGroupSubgroup);
	groups.sort();
	for (const g of groups) {
		let sgroups = Object.keys(ByGroupSubgroup[g]);
		sgroups.sort();
		ds[g] = {};
		for (const sg of sgroups) {
			ds[g][sg] = ByGroupSubgroup[g][sg];
		}
		console.log(sgroups)
	}


	downloadAsYaml(symsCorrected, 'symsCorrected');
	downloadAsYaml(ds, 'byGSG');
}
async function loadGroupsAndCategories_orig() {
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











function calcDisjunctKeysets() {
	let dictDisjoint = {};
	for (const k1 in KeySets) {
		for (const k2 in KeySets) {
			if (k1 == k2) continue;
			if (lookup(dictDisjoint, [k1, k2]) != null) continue;

			let list = intersection(KeySets[k1], KeySets[k2]);
			if (isEmpty(list)) {
				lookupSet(dictDisjoint, [k1, k2], true);
				lookupSet(dictDisjoint, [k2, k1], true);
			} else {
				lookupSet(dictDisjoint, [k1, k2], false);
				lookupSet(dictDisjoint, [k2, k1], false);
			}
		}
	}
	return dictDisjoint;
}
function getCatGroups(n) {
	const catGroups = {
		catsAnimals: { amphibian: 'animal-amphibian', bird: 'animal-bird', insect: 'animal-bug', mammal: 'animal-mammal', marine: 'animal-marine', reptile: 'animal-reptile', },
		catsOther: {
			weather: 'weather', sound: 'sound', travel: 'travel',
			award: 'award-medal', body: 'body-parts', book: 'book-paper', food: 'food', hands: 'hands', hotel: 'hotel', sport: 'person-sport',
		},
		catsVocab: { life: 'life', object: 'object', objects: 'objects', },
		catsFoodDrink: { fruit: 'food-fruit', vegetable: 'food-vegetable', dessert: 'food-sweet', drink: 'drink', },
		catsObjects: {
			art: 'arts-crafts',
			clothing: 'clothing', household: 'household',
			lock: 'lock',
			mail: 'mail',
			medical: 'medical',
			money: 'money',
			music: 'musical-instrument',
			office: 'office',
			computer: 'computer',
			dishware: 'dishware', hotel: 'hotel', game: 'game', phone: 'phone', science: 'science',
		},
		cats1: {
			art: 'arts-crafts', body: 'body-parts', book: 'book-paper', clothing: 'clothing', computer: 'computer', object: 'object',
			objects: 'objects', household: 'household',
			lock: 'lock',
			mail: 'mail',
			medical: 'medical',
			money: 'money',
			music: 'musical-instrument',
			office: 'office', phone: 'phone', science: 'science',
		},
		cats2: {
			animal: 'animals-nature', emotion: 'smileys-emotion', face: 'face', hand: 'hand', building: 'place-building',
			place: 'place', weather: 'weather', travel: 'travel',
			map: 'place-map',
		},
		cats3: {
			action: 'action', drink: 'drink', food: 'food', fruit: 'food-fruit', role: 'person-role', plant: 'plant',
			sport: 'person-sport', role: 'person-role',
			vegetable: 'food-vegetable',
			dessert: 'food-sweet',
		},
		catsBest: {
			action: 'action',
			animal: 'animals-nature',
			art: 'arts-crafts',
			clothing: 'clothing',
			computer: 'computer',
			dishware: 'dishware',
			drink: 'drink',
			emotion: 'smileys-emotion',
			fruit: 'food-fruit',
			vegetable: 'food-vegetable',
			dessert: 'food-sweet',
			game: 'game',
			hand: 'hand',
			household: 'household',
			lock: 'lock',
			mail: 'mail',
			medical: 'medical',
			money: 'money',
			music: 'musical-instrument',
			office: 'office',
			role: 'person-role',
			phone: 'phone',
			building: 'place-building',
			place: 'place',
			map: 'place-map',
			plant: 'plant',
			science: 'science',
			sound: 'sound',
			sport: 'sport',
			tool: 'tool',
			transport: 'transport',
			writing: 'writing',
		},
	};
	return catGroups;
}
function getRandomCats(n) {
	let catGroups = getCatGroups();

	let list = Object.keys(catGroups.catsBest);
	let nRandom = choose(list, n);
	let res = [];

	for (const catName of nRandom) {
		let list, realKey;
		for (const k in KeySets) {
			if (k.includes(catName)) { list = KeySets[k]; realKey = k; break; }
		}
		res.push({ cat: catName, friendly: getFriendlyByCat(catName), key: realKey, list: list });
	}
	return res;
}
function getFriendlyByCat(cat) {
	const CATS1 = {
		action: 'action',
		animal: 'animals-nature',
		amphibian: 'animal-amphibian',
		bird: 'animal-bird',
		insect: 'animal-bug',
		mammal: 'animal-mammal',
		marine: 'animal-marine',
		reptile: 'animal-reptile',
		art: 'arts-crafts',
		award: 'award-medal',
		body: 'body-parts',
		book: 'book-paper',
		clothing: 'clothing',
		computer: 'computer',
		dishware: 'dishware',
		drink: 'drink',
		emotion: 'smileys-emotion',
		face: 'face',
		food: 'food',
		fruit: 'food-fruit',
		vegetable: 'food-vegetable',
		dessert: 'food-sweet',
		game: 'game',
		hand: 'hand',
		hands: 'hands',
		hotel: 'hotel',
		household: 'household',
		life: 'life',
		lock: 'lock',
		mail: 'mail',
		medical: 'medical',
		money: 'money',
		music: 'musical-instrument',
		object: 'object',
		objects: 'objects',
		office: 'office',
		role: 'person-role',
		sport: 'person-sport',
		phone: 'phone',
		building: 'place-building',
		place: 'place',
		map: 'place-map',
		plant: 'plant',
		science: 'science',
		weather: 'weather',
		sound: 'sound',
		sports: 'sport',
		tool: 'tool',
		transport: 'transport',
		travel: 'travel',
		writing: 'writing',
	};
	let dopp = {};
	for (const k in CATS1) {

		dopp[CATS1[k]] = k;

	}
	downloadAsYaml(dopp, 'catsFriendly');
	return dopp[cat];
}

