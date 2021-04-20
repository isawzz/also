function evalState8(state, depth) {
	var score = checkWinnerTTT(state);
	return !score ? 0 : (10 - depth) * (score == MAXIMIZER.sym ? 1 : -1);
}

