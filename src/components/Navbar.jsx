import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ symbol, setSymbol }) => {
  const [input, setInput] = useState(symbol);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSymbol(input.trim().toUpperCase());
      navigate("/trade");
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg py-3">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-wide">
            <span className="text-green-400">Trade</span>
            <span className="text-white">Sathi</span>
          </h1>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex-grow w-full md:w-auto"
        >
          <div className="relative mx-auto max-w-md">
            <input
              type="text"
              placeholder="Stock Symbol (e.g., ICICIBANK)"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button type="submit" className="absolute right-4 top-2.5 text-gray-400">
              🔍
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-4 flex-wrap justify-center md:justify-end">
          {[
            { name: 'Home', path: '/' },
            { name: 'Trade', path: '/trade' },
            { name: 'Login', path: '/login' },
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Report', path: '/report' },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="text-white hover:text-green-400 font-semibold transition-all duration-300 hover:underline underline-offset-4"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
