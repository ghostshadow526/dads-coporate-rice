import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export const generateInvestmentPDF = (investment: any, user: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("salvagebizhub INVESTMENT DOCUMENT", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${format(new Date(), 'PPP')}`, 20, 40);
  doc.text(`Investor Name: ${investment.fullName || user.displayName || 'N/A'}`, 20, 50);
  doc.text(`Investor Email: ${user.email}`, 20, 60);
  doc.text(`Phone: ${investment.phone || 'N/A'}`, 20, 70);
  doc.text(`Address: ${investment.address || 'N/A'}`, 20, 80);
  
  doc.line(20, 85, 190, 85);
  
  doc.text(`Investment Plan: ${investment.plan}`, 20, 100);
  doc.text(`Number of Slots: ${investment.slots}`, 20, 110);
  doc.text(`Total Amount Invested: NGN ${investment.amount.toLocaleString()}`, 20, 120);
  doc.text(`Payment ID: ${investment.paymentId}`, 20, 130);
  doc.text(`Status: ${investment.status.toUpperCase()}`, 20, 140);
  
  doc.line(20, 145, 190, 145);
  
  doc.text("Next of Kin Details:", 20, 160);
  doc.text(`Name: ${investment.nextOfKin || 'N/A'}`, 20, 170);
  doc.text(`Relationship: ${investment.relationship || 'N/A'}`, 20, 180);
  doc.text(`Phone: ${investment.nextOfKinPhone || 'N/A'}`, 20, 190);
  
  doc.text("Bank Details (For Returns):", 20, 210);
  doc.text(`Bank: ${investment.bankName || 'N/A'}`, 20, 220);
  doc.text(`Account Name: ${investment.accountName || 'N/A'}`, 20, 230);
  doc.text(`Account Number: ${investment.accountNumber || 'N/A'}`, 20, 240);
  
  doc.setFontSize(10);
  doc.text("Thank you for investing in salvagebizhub. This document serves as a proof of your investment.", 20, 260);
  doc.text("Please keep this document safe for future reference.", 20, 270);
  
  doc.save(`investment_${investment.paymentId}.pdf`);
};

export const generateReceiptPDF = (payment: any, user: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("salvagebizhub PAYMENT RECEIPT", 105, 20, { align: 'center' });
  
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
  doc.text("salvagebizhub TRAINING PASS", 105, 20, { align: 'center' });
  
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

export const generateConstitutionPDF = (user: any) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("salvagebizhub COOPERATIVE CONSTITUTION", 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Issued to: ${user?.displayName || 'Member'}`, 20, 40);
  doc.text("1. NAME AND OBJECTIVES", 20, 60);
  doc.text("The name of the cooperative shall be salvagebizhub Cooperative Society.", 20, 70);
  doc.text("2. MEMBERSHIP", 20, 80);
  doc.text("Membership is open to all individuals interested in sustainable agriculture.", 20, 90);
  doc.save("salvagebizhub_constitution.pdf");
};

export const generateByeLawsPDF = (user: any) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("salvagebizhub COOPERATIVE BYE-LAWS", 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Issued to: ${user?.displayName || 'Member'}`, 20, 40);
  doc.text("1. MONTHLY DUES", 20, 60);
  doc.text("Members are required to pay a monthly due of NGN 2,000.", 20, 70);
  doc.text("2. VOTING RIGHTS", 20, 80);
  doc.text("Each active member is entitled to one vote during general meetings.", 20, 90);
  doc.save("salvagebizhub_bye_laws.pdf");
};

