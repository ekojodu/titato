import { useState, useEffect } from 'react';
import GameMode from './GameMode';
import DifficultySelector from './DifficultySelector';
import Cell from './Cell';
import ScoreBoard from './ScoreBoard';
import { checkWinner, getCpuMove } from './cpuLogic'; // ✅ import AI logic

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
		<div>
			<h1>Tic Tac Toe</h1>

			{!isNameEntered ? (
				<div>
					<input
						type="text"
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder="Enter your name"
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
			) : (
				<>
					<h2>Welcome, {playerName}</h2>

					<div style={{ maxWidth: '600px', margin: '0 auto' }}>
						<ScoreBoard mode={mode} playerName={playerName} winner={winner} />
					</div>

					<div
						className="game-board"
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 100px)',
							gap: '4px',
							margin: '1rem auto',
						}}
					>
						{board.map((value, index) => (
							<Cell
								key={index}
								value={value}
								onClick={() => handleClick(index)}
							/>
						))}
					</div>

					{winner && (
						<h2>
							{winner === 'Draw'
								? "It's a draw!"
								: winner === 'O'
								? 'CPU wins!'
								: `${playerName} wins!`}
						</h2>
					)}

					{!winner && (
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

					<button onClick={resetGame}>Restart Game</button>
				</>
			)}
		</div>
	);
};

export default Gameboard;
