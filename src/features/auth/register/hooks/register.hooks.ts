import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCountries, registerUser } from "../api/register.api";
import { RegisterPayload } from "../types/register.types";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      const responseData = data?.data;

      if (responseData?.status === 200) {
        const token = responseData?.response?.token;

        if (token) {
          // localStorage.setItem("userToken", token);
          sessionStorage.setItem("tempVerifyToken", token);
        }

        // UserInfo save karo
        localStorage.setItem("UserInfo", JSON.stringify(responseData?.response));

        router.push("/email-verify");
      } else {
        console.log("Registration failed");
      }
    },
    onError: () => {
      // global error — interceptor handle karega
    },
  });
}
