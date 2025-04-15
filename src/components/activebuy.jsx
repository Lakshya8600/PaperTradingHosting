import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useBalance } from "../hooks/useBalance"; 

const ActiveBuyList = () => {
  const [activeBuy, setActiveBuy] = useLocalStorage("activeBuy", []);
  const [activeSell, setActiveSell] = useLocalStorage("activeSell", []);
  const [history, setHistory] = useLocalStorage("history", []);
  const [balance, setBalance] = useBalance();
  const [object, setObject] = useLocalStorage("object", {});
  const [buttonColor, setButtonColor] = useState("gray")

  // const currentPrice = 1000;
  const [profits, setProfits] = useState([]);

  const calculateProfit = (buyPrice, quantity) => {
    let profit = (object.price - buyPrice) * quantity; 
    let fluctuatedProfit = profit + (Math.random() * 0.02 - 0.01);
    // console.log('i m here')
    // console.log("curr",currentPrice)
    return fluctuatedProfit;
  };

  useEffect(() => {
    if(profits >= 0) {
      setButtonColor("green")
    }
    else{
      setButtonColor("red")
    }
  },[profits])
  useEffect(() => {
    const updateProfits = () => {
      const newProfits = activeBuy.map((trade) =>
        calculateProfit(trade.price, trade.quantity)
      );
      setProfits(newProfits);
    };

    updateProfits();
    const interval = setInterval(updateProfits, 1000);

    return () => clearInterval(interval);
  }, [activeBuy]);

  const closeBuyTrade = (trade, index) => {
    // Remove buy trade
    const updatedBuyList = [...activeBuy];
    updatedBuyList.splice(index, 1);
    setActiveBuy(updatedBuyList);

    // Add to history
    const completedBuyTrade = {
      ...trade,
      action: "buy (closed)",
      date: new Date().toLocaleDateString(),
      
    };
    setHistory((prevHistory) => [...prevHistory, completedBuyTrade]);

    // Update balance
    setBalance((prevBalance) => prevBalance + trade.quantity * object.price);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl mt-6">
      <h3 className="text-xl font-semibold mb-4 text-green-400">Active Buy Trades</h3>

      {activeBuy.length === 0 ? (
        <p className="text-gray-400">No active buy trades found.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-300 border-b border-gray-700">
              <th className="pb-2">Stock</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Buy Price</th>
              <th className="pb-2">Current Profit</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeBuy.map((trade, index) => (
              <tr key={index} className="text-white border-b border-gray-700">
                <td className="py-2">{trade.stock}</td>
                <td className="py-2">{trade.quantity}</td>
                <td className="py-2">₹{trade.price}</td>
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
                    className=" text-white py-2 px-4 rounded-lg"
                    onClick={() => closeBuyTrade(trade, index)}
                  >
                    Close Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActiveBuyList;