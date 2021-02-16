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

