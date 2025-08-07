import { useEffect, useState } from "react";
import AllocationChart from "./components/AllocationChart";
import PortfolioTable from "./components/PortfolioTable";
import { EnrichedHolding, Holding } from "./types";
import { fetchPortfolio } from "./services/api";

function App() {
  const initialHoldings: Holding[] = [
    {
      symbol: "AAPL",
      particulars: "Apple Inc.",
      purchasePrice: 145.3,
      quantity: 12,
      exchange: "NASDAQ",
      sector: "Technology",
    },
    {
      symbol: "MSFT",
      particulars: "Microsoft Corp.",
      purchasePrice: 250.0,
      quantity: 8,
      exchange: "NASDAQ",
      sector: "Technology",
    },
    {
      symbol: "7203.T",
      particulars: "Toyota Motor Corp.",
      purchasePrice: 1950.0,
      quantity: 3,
      exchange: "TSE",
      sector: "Automobiles",
    },
    {
      symbol: "7267.T",
      particulars: "Honda Motor Co. Ltd.",
      purchasePrice: 3200.0,
      quantity: 2,
      exchange: "TSE",
      sector: "Automobiles",
    },
    {
      symbol: "F",
      particulars: "Ford Motor Co.",
      purchasePrice: 12.5,
      quantity: 150,
      exchange: "NYSE",
      sector: "Automobiles",
    },
    {
      symbol: "TCS.NS",
      particulars: "Tata Consultancy Services",
      purchasePrice: 3150.0,
      quantity: 5,
      exchange: "NSE",
      sector: "IT Services",
    },
    {
      symbol: "INFY.NS",
      particulars: "Infosys Ltd.",
      purchasePrice: 1250.0,
      quantity: 10,
      exchange: "NSE",
      sector: "IT Services",
    },
    {
      symbol: "HDFCBANK.NS",
      particulars: "HDFC Bank Ltd.",
      purchasePrice: 1550.5,
      quantity: 6,
      exchange: "NSE",
      sector: "Financials",
    },
    {
      symbol: "ICICIBANK.NS",
      particulars: "ICICI Bank Ltd.",
      purchasePrice: 720.0,
      quantity: 12,
      exchange: "NSE",
      sector: "Financials",
    },
    {
      symbol: "RELIANCE.NS",
      particulars: "Reliance Industries Ltd.",
      purchasePrice: 2200.0,
      quantity: 4,
      exchange: "NSE",
      sector: "Energy",
    },
    {
      symbol: "BP.L",
      particulars: "BP plc",
      purchasePrice: 3.1,
      quantity: 200,
      exchange: "LSE",
      sector: "Energy",
    },
  ];

  const [holdings, setHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPortfolio(initialHoldings);
        setHoldings(data.holdings);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!holdings.length) {
    console.log(holdings);
    return (
      <div className="alert alert-danger text-center">No holdings found</div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-primary">Portfolio Dashboard</h1>
      <div className="row">
        <div className="col-xxl-6 mb-4">
          <AllocationChart holdings={holdings} />
        </div>
        <div className="col-xxl-6 horizontal-scrollable">
          <PortfolioTable holdings={holdings} />
        </div>
      </div>
    </div>
  );
}

export default App;
