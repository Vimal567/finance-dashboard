import React from "react";
import { EnrichedHolding } from "../types";

interface SectorGroupProps {
  holdings: EnrichedHolding[];
}

const SectorGroup: React.FC<SectorGroupProps> = ({ holdings }) => {
  const totalInvestment = holdings.reduce((sum, h) => sum + h.investment, 0);
  const totalPurchase = holdings.reduce((sum, h) => sum + h.purchasePrice, 0);
  const totalQuantity = holdings.reduce((sum, h) => sum + h.quantity, 0);
  const totalPresent = holdings.reduce((sum, h) => sum + h.presentValue, 0);
  const totalGainLoss = totalPresent - totalInvestment;

  return (
    <tr className="table-secondary">
      <td>
        <strong>{holdings[0].sector} Summary</strong>
      </td>
      <td>{totalPurchase}</td>
      <td>{totalQuantity}</td>
      <td>{totalInvestment.toFixed(2)}</td>
      <td></td>
      <td></td>
      <td>{totalPresent.toFixed(2)}</td>
      <td>
        <span className={totalGainLoss >= 0 ? "text-success" : "text-danger"}>
          {totalGainLoss.toFixed(2)}
        </span>
      </td>
      <td></td>
      <td></td>
    </tr>
  );
};

export default SectorGroup;
