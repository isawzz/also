const BROADCAST_SETTINGS = true;

//#region config

var USE_ADDONS = false;
const DEFAULTUSERNAME = 'gul'; // nil | gul | felix
const OFFLINE = true;

const SERVERURL = OFFLINE ? 'http://localhost:3000/app/' : 'https://speech-games.herokuapp.com/app/';
var USE_LOCAL_STORAGE = !BROADCAST_SETTINGS; // true | false //localStorage is cleared when false!!!!!
const CLEAR_LOCAL_STORAGE =  BROADCAST_SETTINGS;

//#endregion

var C52, Syms, SymKeys, KeySets, Categories, ByGroupSubgroup; //, CatSets, SymbolDict, SInfo;

var Live, DB; //var Settings, SettingsChanged; //var G, T, P, U, User, ????? , G...Game, T...Table, U...Userdata

var Daaa;
//#region color constants
var ColorNames; //see base.js colors
const BLUE = '#4363d8';
const BLUEGREEN = '#004054';
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
const YELLOW2 = '#ffa0a0';

const ColorList = ['lightgreen', 'lightblue', 'yellow', 'red', 'green', 'blue', 'purple', 'violet', 'lightyellow',
	'teal', 'orange', 'brown', 'olive', 'deepskyblue', 'deeppink', 'gold', 'black', 'white', 'grey'];
const ColorDict = {
	black: { c: 'black', E: 'black', D: 'schwarz' },
	blue: { c: 'blue', E: 'blue', D: 'blau' },
	blue1: { c: BLUE, E: 'blue', D: 'blau' },
	brown: { c: FIREBRICK, E: 'brown', D: 'rotbraun' },
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
