import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { changePassword, getAccountList, openAccount, updateNickname } from "../api/account.api";
import { OpenAccountPayload } from "../types/account.types";

export function useAccountListGroup() {
  const query = useQuery({
    queryKey: ["accList"],
    queryFn: getAccountList,
  });

  return {
    ...query,
    user: query.data?.data?.response,
    status: query.data?.data?.status,
    result: query.data?.data?.result,
  };
}

export function useOpenAccount() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: OpenAccountPayload) => openAccount(payload),
    onSuccess: (data) => {
      const res = data?.data;
      if (res?.status === 200) {
        setMessage({ type: "success", text: res?.result || "Account opened successfully" });
      } else {
        setMessage({ type: "error", text: res?.result || "Failed to open account" });
      }
    },
    onError: () => {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    },
  });

  return { ...mutation, message };
}

// MT5 account password update
// export function useChangePassword() {
//   const [message, setMessage] = useState<{
//     type: "success" | "error";
//     text: string;
//   } | null>(null);

//   const mutation = useMutation({
//     mutationFn: changePassword,
//     onSuccess: (data) => {
//       const res = data?.data;
//       if (res?.status === 200) {
//         setMessage({ type: "success", text: res?.result || "Password changed successfully" });
//       } else {
//         setMessage({ type: "error", text: res?.result || "Failed to change password" });
//       }
//     },
//     onError: () => {
//       setMessage({ type: "error", text: "Something went wrong. Please try again." });
//     },
//   });

//   return { ...mutation, message };
// }

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: changePassword,
  });
  return mutation;
}

export function useUpdateNickname() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: updateNickname,
    onSuccess: (data) => {
      const res = data?.data;
      if (res?.status === 200) {
        setMessage({ type: "success", text: res?.result || "Nickname updated successfully" });
      } else {
        setMessage({ type: "error", text: res?.result || "Failed to update nickname" });
      }
    },
    onError: () => {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    },
  });

  return { ...mutation, message };
}
