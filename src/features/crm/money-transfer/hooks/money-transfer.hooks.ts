// import { useState, useCallback, useEffect } from "react";
// import { MT5Account, TransferApiResponse, TransferStatus, TransferTab, UseMT5AccountsReturn, UseTransferReturn } from "../types/money-transfer.types";
// import { fetchMT5Accounts, submitTransferApi } from "../api/money-transfer.api";

// // ── useMT5Accounts — common, reused in all 3 tabs ────────────────────────────
// export function useMT5Accounts(): UseMT5AccountsReturn {
//   const [mt5Accounts, setMt5Accounts] = useState<MT5Account[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function load() {
//       setIsLoading(true);
//       try {
//         const accounts = await fetchMT5Accounts(); // ye API hai jisko unn tin api call ke baad API call karni hai
//         // Filter out Demo accounts — same as existing code
//         setMt5Accounts(accounts.filter((a) => a.group_name !== "Demo"));
//       } catch {
//         setError("Failed to load MT5 accounts.");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     load();
//   }, []);

//   return { mt5Accounts, isLoading, error };
// }
// // here need to add
// //  useTransfer, handles all 3 tab submissions
// export function useTransfer(): UseTransferReturn {
//   const [transferStatus, setTransferStatus] = useState<TransferStatus>("idle");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const submitTransfer = useCallback(
//     async (payload: Parameters<typeof submitTransferApi>[0], tab: TransferTab) => {
//       setTransferStatus("loading");
//       setErrorMessage("");
//       setSuccessMessage("");

//       try {
//         const data: TransferApiResponse = await submitTransferApi(payload, tab);

//         if (data.status === 200) {
//           setTransferStatus("success");
//           setSuccessMessage(data.result || "Transfer successful.");
//         } else {
//           setTransferStatus("error");
//           setErrorMessage(data.result || "Transfer failed.");
//         }
//       } catch {
//         setTransferStatus("error");
//         setErrorMessage("Something went wrong. Please try again.");
//       }
//     },
//     []
//   );

//   const reset = useCallback(() => {
//     setTransferStatus("idle");
//     setErrorMessage("");
//     setSuccessMessage("");
//   }, []);

//   return { transferStatus, errorMessage, successMessage, submitTransfer, reset };
// }

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MT5Account,
  MT5ToMT5Request,
  MT5ToWalletRequest,
  TransferApiResponse,
  TransferTab,
  UseMT5AccountsReturn,
  UseTransferReturn,
  WalletToMT5Request,
} from "../types/money-transfer.types";
import { fetchMT5Accounts, submitTransferApi } from "../api/money-transfer.api";

type TransferPayload = MT5ToWalletRequest | WalletToMT5Request | MT5ToMT5Request;

// useMT5Accounts
export function useMT5Accounts(): UseMT5AccountsReturn {
  const query = useQuery<MT5Account[]>({
    queryKey: ["mt5Accounts"],
    queryFn: async () => {
      const accounts = await fetchMT5Accounts();
      return accounts.filter((a) => a.group_name !== "Demo");
    },
  });

  return {
    mt5Accounts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.isError ? "Failed to load MT5 accounts." : "",
  };
}

// useTransfer
export function useTransfer(): UseTransferReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload, tab }: { payload: TransferPayload; tab: TransferTab }) =>
      submitTransferApi(payload, tab),

    onSuccess: (data: TransferApiResponse) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["mt5Accounts"] });
        queryClient.invalidateQueries({ queryKey: ["userBalance", "userData"] });
      }
    },
  });

  const submitTransfer = useCallback(
    (payload: TransferPayload, tab: TransferTab) => {
      mutation.mutate({ payload, tab });
    },
    [mutation]
  );

  const reset = useCallback(() => mutation.reset(), [mutation]);

  const isSuccess = mutation.isSuccess && mutation.data?.status === 200;
  const isError = mutation.isError || (mutation.isSuccess && mutation.data?.status !== 200);

  return {
    transferStatus: mutation.isPending
      ? "loading"
      : isSuccess
        ? "success"
        : isError
          ? "error"
          : "idle",
    successMessage: isSuccess ? (mutation.data?.result ?? "Transfer successful.") : "",
    errorMessage: isError
      ? mutation.isError
        ? "Something went wrong. Please try again."
        : (mutation.data?.result ?? "Transfer failed.")
      : "",
    submitTransfer,
    reset,
  };
}
