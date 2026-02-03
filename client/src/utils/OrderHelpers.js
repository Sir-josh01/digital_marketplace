export const getStatusStep = (status) => {
  const s = status ? status.toLowerCase() : '';

switch(s) {
    case 'paid':
    case 'confirmed': 
      return 1;
    case 'processing': 
      return 2;
    case 'shipped': 
      return 3;
    case 'delivered': 
      return 4;
    default: 
      return 0; // 0 means nothing is active yet
  }
};

// You can add more helpers here later, like date formatters
export const formatDate = (dateString) => {
  if(!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};