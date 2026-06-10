export type { Transaction } from "../types/transaction-history.types";

// Tab headers map
export const TAB_HEADERS: Record<string, string[]> = {
  All: ["Sr No.", "Date", "Details", "Credit", "Debit", "Balance"],
  Deposit: ["Sr No.", "Date", "Details", "Type", "Receipt", "Note", "Status", "Remark"],
  Withdraw: ["Sr No.", "Date", "Amount", "Type", "Status", "Withdraw Type", "Remark"],
  Transfer: ["Sr No.", "Date", "From", "To", "Note"],
};