import Image from "next/image";
import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

const DepositTable = ({ rows }: { rows: Transaction[] }) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td colSpan={10} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No deposit transactions found
        </td>
      </tr>
    ) : (
      rows.map((t, index) => (
        <tr
          key={t.id}
          className="divide-x text-center transition hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
        >
          <td className="px-4 py-3">{index + 1}</td>
          <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
          <td className="px-4 py-3">{t.details ?? "-"}</td>
          <td className="px-4 py-3">
            <span className="rounded-full border border-green-200 bg-green-100 px-3 py-[3px] text-xs font-semibold text-green-700">
              Deposit
            </span>
          </td>
          <td className="px-4 py-3">{t.credit?.toFixed(2) ?? "-"}</td>
          <td className="px-4 py-3">-</td>
          <td className="px-4 py-3">{t.balance?.toFixed(2) ?? "-"}</td>
          <td className="px-4 py-3">
            {t.receipt ? (
              <Image
                src={t.receipt}
                className="h-10 w-10 cursor-pointer rounded"
                onClick={() => window.open(t.receipt, "_blank")}
                height={40}
                width={40}
                alt="Receipt"
              />
            ) : (
              "-"
            )}
          </td>
          <td className="px-4 py-3">{t.note ?? "-"}</td>
          <td className="px-4 py-3">{t.remark ?? "-"}</td>
        </tr>
      ))
    )}
  </>
);

export default DepositTable;
