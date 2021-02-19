const BROADCAST_SETTINGS = false;

//#region config

var USE_ADDONS = false;
const DEFAULTUSERNAME = 'gul'; // nil | gul | felix
const OFFLINE = true;

const SERVERURL = OFFLINE ? 'http://localhost:3000/app/' : 'https://speech-games.herokuapp.com/app/';
var USE_LOCAL_STORAGE = !BROADCAST_SETTINGS; // true | false //localStorage is cleared when false!!!!!
const CLEAR_LOCAL_STORAGE = BROADCAST_SETTINGS;

//#endregion

var C52, Syms, SymKeys, KeySets;

//#region color constants
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
//#endregion
