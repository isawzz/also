const BROADCAST_SETTINGS = true;

//#region config

var USE_ADDONS = false;
const DEFAULTUSERNAME = 'gul'; // nil | gul | felix
const OFFLINE = true;

const SERVERURL = OFFLINE ? 'http://localhost:3000/app/' : 'https://speech-games.herokuapp.com/app/';
var USE_LOCAL_STORAGE = !BROADCAST_SETTINGS; // true | false //localStorage is cleared when false!!!!!
const CLEAR_LOCAL_STORAGE = BROADCAST_SETTINGS;

//#endregion

var C52, Syms, SymKeys, KeySets, Categories, ByGroupSubgroup; //, CatSets, SymbolDict, SInfo;
var DB;

var U;
var Pictures, Goal, Selected, Score, uiActivated = false, auxOpen, TO, QContextCounter = 0,Live,Daat,G;
var Settings, SettingsChanged; //var G, T, P, U, User, ????? , G...Game, T...Table, U...Userdata


var DA, Items;

//#region color constants
var ColorNames; //see base.js colors
const BLUE = '#4363d8';
const BLUEGREEN = '#004054';
const BROWN = '#96613d';
const GREEN = '#3cb44b';
const FIREBRICK = '#800000';
const LIGHTGREEN = '#afff45'; //'#bfef45';
const LIGHTBLUE = '#42d4f4';
const OLIVE = '#808000';
const ORANGE = '#f58231';
const PURPLE = '#911eb4';
const RED = '#e6194B';
const TEAL = '#469990';
const YELLOW = '#ffe119';
const YELLOW2 = '#ffa0a0'; //?pink???
const YELLOW3 = '#ffed01';

const ColorList = ['lightgreen', 'lightblue', 'yellow', 'red', 'green', 'blue', 'purple', 'violet', 'lightyellow',
	'teal', 'orange', 'brown', 'olive', 'deepskyblue', 'deeppink', 'gold', 'black', 'white', 'grey'];
const ColorDict = {
	black: { c: 'black', E: 'black', D: 'schwarz' },
	blue: { c: 'blue', E: 'blue', D: 'blau' },
	BLUEGREEN: { c: BLUEGREEN, E: 'bluegreen', D: 'blaugrün' },
	blue1: { c: BLUE, E: 'blue', D: 'blau' },
	BROWN: { c: BROWN, E: 'brown', D: 'braun' },
	deepyellow: { c: YELLOW3, E: 'yellow', D: 'gelb' },
	gold: { c: 'gold', E: 'gold', D: 'golden' },
	green: { c: 'green', E: 'green', D: 'grün' },
	green1: { c: GREEN, E: 'green', D: 'grün' },
	grey: { c: 'grey', E: 'grey', D: 'grau' },
	lightblue: { c: LIGHTBLUE, E: 'lightblue', D: 'hellblau' },
	lightgreen: { c: LIGHTGREEN, E: 'lightgreen', D: 'hellgrün' },
	lightyellow: { c: YELLOW2, E: 'lightyellow', D: 'gelb' },
	olive: { c: OLIVE, E: 'olive', D: 'oliv' },
	orange: { c: ORANGE, E: 'orange', D: 'orange' },
	pink: { c: 'deeppink', E: 'pink', D: 'rosa' },
	purple: { c: PURPLE, E: 'purple', D: 'lila' },
	red: { c: 'red', E: 'red', D: 'rot' },
	red1: { c: RED, E: 'red', D: 'rot' },
	skyblue: { c: 'deepskyblue', E: 'skyblue', D: 'himmelblau' },
	teal: { c: TEAL, E: 'teal', D: 'blaugrün' },
	violet: { c: 'indigo', E: 'violet', D: 'violett' },
	white: { c: 'white', E: 'white', D: 'weiss' },
	yellow: { c: 'yellow', E: 'yellow', D: 'gelb' },
	OLIVE: { c: '#808000', E: 'olive', D: 'oliv' },
	FIREBRICK: { c: '#800000', E: 'darkred', D: 'rotbraun' },
	ORANGE: { c: '#f58231', E: 'orange', D: 'orange' },
	TEAL: { c: '#469990', E: 'teal', D: 'blaugrün' },
	YELLOW2: { c: '#ffff33', E: 'yellow', D: 'gelb' },
	PURPLE: { c: '#911eb4', E: 'purple', D: 'lila' },
	BLUE: { c: '#4363d8', E: 'blue', D: 'blau' },
	GREEN: { c: '#3cb44b', E: 'green', D: 'grün' },
	RED: { c: '#e6194B', E: 'red', D: 'rot' },
	YELLOW: { c: '#ffe119', E: 'yellow', D: 'gelb' },
	LIGHTBLUE: { c: '#42d4f4', E: 'lightblue', D: 'hellblau' },
	LIGHTGREEN: { c: '#afff45', E: 'lightgreen', D: 'hellgrün' },
};

