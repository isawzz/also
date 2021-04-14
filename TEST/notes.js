function checkForWinner(state,HUMAN_PLAYER,COMPUTER_PLAYER) {
	// Check for horizontal wins
	for (i = 0; i <= 6; i += 3) {
		if (state[i] === HUMAN_PLAYER && state[i + 1] === HUMAN_PLAYER && state[i + 2] === HUMAN_PLAYER)
			return 2;
		if (state[i] === COMPUTER_PLAYER && state[i + 1] === COMPUTER_PLAYER && state[i + 2] === COMPUTER_PLAYER)
			return 3;
	}

	// Check for vertical wins
	for (i = 0; i <= 2; i++) {
		if (state[i] === HUMAN_PLAYER && state[i + 3] === HUMAN_PLAYER && state[i + 6] === HUMAN_PLAYER)
			return 2;
		if (state[i] === COMPUTER_PLAYER && state[i + 3] === COMPUTER_PLAYER && state[i + 6] === COMPUTER_PLAYER)
			return 3;
	}

	// Check for diagonal wins
	if ((state[0] === HUMAN_PLAYER && state[4] === HUMAN_PLAYER && state[8] === HUMAN_PLAYER) ||
		(state[2] === HUMAN_PLAYER && state[4] === HUMAN_PLAYER && state[6] === HUMAN_PLAYER))
		return 2;

	if ((state[0] === COMPUTER_PLAYER && state[4] === COMPUTER_PLAYER && state[8] === COMPUTER_PLAYER) ||
		(state[2] === COMPUTER_PLAYER && state[4] === COMPUTER_PLAYER && state[6] === COMPUTER_PLAYER))
		return 3;

	// Check for tie
	for (i = 0; i < BOARD_SIZE; i++) {
		if (state[i] !== HUMAN_PLAYER && state[i] !== COMPUTER_PLAYER)
			return 0;
	}
	return 1;
}
