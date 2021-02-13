//#region DOM m
function mAppend(d, child) { d.appendChild(child); }
function mBy(id) { return document.getElementById(id); }
function mClass(d) { for (let i = 1; i < arguments.length; i++) d.classList.add(arguments[i]); }
function mCreate(tag) { return document.createElement(tag); }
function mDiv(dParent = null, styles) { let d = mCreate('div'); if (dParent) mAppend(dParent, d); if (isdef(styles)) mStyleX(d, styles); return d; }
function mRemoveClass(d) { for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mStyleX(elem, styles, unit = 'px') {
	const paramDict = {
		align: 'text-align',
		bg: 'background-color',
		fg: 'color',
		matop: 'margin-top',
		maleft: 'margin-left',
		mabottom: 'margin-bottom',
		maright: 'margin-right',
		patop: 'padding-top',
		paleft: 'padding-left',
		pabottom: 'padding-bottom',
		paright: 'padding-right',
		rounding: 'border-radius',
		w: 'width',
		h: 'height',
		wmin: 'min-width',
		hmin: 'min-height',
		wmax: 'max-width',
		hmax: 'max-height',
		fontSize: 'font-size',
		fz: 'font-size',
		family: 'font-family',
		weight: 'font-weight',
		z: 'z-index'
	};
	//console.log(':::::::::styles',styles)
	let bg, fg;
	if (isdef(styles.bg) || isdef(styles.fg)) {
		[bg, fg] = getExtendedColors(styles.bg, styles.fg);
	}
	if (isdef(styles.vmargin) && isdef(styles.hmargin)) {
		styles.margin = styles.vmargin + unit + ' ' + styles.hmargin + unit;
		console.log('::::::::::::::', styles.margin)
	}
	if (isdef(styles.vpadding) && isdef(styles.hpadding)) {

		styles.padding = styles.vpadding + unit + ' ' + styles.hpadding + unit;
		console.log('::::::::::::::', styles.vpadding, styles.hpadding)
	}
	if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
	//console.log(styles.bg,styles.fg);

	for (const k in styles) {
		//if (k=='textShadowColor' || k=='contrast') continue; //meaningless styles => TBD
		let val = styles[k];
		let key = k;
		if (isdef(paramDict[k])) key = paramDict[k];
		else if (k == 'font' && !isString(val)) {
			//font would be specified as an object w/ size,family,variant,bold,italic
			// NOTE: size and family MUST be present!!!!!!! in order to use font param!!!!
			let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
			let ff = f.family;
			let fv = f.variant;
			let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
			let fs = isdef(f.italic) ? 'italic' : f.style;
			if (nundef(fz) || nundef(ff)) return null;
			let s = fz + ' ' + ff;
			if (isdef(fw)) s = fw + ' ' + s;
			if (isdef(fv)) s = fv + ' ' + s;
			if (isdef(fs)) s = fs + ' ' + s;
			elem.style.setProperty(k, s);
			continue;
		} else if (k == 'border') {
			//console.log('________________________YES!')
			if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
			if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
		} else if (k == 'layout') {
			elem.style.setProperty('display', 'flex');
			elem.style.setProperty('flex-wrap', 'wrap');
			let hor, vert;
			if (val.length == 1) hor = vert = 'center';
			else {
				let di = { c: 'center', s: 'start', e: 'end' };
				hor = di[val[1]];
				vert = di[val[2]];

			}
			let justStyle = val[0] == 'v' ? vert : hor;
			let alignStyle = val[0] == 'v' ? hor : vert;
			elem.style.setProperty('justify-content', justStyle);
			elem.style.setProperty('align-items', alignStyle);
			switch (val[0]) {
				case 'v': elem.style.setProperty('flex-direction', 'column'); break;
				case 'h': elem.style.setProperty('flex-direction', 'row'); break;
			}
		}

		//console.log(key,val,isNaN(val));if (isNaN(val) && key!='font-size') continue;

		if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
		else if (key == 'background-color') elem.style.background = bg;
		else if (key == 'color') elem.style.color = fg;
		else if (key == 'opacity') elem.style.opacity = val;
		else {
			//console.log('set property',key,makeUnitString(val,unit),val,isNaN(val));
			//if ()
			elem.style.setProperty(key, makeUnitString(val, unit));
		}
	}
}
function mText(text, dParent, styles, classes) {
	let d = mDiv(dParent);
	if (!isEmpty(text)) d.innerHTML = text;
	if (isdef(styles)) mStyleX(d, styles);
	if (isdef(classes)) mClass(d, classes);
	return d;
}

//#endregion

//#region color
function computeColor(c) { return (c == 'random') ? randomColor() : c; }
function computeColorX(c) {

	let res = c;
	if (isList(c)) return chooseRandom(c);
	else if (isString(c) && startsWith(c, 'rand')) {
		res = randomColor();
		let spec = c.substring(4);
		//console.log('______________________', spec);
		if (isdef(window['color' + spec])) {
			console.log('YES!');
			res = window['color' + spec](res);
		}

	}
	return res;
}
function getExtendedColors(bg, fg) {
	//#region doc 
	/* handles values random, inherit, contrast	*/
	//#endregion 
	bg = computeColor(bg);
	fg = computeColor(fg);
	if (bg == 'inherit' && (nundef(fg) || fg == 'contrast')) {
		fg = 'inherit'; //contrast to parent bg!

	} else if (fg == 'contrast' && isdef(bg) && bg != 'inherit') fg = colorIdealText(bg);
	else if (bg == 'contrast' && isdef(fg) && fg != 'inherit') { bg = colorIdealText(fg); }
	return [bg, fg];
}

//#endregion

//#region fire
function fireClick(node) {
	if (document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		//console.log('fireClick: createEvent and node.dispatchEvent exist!!!', node)
		//console.log('****************fireClick: node.onclick exists!!!', node)
		//node.click();
		node.dispatchEvent(evt);
	} else if (document.createEventObject) {
		//console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		//console.log('****************fireClick: node.onclick exists!!!', node)
		node.onclick();
	}
}
function fireWheel(node) {
	if (document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('wheel', true, false);
		console.log('fireClick: createEvent and node.dispatchEvent exist!!!', node)
		node.dispatchEvent(evt);
	} else if (document.createEventObject) {
		console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		console.log('fireClick: node.onclick exists!!!', node)
		node.onclick();
	}
}
function fireKey(k, { control, alt, shift } = {}) {
	console.log('fireKey called!' + document.createEvent)
	if (document.createEvent) {
		// var evt = document.createEvent('KeyEvents');
		// evt.initEvent('keyup', true, false);
		console.log('fireKey: createEvent and node.dispatchEvent exist!!!', k, control, alt, shift);
		//el.dispatchEvent(new Event('focus'));
		//el.dispatchEvent(new KeyboardEvent('keypress',{'key':'a'}));
		window.dispatchEvent(new KeyboardEvent('keypress', { key: '+', ctrlKey: true }));
	} else if (document.createEventObject) {
		console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		console.log('fireClick: node.onclick exists!!!', node)
		node.onclick();
	}
}
//#endregion

//#region file IO
function downloadTextFile(s, filenameNoExt, ext = 'txt') {
	saveFileAtClient(
		filenameNoExt + "." + ext,
		"data:application/text",
		new Blob([s], { type: "" }));

}
function saveFileAtClient(name, type, data) {
	//usage:
	// json_str = JSON.stringify(someObject);
	// saveFileAtClient("yourfilename.json", "data:application/json", new Blob([json_str], {type: ""}));

	//console.log(navigator.msSaveBlob);
	if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
	let a = document.createElement('a');
	a.style.display = 'none';
	let url = window.URL.createObjectURL(new Blob([data], { type: type }));
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	fireClick(a);
	setTimeout(function () {
		// fixes firefox html removal bug
		window.URL.revokeObjectURL(url);
		a.remove();
	}, 500);
}
function downloadAsText(s, filename, ext = 'txt') {
	downloadTextFile(s, filename, ext);
}
function downloadAsYaml(o, filename) {
	//console.log(symbolDict_)
	let y = jsonToYaml(o);
	downloadTextFile(y, filename, 'yaml');
}
function jsonToYaml(o) {
	// this is your json object
	//JSONObject jsonobject = new JSONObject(map);
	// get json string
	let y = jsyaml.dump(o);
	return y;
	//  let text= JSON.stringify(o); //o.toString(4);
	//  let di = jsyaml.load(text);
	//  let y = jsyaml.dump(di);
}

//#endregion

//#region init 
function initLive() { Live = {};Daat={}; }

//#endregion

//#region keys
function getKeySets() {
	let ks = localStorage.getItem('KeySets');
	if (isdef(ks)) return JSON.parse(ks);

	let res = {};
	for (const k in Syms) {
		let info = Syms[k];
		if (nundef(info.cats)) continue;
		for (const ksk of info.cats) {
			lookupAddIfToList(res, [ksk], k);
		}
	}
	localStorage.setItem('KeySets', JSON.stringify(res));
	return res;

}

//#endregion

//#region loading DB, yaml,json,text
async function dbInit(appName, dir = '../DATA/') {
	let users = await route_path_yaml_dict(dir + '_users.yaml');
	let settings = await route_path_yaml_dict(dir + '_settings.yaml');
	let addons = await route_path_yaml_dict(dir + '_addons.yaml');
	let games = await route_path_yaml_dict(dir + '_games.yaml');
	let speechGames = await route_path_yaml_dict(dir + '_speechGames.yaml');
	let tables = await route_path_yaml_dict(dir + '_tables.yaml');

	DB = {
		id: appName,
		users: users,
		settings: settings,
		games: games,
		tables: tables,
		speechGames: speechGames,
		addons: addons,
	};

	dbSave(appName);
}
async function dbLoad(appName, callback) {
	let url = SERVERURL;
	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	}).then(async data => {
		let sData = await data.json();

		DB = firstCond(sData, x => x.id == appName);
		console.log('...loaded DB', DB);

		if (isdef(callback)) callback();
	});
}

