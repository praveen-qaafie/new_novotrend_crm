import { Transaction } from "@/features/crm/transaction-history/types/transaction-history.types";

const WithdrawTable = ({ rows }: { rows: Transaction[] }) => (
  <>
    {rows.length === 0 ? (
      <tr>
        <td colSpan={9} className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No withdrawal transactions found
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
          <td className="px-4 py-3 whitespace-nowrap">{t.status}</td>
          <td className="px-4 py-3">{t.withdrawType ?? "-"}</td>
          <td className="px-4 py-3">{"-"}</td>
          <td className="px-4 py-3">{"-"}</td>
          <td className="px-4 py-3">{t.remark ?? "-"}</td>
        </tr>
      ))
    )}
  </>
);

export default WithdrawTable;
