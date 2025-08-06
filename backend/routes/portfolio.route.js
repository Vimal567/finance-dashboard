const express       = require('express');
const router        = express.Router();
const yahooService  = require('../services/yahooService');
const alphaService  = require('../services/alphaService');
const { getCache, setCache }  = require('../utils/cache');


router.post('/', async (req, res) => {
  const data = Array.isArray(req.body.holdings) ? req.body.holdings : [];
  if (!data.length) {
    return res.status(400).json({ error: 'Please provide the holdings list' });
  }

  try {
    // Fetch each holding with live data + computed fields
    const enriched = await Promise.all(
      data.map(async holdings => {
        const sym = holdings.symbol.toUpperCase();
        // cache for rate limits
        const key = `stock_${sym}`;

        let live = getCache(key, 60);
        if (!live) {
          const { cmp } = await yahooService.getCMP(sym);
          const { peRatio, earnings } = await alphaService.getPERatioAndEarnings(sym);
          live = { cmp, peRatio, earnings };
          setCache(key, live);
        }

        const investment   = holdings.purchasePrice * holdings.quantity;
        const presentValue = live.cmp * holdings.quantity;
        const gainLoss     = presentValue - investment;

        return {
          symbol:       sym,
          particulars:  holdings.particulars || sym,
          purchasePrice: holdings.purchasePrice,
          quantity:     holdings.quantity,
          investment:   investment,
          exchange:     holdings.exchange,
          cmp:          live.cmp,
          presentValue: presentValue,
          gainLoss:     gainLoss,
          peRatio:      live.peRatio,
          earnings:     live.earnings,
          sector:       holdings.sector,
        };
      })
    );

    // 2. compute portfolio
    const totalInvestment = enriched.reduce((sum, e) => sum + e.investment, 0);
    const withPercent = enriched.map(e => ({
      ...e,
      portfolioPct: totalInvestment
        ? Number((e.investment / totalInvestment * 100).toFixed(2))
        : 0,
    }));

    return res.json({
      totalInvestment,
      holdings: withPercent,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
