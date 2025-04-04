import { useState, useEffect } from 'react';
import GameMode from './GameMode';
import DifficultySelector from './DifficultySelector';
import Cell from './Cell';
import ScoreBoard from './ScoreBoard';

const Gameboard = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [mode, setMode] = useState(''); // Allow user to choose mode first
	const [winner, setWinner] = useState(null);
	const [playerName, setPlayerName] = useState(''); // State for player name
	const [isNameEntered, setIsNameEntered] = useState(false); // Flag to check if the name is entered
	const [currentPlayer, setCurrentPlayer] = useState('Player 1'); // Track the current player
	const [difficulty, setDifficulty] = useState('easy'); // New: State for difficulty level

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setWinner(null);
		setCurrentPlayer('Player 1'); // Reset to Player 1's turn
	};

	const handleNameChange = (e) => {
		setPlayerName(e.target.value);
	};

	const handleNameSubmit = () => {
		if (playerName.trim() && mode) {
			setIsNameEntered(true); // Set name as entered
		} else {
			alert(
				'Please enter a valid name and select a game mode before starting.'
			);
		}
	};

	const checkWinner = (board) => {
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

		for (const [a, b, c] of winningCombinations) {
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a];
			}
		}

		return board.every((cell) => cell !== null) ? 'Draw' : null;
	};

	const handleClick = (index) => {
		if (board[index] || winner) return;

		const newBoard = [...board];
		newBoard[index] = currentPlayer === 'Player 1' ? 'X' : 'O'; // Player 1 is 'X', Player 2 is 'O'
		setBoard(newBoard);

		const winnerCheck = checkWinner(newBoard);
		if (winnerCheck) {
			setWinner(winnerCheck);
			return;
		}

		// Switch turns after the player move
		setCurrentPlayer((prevPlayer) =>
			prevPlayer === 'Player 1' ? 'Player 2' : 'Player 1'
		);
	};

	useEffect(() => {
		if (mode === 'CPU' && currentPlayer === 'Player 2' && !winner) {
			const makeCpuMove = (currentBoard) => {
				let index;

				if (difficulty === 'easy') {
					// 50% random, 30% best, 20% worst
					const rand = Math.random();
					if (rand < 0.5) {
						index = getRandomMove(currentBoard);
					} else if (rand < 0.8) {
						index = getBestMove(currentBoard, 'O').index;
					} else {
						index = getWorstMove(currentBoard, 'O').index;
					}
				} else {
					index = getBestMove(currentBoard, 'O').index;
				}

				if (index !== null) {
					const newBoard = [...currentBoard];
					newBoard[index] = 'O';
					setBoard(newBoard);

					const winnerCheck = checkWinner(newBoard);
					if (winnerCheck) {
						setWinner(winnerCheck);
					} else {
						setCurrentPlayer('Player 1');
					}
				}
			};

			const getRandomMove = (board) => {
				const availableMoves = board
					.map((cell, idx) => (cell === null ? idx : null))
					.filter((idx) => idx !== null);
				return availableMoves.length > 0
					? availableMoves[Math.floor(Math.random() * availableMoves.length)]
					: null;
			};

			const getWorstMove = (board, player) => {
				const allMoves = [];
				const opponent = player === 'O' ? 'X' : 'O';

				board.forEach((cell, idx) => {
					if (cell === null) {
						const newBoard = [...board];
						newBoard[idx] = player;
						const { score } = getBestMove(
							newBoard,
							opponent,
							-Infinity,
							Infinity,
							1
						);
						allMoves.push({ index: idx, score });
					}
				});

				allMoves.sort((a, b) => a.score - b.score); // worst moves first
				return allMoves.length > 0 ? allMoves[0] : { index: null };
			};

			const getBestMove = (
				board,
				player,
				alpha = -Infinity,
				beta = Infinity,
				depth = 0
			) => {
				const opponent = player === 'O' ? 'X' : 'O';
				const winner = checkWinner(board);
				if (winner === 'O') return { score: 10 - depth };
				if (winner === 'X') return { score: depth - 10 };
				if (board.every((cell) => cell !== null)) return { score: 0 };
				if (depth >= 5) return { score: 0 };

				let bestScore = player === 'O' ? -Infinity : Infinity;
				let bestMoves = [];

				const availableMoves = board
					.map((cell, idx) => (cell === null ? idx : null))
					.filter((idx) => idx !== null);

				for (let i of availableMoves) {
					let newBoard = [...board];
					newBoard[i] = player;

					let { score } = getBestMove(
						newBoard,
						opponent,
						alpha,
						beta,
						depth + 1
					);

					if (player === 'O') {
						if (score > bestScore) {
							bestScore = score;
							bestMoves = [i];
						} else if (score === bestScore) {
							bestMoves.push(i);
						}
						alpha = Math.max(alpha, score);
					} else {
						if (score < bestScore) {
							bestScore = score;
							bestMoves = [i];
						} else if (score === bestScore) {
							bestMoves.push(i);
						}
						beta = Math.min(beta, score);
					}

					if (beta <= alpha) break;
				}

				const chosenIndex =
					bestMoves[Math.floor(Math.random() * bestMoves.length)];
				return { index: chosenIndex, score: bestScore };
			};

			setTimeout(() => makeCpuMove(board), 500);
		}
	}, [currentPlayer, board, mode, winner, difficulty]);

	return (
		<div>
			<h1>Tic Tac Toe</h1>

			{/* Game Mode and Difficulty Selector */}
			{!isNameEntered && (
				<div>
					<input
						type='text'
						value={playerName}
						onChange={handleNameChange}
						placeholder='Enter your name'
					/>
					<GameMode mode={mode} setMode={setMode} />
					{mode === 'CPU' && (
						<DifficultySelector
							difficulty={difficulty}
							setDifficulty={setDifficulty}
						/>
					)}
					<button onClick={handleNameSubmit}>Start Game</button>
				</div>
			)}

			{/* Player Name Input */}
			{isNameEntered && (
				<>
					<div>
						<h2>Welcome, {playerName}</h2>
					</div>

					<div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
						<ScoreBoard mode={mode} playerName={playerName} winner={winner} />
					</div>
					{/* Gameboard */}
					<div
						className='game-board'
						style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}
					>
						{board.map((value, index) => (
							<Cell
								key={index}
								value={value}
								onClick={() => handleClick(index)}
							/>
						))}
					</div>

					{/* Winner Display */}
					{winner && (
						<h2>
							{winner === 'Draw'
								? "It's a draw!"
								: winner === 'O'
								? 'CPU wins!'
								: `${playerName} wins!`}
						</h2>
					)}

					{/* Game Status */}
					{winner === null && (
						<h3>
							{mode === 'CPU'
								? currentPlayer === 'Player 1'
									? `${playerName}'s Turn (X)`
									: `CPU's Turn (O)`
								: currentPlayer === 'Player 1'
								? `${playerName}'s Turn (X)`
								: `Player 2's Turn (O)`}
						</h3>
					)}

					{/* Restart Button */}
					<button onClick={resetGame}>Restart Game</button>
				</>
			)}
		</div>
	);
};

export default Gameboard;
