// routes/stocks.js
const express = require("express");
const router = express.Router();
const yahoo = require("../services/yahooService");
const alpha = require("../services/alphaService");
const { getCache, setCache } = require("../utils/cache");

router.get("/", async (req, res) => {
  const symbols = (req.query.symbols || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (!symbols.length) {
    return res.status(400).json({ error: "No symbols provided" });
  }

  try {
    // For each symbol, either return cache or fetch live
    const promises = symbols.map(async (symbol) => {
      const key = `stock_${symbol}`;
      const cached = getCache(key, 60);
      if (cached) return { ...cached, cached: true };

      const { cmp } = await yahoo.getCMP(symbol);
      const { peRatio, earnings } = await alpha.getPERatioAndEarnings(symbol);
      const result = { symbol, cmp, peRatio, earnings };
      setCache(key, result);
      return result;
    });

    const data = await Promise.all(promises);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

module.exports = router;
