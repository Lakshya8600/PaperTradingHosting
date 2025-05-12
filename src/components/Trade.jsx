import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";
import { useLocalStorage } from "usehooks-ts";
import { useBalance } from "../hooks/useBalance";

const Trade = ({ symbol }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [balance, setBalance] = useBalance();
  const [range, setRange] = useState("6mo");
  const [interval, setInterval] = useState("1d");
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [action, setAction] = useState("buy");

  const [activeBuy, setActiveBuy] = useLocalStorage("activeBuy", []);
  const [activeSell, setActiveSell] = useLocalStorage("activeSell", []);
  const [history, setHistory] = useLocalStorage("history", []);
  const [object, setObject] = useLocalStorage("object", {
    quantity: 0,
    stock: symbol,
    price: currentPrice,
    date: new Date().toLocaleDateString(),
    display: 0,
  });

  const fetchData = async () => {
    try {
      
      setLoading(true);
      setError(null);

      const url = `https://lakshyakumra1.pythonanywhere.com/info/${symbol}/${range}/${interval}`;
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

      const candlestickData = dates.map((timestamp, index) => {
        const utcDate = new Date(timestamp);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset);
      
        return {
          x: istDate,
          y: [opens[index], highs[index], lows[index], closes[index]],
        };
      });

      setSeries([{ data: candlestickData }]);

      // Update the current price with the latest close value
      const latestClose = closes[closes.length - 1];
      setCurrentPrice(latestClose);
      // //testing
      // console.log("i m in fetchData, current price:", currentPrice);
      // //
      
    } catch (err) {
      console.error("Error fetching chart:", err);
      setError(err.message);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(()=>{
  //   console.log("i m in useEffect, current price:", currentPrice);
  // },[currentPrice])
  useEffect(() => {
    // Fetch data whenever symbol, range, or interval changes
    fetchData();
  }, [symbol, range, interval]);

  useEffect(() => {
    // Update the object state whenever currentPrice or symbol changes
    setObject((prev) => ({
      ...prev,
      stock: symbol,
      price: currentPrice,
    }));
  }, [currentPrice, symbol]);

  const handleCloseTrade = (tradeIndex, type) => {
    let trade;
    let updatedList;

    if (type === "buy") {
      updatedList = [...activeBuy];
      trade = updatedList[tradeIndex];
      updatedList.splice(tradeIndex, 1);
      setActiveBuy(updatedList);

      setHistory((prev) => [
        ...prev,
        { ...trade, action: "buy (closed)", date: new Date().toLocaleDateString() },
      ]);
      setBalance((prev) => prev + trade.quantity * trade.price);
    } else {
      updatedList = [...activeSell];
      trade = updatedList[tradeIndex];
      updatedList.splice(tradeIndex, 1);
      setActiveSell(updatedList);

      setHistory((prev) => [
        ...prev,
        { ...trade, action: "sell (closed)", date: new Date().toLocaleDateString() },
      ]);
      setBalance((prev) => prev + trade.quantity * trade.price);
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
    theme: { mode: "dark" },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <select value={range} onChange={(e) => setRange(e.target.value)} className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600">
          <option value="1d">1 Day</option>
          <option value="1wk">1 Week</option>
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
        </select>
        <select value={interval} onChange={(e) => setInterval(e.target.value)} className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600">
          <option value="1m">1 Min</option>
          <option value="5m">5 Min</option>
          <option value="1h">1 hr</option>
          <option value="1d">1 Day</option>
          <option value="1wk">1 Week</option>
          <option value="1mo">1 Month</option>
        </select>
        <button onClick={fetchData} className="px-5 py-2 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold transition hover:shadow-lg hover:-translate-y-1 duration-300">
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-center text-red-400 mb-6">Error: {error}</div>}

      {/* Current Price */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">{symbol}</h2>
        {currentPrice && <p className="text-lg text-green-400 mt-1">Current Price: ₹{Number(currentPrice).toFixed(2)}</p>}
      </div>

      {/* Chart */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-xl mb-12">
        {loading ? <p className="text-center text-gray-300">Loading chart...</p> : <ApexChart options={options} series={series} type="candlestick" height={350} />}
      </div>

      {/* Trade Panel */}
      <div className="flex justify-center items-center">
        <form className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center text-green-400">Trade Panel</h2>
          <span className="text-sm text-gray-400">Current Price: ₹{Number(currentPrice).toFixed(2)}</span>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
            <input
              type="number"
              value={object.display}
              onChange={(e) =>
                setObject({
                  ...object,
                  quantity: Number(e.target.value),
                  display: Number(e.target.value),
                  price: currentPrice,
                })
              }
              className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700"
              placeholder="Enter quantity"
            />
          </div>

          {/* Price (read-only, shows total price) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Total</label>
            <input
              type="number"
              value={object.quantity * currentPrice}
              readOnly
              className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700"
            />
          </div>

          {/* Action */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
            <div className="flex rounded-full overflow-hidden border border-gray-700">
              <label className="flex-1 text-center">
                <input type="radio" value="buy" checked={action === "buy"} onChange={() => setAction("buy")} className="hidden peer" />
                <span className="block py-2 peer-checked:bg-green-500 peer-checked:text-white text-gray-400 font-medium">Buy</span>
              </label>
              <label className="flex-1 text-center">
                <input type="radio" value="sell" checked={action === "sell"} onChange={() => setAction("sell")} className="hidden peer" />
                <span className="block py-2 peer-checked:bg-red-500 peer-checked:text-white text-gray-400 font-medium">Sell</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();


              const trade = {
                stock: symbol,
                quantity: object.quantity,
                price: currentPrice,
                date: new Date().toLocaleDateString(),
              };

              if (action === "buy") {
                const cost = object.quantity * currentPrice;
                if (cost > balance) {
                  alert("Insufficient balance!");
                  return;
                }
                setActiveBuy([...activeBuy, trade]);
                setBalance((prev) => prev - cost);
              } else {
                const cost = object.quantity * currentPrice;
                if (cost > balance) {
                  alert("Insufficient balance!");
                  return;
                }
                setActiveSell([...activeSell, trade]);
                setBalance((prev) => prev - cost);
              }

              // Reset input
              setObject({
                ...object,
                quantity: 0,
                display: 0,
                price: currentPrice,
                stock: symbol,
                date: new Date().toLocaleDateString(),
              });
              console.log("here11",object)
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Submit Trade
          </button>

          <p className="text-sm text-gray-400">Balance: ₹{balance}</p>
        </form>
        
      </div>
      <button
        onClick={() => {
          if (confirm("Are you sure you want to reset your balance?")) {
            setBalance(100000);
          }
        }}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
      >
        Reset Balance

      </button>
        
    </div>
  );
};

export default Trade;
