const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// Fetches P/E ratio and latest earnings from Alpha Vantage.
async function getPERatioAndEarnings(symbol) {
  try {
    // Company Overview for P/E
    const overviewRes = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: API_KEY,
      }
    });

    // Earnings data
    const earningsRes = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'EARNINGS',
        symbol,
        apikey: API_KEY,
      }
    });


    const peRatio = parseFloat(overviewRes.data.PERatio);
    // Grab most recent quarterly earnings
    const latestQuarter = earningsRes.data.quarterlyEarnings?.[0] || {};
    const earnings = `${latestQuarter.reportedEPS || 'N/A'} USD`;

    return { peRatio, earnings };
  } catch (err) {
    console.error('Alpha Vantage error:', err.message);
    throw err;
  }
}

module.exports = { getPERatioAndEarnings };
