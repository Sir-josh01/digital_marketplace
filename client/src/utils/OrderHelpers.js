export const getStatusStep = (status) => {
  switch(status) {
    case 'Confirmed': return 1;
    case 'Processing': return 2;
    case 'Shipped': return 3;
    case 'Delivered': return 4;
    default: return 1; // Default to the first step
  }
};

// You can add more helpers here later, like date formatters
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};