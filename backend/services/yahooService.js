const yahooFinance = require("yahoo-finance2").default;

// Fetch the current market price (CMP) for a given stock symbol
const getCMP = async (symbol) => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      cmp: quote?.regularMarketPrice | 0,
    };
  } catch (error) {
    console.error("Yahoo fetch error:", error);
    throw error;
  }
};

module.exports = {
  getCMP,
};
