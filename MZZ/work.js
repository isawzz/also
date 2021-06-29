class GHome_cy extends Game {
	constructor(name, o) { super(name, o); }
	prompt() {
		let d=this.dGraph=mDiv(dTable,{w:'90%',h:window.innerHeight*.6,bg:'random'});
		cyInit(d);
	}
	eval() {
	}
}
