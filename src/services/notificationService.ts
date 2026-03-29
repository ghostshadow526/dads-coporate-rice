export const sendCompanyNotification = async (type: 'investment' | 'order' | 'registration', details: any) => {
  // In a real application, this would call a cloud function or an email API
  console.log(`[COMPANY NOTIFICATION] New ${type} received:`, details);
  
  // Simulate API call
  return new Promise((resolve) => setTimeout(resolve, 500));
};