//#endregion


//#region speechGame constants: badge symbols, DD, OPS...
const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
	GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 'deeppink', //** MAXLEVEL 10 */
	TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE, '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'palegreen', '#e6194B'];
var levelKeys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
	'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
	'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];
const DD = {
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
	say: 'sage', write: 'schreibe', complete: 'ergänze', 'unequal': 'ungleich', except: 'ausser', EXCEPT: 'AUSSER',
	number: 'Zahl', color: 'farbe', eliminate: 'eliminiere', all: 'alle', with: 'mit', true: 'wahr', false: 'falsch',
	build: 'bilde', count: 'zähle', 'the red dots': 'die roten Punkte',
};
const OPS = { //die muessen vals in settings.games[game] sein!
	'first': { cmd: 'add', link: 'to', wr: '+', sp: 'plus', f: (a, b) => (a + b), min: 20, max: 100 },
	'plus': { cmd: 'add', link: 'to', wr: '+', sp: 'plus', f: (a, b) => (a + b), min: 3, max: 30 },
	'minus': { cmd: 'subtract', link: 'from', wr: '-', sp: 'minus', f: (a, b) => (a - b), min: 1, max: 10 },
	'div': { cmd: 'divide', link: 'by', wr: ':', sp: 'divided by', f: (a, b) => (a / b), min: 2, max: 10 },
	'intdiv': { cmd: 'divide', link: 'by', wr: 'div', sp: 'divided by', f: (a, b) => (Math.floor(a / b)), min: 1, max: 10 },
	'mult': { cmd: 'multiply', link: 'by', wr: 'x', sp: 'times', f: (a, b) => (a * b), min: 2, max: 10 },
	// '**':{wr:'^',sp:'to the power of',f:(a,b)=>(Math.pow(a,b))},
	'pow': { cmd: 'build', link: 'to the power of', wr: '^', sp: 'to the power of', f: (a, b) => (Math.pow(a, b)), min: 0, max: 20 },
	'mod': { cmd: 'build', link: 'modulo', wr: '%', sp: 'modulo', f: (a, b) => (a % b), min: 0, max: 20 },
	'l': { cmd: 'true or false?', link: 'less than', wr: '<', sp: 'less than', f: (a, b) => (a < b) },
	'g': { cmd: 'true or false?', link: 'greater than', wr: '>', sp: 'greater than', f: (a, b) => (a > b) },
	'leq': { cmd: 'true or false?', link: 'less or equal', wr: '<=', sp: 'less or equal', f: (a, b) => (a <= b) },
	'geq': { cmd: 'true or false?', link: 'greater or equal', wr: '>=', sp: 'greater or equal', f: (a, b) => (a >= b) },
	'eq': { cmd: 'true or false?', link: 'equal', wr: '=', sp: 'equal', f: (a, b) => (a == b) },
	'neq': { cmd: 'true or false?', link: 'unequal', wr: '#', sp: 'unequal', f: (a, b) => (a != b) },
	'and': { cmd: 'true or false?', link: 'and', wr: '&&', sp: 'and', f: (a, b) => (a && b) },
	'or': { cmd: 'true or false?', link: 'or', wr: '||', sp: 'or', f: (a, b) => (a || b) },
	'nand': { cmd: 'true or false?', link: 'nand', wr: 'nand', sp: 'nand', f: (a, b) => (!(a && b)) },
	'nor': { cmd: 'true or false?', link: 'nor', wr: 'nor', sp: 'nor', f: (a, b) => (!(a || b)) },
	'xor': { cmd: 'true or false?', link: 'xor', wr: 'xor', sp: 'xor', f: (a, b) => (a && !b || !a && b) },
}

