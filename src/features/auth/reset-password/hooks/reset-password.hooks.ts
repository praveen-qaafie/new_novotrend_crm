import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPassword } from "../api/reset-password.api";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      // toast.success("Password reset successfully");
      router.push("/signin");
    },
    onError: () => {
      // toast.error("Reset failed. Please try again.");
    },
  });
}