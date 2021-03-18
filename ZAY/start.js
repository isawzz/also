async function _start() {

	//repairSubgroups(); return; //instead of person-role, makes subgroups job,jobman,role

	createSubtitledPage('seagreen'); revealMain();
	console.log(DB);
	let data = genCats();
	let sample = new SolCatsClass(data);
	sample.prompt();


}

