import PropTypes from 'prop-types';

const Cell = ({ value, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        fontSize: "24px",
        cursor: "pointer",
      }}
    >
      {value}
    </div>
  );
};

// PropTypes validation
Cell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string, // For "X" or "O"
    PropTypes.oneOf([null]), // For an empty cell
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Cell;

  