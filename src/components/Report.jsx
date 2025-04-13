import React from 'react';


const Report = () => {
  return (
    <>

      <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
        <h1 className="text-3xl font-bold text-green-400 text-center mb-8">
          Trade Performance Report
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Total Trades</h2>
            <p className="text-3xl font-bold text-green-400">32</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Winning Trades</h2>
            <p className="text-3xl font-bold text-green-400">19</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Losing Trades</h2>
            <p className="text-3xl font-bold text-red-400">13</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Win Rate</h2>
            <p className="text-3xl font-bold text-green-400">59.4%</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Total Profit</h2>
            <p className="text-3xl font-bold text-green-400">₹3,450</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-2">Max Drawdown</h2>
            <p className="text-3xl font-bold text-red-400">-₹1,200</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Performance Tips</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Analyze your losing trades to identify patterns.</li>
            <li>Stick to trades with the best risk-to-reward ratios.</li>
            <li>Review your most profitable strategies and refine them.</li>
            <li>Use stop loss and take profit consistently.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Report;
