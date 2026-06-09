"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormData,
  changePasswordSchema,
  UpdateNicknameFormData,
  updateNicknameSchema,
} from "@/features/crm/account/schemas/account.schemas";
import { useChangePassword, useUpdateNickname } from "@/features/crm/account/hooks/account.hooks";
import FormMessage from "@/common/UI/FormMessage";

interface AccountModalProps {
  type: "password" | "nickname" | null;
  onClose: () => void;
  mt5id: string;
  nickname?: string;
}

export default function AccountModal({ type, onClose, mt5id, nickname }: AccountModalProps) {
  const [passwordType, setPasswordType] = useState<"main" | "investor" | "both">("main");
  const [showMainPass, setShowMainPass] = useState(false);
  const [showInvestorPass, setShowInvestorPass] = useState(false);

  const { mutate: changePwd, isPending: pwdPending, message: pwdMessage } = useChangePassword();
  const { mutate: updateNick, isPending: nickPending, message: nickMessage } = useUpdateNickname();

  // Password form
  const {
    register: pwdRegister,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { passwordtype: "main" },
  });

  // Nickname form
  const {
    register: nickRegister,
    handleSubmit: handleNickSubmit,
    reset: resetNick,
    formState: { errors: nickErrors },
  } = useForm<UpdateNicknameFormData>({
    resolver: zodResolver(updateNicknameSchema),
    defaultValues: { nickname: nickname ?? "" },
  });

  // Nickname pre-fill
  useEffect(() => {
    if (type === "nickname" && nickname) {
      resetNick({ nickname });
    }
  }, [type, nickname, resetNick]);

  const handleClose = () => {
    resetPwd();
    resetNick();
    onClose();
  };

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    changePwd(
      {
        passwordtype: data.passwordtype,
        mt5id,
        mainpassword: data.mainpassword,
        investorpassword: data.investorpassword,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.status === 200) {
            setTimeout(() => handleClose(), 2000);
          }
        },
      }
    );
  };

  const onNicknameSubmit = (data: UpdateNicknameFormData) => {
    updateNick(
      { mt5id, nickname: data.nickname },
      {
        onSuccess: (res) => {
          if (res?.data?.status === 200) {
            handleClose();
          }
        },
      }
    );
  };

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-[1] flex items-center justify-center bg-gray-400/50 p-4 backdrop-blur-[32px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {type === "password" ? "Change Trading Password" : "Update Your Nick Name"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* MT5 ID — common */}
        <div>
          <label className="text-sm font-medium">MT5 ID</label>
          <input
            type="text"
            value={mt5id}
            readOnly
            className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 text-gray-500 outline-none"
          />
        </div>

        {/* Password Form */}
        {type === "password" ? (
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Password Type</label>
              {/* <select
                value={passwordType}
                onChange={(e) => {
                  const val = e.target.value as "main" | "investor" | "both";
                  setPasswordType(val);
                }}
                {...pwdRegister("passwordtype")}
                className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="main">Main</option>
                <option value="investor">Investor</option>
                <option value="both">Both</option>
              </select> */}
              <select
                value={passwordType}
                {...pwdRegister("passwordtype", {
                  onChange: (e) => {
                    const val = e.target.value as "main" | "investor" | "both";
                    setPasswordType(val);
                  },
                })}
                className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="main">Main</option>
                <option value="investor">Investor</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Main Password */}
            {(passwordType === "main" || passwordType === "both") && (
              <div>
                <label className="text-sm font-medium">Main Password</label>
                <div className="relative mt-1">
                  <input
                    type={showMainPass ? "text" : "password"}
                    placeholder="Enter main password"
                    {...pwdRegister("mainpassword")}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMainPass((p) => !p)}
                    className="absolute top-2.5 right-3 text-gray-500"
                  >
                    {showMainPass ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {pwdErrors.mainpassword && (
                  <p className="text-error-500 mt-1 text-xs">{pwdErrors.mainpassword.message}</p>
                )}
              </div>
            )}

            {/* Investor Password */}
            {(passwordType === "investor" || passwordType === "both") && (
              <div>
                <label className="text-sm font-medium">Investor Password</label>
                <div className="relative mt-1">
                  <input
                    type={showInvestorPass ? "text" : "password"}
                    placeholder="Enter investor password"
                    {...pwdRegister("investorpassword")}
                    className="w-full rounded-xl border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInvestorPass((p) => !p)}
                    className="absolute top-2.5 right-3 text-gray-500"
                  >
                    {showInvestorPass ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {pwdErrors.investorpassword && (
                  <p className="text-error-500 mt-1 text-xs">
                    {pwdErrors.investorpassword.message}
                  </p>
                )}
              </div>
            )}

            {pwdMessage && <FormMessage message={pwdMessage} />}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5"
              >
                Close
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={pwdPending}
                className="rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3245ea] disabled:opacity-70"
              >
                {pwdPending ? "Updating..." : "Update Password"}
              </motion.button>
            </div>
          </form>
        ) : (
          /* Nickname Form */
          <form onSubmit={handleNickSubmit(onNicknameSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nick Name</label>
              <input
                type="text"
                placeholder="Enter nick name"
                {...nickRegister("nickname")}
                className="mt-1 w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {nickErrors.nickname && (
                <p className="text-error-500 mt-1 text-xs">{nickErrors.nickname.message}</p>
              )}
            </div>

            {nickMessage && <FormMessage message={nickMessage} />}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5"
              >
                Close
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={nickPending}
                className="rounded-xl bg-[#465FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3245ea] disabled:opacity-70"
              >
                {nickPending ? "Saving..." : "Save Nick Name"}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
