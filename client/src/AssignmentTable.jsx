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


// import React, { useEffect, useState } from 'react';

// const AssignmentTable = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [sortBy, setSortBy] = useState('start_date');
//   const [sortOrder, setSortOrder] = useState('asc');

//   const fetchAssignments = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/project_assignments');
//       const data = await res.json();
//       setAssignments(data.slice(-5)); // Only show latest 5
//     } catch (err) {
//       console.error('Failed to fetch assignments', err);
//     }
//   };

//   useEffect(() => {
//     fetchAssignments();
//     const interval = setInterval(fetchAssignments, 60000); // refresh every 1 min
//     return () => clearInterval(interval);
//   }, []);

//   const handleSort = (key) => {
//     const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
//     setSortBy(key);
//     setSortOrder(newOrder);

//     const sorted = [...assignments].sort((a, b) => {
//       const valA = key === 'start_date' ? new Date(a[key]) : a[key]?.employee_id || a[key]?.project_name;
//       const valB = key === 'start_date' ? new Date(b[key]) : b[key]?.employee_id || b[key]?.project_name;

//       return newOrder === 'asc'
//         ? String(valA).localeCompare(String(valB))
//         : String(valB).localeCompare(String(valA));
//     });

//     setAssignments(sorted);
//   };

//   const thStyle = {
//     backgroundColor: '#2c3e50',
//     color: 'white',
//     padding: '10px',
//     cursor: 'pointer',
//     textAlign: 'left',
//     borderBottom: '2px solid #34495e',
//   };

//   const tdStyle = {
//     padding: '10px',
//     borderBottom: '1px solid #ccc',
//   };

//   const tableStyle = {
//     width: '90%',
//     margin: '30px auto',
//     borderCollapse: 'collapse',
//     backgroundColor: '#f9f9f9',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//   };

//   const rowHoverStyle = {
//     transition: 'background-color 0.2s ease',
//   };

//   return (
//     <div style={{ textAlign: 'center', padding: '20px' }}>
//       <h2>Latest Project Assignments</h2>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             <th style={thStyle} onClick={() => handleSort('employee_id')}>Employee ID</th>
//             <th style={thStyle} onClick={() => handleSort('employee_name')}>Employee Name</th>
//             <th style={thStyle} onClick={() => handleSort('project_name')}>Project Name</th>
//             <th style={thStyle} onClick={() => handleSort('start_date')}>Start Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {assignments.map((a, index) => (
//             <tr key={index} style={index % 2 === 0 ? rowHoverStyle : { ...rowHoverStyle, backgroundColor: '#f0f0f0' }}>
//               <td style={tdStyle}>{a.employee_id?.employee_id}</td>
//               <td style={tdStyle}>{a.employee_id?.full_name}</td>
//               <td style={tdStyle}>{a.project_code?.project_name}</td>
//               <td style={tdStyle}>{new Date(a.start_date).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AssignmentTable;
