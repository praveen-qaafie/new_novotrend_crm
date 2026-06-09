"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DurationType } from "@/features/crm/dashboard/types/dashboard.types";
import { useAffiliateProgress } from "@/features/partner/reports/hooks/reports.hooks";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Fixed color palette for symbols
const SYMBOL_COLORS = [
  "#465FFF",
  "#00C49F",
  "#F59E0B",
  "#b47474",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

// const FILTERS: DurationType[] = ["monthly", "quarterly", "annually"];

export default function AffiliateProgress() {
  const [duration] = useState<DurationType>("monthly");
  const { data, isLoading } = useAffiliateProgress({ duration });
  const progress = data?.affiliate_progress ?? [];

  // Build pie chart data from affiliate_progress
  const series = progress.map((p) => Math.abs(parseFloat(p.lotsize)));
  const labels = progress.map((p) => p.symbol);
  const colors = progress.map((_, i) => SYMBOL_COLORS[i % SYMBOL_COLORS.length]);

  const options: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    labels,
    colors,
    stroke: { width: 0 },
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 500,
      itemMargin: { horizontal: 10, vertical: 6 },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontSize: "13px",
        fontWeight: "600",
        colors: ["#fff"],
      },
      dropShadow: { enabled: false },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (_val, { seriesIndex }) => {
          const item = progress[seriesIndex];
          return `Lot: ${item?.lotsize}`;
        },
      },
    },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 320 } } },
      { breakpoint: 640, options: { legend: { position: "bottom", fontSize: "12px" } } },
    ],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="shadow-default rounded-2xl bg-white px-5 pt-5 pb-8 sm:px-6 sm:pt-6 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Affiliate Progress Status
            </h3>
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              How Close Are You to Your Monthly Goals?
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex h-[316px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : series.length === 0 ? (
            <div className="flex h-[316px] items-center justify-center text-sm text-gray-400">
              No data available
            </div>
          ) : (
            <div className="mx-auto max-w-[420px] sm:max-w-[460px]">
              <ReactApexChart options={options} series={series} type="pie" height={316} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}