var BlockServerSend = false;
async function dbSave(appName) {
	if (BlockServerSend) { setTimeout(() => dbSave(appName), 1000); }
	else {
		//console.log('saving DB:',appName,DB);
		let url = SERVERURL + appName;
		BlockServerSend = true;
		//console.log('blocked...');
		fetch(url, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(DB)
		}).then(() => { BlockServerSend = false; }); //console.log('unblocked...'); });
	}
}

async function fetch_wrapper(url) { return await fetch(url); }
async function route_path_yaml_dict(url) {
	let data = await fetch_wrapper(url);
	let text = await data.text();
	let dict = jsyaml.load(text);
	return dict;
}
async function route_path_json_dict(url) {
	let data = await fetch_wrapper(url);
	let json = await data.json();
	return json;
}
async function route_path_text(url) {
	let data = await fetch_wrapper(url);
	return await data.text();
}
async function localOrRoute(key, url) {
	if (USE_LOCAL_STORAGE) {
		let x = localStorage.getItem(key);
		if (isdef(x)) return JSON.parse(x);
		else {
			let data = await route_path_yaml_dict(url);
			if (key != 'svgDict') localStorage.setItem(key, JSON.stringify(data));
			return data;
		}
	} else return await route_path_yaml_dict(url);
}


//#endregion

