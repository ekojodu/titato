import { useState, useEffect } from 'react';
import GameMode from './GameMode';
import DifficultySelector from './DifficultySelector';
import Cell from './Cell';
import ScoreBoard from './ScoreBoard';
import { checkWinner, getCpuMove } from './cpuLogic';

const Gameboard = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [mode, setMode] = useState('');
	const [winner, setWinner] = useState(null);
	const [playerName, setPlayerName] = useState('');
	const [isNameEntered, setIsNameEntered] = useState(false);
	const [currentPlayer, setCurrentPlayer] = useState('Player 1');
	const [difficulty, setDifficulty] = useState('easy');

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setWinner(null);
		setCurrentPlayer('Player 1');
	};

	const handleClick = (index) => {
		if (board[index] || winner) return;

		const newBoard = [...board];
		newBoard[index] = currentPlayer === 'Player 1' ? 'X' : 'O';
		setBoard(newBoard);

		const winnerCheck = checkWinner(newBoard);
		if (winnerCheck) {
			setWinner(winnerCheck);
			return;
		}

		setCurrentPlayer((prev) =>
			prev === 'Player 1' ? 'Player 2' : 'Player 1'
		);
	};

	useEffect(() => {
		if (mode === 'CPU' && currentPlayer === 'Player 2' && !winner) {
			const cpuMove = getCpuMove(board, difficulty);

			setTimeout(() => {
				if (cpuMove !== null && cpuMove !== undefined) {
					const newBoard = [...board];
					newBoard[cpuMove] = 'O';
					setBoard(newBoard);

					const winnerCheck = checkWinner(newBoard);
					if (winnerCheck) {
						setWinner(winnerCheck);
					} else {
						setCurrentPlayer('Player 1');
					}
				}
			}, 600);
		}
	}, [currentPlayer, board, mode, winner, difficulty]);

	const handleNameSubmit = () => {
		if (playerName.trim() && mode) setIsNameEntered(true);
		else alert('Please enter your name and select a mode.');
	};

	return (
		<div style={styles.container}>
			{!isNameEntered ? (
				<div style={styles.startScreen}>
					<input
						type="text"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder="Enter your name"
						style={styles.input}
					/>
					<GameMode mode={mode} setMode={setMode} />
					{mode === 'CPU' && (
						<DifficultySelector
							difficulty={difficulty}
							setDifficulty={setDifficulty}
						/>
					)}
					<button style={styles.startButton} onClick={handleNameSubmit}>
						Start Game
					</button>
				</div>
			) : (
				<>
					<h2 style={styles.welcome}>Welcome, {playerName}</h2>

					<div style={styles.scoreWrapper}>
						<ScoreBoard mode={mode} playerName={playerName} winner={winner} />
					</div>

					<div style={styles.board}>
						{board.map((value, index) => (
							<Cell
								key={index}
								value={value}
								onClick={() => handleClick(index)}
							/>
						))}
					</div>

					{winner && (
						<h3 style={styles.message}>
							{winner === 'Draw'
								? "It's a draw!"
								: winner === 'O'
								? mode === 'CPU'
									? 'CPU wins!'
									: 'Player 2 wins!'
								: `${playerName} wins!`}
						</h3>
					)}

					{!winner && (
						<h3 style={styles.message}>
							{mode === 'CPU'
								? currentPlayer === 'Player 1'
									? `${playerName}'s Turn (X)`
									: `CPU's Turn (O)`
								: currentPlayer === 'Player 1'
								? `${playerName}'s Turn (X)`
								: `Player 2's Turn (O)`}
						</h3>
					)}

					<button style={styles.restartButton} onClick={resetGame}>
						Restart Game
					</button>
				</>
			)}
		</div>
	);
};

const styles = {
	container: {
		minHeight: '100vh',
		backgroundColor: '#0d0d0d',
		color: '#f0f0f0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '1rem',
		overflow: 'hidden',
	},
	startScreen: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '10px',
	},
	input: {
		padding: '10px',
		borderRadius: '6px',
		border: 'none',
		outline: 'none',
		width: '200px',
		textAlign: 'center',
		fontSize: '16px',
	},
	startButton: {
		padding: '10px 20px',
		backgroundColor: '#007bff',
		border: 'none',
		borderRadius: '8px',
		color: '#fff',
		fontSize: '16px',
		cursor: 'pointer',
		marginTop: '10px',
	},
	board: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 100px)',
		gap: '5px',
		margin: '1rem 0',
	},
	welcome: {
		marginBottom: '10px',
		fontSize: '18px',
	},
	message: {
		fontSize: '16px',
		marginTop: '8px',
		textAlign: 'center',
	},
	scoreWrapper: {
		marginBottom: '10px',
	},
	restartButton: {
		marginTop: '8px',
		padding: '10px 20px',
		borderRadius: '8px',
		border: 'none',
		backgroundColor: '#ff4d4f',
		color: '#fff',
		fontSize: '16px',
		cursor: 'pointer',
	},
};

export default Gameboard;
