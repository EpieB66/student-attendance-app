import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 py-6 px-8 rounded-t-3xl">
      <h1 className="text-4xl font-bold text-center text-white">
        {title}
      </h1>
    </header>
  );
};

export default Header;