//#region measure size and pos
function getRect(elem, relto) {

	if (isString(elem)) elem = document.getElementById(elem);

	let res = elem.getBoundingClientRect();
	console.log(res)
	if (isdef(relto)) {
		let b2 = relto.getBoundingClientRect();
		res = {
			x: b1.x - b2.x,
			y: b1.y - b2.y,
			left: b1.left - b2.left,
			top: b1.top - b2.top,
			right: b1.right - b2.right,
			bottom: b1.bottom - b2.bottom,
			width: b1.width,
			height: b1.height
		};
	}
	return {x:Math.round(res.left),y:Math.round(res.top),w:Math.round(res.width),h:Math.round(res.height)};
}
function getSizeWithStyles(text, styles) {
	var d = document.createElement("div");
	document.body.appendChild(d);
	//console.log(styles);
	let cStyles = jsCopy(styles);
	cStyles.position = 'fixed';
	cStyles.opacity = 0;
	cStyles.top = '-9999px';
	mStyleX(d, cStyles);
	d.innerHTML = text;
	height = d.clientHeight;
	width = d.clientWidth;
	d.parentNode.removeChild(d);
	return { w: Math.round(width), h: Math.round(height) };
}
function toBase10(s,base=16){
	//console.log(s);
	let s1=reverseString(s.toLowerCase());
	//console.log(s1);
	let res=0;
	let mult=1;
	for(let i=0;i<s1.length;i++){
		let l=s1[i];
		let hexarr=['a','b','c','d','e','f'];
		let n= isNumber(l)?Number(l):10+hexarr.indexOf(l);
		res+=mult*n;
		mult*=base;
	}
	return res;
}
//#endregion

