// src/hooks/useBalance.js
import { useLocalStorage } from "usehooks-ts";

// This hook can be used in ANY component and will share the same balance
export const useBalance = () => {
  return useLocalStorage("balance", 100000); // key = "balance", default = ₹100000
};