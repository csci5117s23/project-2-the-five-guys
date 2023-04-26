export function formatDate(isoDateString) {
  const formattedDate = new Date(isoDateString);
  return formattedDate.toLocaleDateString()
}
