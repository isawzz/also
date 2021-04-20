class MonteCarlo {
	constructor(game, UCB1ExploreParam = 2) {
		this.game = game
		this.UCB1ExploreParam = UCB1ExploreParam
		this.nodes = new Map() // map: State.hash() => MonteCarloNode
	}
	makeNode(state) {
		if (!this.nodes.has(state.hash())) {
			let unexpandedPlays = this.game.legalPlays(state).slice()
			let node = new MonteCarloNode(null, null, state, unexpandedPlays)
			this.nodes.set(state.hash(), node)
		}
	}
	runSearch(state, timeout = 3) {
		this.makeNode(state);
		let draws = 0;
		let totalSims = 0;
		let end = Date.now() + timeout * 1000;
		while (Date.now() < end) {
			let node = this.select(state);
			let winner = this.game.winner(node.state);
			if (node.isLeaf() === false && winner === null) {
				node = this.expand(node);
				winner = this.simulate(node);
			}
			this.backpropagate(node, winner);
			if (winner === 0) draws++;
			totalSims++;
		}
		return { runtime: timeout, simulations: totalSims, draws: draws };
	}

	bestPlay(state, policy = "robust") {
		this.makeNode(state);

		// If not all children are expanded, not enough information
		if (this.nodes.get(state.hash()).isFullyExpanded() === false)
			throw new Error("Not enough information!");

		let node = this.nodes.get(state.hash());
		let allPlays = node.allPlays();
		let bestPlay;

		// Most visits (robust child)
		if (policy === "robust") {
			let max = -Infinity;
			for (let play of allPlays) {
				let childNode = node.childNode(play);
				if (childNode.n_plays > max) {
					bestPlay = play;
					max = childNode.n_plays;
				}
			}
		}
		// Highest winrate (max child)
		else if (policy === "max") {
			let max = -Infinity;
			for (let play of allPlays) {
				let childNode = node.childNode(play);
				let ratio = childNode.n_wins / childNode.n_plays;
				if (ratio > max) {
					bestPlay = play;
					max = ratio;
				}
			}
		}
		return bestPlay;
	}

	select(state) {
		let node = this.nodes.get(state.hash());
		while (node.isFullyExpanded() && !node.isLeaf()) {
			let plays = node.allPlays();
			let bestPlay;
			let bestUCB1 = -Infinity;
			for (let play of plays) {
				let childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam);
				if (childUCB1 > bestUCB1) {
					bestPlay = play;
					bestUCB1 = childUCB1;
				}
			}
			node = node.childNode(bestPlay);
		}
		return node;
	}

	expand(node) {
		let plays = node.unexpandedPlays();
		let index = Math.floor(Math.random() * plays.length);
		let play = plays[index];
		let childState = this.game.nextState(node.state, play);
		let childUnexpandedPlays = this.game.legalPlays(childState);
		let childNode = node.expand(play, childState, childUnexpandedPlays);
		this.nodes.set(childState.hash(), childNode);
		return childNode;
	}

	simulate(node) {
		let state = node.state
		let winner = this.game.winner(state)
		while (winner === null) {
			let plays = this.game.legalPlays(state)
			let play = plays[Math.floor(Math.random() * plays.length)]
			state = this.game.nextState(state, play)
			winner = this.game.winner(state)
		}
		return winner
	}

	backpropagate(node, winner) {
		while (node !== null) {
			node.n_plays += 1
			// Parent's choice
			if (node.state.isPlayer(-winner)) {
				node.n_wins += 1
			}
			node = node.parent
		}
	}

	getStats(state) {
		let node = this.nodes.get(state.hash())
		let stats = { n_plays: node.n_plays, n_wins: node.n_wins, children: [] }
		for (let child of node.children.values()) {
			if (child.node === null) stats.children.push({ play: child.play, n_plays: null, n_wins: null })
			else stats.children.push({ play: child.play, n_plays: child.node.n_plays, n_wins: child.node.n_wins })
		}
		return stats
	}
}
