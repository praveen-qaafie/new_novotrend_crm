import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getUserBalanceData, getUserData } from "../api/dashboard.api";

export function useDashboardStats() {
  const query = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });



  return {
    ...query,
    user: query.data?.data?.response, // ← DashboardUser
    status: query.data?.data?.status, // ← number
    result: query.data?.data?.result, // ← string
  };
}

// USER-DATA
export function useUserData() {
  const query = useQuery({
    queryKey: ["crm", "user"],
    queryFn: getUserData,
  });

  return {
    ...query,
    user: query.data?.data?.response,
    status: query.data?.data?.status,
  };
}

//
export function useUserBalanceData() {
  const query = useQuery({
    queryKey: ["userBalance", "userData"],
    queryFn: getUserBalanceData,
  });

  return {
    ...query,
    user: query.data?.data?.response,
    status: query.data?.data?.status,
  };
}