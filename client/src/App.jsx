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
      const data = await fetchAssignments(); // API already returns newest first, limited to 5
      setRows(data);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load');
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000); // auto-refresh every minute
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];

      if (sortKey === 'start_date') {
        return sortDir === 'asc'
          ? new Date(A) - new Date(B)
          : new Date(B) - new Date(A);
      }
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sortKey, sortDir]);

  const onSort = (key) => {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', margin: '0 auto', maxWidth: 960 }}>
      <h1 style={{ textAlign: 'center' }}>Project Assignments (Latest 5)</h1>

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <button onClick={load} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #ddd' }}>
          Refresh
        </button>
      </div>

      {error && <p style={{ color: 'crimson', textAlign: 'center' }}>{error}</p>}

      <AssignmentTable rows={sorted} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />

      <p style={{ fontSize: 12, opacity: 0.7, textAlign: 'center' }}>
        Auto-refreshes every minute. Click headers to sort.
      </p>
    </div>
  );
}

