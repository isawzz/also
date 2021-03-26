function filterWordByLength(k, w) {
	//console.log('k',k,'w',w,'max',G.maxWordLength,'min',G.minWordLength)
	if (nundef(G.minWordLength)) G.minWordLength = 0;
	return w.length <= G.maxWordLength && w.length >= G.minWordLength && !w.includes(' ');
}










