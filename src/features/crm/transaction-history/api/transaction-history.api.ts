import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  AllTransaction,
  DepositTransaction,
  Transaction,
  TransactionTab,
  TransferTransaction,
  WithdrawTransaction,
} from "../types/transaction-history.types";

const ENDPOINT_MAP: Record<TransactionTab, string> = {
  All: API_ENDPOINTS.CRM.GET_ALL_WALLET_HISTORY,
  Deposit: API_ENDPOINTS.CRM.GET_ALL_DEPOSIT_HISTORY,
  Withdraw: API_ENDPOINTS.CRM.GET_ALL_WITHDRAW_HISTORY,
  Transfer: API_ENDPOINTS.CRM.GET_ALL_TRANSFER_HISTORY,
};

export async function fetchTransactionHistory(
  tab: TransactionTab,
  mt5account: string = ""
): Promise<Transaction[]> {
  const endpoint = ENDPOINT_MAP[tab];
  const res = await api.post<{ data: { status: number; response: unknown[] } }>(endpoint, {
    mt5account,
  });

  console.log(`Raw ${tab} response:`, res.data);

  const raw = res.data.data.response;
  if (!raw?.length) return [];

  // ── Normalize each tab's response to unified Transaction shape ──
  switch (tab) {
    case "All":
      return (raw as AllTransaction[]).map((t, i) => ({
        id: t.Srno ?? i,
        date: t.date,
        details: t.details,
        credit: Number(t.credit) || 0,
        debit: Number(t.debit) || 0,
        balance: Number(t.balance) || 0,
      }));

    case "Deposit":
      return (raw as DepositTransaction[]).map((t, i) => ({
        id: t.id ?? i,
        date: t.date,
        details: t.payment_type,
        credit: Number(t.amount) || 0,
        receipt: t.req_image,
        note: t.note,
        status: t.status,
        remark: t.remark,
      }));

    case "Withdraw":
      return (raw as WithdrawTransaction[]).map((t, i) => ({
        id: t.id ?? i,
        date: t.date,
        debit: Number(t.amount) || 0,
        withdrawType: t.withdraw_type_details || t.withdraw_type,
        status: t.status,
        remark: t.remark,
      }));

    case "Transfer":
      return (raw as TransferTransaction[]).map((t, i) => ({
        id: t.id ?? i,
        date: t.date,
        debit: Number(t.amount) || 0,
        from: t.fromaccno,
        to: t.toaccno,
        note: t.note,
      }));

    default:
      return [];
  }
}
