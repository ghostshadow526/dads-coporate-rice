import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export const generateInvestmentPDF = (investment: any, user: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("DAD'S RICE INVESTMENT DOCUMENT", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${format(new Date(), 'PPP')}`, 20, 40);
  doc.text(`Investor Name: ${user.displayName || 'N/A'}`, 20, 50);
  doc.text(`Investor Email: ${user.email}`, 20, 60);
  
  doc.line(20, 65, 190, 65);
  
  doc.text(`Investment Plan: ${investment.plan}`, 20, 80);
  doc.text(`Number of Slots: ${investment.slots}`, 20, 90);
  doc.text(`Total Amount Invested: NGN ${investment.amount.toLocaleString()}`, 20, 100);
  doc.text(`Payment ID: ${investment.paymentId}`, 20, 110);
  doc.text(`Status: ${investment.status.toUpperCase()}`, 20, 120);
  
  doc.setFontSize(10);
  doc.text("Thank you for investing in DAD'S Rice. This document serves as a proof of your investment.", 20, 140);
  doc.text("Please keep this document safe for future reference.", 20, 150);
  
  doc.save(`investment_${investment.paymentId}.pdf`);
};

export const generateReceiptPDF = (payment: any, user: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("DAD'S RICE PAYMENT RECEIPT", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${format(new Date(), 'PPP')}`, 20, 40);
  doc.text(`Customer Name: ${user.displayName || 'N/A'}`, 20, 50);
  doc.text(`Customer Email: ${user.email}`, 20, 60);
  
  doc.line(20, 65, 190, 65);
  
  doc.text(`Purpose: ${payment.purpose}`, 20, 80);
  doc.text(`Amount Paid: NGN ${payment.amount.toLocaleString()}`, 20, 90);
  doc.text(`Transaction ID: ${payment.id}`, 20, 100);
  doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 110);
  
  doc.setFontSize(10);
  doc.text("Thank you for your payment. This receipt is automatically generated.", 20, 130);
  
  doc.save(`receipt_${payment.id}.pdf`);
};

export const generateTrainingPassPDF = (registration: any, training: any, user: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("DAD'S RICE TRAINING PASS", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${format(new Date(), 'PPP')}`, 20, 40);
  doc.text(`Registrant Name: ${user.displayName || 'N/A'}`, 20, 50);
  
  doc.line(20, 55, 190, 55);
  
  doc.text(`Training Title: ${training.title}`, 20, 70);
  doc.text(`Training Date: ${format(training.date.toDate(), 'PPP')}`, 20, 80);
  doc.text(`Payment ID: ${registration.paymentId}`, 20, 90);
  
  doc.setFontSize(10);
  doc.text("Please present this pass at the training venue.", 20, 110);
  
  doc.save(`training_pass_${registration.paymentId}.pdf`);
};
