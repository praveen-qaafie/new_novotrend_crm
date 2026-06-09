// Rebate Client 
export interface RebateClient {
  user_name: string;
  email: string;
  mt5_id: string;
  rebate_per: string | number;
  tot_lot: number;
  commision: number;
}

export interface RebateClientSummary {
  clients_count: number;
  total_lots: number;
  total_commision: number;
}

export interface RebateClientsResponse {
  details: RebateClient[];
  summary?: RebateClientSummary;
}

// Rebate History
export interface RebateHistoryItem {
  user_name: string;
  email: string;
  processed_date: string;
  mt5_id: string;
  tot_lot: number;
  commision: number;
}

export interface RebateHistoryResponse {
  details: RebateHistoryItem[];
}

// Filters 
export interface RebateFilters {
  search: string;
  mt5acc: string;
}