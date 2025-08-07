export interface Holding {
    symbol: string;
    particulars: string;
    purchasePrice: number;
    quantity: number;
    exchange: string;
    sector: string;
}

export interface EnrichedHolding extends Holding {
    investment: number;
    cmp: number;
    presentValue: number;
    gainLoss: number;
    peRatio: number;
    earnings: number;
    portfolioPct: number;
}

export interface PortfolioResponse {
    totalInvestment: number;
    holdings: EnrichedHolding[];
}