import React from 'react';
import './squareButton.css'; // Import the CSS file for styling

const SquareButton = ({ onClick }) => {
  return (
    <button className="square-button" onClick={onClick}>
      Search
    </button>
  );
};

export default SquareButton;
