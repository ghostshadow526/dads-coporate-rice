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

export const generateAgreementPDF = (data: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addNewPage = () => {
    doc.addPage();
    yPosition = margin;
  };

  const addText = (text: string, options: any = {}) => {
    const { fontSize = 11, bold = false, centered = false, spaceBefore = 2, spaceAfter = 2 } = options;
    doc.setFontSize(fontSize);
    if (bold) doc.setFont(undefined, 'bold');
    else doc.setFont(undefined, 'normal');

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.45;

    if (yPosition + lines.length * lineHeight > pageHeight - margin) {
      addNewPage();
    }

    yPosition += spaceBefore;
    doc.text(lines, centered ? pageWidth / 2 : margin, yPosition, { align: centered ? 'center' : 'left' });
    yPosition += lines.length * lineHeight + spaceAfter;
  };

  // Header
  addText("SALVAGE BIZ-HUB NIG LTD", { fontSize: 16, bold: true, centered: true });
  addText("JOINT-VENTURE FARMING AGREEMENT", { fontSize: 14, bold: true, centered: true, spaceAfter: 8 });

  addText(
    "Head Office Address: Block A Josfood, Adjacent Civil Defense Headquarters, Jos, Plateau State.",
    { fontSize: 9, centered: true }
  );
  addText("Email: salvagebizhub@gmail.com | Phone: +234 (0)9167313334, +234 (0)8087040744", {
    fontSize: 9,
    centered: true,
    spaceAfter: 8,
  });

  // Introduction
  addText(
    `This Joint-venture agriculture business agreement ("Contract") is entered into on ${data.effectiveDate} ("Effective Date") by and between; Salvage Biz-Hub Nig Ltd ("Company"), a company duly registered with the Corporate Affairs Commission (CAC) with registration No. RC-1840192, compliance and certified with (SCUML) certificate by the Economic and financial crimes commission (EFCC) and a registered member of the Plateau State Chamber of Commerce, Mines and Agriculture (PLACCIMA) having its operational head office at Block A, Josfood, Adjacent Civil Defense Headquarters, Jos Plateau State Nigeria.`,
    { fontSize: 10, spaceAfter: 6 }
  );

  addText("And", { bold: true, spaceAfter: 4 });

  addText(`${data.partnerName}`, { bold: true, spaceAfter: 2 });
  addText(`Address: ${data.partnerAddress}`, { fontSize: 10, spaceAfter: 8 });

  // Main Clauses
  addText("WHEREAS:", { bold: true, fontSize: 12, spaceAfter: 4 });

  addText(
    "1. The Company is engaged in the legal business of agriculture, agro products/rice farming, cultivation, processing, packaging and supplies of same product(s). The company has developed a business model that allows individual(s)/group(s) to partner, run and expand its wet and dry season rice farming business tag: 'BECOME A FARMER WITHOUT NECESSARILY GOING TO FARM' (the \"Program\") then share profit with the partner at the end of every 6 months while going back to farm the next season.",
    { fontSize: 10, spaceAfter: 6 }
  );

  addText(
    "2. The partner/financier is interested in investing in the Program and has agreed to provide funding to the Company for the purpose of expanding its rice farming operations.",
    { fontSize: 10, spaceAfter: 6 }
  );

  addText(
    "3. The parties have agreed to the partnership terms and conditions of the farming business, including the partnership amount and slot(s) subscribed to, the sharing profit percentage on the business (ROI), and other terms as set forth in the business partnership Contract Agreement (the \"Agreement\").",
    { fontSize: 10, spaceAfter: 8 }
  );

  addText("NOW, THEREFORE, in consideration of the mutual covenants and understanding contained herein, the parties agree as follows:", {
    fontSize: 10,
    spaceAfter: 8,
  });

  // Section 1
  addText("1. PARTNERSHIP/JOINT-VENTURE TERMS", { bold: true, fontSize: 11, spaceAfter: 4 });

  addText(
    `1.1 The partner/financier (Investor) agrees to put money in the Company's business/rice farm program, "Become a Farmer without Necessarily Going to Farm," under the following terms:`,
    { fontSize: 10, spaceAfter: 4 }
  );

  addText(`• Funding package subscribed to: ${data.fundingPackage}`, { fontSize: 10 });
  addText(`• Amount paid: ${data.amountPaid}`, { fontSize: 10 });
  addText("• Company provides: Land, expertise and management", { fontSize: 10 });
  addText("• 38% profit sharing (ROI) to the partner in every six (6) months", { fontSize: 10, spaceAfter: 4 });
  addText(
    "• Minimum 12 months funding period; farm proceeds shared every 6 months after cultivation, harvesting, processing, and supplies",
    { fontSize: 10 }
  );
  addText(
    "• In case of loss or damage, parties may discuss refund timeline with 0% loss guarantee through insurance",
    { fontSize: 10, spaceAfter: 8 }
  );

  // Section 2
  addText("2. COMPANY POLICY ON FARMING BUSINESS", { bold: true, fontSize: 11, spaceAfter: 4 });

  addText(
    "2.1 As a condition precedent to this business, the partner/financier shall purchase a portion of the rice finished products of the DAD's RICE brand cultivated by the company using the partners funding capital, per every slot financed.",
    { fontSize: 10, spaceAfter: 4 }
  );

  addText("2.2 In the event of the partner/financier's death, only the designated next of kin shall have access to the partnership funds.", {
    fontSize: 10,
    spaceAfter: 4,
  });

  addText("2.3 VAT of 7.5% from the Investor's profit (ROI) shall be debited to cover tax payment charges.", { fontSize: 10, spaceAfter: 4 });

  addText("2.4 The partner/financier warrants that all information provided on the company's Know Your Customer (KYC) form is accurate, complete, and true.",
    { fontSize: 10, spaceAfter: 4 }
  );

  addText("2.5 The Company shall not be liable for any funding capital made with illicit funds.", { fontSize: 10, spaceAfter: 8 });

  // Section 3
  addText("3. COMMUNICATION", { bold: true, fontSize: 11, spaceAfter: 4 });
  addText("All official communications shall be conducted through:", { fontSize: 10 });
  addText("• Phone: 09167313334", { fontSize: 10 });
  addText("• Email: salvagebizhub.investment@gmail.com", { fontSize: 10 });
  addText("• Office Hours: 8:30 AM - 4:30 PM, Monday to Friday", { fontSize: 10, spaceAfter: 8 });

  // Section 7 - ROI Timeline
  addText("7. SPECIFIC TIMELINE FOR ROI SHARING PAYMENT", { bold: true, fontSize: 11, spaceAfter: 4 });
  addText("7.1 The Company shall share the farm business profit (ROI) to the partner within 21-28 days after the due date.", { fontSize: 10, spaceAfter: 4 });
  addText("7.2 In the event of a delay, the Company shall notify the partner in writing with reasons and expected payment date.", {
    fontSize: 10,
    spaceAfter: 8,
  });

  // Signatures Section
  addText("SIGNATURES", { bold: true, fontSize: 12, spaceAfter: 8 });

  addText("For and on behalf of Salvage Biz-Hub Nig Ltd:", { bold: true, fontSize: 10, spaceAfter: 4 });
  addText("Name: _____________________________________", { fontSize: 10 });
  addText("Designation: _______________________________", { fontSize: 10 });
  addText("Signature and Date: __________________________", { fontSize: 10, spaceAfter: 8 });

  addText("Signed by the partner/financier:", { bold: true, fontSize: 10, spaceAfter: 4 });
  addText(`Name: ${data.partnerName}`, { fontSize: 10 });
  addText(`Address: ${data.partnerAddress}`, { fontSize: 10 });
  addText("Signature: ________________________________", { fontSize: 10 });
  addText("Date: ____________________________________", { fontSize: 10, spaceAfter: 8 });

  addText("Partner Witness:", { bold: true, fontSize: 10, spaceAfter: 4 });
  addText(`Name: ${data.witnessName || '________________________________'}`, { fontSize: 10 });
  addText(`Relationship with partner: ${data.witnessRelationship || '________________________________'}`, { fontSize: 10 });
  addText("Signature: ________________________________", { fontSize: 10 });

  // Add disclaimer
  addNewPage();
  addText("INVESTMENT DISCLAIMER", { bold: true, fontSize: 14, centered: true, spaceAfter: 8 });

  addText("At Salvage Biz-Hub, we are committed to providing transparent and responsible investment opportunities.", {
    fontSize: 10,
    spaceAfter: 4,
  });

  addText("By participating in any of our investment packages, you acknowledge and agree to the following:", {
    fontSize: 10,
    spaceAfter: 6,
  });

  addText("1. SOURCE OF FUNDS", { bold: true, fontSize: 11, spaceAfter: 2 });
  addText(
    "Investor(s) are expected to use funds obtained through legitimate and lawful means. Responsibility for the source of investment funds remains with the Investor.",
    { fontSize: 10, spaceAfter: 6 }
  );

  addText("2. REGULATORY COMPLIANCE", { bold: true, fontSize: 11, spaceAfter: 2 });
  addText(
    "The Company maintains a commitment to ethical business practices and adherence to applicable financial regulations.",
    { fontSize: 10, spaceAfter: 6 }
  );

  addText("3. INVESTMENT RISK AWARENESS", { bold: true, fontSize: 11, spaceAfter: 2 });
  addText("While Salvage Biz-Hub strives to create profitable opportunities, returns cannot be 100% guaranteed.", { fontSize: 10 });
  addText("✓ Principal capital IS 100% refund guaranteed.", { fontSize: 10, bold: true, spaceAfter: 6 });

  addText("4. SHARED RESPONSIBILITY", { bold: true, fontSize: 11, spaceAfter: 2 });
  addText(
    "Investment decisions are made at the discretion of the Investor. Outcomes may vary depending on market and operational conditions.",
    { fontSize: 10, spaceAfter: 6 }
  );

  addText("5. COMMITMENT TO TRANSPARENCY", { bold: true, fontSize: 11, spaceAfter: 2 });
  addText(
    "We are dedicated to maintaining clear communication and building trust with our investors. Our team remains available to provide clarification and support.",
    { fontSize: 10, spaceAfter: 6 }
  );

  // Footer
  addText(
    "By proceeding with this investment package, you confirm your understanding of the above and your willingness to participate under these terms.",
    { fontSize: 9, centered: true, spaceAfter: 12 }
  );

  addText(`Generated on: ${format(new Date(), 'PPP')}`, { fontSize: 8, centered: true });

  // Save the PDF
  doc.save(`investment_agreement_${data.partnerName?.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