//#region objects (arrays, dictionaries...)
function lookup(dict, keys) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (k === undefined) break;
		let e = d[k];
		if (e === undefined || e === null) return null;
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupSet(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (nundef(k)) continue; //skip undef or null values
		if (d[k] === undefined) d[k] = (i == ilast ? val : {});
		if (nundef(d[k])) d[k] = (i == ilast ? val : {});
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupSetOverride(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {

		//console.log(k,d)
		if (i == ilast) {
			if (nundef(k)) {
				//letzter key den ich eigentlich setzen will ist undef!
				alert('lookupAddToList: last key indefined!' + keys.join(' '));
				return null;
			} else {
				d[k] = val;
			}
			return d[k];
		}

		if (nundef(k)) continue; //skip undef or null values

		if (nundef(d[k])) d[k] = {};

		d = d[k];
		i += 1;
	}
	return d;
}
function lookupAddToList(dict, keys, val) {
	//usage: lookupAddToList({a:{b:[2]}}, [a,b], 3) => {a:{b:[2,3]}}
	//usage: lookupAddToList({a:{b:[2]}}, [a,c], 3) => {a:{b:[2],c:[3]}}
	//usage: lookupAddToList({a:[0, [2], {b:[]}]}, [a,1], 3) => { a:[ 0, [2,3], {b:[]} ] }
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {

		if (i == ilast) {
			if (nundef(k)) {
				//letzter key den ich eigentlich setzen will ist undef!
				alert('lookupAddToList: last key indefined!' + keys.join(' '));
				return null;
			} else if (isList(d[k])) {
				d[k].push(val);
			} else {
				d[k] = [val];
			}
			return d[k];
		}

		if (nundef(k)) continue; //skip undef or null values

		// if (i ==ilast && d[k]) d[k]=val;

		if (d[k] === undefined) d[k] = {};

		d = d[k];
		i += 1;
	}
	return d;
}
function lookupAddIfToList(dict, keys, val) {
	//usage see lookupAddToList 
	//only adds it to list if not contained!
	let lst = lookup(dict, keys);
	if (isList(lst) && lst.includes(val)) return;
	lookupAddToList(dict, keys, val);
}
function lookupRemoveFromList(dict, keys, val, deleteIfEmpty = false) {
	//usage: lookupRemoveFromList({a:{b:[2]}}, [a,b], 2) => {a:{b:[]}} OR {a:{}} (wenn deleteIfEmpty==true)
	//usage: lookupRemoveFromList({a:{b:[2,3]}}, [a,b], 3) => {a:{b:[2]}}
	//usage: lookupRemoveFromList({a:[ 0, [2], {b:[]} ] }, [a,1], 2) => { a:[ 0, [], {b:[]} ] }
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {

		if (i == ilast) {
			if (nundef(k)) {
				//letzter key den ich eigentlich setzen will ist undef!
				alert('lookupRemoveFromList: last key indefined!' + keys.join(' '));
				return null;
			} else if (isList(d[k])) {
				removeInPlace(d[k], val);
				if (deleteIfEmpty && isEmpty(d[k])) delete d[k];
			} else {
				if (d[k] === undefined) {
					error('lookupRemoveFromList not a list ' + d[k]);
					return null;
				}
			}
			return d[k];
		}

		if (nundef(k)) continue; //skip undef or null values

		// if (i ==ilast && d[k]) d[k]=val;

		if (d[k] === undefined) {
			error('lookupRemoveFromList key not found ' + k);
			return null;
		}

		d = d[k];
		i += 1;
	}
	return d;
}
//#endregion

//#region random
function coin(percent = 50) {
	let r = Math.random();
	//r ist jetzt zahl zwischen 0 und 1
	r *= 100;
	return r < percent;
}
function choose(arr, n, exceptIndices) {
	var result = [];
	var len = arr.length;
	var taken = new Array(len);
	if (isdef(exceptIndices) && exceptIndices.length < len - n) {
		for (const i of exceptIndices) if (i >= 0 && i <= len) taken[i] = true;
	}
	if (n > len) n = len - 1;
	while (result.length < n) {
		var iRandom = Math.floor(Math.random() * len);
		while (taken[iRandom]) { iRandom += 1; if (iRandom >= len) iRandom = 0; }
		result.push(arr[iRandom]);
		taken[iRandom] = true;
	}
	return result;
}
function chooseRandom(arr, condFunc = null) {
	let len = arr.length;
	if (condFunc) {
		let best = arr.filter(condFunc);
		if (!isEmpty(best)) return chooseRandom(best);
	}
	let idx = Math.floor(Math.random() * len);
	return arr[idx];
}
function randomColor(s, l, a) { return isdef(s) ? randomHslaColor(s, l, a) : randomHexColor(); }
function randomHslaColor(s = 100, l = 70, a = 1) {
	//s,l in percent, a in [0,1], returns hsla string
	var hue = Math.round(Math.random() * 360);
	return hslToHslaString(hue, s, l, a);
}
function randomHexColor() {
	let s = '#';
	for (let i = 0; i < 6; i++) {
		s += chooseRandom(['f', 'c', '9', '6', '3', '0']);
	}
	return s;
}
function randomNumber(min = 0, max = 100) {
	return Math.floor(Math.random() * (max - min + 1)) + min; //min and max inclusive!
}

//#endregion

//#region string functions
function replaceAll(str, sSub, sBy) {
	let regex = new RegExp(sSub, 'g');
	return str.replace(regex, sBy);
}
function reverseString(s) {
	return toLetterList(s).reverse().join('');
}
function sameCaseInsensitive(s1, s2) {
	return s1.toLowerCase() == s2.toLowerCase();
}
function startsWith(s, sSub) {
	//testHelpers('startWith: s='+s+', sSub='+sSub,typeof(s),typeof(sSub));
	return s.substring(0, sSub.length) == sSub;
}
function stringAfter(sFull, sSub) {
	//testHelpers('s='+sFull,'sub='+sSub)
	let idx = sFull.indexOf(sSub);
	//testHelpers('idx='+idx)
	if (idx < 0) return '';
	return sFull.substring(idx + sSub.length);
}
function stringAfterLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return arrLast(parts);
}
function stringBefore(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return sFull;
	return sFull.substring(0, idx);
}
function stringBeforeLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return sFull.substring(0, sFull.length - arrLast(parts).length - 1);
}
function stringBetween(sFull, sStart, sEnd) {
	return stringBefore(stringAfter(sFull, sStart), isdef(sEnd) ? sEnd : sStart);
}
function stringBetweenLast(sFull, sStart, sEnd) {
	let s1 = stringBeforeLast(sFull, isdef(sEnd) ? sEnd : sStart);
	return stringAfterLast(s1, sStart);
	//return stringBefore(stringAfter(sFull,sStart),isdef(sEnd)?sEnd:sStart);
}
function toLetterList(s) {
	return [...s];
}

