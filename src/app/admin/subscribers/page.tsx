"use client";

import { useEffect, useState } from "react";
import { Card, EmptyState, PageHeader, Spinner } from "@/components/admin/ui";

type S = { id: number; email: string; createdAt: string };

export default function SubscribersAdmin() {
  const [rows, setRows] = useState<S[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((r) => r.json())
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  async function remove(row: S) {
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== row.id));
    const res = await fetch(`/api/subscribers/${row.id}`, { method: "DELETE" });
    if (!res.ok) setRows(prev);
  }

  function exportCsv() {
    const csv = ["email,joined", ...rows.map((r) => `${r.email},${new Date(r.createdAt).toISOString()}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "digital-angel-subscribers.csv";
    a.click();
  }

  return (
    <div>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle={`${rows.length} reader${rows.length === 1 ? "" : "s"} on the list.`}
        action={
          <button onClick={exportCsv} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white">
            Export CSV
          </button>
        }
      />
      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState title="No subscribers yet" hint="Signups from the website appear here." />
        ) : (
          <Card className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-3 font-medium text-slate-700">{s.email}</td>
                    <td className="px-6 py-3 text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => remove(s)} className="text-sm font-medium text-red-600 hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
