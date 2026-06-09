import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resendOtp, verifyOtp } from "../api/email-verification.api";

export function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      const responseData = data?.data;
      if (responseData?.status === 200) {
        // verify success — token remove 
        sessionStorage.removeItem("tempVerifyToken");
        router.push("/sign-in");
        
      } else {
        // error component mein handle hoga
      }
    },
    onError: () => {
      // interceptor handle karega
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      const responseData = data?.data;
      if (responseData?.status === 200) {
        // success — component mein toast dikhao
      }
    },
  });
}
