export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // If the date is just a year (4 digits)
  if (/^\d{4}$/.test(dateString)) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return as is if invalid
    }

    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date).replace(' г.', '');
  } catch (e) {
    return dateString;
  }
};
