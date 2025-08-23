// TINY API HELPER
export async function fetchAssignments() {
  const res = await fetch('/api/project_assignments?limit=5');
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}
