// In src/utilis/index.js

export const checkWinner = (board) => {
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let combo of winningCombinations) {
		const [a, b, c] = combo;
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return board[a];
		}
	}

	return null;
};

export const cpuMove = (board) => {
	const emptyIndices = board
		.map((val, idx) => (val === null ? idx : null))
		.filter((val) => val !== null);
	return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};
