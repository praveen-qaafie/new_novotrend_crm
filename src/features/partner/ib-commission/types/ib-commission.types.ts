export type CommissionStatus = "approved" | "rejected" | "pending";

export interface CommissionHistoryItem {
  date: string;
  amount: string | number;
  remark: string;
  status: CommissionStatus | string;
}

export interface IBCommissionResponse {
  total_commission: number;
  details: CommissionHistoryItem[];
}

export interface WithdrawCommissionPayload {
  amount: number;
}

export interface WithdrawCommissionApiResponse {
  status: number;
  result: string;
}