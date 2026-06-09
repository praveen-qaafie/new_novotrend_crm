import React from "react";
import type { Metadata } from "next";
// import { EcommerceMetrics } from "@/components/maindashboard/EcommerceMetrics";
import DashboardClient from "@/components/maindashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Novotrend CRM",
  description: "Future of global trading",
};

export default function Ecommerce() {
  return (
    <>
      <div className="">
        <div className="">
          {/* <EcommerceMetrics /> */}
          <DashboardClient />
        </div>
        {/* Not using */}
        {/* <div className="col-span-12 py-5 xl:col-span-12">
          <DemographicCard />
        </div> */}
      </div>
    </>
  );
}
