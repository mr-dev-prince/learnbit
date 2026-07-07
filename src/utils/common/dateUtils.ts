export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
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
