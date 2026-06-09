"use client";

import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import IdCard from "../../../../public/images/cards/dummy.webp";

import FormMessage from "@/common/UI/FormMessage";
import {
  useAddUserBank,
  useGetUserBankDetails,
} from "@/features/crm/funds/add-bank-account/hooks/add-bank-account.hook";

interface FormDataType {
  bankname: string;
  accname: string;
  accno: string;
  ifsc: string;
  iban_number: string;
  bankaddress: string;
}

interface FormErrors {
  bankname?: string;
  accname?: string;
  accno?: string;
  ifsc?: string;
  iban_number?: string;
  bankaddress?: string;
}

export default function NewAccount() {
  const [preview, setPreview] = useState<string | null>(IdCard.src);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankStatus, setBankStatus] = useState("Not Submit");

  const [formData, setFormData] = useState<FormDataType>({
    bankname: "",
    accname: "",
    accno: "",
    ifsc: "",
    iban_number: "",
    bankaddress: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { bankDetails, isLoading, refetch } = useGetUserBankDetails();

  const { mutate: addUserBank, isPending, message } = useAddUserBank();

  useEffect(() => {
    if (bankDetails) {
      setFormData({
        bankname: bankDetails.bankname || "",
        accname: bankDetails.accholder || "",
        accno: bankDetails.accno || "",
        ifsc: bankDetails.ifsc || "",
        iban_number: bankDetails.iban || "",
        bankaddress: bankDetails.kyc_bank_address || "",
      });

      if (bankDetails.image) {
        setPreview(bankDetails.image);
      }

      setBankStatus(bankDetails.status || "Not Submit");
    }
  }, [bankDetails]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.bankname.trim()) {
      newErrors.bankname = "Bank name is required";
    }

    if (!formData.accname.trim()) {
      newErrors.accname = "Account holder name is required";
    }

    if (!formData.accno.trim()) {
      newErrors.accno = "Account number is required";
    } else if (!/^\d+$/.test(formData.accno)) {
      newErrors.accno = "Only digits allowed";
    }

    if (!formData.ifsc.trim()) {
      newErrors.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.toUpperCase())) {
      newErrors.ifsc = "Invalid IFSC format";
    }

    if (!formData.iban_number.trim()) {
      newErrors.iban_number = "IBAN number is required";
    }

    if (!formData.bankaddress.trim()) {
      newErrors.bankaddress = "Bank address is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    addUserBank(
      {
        ...formData,
        kyc_bank_image: selectedFile,
        status: "Pending",
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl md:p-10 dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              Add New Bank Account
            </h2>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Enter your bank details carefully and upload your proof below.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status:
              <span
                className={`ml-2 font-semibold ${
                  bankStatus?.toLowerCase() === "approved"
                    ? "text-green-500"
                    : bankStatus?.toLowerCase() === "pending"
                      ? "text-yellow-500"
                      : bankStatus?.toLowerCase() === "rejected"
                        ? "text-red-500"
                        : "text-gray-500"
                }`}
              >
                {isLoading ? "Loading..." : bankStatus}
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Inputs */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Bank Name */}
            <div>
              <input
                type="text"
                name="bankname"
                value={formData.bankname}
                onChange={handleChange}
                placeholder="Bank Name"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3"
              />
              {errors.bankname && <p className="mt-1 text-sm text-red-500">{errors.bankname}</p>}
            </div>

            {/* Holder Name */}
            <div>
              <input
                type="text"
                name="accname"
                value={formData.accname}
                onChange={handleChange}
                placeholder="Bank Holder Name"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3"
              />
              {errors.accname && <p className="mt-1 text-sm text-red-500">{errors.accname}</p>}
            </div>

            {/* Account Number */}
            <div>
              <input
                type="text"
                name="accno"
                value={formData.accno}
                onChange={handleChange}
                placeholder="Account Number"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3"
              />
              {errors.accno && <p className="mt-1 text-sm text-red-500">{errors.accno}</p>}
            </div>

            {/* IFSC */}
            <div>
              <input
                type="text"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                placeholder="IFSC Code"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3"
              />
              {errors.ifsc && <p className="mt-1 text-sm text-red-500">{errors.ifsc}</p>}
            </div>

            {/* IBAN */}
            <div>
              <input
                type="text"
                name="iban_number"
                value={formData.iban_number}
                onChange={handleChange}
                placeholder="IBAN Number"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3"
              />
              {errors.iban_number && (
                <p className="mt-1 text-sm text-red-500">{errors.iban_number}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <input
                type="text"
                name="bankaddress"
                value={formData.bankaddress}
                onChange={handleChange}
                placeholder="Bank Address"
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3"
              />
              {errors.bankaddress && (
                <p className="mt-1 text-sm text-red-500">{errors.bankaddress}</p>
              )}
            </div>
          </div>

          {/* Upload */}
          <div>
            <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
              <label className="flex flex-col items-center gap-3">
                <Upload className="h-6 w-6 text-indigo-600" />
                <span className="text-sm font-medium">Upload Bank Proof Image</span>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="relative h-56 w-full sm:h-64">
                <Image
                  src={preview}
                  alt="Bank Proof Preview"
                  fill
                  className="rounded-xl object-contain"
                />
              </div>
            </div>
          )}

          {/* Message */}
          {message && <FormMessage message={message} />}

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white"
            >
              {isPending ? "Processing..." : "Add Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
