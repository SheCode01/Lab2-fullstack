import React, { useEffect, useMemo, useState } from 'react';
import AssignmentTable from './AssignmentTable.jsx';
import { fetchAssignments } from './api.js';

export default function App() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState('start_date');
  const [sortDir, setSortDir] = useState('desc');

  async function load() {
    try {
      const data = await fetchAssignments();  // API already returns newest first, limited to 5
      setRows(data);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load');
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);  // auto-refresh every minute
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const A = a[sortKey], B = b[sortKey];
      if (sortKey === 'start_date') {
        return sortDir === 'asc' ? new Date(A) - new Date(B) : new Date(B) - new Date(A);
      }
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sortKey, sortDir]);

  const onSort = (key) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <main className="container">
      <section className="card">
        <h1>Project Assignments (Latest 5)</h1>
        <div className="actions">
          <button className="refresh" onClick={load}>Refresh</button>
        </div>
        {error && <p style={{ color:'salmon', textAlign:'center' }}>{error}</p>}
        <div className="table-wrap">
          <AssignmentTable rows={sorted} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        </div>
        <p className="note">Auto-refreshes every minute. Click headers to sort.</p>
      </section>
    </main>
  );
}
