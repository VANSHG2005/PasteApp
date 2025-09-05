export const FormatDate = (date) => {
  const _date = new Date(date);

  if (isNaN(_date)) {
    console.error('Invalid date');
    return 'Invalid Date';
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(_date);

  return formattedDate;
};
