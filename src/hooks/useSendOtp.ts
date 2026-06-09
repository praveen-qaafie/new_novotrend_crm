import { API_ENDPOINTS } from "@/constants/endpoints";
import { OtpStatus } from "@/features/crm/funds/withdraw-funds/types/withdraw-funds.types";
import api from "@/lib/axios";
import { useState, useCallback } from "react";

interface SendOtpParams {
  amount: string;
  otp_type: string;
}

interface UseSendOtpReturn {
  otpStatus: OtpStatus;
  otpMessage: string; // success message — show inline
  otpError: string; // error message — show inline
  sendOtp: (params: SendOtpParams) => Promise<void>;
  resetOtp: () => void;
}

export function useSendOtp(): UseSendOtpReturn {
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");

  const sendOtp = useCallback(async ({ amount, otp_type }: SendOtpParams) => {
    setOtpStatus("sending");
    setOtpMessage("");
    setOtpError("");

    try {
      const res = await api.post(API_ENDPOINTS.CRM.SEND_OTP, {
        amount,
        otp_type,
        mt5_id: "",
        mt5_receiverid: "",
      });

      const data = res?.data?.data;

      if (data?.status === 200) {
        setOtpStatus("sent");
        setOtpMessage(data?.result || "OTP sent successfully!");
      } else {
        setOtpStatus("error");
        setOtpError(data?.result || "Failed to send OTP. Try again.");
      }
    } catch {
      setOtpStatus("error");
      setOtpError("Something went wrong. Please try again.");
    }
  }, []);

  const resetOtp = useCallback(() => {
    setOtpStatus("idle");
    setOtpMessage("");
    setOtpError("");
  }, []);

  return { otpStatus, otpMessage, otpError, sendOtp, resetOtp };
}