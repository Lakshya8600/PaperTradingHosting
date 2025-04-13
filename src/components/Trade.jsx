import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { useLocalStorage } from "usehooks-ts";
import { useBalance } from "../hooks/useBalance";

const Trade = ({ symbol = "TATA" }) => {
  const [balance, setBalance] = useBalance();

  const [range, setRange] = useState("6mo");
  const [interval, setInterval] = useState("1d");
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentPrice = 1000;

  const [object, setObject] = useLocalStorage("object", {
    quantity: 0,
    stock: symbol,
    price: currentPrice,
    date: new Date().toLocaleDateString(),
    display: 0,
  });

  const [activeBuy, setActiveBuy] = useLocalStorage("activeBuy", []);
  const [activeSell, setActiveSell] = useLocalStorage("activeSell", []);
  const [history, setHistory] = useLocalStorage("history", []);

  const [action, setAction] = useState("buy");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://kumrawatyogesh.pythonanywhere.com/info/${symbol}/${range}/${interval}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const rawData = await response.json();

      const datetimeField =
        interval === "1m" || interval === "5m" || interval === "1h"
          ? rawData["('Datetime', '')"] || rawData["('Date', '')"]
          : rawData["('Date', '')"];

      const dates = Object.values(datetimeField || []);
      const closes = Object.values(rawData[`('Close', '${symbol}.NS')`] || []);
      const opens = Object.values(rawData[`('Open', '${symbol}.NS')`] || []);
      const highs = Object.values(rawData[`('High', '${symbol}.NS')`] || []);
      const lows = Object.values(rawData[`('Low', '${symbol}.NS')`] || []);

      if (dates.length === 0 || closes.length === 0) {
        throw new Error("No data available for the selected range and interval.");
      }

      const candlestickData = dates.map((timestamp, index) => ({
        x: new Date(timestamp),
        y: [opens[index], highs[index], lows[index], closes[index]],
      }));

      setSeries([{ data: candlestickData }]);
    } catch (err) {
      console.error("Error fetching chart:", err);
      setError(err.message);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol, range, interval]);

  const handleCloseTrade = (tradeIndex, type) => {
    let trade;
    let updatedList;

    if (type === "buy") {
      updatedList = [...activeBuy];
      trade = updatedList[tradeIndex];
      updatedList.splice(tradeIndex, 1);
      setActiveBuy(updatedList);

      const completedTrade = {
        ...trade,
        action: "buy (closed)",
        date: new Date().toLocaleDateString(),
      };
      setHistory((prevHistory) => [...prevHistory, completedTrade]);

      setBalance((prevBalance) => prevBalance + trade.quantity * trade.price);
    } else {
      updatedList = [...activeSell];
      trade = updatedList[tradeIndex];
      updatedList.splice(tradeIndex, 1);
      setActiveSell(updatedList);

      const completedTrade = {
        ...trade,
        action: "sell (closed)",
        date: new Date().toLocaleDateString(),
      };
      setHistory((prevHistory) => [...prevHistory, completedTrade]);

      setBalance((prevBalance) => prevBalance - trade.quantity * trade.price);
    }
  };

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
      toolbar: { show: false },
    },
    title: {
      text: `${symbol} Candlestick Chart`,
      align: "left",
      style: { color: "#38bdf8" },
    },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#d1d5db" } },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        style: { colors: "#d1d5db" },
        formatter: (value) => Math.round(value),
      },
    },
    theme: {
      mode: "dark",
    },
  };

  return (
    <>
      
      <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
        {/* Range and Interval Selectors */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          >
            <option value="1d">1 Day</option>
            <option value="1wk">1 Week</option>
            <option value="1mo">1 Month</option>
            <option value="3mo">3 Months</option>
            <option value="6mo">6 Months</option>
            <option value="1y">1 Year</option>
          </select>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          >
            <option value="1m">1 Min</option>
            <option value="5m">5 Min</option>
            <option value="1h">1 hr</option>
            <option value="1d">1 Day</option>
            <option value="1wk">1 Week</option>
            <option value="1mo">1 Month</option>
          </select>
          <button
            onClick={fetchData}
            className="px-5 py-2 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold transition hover:shadow-lg hover:-translate-y-1 duration-300"
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-400 mb-6">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Candlestick Chart */}
        <div className="bg-gray-900 p-4 rounded-xl shadow-xl mb-12">
          {loading ? (
            <p className="text-center text-gray-300">Loading chart...</p>
          ) : (
            <ApexChart options={options} series={series} type="candlestick" height={350} />
          )}
        </div>

        {/* Trade Panel */}
        <div className="flex justify-center items-center">
          <form className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-center text-green-400">Trade Panel</h2>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={object.display}
                onChange={(e) =>
                  setObject({
                    ...object,
                    quantity: Number(e.target.value),
                    display: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Price Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={object.price}
                onChange={(e) =>
                  setObject({
                    ...object,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Action Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
              <div className="flex rounded-full overflow-hidden border border-gray-700">
                <label className="flex-1 text-center">
                  <input
                    type="radio"
                    name="action"
                    value="buy"
                    className="hidden peer"
                    checked={action === "buy"}
                    onChange={() => setAction("buy")}
                  />
                  <span className="block py-2 peer-checked:bg-green-500 peer-checked:text-white text-gray-400 font-medium transition">
                    Buy
                  </span>
                </label>
                <label className="flex-1 text-center">
                  <input
                    type="radio"
                    name="action"
                    value="sell"
                    className="hidden peer"
                    checked={action === "sell"}
                    onChange={() => setAction("sell")}
                  />
                  <span className="block py-2 peer-checked:bg-red-500 peer-checked:text-white text-gray-400 font-medium transition">
                    Sell
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300"
              onClick={(e) => {
                e.preventDefault();

                const trade = {
                  stock: object.stock,
                  quantity: object.quantity,
                  price: object.price,
                  date: new Date().toLocaleDateString(),
                };

                if (action === "buy") {
                  const updatedBuyList = [...activeBuy, trade];
                  setActiveBuy(updatedBuyList);
                } else {
                  const updatedSellList = [...activeSell, trade];
                  setActiveSell(updatedSellList);
                }

                // Reset form input values
                setObject({
                  ...object,
                  quantity: 0,
                  price: 0,
                  display: 0,
                  date: new Date().toLocaleDateString(),
                });

                // Update balance
                setBalance((prevBalance) =>
                  action === "buy"
                    ? prevBalance - object.quantity * object.price
                    : prevBalance + object.quantity * object.price
                );
              }}
            >
              Submit Trade
            </button>

            {/* Balance Info */}
            <p className="text-sm text-gray-400 text-left">Balance: ₹{balance}</p>
          </form>
        </div>

        
      </div>
     
    </>
  );
};

export default Trade;