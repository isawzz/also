module.exports = {
	makeid,
	fromYamlFile,
	getFilenames,
	toYamlFile, toYamlString,
	convertPerlen,
	listFiles,
}
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const base = require('../BASE/base.js');

function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
function fromYamlFile(filePath) {
	try {
		//console.log('filePath',filePath)
		let fileContents = fs.readFileSync(filePath, 'utf8');
		//console.log(typeof fileContents);
		//console.log(fileContents)
		let data = yaml.parse(fileContents);
		//console.log('data',typeof data,Object.keys(data),data['playful']);
		return data;
	} catch (e) {
		//console.log(e);
		return null;
	}
}
function toYamlString(data){return yaml.stringify(data);}
function toYamlFile(data, filePath) {
	let yamlStr = yaml.stringify(data);
	//console.log('?')
	fs.writeFileSync(filePath, yamlStr, 'utf8');
}
function getFilenames(dir, callback) {
	let filenames = [];
	fs.readdir(dir, (err, files) => {
		if (err) { return console.log('Unable to scan directory: ' + err); }
		files.forEach(file => {
			// Do whatever you want to do with the file
			filenames.push(file);//console.log(file);
		});
		//console.log(filenames);
		if (base.isdef(callback)) callback(filenames);
	});
}
function listFiles(perlen) {
	const directoryPath = path.join(__dirname, PERLEN_DATA_PATH + 'perlen');
	let names = [];
	fs.readdir(directoryPath, (err, files) => {
		if (err) { return console.log('Unable to scan directory: ' + err); }
		files.forEach(file => {
			// Do whatever you want to do with the file
			names.push(file);//console.log(file);
		});
		console.log(names.length);
		for (let i = 0; i < names.length; i++) {
			console.log(names[i]);
			let fname = base.stringBefore(names[i], '.');
			console.log(fname);
			let p = findPerle(fname, perlen);
			if (p) {
				p.path = fname;
			} else {
				p = { path: fname, Name: base.capitalize(fname), Update: base.formatDate(), Created: base.formatDate(), 'Fe Tags': '', 'Wala Tags': '', 'Ma Tags': '' };
				perlen.push(p);
			}
		}
		//save perlen in new file!
		perlen.sort((a, b) => a.path < b.path ? -1 : 1);
		toYamlFile(perlen, './newPerlen.yaml');
	});
}


//#region ?
function toPngFile(data, filePath) {
	const fs = require('fs');
	const fetch = require('node-fetch');

	const url = "https://www.something.com/.../image.jpg"

	async function download() {
		const response = await fetch(url);
		const buffer = await response.buffer();
		fs.writeFile(`./image.jpg`, buffer, () =>
			console.log('finished downloading!'));
	}
}

function convertPerlen(list) {
	let di = {};
	for (let i = 0; i < list.length; i++) {
		let el = list[i];
		di[i] = {
			file: 'perlen/' + el + '.png',
			title: el,
			key: i,
			tags: { fe: addRandomTags('felix'), di: addRandomTags('wala'), ma: addRandomTags('ma') },
			text: "",
		};
	}
	toYamlFile(di, './frontEnd/assets/glasperlen.yaml');
	return di;
}

function addRandomTags(name) {
	const tags = {
		felix: ['psychology', 'time', 'culture', 'future', 'control', 'causality'],
		ma: ['yin', 'yang', 'trap', 'flavors', 'control', 'start'],
		wala: ['struktur', 'gromgorr', 'meinung', 'entwicklung', 'kollectiv', 'macht']
	};
	let arr = base.isdef(tags[name]) ? tags[name] : tags.felix;
	let n = base.randomNumber(1, 3);
	let t = base.choose(arr, n);
	return t;
}

function findPerle(fname, perlen) {
	let x = base.firstCond(perlen, x => x.text.toLowerCase().includes(fname.toLowerCase()));
	if (base.isdef(x)) console.log('found perle for', fname);
	return x;
}