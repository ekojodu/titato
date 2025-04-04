// GameMode.js
import PropTypes from 'prop-types';

const GameMode = ({ mode, setMode, resetGame }) => {
	const handleModeChange = (newMode) => {
		setMode(newMode);
		resetGame();
	};

	return (
		<div>
			<h2>Game Mode: {mode}</h2>
			<button onClick={() => handleModeChange('Human')}>
				Player vs Player
			</button>
			<button onClick={() => handleModeChange('CPU')}>Player vs CPU</button>
		</div>
	);
};

// PropTypes validation
GameMode.propTypes = {
	mode: PropTypes.string.isRequired,
	setMode: PropTypes.func.isRequired,
	resetGame: PropTypes.func.isRequired,
};

export default GameMode;
