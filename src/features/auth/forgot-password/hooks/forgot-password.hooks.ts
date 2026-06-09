import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/forgot-password.api";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (_, email) => {
      console.log(email, _);
      // toast.success("Reset link sent successfully");
    },
    onError: () => {
      // toast.error("Error while sending reset link");
    },
  });
}
