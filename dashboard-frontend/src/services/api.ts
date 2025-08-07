import axios from 'axios';
import { Holding, PortfolioResponse } from '../types';

const API_BASE = 'https://finance-dashboard-p4wj.onrender.com';//Initial load may take upto 1 min because of free service

export const fetchPortfolio = async (holdings: Holding[]): Promise<PortfolioResponse> => {
    const resp = await axios.post<PortfolioResponse>(`${API_BASE}/api/portfolio`, { holdings });
    return resp.data;
};