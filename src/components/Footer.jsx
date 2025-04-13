import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} TradeSathi. All rights reserved.</p>
          <div className="mt-2 text-sm">
            Made with 💚 for paper traders.
          </div>
        </div>
      </footer>
  );
};

export default Footer;
