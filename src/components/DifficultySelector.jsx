import PropTypes from 'prop-types'; // Import PropTypes

const DifficultySelector = ({ difficulty, setDifficulty }) => {
	return (
		<div>
			<h3>Select Difficulty</h3>
			<select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
	<option value="easy">Easy</option>
	<option value="medium">Medium</option>
	<option value="hard">Hard</option>
</select>
		</div>
	);
};

// Adding PropTypes validation
DifficultySelector.propTypes = {
	difficulty: PropTypes.string.isRequired, // Ensuring difficulty is a string and is required
	setDifficulty: PropTypes.func.isRequired, // Ensuring setDifficulty is a function and is required
};

export default DifficultySelector;
