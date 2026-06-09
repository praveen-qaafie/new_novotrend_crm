"use client";

import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type PremiumPieChartProps = {
  totalLots?: number;
  activeLevel?: number;
};

export default function PremiumPieChart({ totalLots = 0, activeLevel = 0 }: PremiumPieChartProps) {

  const tradingLots = parseFloat(String(totalLots)) || 0;
  const activeClients = parseFloat(String(activeLevel)) || 0;
  const isNoData = tradingLots === 0 && activeClients === 0;
  const series = isNoData ? [1] : [tradingLots, activeClients];

  // console.log("activeClients", activeClients)

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
      toolbar: {
        show: false,
      },
    },

    labels: isNoData ? ["No Data"] : ["Trading Lots", "Active Client"],

    colors: isNoData ? ["#E5E7EB"] : ["#0088FE", "#00C49F"],

    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 500,
      height: 50, // reserve fixed legend space
    },

    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },

    stroke: {
      width: 0,
      colors: ["#ffffff"],
    },

    dataLabels: {
      enabled: !isNoData,

      formatter: (val: number) => `${val.toFixed(0)}%`,

      style: {
        fontSize: "14px",
        fontWeight: "600",
        colors: ["#fff"],
      },

      dropShadow: {
        enabled: false,
      },
    },

    tooltip: {
      enabled: !isNoData,
    },

    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
  };

  return (
    <div className="h-[340px]">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-left font-medium text-gray-700">Affiliate Progress Status</h2>
      </div>

      {/* Chart Area */}
      <div className="relative flex flex-1 items-center justify-center">
        <div className="h-[290px] w-full">
          <ReactApexChart
            key={`${tradingLots}-${activeClients}`}
            options={options}
            series={series}
            type="pie"
            width="100%"
            height="100%"
          />
        </div>

        {/* No Data Overlay */}
        {isNoData && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
