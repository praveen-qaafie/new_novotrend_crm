// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { resetPassword } from "../api/reset-password.api";

// export function useResetPassword() {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: resetPassword,
//     onSuccess: () => {
//       // toast.success("Password reset successfully");
//       router.push("/signin");
//     },
//     onError: () => {
//       // toast.error("Reset failed. Please try again.");
//     },
//   });
// }

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPassword } from "../api/reset-password.api";

export function useResetPassword() {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      const responseData = data?.data?.data;
      const responseData1 = data?.data;

      console.log("responseData", responseData);
      console.log("responseData1", responseData1);

      if (responseData?.status === 200) {
        setMessage({
          type: "success",
          text: responseData?.result || "Password reset successfully.",
        });
        router.push("/sign-in");
      } else {
        setMessage({
          type: "error",
          text: responseData?.result || "Reset failed. Please try again.",
        });
      }
    },
    onError: () => {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    },
  });

  return { ...mutation, message };
}