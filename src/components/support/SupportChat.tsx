"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Paperclip, Send, Loader2, AlertCircle, ArrowLeft, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  useSupportDetail,
  useSubmitRemark,
} from "@/features/crm/team-support/hooks/team-support.hooks";
import type { ChatMessage } from "@/features/crm/team-support/types/team-support.types";

// Motion variants

const msgVariants: Variants = {
  hiddenLeft: { opacity: 0, x: -20 },
  hiddenRight: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// Helpers

function getTime(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split(" ");
  return parts[1] ?? "";
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
}

// Component

export default function SupportChat() {
  const router = useRouter();
  const params = useParams();
  const ticketId = (params?.ID as string) ?? null;

  const { data: ticketDetails, isLoading } = useSupportDetail(ticketId);
  const submitRemark = useSubmitRemark(ticketId);

  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [ticketDetails?.details_list]);

  // Reset after send
  useEffect(() => {
    if (submitRemark.isSuccess && submitRemark.data?.status === 200) {
      setRemark("");
      setFile(null);
      setFileName("");
      submitRemark.reset();
    }
  }, [submitRemark.isSuccess, submitRemark.data]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remark.trim() || !ticketId) return;
    submitRemark.mutate({
      sudelid: ticketId,
      remakrusers: remark,
      s_file_name: file ?? undefined,
    });
  };

  const handleFile = (f: File | null) => {
    setFile(f);
    setFileName(f?.name ?? "");
  };

  // Derived
  const isClosed = ticketDetails?.s_status === "Closed";
  const isSending = submitRemark.isPending;

  // old code: details_list.slice().reverse() — latest message at bottom
  const chatMessages: ChatMessage[] = ticketDetails?.details_list?.slice().reverse() ?? [];

  const sendError = submitRemark.isError
    ? "Something went wrong. Please try again."
    : submitRemark.data?.status !== 200 && submitRemark.data?.result
      ? submitRemark.data.result
      : "";

  // Render

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50 transition dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>

          {isLoading ? (
            <div className="space-y-1.5">
              <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ) : (
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                {ticketDetails?.ticket_name ?? "Support Chat"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ticket #{ticketId}
                {ticketDetails?.s_status && (
                  <>
                    {" "}
                    —{" "}
                    <span
                      className={
                        ticketDetails.s_status === "Open" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {ticketDetails.s_status}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket info card */}
      {isLoading ? (
        <div className="mx-6 mt-4 h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      ) : ticketDetails ? (
        <div className="mx-6 mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {["Ticket Name", "Question", "File", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="border border-gray-200 p-3 text-center text-xs font-medium text-gray-600 dark:border-gray-600 dark:text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                <td className="border border-gray-200 p-3 font-medium dark:border-gray-700">
                  {ticketDetails.ticket_name}
                </td>
                <td className="border border-gray-200 p-3 dark:border-gray-700">
                  {ticketDetails.s_question}
                </td>
                <td className="border border-gray-200 p-3 dark:border-gray-700">
                  {ticketDetails.s_file_name ? (
                    <a
                      href={ticketDetails.s_file_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      <Image
                        src={ticketDetails.s_file_name}
                        alt="attachment"
                        width={40}
                        height={40}
                        className="mx-auto rounded-md border border-gray-300"
                      />
                    </a>
                  ) : (
                    <span className="text-gray-400">NA</span>
                  )}
                </td>
                <td className="border border-gray-200 p-3 dark:border-gray-700">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      ticketDetails.s_status === "Open"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {ticketDetails.s_status}
                  </span>
                </td>
                <td className="border border-gray-200 p-3 whitespace-nowrap dark:border-gray-700">
                  {ticketDetails.s_date}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Chat section label */}
      <div className="mx-6 mt-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Support Chat</h3>
      </div>

      {/* Chat messages */}
      <div
        ref={chatRef}
        className="flex-1 space-y-5 overflow-y-auto px-6 py-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {isLoading ? (
          // skeleton loading
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-end gap-3 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 ${i % 2 === 0 ? "order-last" : ""}`}
                />
                <div
                  className={`h-12 w-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700`}
                />
              </div>
            ))}
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Send className="h-7 w-7 text-slate-300" />
            </div>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg: ChatMessage, idx: number) => {
            const isUser = msg.chatstatus === "UserChat";
            const time = getTime(msg.s_date);
            const avatar = isUser
              ? msg.s_file_name || "/images/user/customer.png"
              : msg.user_img || "/images/user/customer.png";

            return (
              <motion.div
                key={idx}
                variants={msgVariants}
                initial={isUser ? "hiddenRight" : "hiddenLeft"}
                animate="visible"
                className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar — left for admin */}
                {!isUser && (
                  <Image
                    src={avatar}
                    alt="avatar"
                    width={34}
                    height={34}
                    className="shrink-0 rounded-full border border-gray-200 object-cover shadow-sm"
                  />
                )}

                <div
                  className={`flex max-w-xs flex-col md:max-w-md ${isUser ? "items-end" : "items-start"}`}
                >
                  <span className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {msg.user_name}
                  </span>

                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-br-none bg-indigo-600 text-white"
                        : "rounded-bl-none border border-slate-100 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    }`}
                  >
                    {/* Attachment in message */}
                    {msg.supp_del_file_name && (
                      <div className="mb-2">
                        {isImageUrl(msg.supp_del_file_name) ? (
                          <a
                            href={msg.supp_del_file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={msg.supp_del_file_name}
                              alt="attachment"
                              width={200}
                              height={140}
                              className="rounded-xl object-cover shadow-md"
                            />
                          </a>
                        ) : (
                          <a
                            href={msg.supp_del_file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xs hover:bg-white/20"
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="truncate">View attachment</span>
                          </a>
                        )}
                      </div>
                    )}
                    {/* Message text */}
                    {msg.sup_del_remak && <p>{msg.sup_del_remak}</p>}
                  </div>

                  <span className="mt-1 text-[10px] text-gray-400">{time}</span>
                </div>

                {/* Avatar — right for user */}
                {isUser && (
                  <Image
                    src={avatar}
                    alt="avatar"
                    width={34}
                    height={34}
                    className="shrink-0 rounded-full border border-gray-200 object-cover shadow-sm"
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Input bar ── */}
      {!isClosed ? (
        <form
          onSubmit={handleSend}
          className="border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90"
        >
          {/* Send error */}
          {sendError && (
            <div className="mb-2 flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-500 dark:bg-red-900/20">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {sendError}
            </div>
          )}

          {/* File preview bar */}
          {fileName && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
              <span className="flex-1 truncate">{fileName}</span>
              <button
                type="button"
                onClick={() => handleFile(null)}
                className="ml-auto shrink-0 text-slate-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            {/* Attach file */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 text-slate-400 transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            {/* Text input */}
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              className="flex-1 border-none bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={isSending || !remark.trim()}
              className="shrink-0 rounded-full bg-indigo-600 p-2 text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          🔒 This ticket is closed. No further messages can be sent.
        </div>
      )}
    </div>
  );
}
