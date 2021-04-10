function changeUser(username) {
	saveUser();
	loadUser(username);
}
function loadUser(username) {
	U = DB.users[username];
	U.live = {};
	mInner('user: ' + username, dSubtitleLeft);
	console.log('User',U)
}


function saveUser() {
	//was muss von U.live uebernommen werden?
	delete U.live;
	dbSave('boardGames');
}
function temple(dParent) {
	let elem = createElementFromHTML(`<div id='dTemple' onclick='onClickTemple()'>🏛️</div>`);
	mAppend(dParent, elem);

}









