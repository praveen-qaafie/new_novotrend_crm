export type { Transaction } from "../types/transaction-history.types";

// Tab headers map
export const TAB_HEADERS: Record<string, string[]> = {
  All: ["Sr No.", "Date", "Details", "Credit", "Debit", "Balance"],
  Deposit: [
    "Sr No.",
    "Date",
    "Details",
    "Type",
    "Credit",
    "Debit",
    "Balance",
    "Receipt",
    "Note",
    "Remark",
  ],
  Withdraw: ["Sr No.", "Date", "Details", "Type", "Debit", "Balance", "Withdraw Type", "Remark"],
  Transfer: ["Sr No.", "Date", "Type", "Credit", "Debit", "Balance", "From", "To", "Note"],
};
