//#region DOM m
function mAppend(d, child) { d.appendChild(child); }
function mBy(id) { return document.getElementById(id); }
function mCreate(tag) { return document.createElement(tag); }
function mDiv(dParent = null, styles) { let d = mCreate('div'); if (dParent) mAppend(dParent, d); if (isdef(styles)) mStyleX(d, styles); return d; }
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
			if (isNumber(val)) val=`solid ${val}px ${isdef(styles.fg)?styles.fg:'#ffffff80'}`;
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

//#endregion

//#region init 
function initLive() { Live = {}; }

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















