import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { History } from 'lucide-react';

export const AdminAuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminAuditLog()
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-brand-gold" />
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Security &amp; Administrative Audit Trail
          </h1>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Chronological record of product revisions, enquiry arrivals, and publishing events.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase text-neutral-500">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator / Agent</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400">Loading audit trail...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400">No events logged yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 text-[11px]">
                  <td className="py-3 px-4 text-neutral-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
                    {log.user_id}
                  </td>
                  <td className="py-3 px-4 text-brand-gold font-medium">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {log.entity_type}
                  </td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-sans max-w-sm">
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
