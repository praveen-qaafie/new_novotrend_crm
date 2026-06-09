import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";

export async function forgotPassword(email: string): Promise<void> {
  await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
}
