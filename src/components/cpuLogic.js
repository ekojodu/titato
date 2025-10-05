// cpuLogic.js

// Utility: Check if there’s a winner
export const checkWinner = (board) => {
	const combos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (const [a, b, c] of combos) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return board[a];
		}
	}
	return board.every((c) => c !== null) ? 'Draw' : null;
};

// Get all available cell indexes
const getAvailableMoves = (board) =>
	board.map((cell, i) => (cell === null ? i : null)).filter((i) => i !== null);

// Random move for Easy mode
const getRandomMove = (board) => {
	const moves = getAvailableMoves(board);
	return moves.length > 0
		? moves[Math.floor(Math.random() * moves.length)]
		: null;
};

// --- Minimax Algorithm (for unbeatable CPU) ---
const minimax = (board, player) => {
	const opponent = player === 'O' ? 'X' : 'O';
	const winner = checkWinner(board);

	if (winner === 'O') return { score: 10 };
	if (winner === 'X') return { score: -10 };
	if (winner === 'Draw') return { score: 0 };

	const moves = [];
	for (const index of getAvailableMoves(board)) {
		const newBoard = [...board];
		newBoard[index] = player;
		const result = minimax(newBoard, opponent);
		moves.push({ index, score: result.score });
	}

	if (player === 'O') {
		// CPU tries to maximize score
		return moves.reduce(
			(best, move) => (move.score > best.score ? move : best),
			{ score: -Infinity }
		);
	} else {
		// Human tries to minimize score
		return moves.reduce(
			(best, move) => (move.score < best.score ? move : best),
			{ score: Infinity }
		);
	}
};

// --- Simplified heuristic for Medium difficulty ---
const getMediumMove = (board) => {
	const moves = getAvailableMoves(board);

	// Step 1: Try to win immediately
	for (const i of moves) {
		const temp = [...board];
		temp[i] = 'O';
		if (checkWinner(temp) === 'O') return i;
	}

	// Step 2: Block human win
	for (const i of moves) {
		const temp = [...board];
		temp[i] = 'X';
		if (checkWinner(temp) === 'X') return i;
	}

	// Step 3: Otherwise, pick center or random corner
	if (board[4] === null) return 4;
	const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
	if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

	// Step 4: Random move as fallback
	return getRandomMove(board);
};

// --- Main CPU Logic Export ---
export const getCpuMove = (board, difficulty) => {
	if (difficulty === 'easy') {
		// 80% random, 20% smart
		return Math.random() < 0.8
			? getRandomMove(board)
			: minimax(board, 'O').index;
	}
	if (difficulty === 'medium') {
		return getMediumMove(board);
	}
	// Hard: Always best
	return minimax(board, 'O').index;
};
