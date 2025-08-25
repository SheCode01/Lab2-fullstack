import React from 'react';

export default function AssignmentTable({ rows, sortKey, sortDir, onSort }) {
  const headers = [
    { key: 'employee_id',   label: 'Employee_ID' },
    { key: 'employee_name', label: 'Employee_name' },
    { key: 'project_name',  label: 'Project_name' },
    { key: 'start_date',    label: 'Start_date' },
  ];
  const fmt = (d) => new Date(d).toLocaleDateString();

  return (
    <table>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h.key} onClick={() => onSort(h.key)} title="Click to sort">
              {h.label} {sortKey === h.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r._id}>
            <td>{r.employee_id}</td>
            <td>{r.employee_name}</td>
            <td>{r.project_name}</td>
            <td>{fmt(r.start_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
