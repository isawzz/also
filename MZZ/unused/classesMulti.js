class GPerlen extends G2Player{
	async startGame(){
		console.log('hallo perlen')
		await this.setStartPosition();
		
	}
	async setStartPosition(){
		let state = DB.tables[0];
		console.log('state',state);
	}
}

