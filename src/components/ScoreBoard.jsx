import { useEffect, useState } from 'react';

const Scoreboard = ({ mode, playerName, winner }) => {
	const [scores, setScores] = useState(() => {
		const saved = localStorage.getItem('tictactoe-scores');
		return saved
			? JSON.parse(saved)
			: {
					player1: 0,
					draw: 0,
					player2: 0, // for Player 2 or CPU
			  };
	});

	useEffect(() => {
		if (!winner || winner === 'reset') return;

		setScores((prevScores) => {
			let updated = { ...prevScores };

			if (winner === 'Draw') {
				updated.draw += 1;
			} else if (
				(mode === 'CPU' && winner === 'O') ||
				(mode === '2P' && winner !== 'X')
			) {
				updated.player2 += 1;
			} else {
				updated.player1 += 1;
			}

			localStorage.setItem('tictactoe-scores', JSON.stringify(updated));
			return updated;
		});
	}, [winner]);

	const resetScoreboard = () => {
		const cleared = { player1: 0, draw: 0, player2: 0 };
		setScores(cleared);
		localStorage.setItem('tictactoe-scores', JSON.stringify(cleared));
	};

	return (
		<div style={styles.container}>
			<h3 style={styles.heading}>📊 Scoreboard</h3>
			<div style={styles.row}>
				<div style={styles.scoreBox}>
					<p style={styles.label}>Player 1</p>
					<p style={styles.value}>{scores.player1}</p>
				</div>
				<div style={styles.scoreBox}>
					<p style={styles.label}>Draw</p>
					<p style={styles.value}>{scores.draw}</p>
				</div>
				<div style={styles.scoreBox}>
					<p style={styles.label}>{mode === 'CPU' ? 'CPU' : 'Player 2'}</p>
					<p style={styles.value}>{scores.player2}</p>
				</div>
			</div>
			<button style={styles.button} onClick={resetScoreboard}>
				Reset Scoreboard
			</button>
		</div>
	);
};

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
	heading: {
		textAlign: 'center',
		fontSize: '18px',
		marginBottom: '10px',
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
};

export default Scoreboard;
