import { useEffect, useState } from 'react';

const Scoreboard = ({ mode, playerName, winner }) => {
	const opponentName = mode === 'CPU' ? 'CPU' : 'Player 2';

	const [scores, setScores] = useState(() => {
		const saved = localStorage.getItem('tictactoe-scores');
		return saved
			? JSON.parse(saved)
			: {
					[playerName]: { wins: 0, losses: 0, draws: 0 },
					[opponentName]: { wins: 0, losses: 0, draws: 0 },
			  };
	});

	useEffect(() => {
		if (!winner || winner === 'reset') return;

		setScores((prevScores) => {
			const newScores = { ...prevScores };

			// Ensure players exist
			if (!newScores[playerName])
				newScores[playerName] = { wins: 0, losses: 0, draws: 0 };
			if (!newScores[opponentName])
				newScores[opponentName] = { wins: 0, losses: 0, draws: 0 };

			if (winner === 'Draw') {
				newScores[playerName].draws += 1;
				newScores[opponentName].draws += 1;
			} else if (winner === 'X') {
				newScores[playerName].wins += 1;
				newScores[opponentName].losses += 1;
			} else {
				newScores[playerName].losses += 1;
				newScores[opponentName].wins += 1;
			}

			localStorage.setItem('tictactoe-scores', JSON.stringify(newScores));
			return newScores;
		});
	}, [winner]);

	const resetScoreboard = () => {
		const reset = {
			[playerName]: { wins: 0, losses: 0, draws: 0 },
			[opponentName]: { wins: 0, losses: 0, draws: 0 },
		};
		setScores(reset);
		localStorage.setItem('tictactoe-scores', JSON.stringify(reset));
	};

	const renderScore = (label, player) => (
		<div style={styles.playerContainer}>
			<h4 style={styles.heading}>
				{label} ({player})
			</h4>
			<div style={styles.row}>
				<div style={styles.scoreBox}>
					<p style={styles.label}>Wins</p>
					<p style={styles.value}>{scores[player]?.wins || 0}</p>
				</div>
				<div style={styles.scoreBox}>
					<p style={styles.label}>Losses</p>
					<p style={styles.value}>{scores[player]?.losses || 0}</p>
				</div>
				<div style={styles.scoreBox}>
					<p style={styles.label}>Draws</p>
					<p style={styles.value}>{scores[player]?.draws || 0}</p>
				</div>
			</div>
		</div>
	);

	return (
		<div style={styles.container}>
			<h3 style={styles.heading}>📊 Scoreboard</h3>
			{renderScore('Player 1', playerName)}
			{renderScore(mode === 'CPU' ? 'CPU' : 'Player 2', opponentName)}
			<button style={styles.button} onClick={resetScoreboard}>
				Reset Scoreboard
			</button>
		</div>
	);
};

export default Scoreboard;

// Optional: move to a separate file
const styles = {
	container: {
		background: '#f1f1f1',
		padding: '16px',
		borderRadius: '12px',
		marginTop: '20px',
		boxShadow: '0 0 10px rgba(0,0,0,0.1)',
		maxWidth: '100%',
		width: '100%',
		boxSizing: 'border-box',
	},
	playerContainer: {
		marginBottom: '16px',
	},
	heading: {
		marginBottom: '10px',
		textAlign: 'center',
		fontSize: '18px',
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		gap: '12px',
	},
	scoreBox: {
		background: '#fff',
		padding: '10px',
		borderRadius: '8px',
		textAlign: 'center',
		width: '100%', // Full width on mobile by default
		flex: '1 1 30%',
		boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
		minWidth: '100px',
	},
	label: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: '14px',
	},
	value: {
		fontSize: '20px',
		margin: '4px 0 0 0',
		color: '#007BFF',
	},
	button: {
		marginTop: '12px',
		padding: '10px 16px',
		border: 'none',
		borderRadius: '8px',
		background: '#ff4d4f',
		color: '#fff',
		cursor: 'pointer',
		width: '100%',
		fontSize: '16px',
	},

	// Optional media queries if you're using a style library like styled-components or CSS
	// You can ignore this in plain inline styles unless you're using something like emotion/css
	// But feel free to convert this to CSS for better responsiveness control!
};
