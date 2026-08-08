export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    hour12: true,
  })
    .format(date)
    .replace(',', '')
    .replace('am', 'AM')
    .replace('pm', 'PM');
}
