class AIPlayer{
	constructor(){this.id=getUID('AI');this.userColor=randomColor();}
	setData(o){copyKeys(o,this);}
	move(possibleMoves){return chooseRandom(possibleMoves);}
}






