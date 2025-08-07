import React, { Fragment } from "react";
import { useTable, useGroupBy, useExpanded } from "react-table";
import { EnrichedHolding } from "../types";
import SectorGroup from "./SectorGroup";

interface PortfolioTableProps {
  holdings: EnrichedHolding[];
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ holdings }) => {
  const columns = React.useMemo(
    () => [
      { Header: "Symbol", accessor: "symbol" },
      { Header: "Purchase Price", accessor: "purchasePrice" },
      { Header: "Qty", accessor: "quantity" },
      {
        Header: "Investment",
        accessor: "investment",
        Cell: ({ value }: any) => value.toFixed(2),
      },
      { Header: "Exchange", accessor: "exchange" },
      {
        Header: "CMP",
        accessor: "cmp",
        Cell: ({ value }: any) => value.toFixed(2),
      },
      {
        Header: "Present Value",
        accessor: "presentValue",
        Cell: ({ value }: any) => value.toFixed(2),
      },
      {
        Header: "Gain/Loss",
        accessor: "gainLoss",
        Cell: ({ value }: any) => (
          <span className={value >= 0 ? "text-success" : "text-danger"}>
            {value.toFixed(2)}
          </span>
        ),
      },
      { Header: "P/E Ratio", accessor: "peRatio" },
      { Header: "Earnings", accessor: "earnings" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: holdings }, useGroupBy, useExpanded);

  return (
    <table {...getTableProps()} className="table table-striped">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="text-center align-middle"
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          const currentSector = row.original.sector;
          const prevSector = i > 0 ? rows[i - 1].original.sector : null;
          const showSummary = prevSector !== currentSector;

          return (
            <Fragment key={row.id}>
              {showSummary && (
                <SectorGroup
                  holdings={holdings.filter((h) => h.sector === currentSector)}
                />
              )}
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default PortfolioTable;
