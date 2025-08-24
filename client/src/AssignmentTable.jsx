import React from 'react';

export default function AssignmentTable({ rows, sortKey, sortDir, onSort }) {
  const headers = [
    { key: 'employee_id',   label: 'Employee_ID' },
    { key: 'employee_name', label: 'Employee_name' },
    { key: 'project_name',  label: 'Project_name' },
    { key: 'start_date',    label: 'Start_date' },
  ];

  const formatDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleDateString();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th
                key={h.key}
                onClick={() => onSort(h.key)}
                style={{ cursor: 'pointer', borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}
                title="Click to sort"
              >
                {h.label} {sortKey === h.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id ?? `${r.employee_id}-${r.project_name}-${r.start_date}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px' }}>{r.employee_id}</td>
              <td style={{ padding: '8px' }}>{r.employee_name}</td>
              <td style={{ padding: '8px' }}>{r.project_name}</td>
              <td style={{ padding: '8px' }}>{formatDate(r.start_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

