import { useEffect, useState } from 'react';
import DifficultySelector from './DifficultySelector'; // ✅ make sure this file exists

const Scoreboard = ({ mode, playerName, winner, difficulty, setDifficulty }) => {
	const [scores, setScores] = useState(() => {
		const saved = localStorage.getItem('tictactoe-scores');
		return saved
			? JSON.parse(saved)
			: {
					player1: 0,
					draw: 0,
					player2: 0,
			  };
	});

	const [showPopup, setShowPopup] = useState(false);

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
	}, [winner, mode]);

	const resetScoreboard = () => {
		const cleared = { player1: 0, draw: 0, player2: 0 };
		setScores(cleared);
		localStorage.setItem('tictactoe-scores', JSON.stringify(cleared));
	};

	return (
		<div style={styles.container}>
			<h3 style={styles.heading}>Scoreboard</h3>
			<div style={styles.row}>
				<div style={styles.scoreBox}>
					<p style={styles.label}>{playerName || 'Player 1'}</p>
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

			{/* ✅ Two buttons side-by-side */}
			<div style={styles.buttonRow}>
				<button style={styles.resetButton} onClick={resetScoreboard}>
					Reset Scoreboard
				</button>
				<button style={styles.diffButton} onClick={() => setShowPopup(true)}>
					Change Difficulty
				</button>
			</div>

			{/* ✅ Popup for Difficulty Selection */}
			{showPopup && (
				<div style={styles.popupOverlay}>
					<div style={styles.popupContent}>
						<h3 style={{ color: '#fff', marginBottom: '10px' }}>Select Difficulty</h3>
						<DifficultySelector
							difficulty={difficulty}
							setDifficulty={(level) => {
								setDifficulty(level);
								setShowPopup(false);
							}}
						/>
						<button style={styles.closeBtn} onClick={() => setShowPopup(false)}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

const styles = {
	container: {
		padding: '16px',
		width: 'auto',
		maxWidth: '300px',
		margin: '0 auto',
		textAlign: 'center',
	},
	heading: {
		fontSize: '18px',
		color: '#fff',
		marginBottom: '10px',
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: '8px',
	},
	scoreBox: {
		background: '#fff',
		padding: '10px',
		borderRadius: '8px',
		textAlign: 'center',
		flex: '1',
		boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
		minWidth: '80px',
	},
	label: {
		fontWeight: 'bold',
		color: '#333',
		fontSize: '14px',
	},
	value: {
		fontSize: '20px',
		marginTop: '4px',
		color: '#007BFF',
	},
	buttonRow: {
		display: 'flex',
		gap: '10px',
		marginTop: '12px',
	},
	resetButton: {
		flex: 1,
		padding: '10px',
		border: 'none',
		borderRadius: '8px',
		background: '#ff4d4f',
		color: '#fff',
		cursor: 'pointer',
		fontSize: '16px',
	},
	diffButton: {
		flex: 1,
		padding: '10px',
		border: 'none',
		borderRadius: '8px',
		background: 'green',
		color: '#fff',
		cursor: 'pointer',
		fontSize: '16px',
	},
	popupOverlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.7)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	popupContent: {
		backgroundColor: '#222',
		padding: '20px',
		borderRadius: '10px',
		textAlign: 'center',
		width: '80%',
		maxWidth: '300px',
		boxShadow: '0 0 10px rgba(0,0,0,0.5)',
	},
	closeBtn: {
		marginTop: '10px',
		padding: '8px 12px',
		background: '#444',
		color: '#fff',
		border: 'none',
		borderRadius: '6px',
		cursor: 'pointer',
	},
};

export default Scoreboard;
