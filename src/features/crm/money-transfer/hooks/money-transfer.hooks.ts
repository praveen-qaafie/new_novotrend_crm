import { useState, useCallback, useEffect } from "react";
import { MT5Account, TransferApiResponse, TransferStatus, TransferTab, UseMT5AccountsReturn, UseTransferReturn } from "../types/money-transfer.types";
import { fetchMT5Accounts, submitTransferApi } from "../api/money-transfer.api";

// ── useMT5Accounts — common, reused in all 3 tabs ────────────────────────────
export function useMT5Accounts(): UseMT5AccountsReturn {
  const [mt5Accounts, setMt5Accounts] = useState<MT5Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const accounts = await fetchMT5Accounts();
        // Filter out Demo accounts — same as existing code
        setMt5Accounts(accounts.filter((a) => a.group_name !== "Demo"));
      } catch {
        setError("Failed to load MT5 accounts.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { mt5Accounts, isLoading, error };
}

// ── useTransfer — handles all 3 tab submissions ───────────────────────────────
export function useTransfer(): UseTransferReturn {
  const [transferStatus, setTransferStatus] = useState<TransferStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitTransfer = useCallback(
    async (payload: Parameters<typeof submitTransferApi>[0], tab: TransferTab) => {
      setTransferStatus("loading");
      setErrorMessage("");
      setSuccessMessage("");

      try {
        const data: TransferApiResponse = await submitTransferApi(payload, tab);

        if (data.status === 200) {
          setTransferStatus("success");
          setSuccessMessage(data.result || "Transfer successful.");
        } else {
          setTransferStatus("error");
          setErrorMessage(data.result || "Transfer failed.");
        }
      } catch {
        setTransferStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setTransferStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  return { transferStatus, errorMessage, successMessage, submitTransfer, reset };
}
