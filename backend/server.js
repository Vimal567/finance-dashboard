const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const stockRoutes = require('./routes/stocks.route.js');
const portfolioRoutes = require('./routes/portfolio.route.js');

const app = express();
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Default Route
app.get('/', (req, res) => res.send("Api is working!"));

app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