//#endregion

//#region type checking / checking
function isdef(x) { return x !== null && x !== undefined; }
function nundef(x) { return x === null || x === undefined; }

function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isDictOrList(d) { return typeof (d) == 'object'; }
function isList(arr) { return Array.isArray(arr); }
function isLiteral(x) { return isString(x) || isNumber(x); }
function isNumber(x) { return !isNaN(+x); }
function isString(param) { return typeof param == 'string'; }

//#endregion

//#region misc helpers
function createElementFromHTML(htmlString) {
	//console.log('---------------',htmlString)
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();// '<div>halloooooooooooooo</div>';// htmlString.trim();

	// Change this to div.childNodes to support multiple top-level nodes
	//console.log(div.firstChild)
	return div.firstChild;
}
function isEmpty(arr) {
	return arr === undefined || !arr
		|| (isString(arr) && (arr == 'undefined' || arr == ''))
		|| (Array.isArray(arr) && arr.length == 0)
		|| Object.entries(arr).length === 0;
}
function jsCopy(o) {
	//console.log(o)
	return JSON.parse(JSON.stringify(o));
}
function makeUnitString(nOrString, unit = 'px', defaultVal = '100%') {
	if (nundef(nOrString)) return defaultVal;
	if (isNumber(nOrString)) nOrString = '' + nOrString + unit;
	return nOrString;
}
//#endregion













