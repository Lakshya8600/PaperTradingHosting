import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useBalance } from "../hooks/useBalance";

const ActiveSellList = () => {
  const [activeSell, setActiveSell] = useLocalStorage("activeSell", []);
  const [activeBuy, setActiveBuy] = useLocalStorage("activeBuy", []);
  const [history, setHistory] = useLocalStorage("history", []);
  const [balance, setBalance] = useBalance();
  const [object, setObject] = useLocalStorage("object", {});
  const [profits, setProfits] = useState([]);
  const [buttonColor, setButtonColor] = useState("gray")

  // Helper function to find the corresponding buy price
  const findBuyPrice = (stock) => {
    const buyTrade = activeBuy.find((trade) => trade.stock === stock);
    return buyTrade ? buyTrade.price : 0; // Default to 0 if no matching buy trade is found
  };

  // Calculate profit based on the difference between sell price and buy price
  const calculateProfit = (sellPrice, buyPrice, quantity) => {
    const baseProfit = (sellPrice - buyPrice) * quantity;
    const fluctuation = (Math.random() * 0.02 - 0.01).toFixed(2); 
    return baseProfit + parseFloat(fluctuation);
  };

  useEffect(()=>{
    if(profits>=0){
      setButtonColor("green")
    }
    else{
      setButtonColor("red")
    }
  },[profits])
  useEffect(() => {
    const updateProfits = () => {
      const newProfits = activeSell.map((trade) => {
        const buyPrice = findBuyPrice(trade.stock);
        return calculateProfit(object.price, buyPrice, object.quantity);
      });
      setProfits(newProfits);
    };

    updateProfits();
    const interval = setInterval(updateProfits, 1000); // Update every second

    return () => clearInterval(interval);
  }, [activeSell, activeBuy]);

  const closeSellTrade = (trade, index) => {
    // Remove sell trade
    alert("Are you sure you want to close this trade?")
    const updatedSellList = [...activeSell];
    updatedSellList.splice(index, 1);
    setActiveSell(updatedSellList);

    // Add to history
    const completedSellTrade = {
      ...trade,
      action: "sell (closed)",
      date: new Date().toLocaleDateString(),
    };
    setHistory((prevHistory) => [...prevHistory, completedSellTrade]);

    // Update balance (add the total sell value)
    setBalance((prevBalance) => prevBalance + trade.quantity * trade.price);
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl mt-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-red-400">Active Sell Trades</h3>

      {activeSell.length === 0 ? (
        <p className="text-gray-400">No active sell trades found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-center text-sm sm:text-base">
            <thead>
              <tr className="text-gray-300 border-b border-gray-700">
                <th className="pb-2">Stock</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Sell Price</th>
                <th className="pb-2">Current Profit</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeSell.map((trade, index) => (
                <tr key={index} className="text-white border-b border-gray-700">
                  <td className="py-2">{trade.stock}</td>
                  <td className="py-2">{trade.quantity}</td>
                  <td className="py-2">₹{Number(trade.price).toFixed(2)}</td>
                  <td className={`py-2 ${profits[index] >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {profits[index] !== undefined
                      ? profits[index] >= 0
                        ? `₹${profits[index].toFixed(2)}`
                        : `-₹${Math.abs(profits[index]).toFixed(2)}`
                      : "₹0.00"}
                  </td>
                  <td className="py-2">
                    <button
                      style={{ backgroundColor: buttonColor }}
                      className="text-white py-1 px-3 sm:py-2 sm:px-4 rounded-lg"
                      onClick={() => closeSellTrade(trade, index)}
                    >
                      Close Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveSellList;