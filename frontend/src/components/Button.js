import React from 'react';

const Button = ({ color, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-lg font-medium text-white transition hover:brightness-110"
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
};

export default Button;