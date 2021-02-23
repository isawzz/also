const FIVE_LANGUAGES = ['C', 'D', 'E', 'F', 'S'];
const EIGHT_LANGUAGES = ['C', 'D', 'E', 'F', 'I', 'L', 'R', 'S'];

async function checkText3(){
	let all=await route_path_text('../TEST/files/stage0/st3.txt');
	console.log('stage0_3',all)

	let lAll = all.split('\n');
	console.log('stage0_31',lAll);

	let lines = lAll.filter(x=>!isEmpty(x.trim()));
	console.log('stage0_31 lines',li



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



