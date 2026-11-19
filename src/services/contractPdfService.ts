import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
  handleFirestoreError,
  OperationType,
} from '../firebase';

export interface ContractFormData {
  // Header
  irCode: string;

  // Investment Season & Term
  season: string;
  startDay: string;
  startMonthYear: string;
  endDay: string;
  endMonthYear: string;

  // Investor & Next of Kin Details
  name: string;
  phoneNo: string;
  email: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  nextOfKinEmail: string;
  subscriptionDate: string;
  paymentDate: string;

  // EOP Table Remarks (Rows 1 - 12)
  remarks: {
    r1: string;
    r2: string;
    r3: string;
    r4: string;
    r5: string;
    r6: string;
    r7: string;
    r8: string;
    r9: string;
    r10: string;
    r11: string;
    r12: string;
  };

  // Investment Summary & Bank Details
  hectaresInvested: string;
  totalAmountPaid: string;
  amountPaidDate: string;
  amountInWordsLine1: string;
  amountInWordsLine2: string;
  expectedRoiRice: string;
  gtToPayAtMaturity: string;
  bankName: string;
  acctName: string;
  acctNo: string;
  investorSign: string;

  // Package Slot & Payment Info
  selectedSlot: 'Bronze' | 'Silver' | 'Gold' | '';
  methodOfPayment: string;
  officialDate: string;
}

export const initialContractFormData: ContractFormData = {
  irCode: '',
  season: '',
  startDay: '',
  startMonthYear: '',
  endDay: '',
  endMonthYear: '',
  name: '',
  phoneNo: '',
  email: '',
  nextOfKin: '',
  nextOfKinPhone: '',
  nextOfKinEmail: '',
  subscriptionDate: new Date().toLocaleDateString('en-GB'),
  paymentDate: new Date().toLocaleDateString('en-GB'),
  remarks: {
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: '',
    r6: '',
    r7: '',
    r8: '',
    r9: '',
    r10: '',
    r11: '',
    r12: '',
  },
  hectaresInvested: '',
  totalAmountPaid: '',
  amountPaidDate: new Date().toLocaleDateString('en-GB'),
  amountInWordsLine1: '',
  amountInWordsLine2: '',
  expectedRoiRice: '',
  gtToPayAtMaturity: '',
  bankName: '',
  acctName: '',
  acctNo: '',
  investorSign: '',
  selectedSlot: '',
  methodOfPayment: '',
  officialDate: '',
};

export const ORIGINAL_CONTRACT_PDF_URL = '/assets/aistudio/SBH_CONTRACT_FORM_db626c67.pdf';
export const CONTRACT_IMAGE_WIDTH = 2480;
export const CONTRACT_IMAGE_HEIGHT = 3500;

/**
 * Maps pixel coordinates from the 2480x3500 image space to the PDF's 595x842 pt page space.
 * The original content stream places /X1 at cm [595 0 0 839.71771 0 1.14114].
 */
export const toContractPdfCoord = (x: number, y: number, w: number = 0, h: number = 0) => {
  const pdfX = (x / CONTRACT_IMAGE_WIDTH) * 595;
  const pdfW = (w / CONTRACT_IMAGE_WIDTH) * 595;
  const pdfH = (h / CONTRACT_IMAGE_HEIGHT) * 839.71771;
  const pdfY = 1.14114 + (1 - (y + h) / CONTRACT_IMAGE_HEIGHT) * 839.71771;
  return { x: pdfX, y: pdfY, width: pdfW, height: pdfH };
};

/**
 * Loads the original SBH Contract PDF and embeds AcroForm fields and inked user values.
 */
export async function generateCompletedContractPDF(
  data: ContractFormData,
  options: { flatten?: boolean } = {}
): Promise<Uint8Array> {
  const response = await fetch(ORIGINAL_CONTRACT_PDF_URL);
  if (!response.ok) {
    throw new Error('Failed to load the original SBH Contract PDF template.');
  }

  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPage(0);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
  const form = pdfDoc.getForm();

  const inkColor = rgb(0.05, 0.12, 0.38);

  const drawLineText = (
    text: string,
    x: number,
    y: number,
    w: number,
    h: number,
    size = 8.5,
    useItalic = false
  ) => {
    if (!text) return;
    const pos = toContractPdfCoord(x, y, w, h);
    page.drawText(String(text), {
      x: pos.x + 2,
      y: pos.y + 3,
      size,
      font: useItalic ? italicFont : boldFont,
      color: inkColor,
      maxWidth: pos.width - 4,
    });
  };

  const drawCheck = (x: number, y: number, w: number, h: number) => {
    const pos = toContractPdfCoord(x, y, w, h);
    page.drawText('X', {
      x: pos.x + pos.width * 0.25,
      y: pos.y + pos.height * 0.15,
      size: 11,
      font: boldFont,
      color: inkColor,
    });
  };

  const addAcroField = (name: string, value: string, x: number, y: number, w: number, h: number) => {
    try {
      const rect = toContractPdfCoord(x, y, w, h);
      const tf = form.createTextField(name);
      tf.setText(value || '');
      tf.addToPage(page, rect);
    } catch {
      // Ignore duplicate field registration errors
    }
  };

  const addAcroCheck = (name: string, isChecked: boolean, x: number, y: number, w: number, h: number) => {
    try {
      const rect = toContractPdfCoord(x, y, w, h);
      const cb = form.createCheckBox(name);
      if (isChecked) {
        cb.check();
      }
      cb.addToPage(page, rect);
    } catch {
      // Ignore
    }
  };

  // Header IR Code
  drawLineText(data.irCode, 1986, 635, 334, 56, 8.5);
  addAcroField('irCode', data.irCode, 1986, 635, 334, 56);

  // Intro Paragraph Blanks
  drawLineText(data.season, 1904, 860, 314, 48, 8.5);
  addAcroField('season', data.season, 1904, 860, 314, 48);

  drawLineText(data.startDay, 194, 998, 183, 48, 8.5);
  addAcroField('startDay', data.startDay, 194, 998, 183, 48);

  drawLineText(data.startMonthYear, 524, 998, 555, 48, 8.5);
  addAcroField('startMonthYear', data.startMonthYear, 524, 998, 555, 48);

  drawLineText(data.endDay, 1256, 998, 157, 48, 8.5);
  addAcroField('endDay', data.endDay, 1256, 998, 157, 48);

  drawLineText(data.endMonthYear, 1582, 998, 448, 48, 8.5);
  addAcroField('endMonthYear', data.endMonthYear, 1582, 998, 448, 48);

  // Investor & Contact Lines
  drawLineText(data.name, 262, 1368, 742, 48, 8.5);
  addAcroField('name', data.name, 262, 1368, 742, 48);

  drawLineText(data.phoneNo, 1272, 1368, 501, 48, 8.5);
  addAcroField('phoneNo', data.phoneNo, 1272, 1368, 501, 48);

  drawLineText(data.email, 1960, 1368, 421, 48, 7.5);
  addAcroField('email', data.email, 1960, 1368, 421, 48);

  drawLineText(data.nextOfKin, 376, 1461, 793, 48, 8.5);
  addAcroField('nextOfKin', data.nextOfKin, 376, 1461, 793, 48);

  drawLineText(data.nextOfKinPhone, 1333, 1461, 478, 48, 8.5);
  addAcroField('nextOfKinPhone', data.nextOfKinPhone, 1333, 1461, 478, 48);

  drawLineText(data.nextOfKinEmail, 1970, 1461, 394, 48, 7.5);
  addAcroField('nextOfKinEmail', data.nextOfKinEmail, 1970, 1461, 394, 48);

  drawLineText(data.subscriptionDate, 500, 1533, 792, 48, 8.5);
  addAcroField('subscriptionDate', data.subscriptionDate, 500, 1533, 792, 48);

  drawLineText(data.paymentDate, 1617, 1533, 741, 48, 8.5);
  addAcroField('paymentDate', data.paymentDate, 1617, 1533, 741, 48);

  // EOP Table Remarks (Rows 1-12)
  const remarkRows: Array<{ key: keyof ContractFormData['remarks']; y: number; h: number }> = [
    { key: 'r1', y: 1794, h: 58 },
    { key: 'r2', y: 1865, h: 58 },
    { key: 'r3', y: 1936, h: 58 },
    { key: 'r4', y: 2008, h: 58 },
    { key: 'r5', y: 2079, h: 58 },
    { key: 'r6', y: 2150, h: 58 },
    { key: 'r7', y: 2221, h: 58 },
    { key: 'r8', y: 2292, h: 58 },
    { key: 'r9', y: 2364, h: 58 },
    { key: 'r10', y: 2435, h: 58 },
    { key: 'r11', y: 2506, h: 58 },
    { key: 'r12', y: 2576, h: 50 },
  ];

  remarkRows.forEach((row) => {
    const val = data.remarks[row.key] || '';
    drawLineText(val, 2022, row.y, 326, row.h, 7.5);
    addAcroField(`remark_${row.key}`, val, 2022, row.y, 326, row.h);
  });

  // Financial Summary & Bank Details
  drawLineText(data.hectaresInvested, 782, 2750, 229, 48, 8.5);
  addAcroField('hectaresInvested', data.hectaresInvested, 782, 2750, 229, 48);

  drawLineText(data.totalAmountPaid, 1437, 2750, 465, 48, 8.5);
  addAcroField('totalAmountPaid', data.totalAmountPaid, 1437, 2750, 465, 48);

  drawLineText(data.amountPaidDate, 2043, 2750, 305, 48, 8.5);
  addAcroField('amountPaidDate', data.amountPaidDate, 2043, 2750, 305, 48);

  drawLineText(data.amountInWordsLine1, 165, 2830, 2100, 48, 8.5);
  addAcroField('amountInWordsLine1', data.amountInWordsLine1, 165, 2830, 2100, 48);

  drawLineText(data.amountInWordsLine2, 135, 2886, 2055, 48, 8.5);
  addAcroField('amountInWordsLine2', data.amountInWordsLine2, 135, 2886, 2055, 48);

  drawLineText(data.expectedRoiRice, 858, 2972, 228, 48, 8.5);
  addAcroField('expectedRoiRice', data.expectedRoiRice, 858, 2972, 228, 48);

  drawLineText(data.gtToPayAtMaturity, 1691, 2972, 357, 48, 8.5);
  addAcroField('gtToPayAtMaturity', data.gtToPayAtMaturity, 1691, 2972, 357, 48);

  drawLineText(data.bankName, 247, 3046, 330, 48, 8);
  addAcroField('bankName', data.bankName, 247, 3046, 330, 48);

  drawLineText(data.acctName, 850, 3046, 567, 48, 8);
  addAcroField('acctName', data.acctName, 850, 3046, 567, 48);

  drawLineText(data.acctNo, 1620, 3046, 459, 48, 8.5);
  addAcroField('acctNo', data.acctNo, 1620, 3046, 459, 48);

  drawLineText(data.investorSign, 2204, 3046, 177, 48, 8.5, true);
  addAcroField('investorSign', data.investorSign, 2204, 3046, 177, 48);

  // Slot Checkboxes
  if (data.selectedSlot === 'Bronze') {
    drawCheck(644, 3192, 81, 47);
    addAcroCheck('slot_bronze', true, 644, 3192, 81, 47);
  } else if (data.selectedSlot === 'Silver') {
    drawCheck(1224, 3192, 81, 47);
    addAcroCheck('slot_silver', true, 1224, 3192, 81, 47);
  } else if (data.selectedSlot === 'Gold') {
    drawCheck(2027, 3192, 80, 47);
    addAcroCheck('slot_gold', true, 2027, 3192, 80, 47);
  }

  // Official Payment Method & Date
  drawLineText(data.methodOfPayment, 1888, 3326, 209, 48, 7.5);
  addAcroField('methodOfPayment', data.methodOfPayment, 1888, 3326, 209, 48);

  drawLineText(data.officialDate, 2209, 3326, 178, 48, 7.5);
  addAcroField('officialDate', data.officialDate, 2209, 3326, 178, 48);

  if (options.flatten) {
    form.flatten();
  }

  return await pdfDoc.save();
}

/**
 * Triggers immediate browser download of the completed Contract PDF.
 */
export async function downloadCompletedContractPDF(data: ContractFormData, filename?: string) {
  const bytes = await generateCompletedContractPDF(data);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (data.name || 'Investor').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = filename || `SBH_CONTRACT_FORM_${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

const cleanStr = (val: string, maxLen = 200) => String(val || '').trim().slice(0, maxLen);

/**
 * Save Contract Form Submission to Firestore.
 */
export async function saveContractSubmission(uid: string | null, data: ContractFormData) {
  if (!uid) {
    throw new Error('Please sign in to submit and save your official investment contract form.');
  }

  const submissionPayload = {
    uid,
    irCode: cleanStr(data.irCode, 60),
    season: cleanStr(data.season, 80),
    startDay: cleanStr(data.startDay, 40),
    startMonthYear: cleanStr(data.startMonthYear, 80),
    endDay: cleanStr(data.endDay, 40),
    endMonthYear: cleanStr(data.endMonthYear, 80),
    name: cleanStr(data.name, 150),
    phoneNo: cleanStr(data.phoneNo, 40),
    email: cleanStr(data.email, 150),
    nextOfKin: cleanStr(data.nextOfKin, 150),
    nextOfKinPhone: cleanStr(data.nextOfKinPhone, 40),
    nextOfKinEmail: cleanStr(data.nextOfKinEmail, 150),
    subscriptionDate: cleanStr(data.subscriptionDate, 50),
    paymentDate: cleanStr(data.paymentDate, 50),
    remarks: {
      r1: cleanStr(data.remarks.r1, 100),
      r2: cleanStr(data.remarks.r2, 100),
      r3: cleanStr(data.remarks.r3, 100),
      r4: cleanStr(data.remarks.r4, 100),
      r5: cleanStr(data.remarks.r5, 100),
      r6: cleanStr(data.remarks.r6, 100),
      r7: cleanStr(data.remarks.r7, 100),
      r8: cleanStr(data.remarks.r8, 100),
      r9: cleanStr(data.remarks.r9, 100),
      r10: cleanStr(data.remarks.r10, 100),
      r11: cleanStr(data.remarks.r11, 100),
      r12: cleanStr(data.remarks.r12, 100),
    },
    hectaresInvested: cleanStr(data.hectaresInvested, 40),
    totalAmountPaid: cleanStr(data.totalAmountPaid, 60),
    amountPaidDate: cleanStr(data.amountPaidDate, 50),
    amountInWordsLine1: cleanStr(data.amountInWordsLine1, 200),
    amountInWordsLine2: cleanStr(data.amountInWordsLine2, 200),
    expectedRoiRice: cleanStr(data.expectedRoiRice, 60),
    gtToPayAtMaturity: cleanStr(data.gtToPayAtMaturity, 60),
    bankName: cleanStr(data.bankName, 120),
    acctName: cleanStr(data.acctName, 150),
    acctNo: cleanStr(data.acctNo, 40),
    investorSign: cleanStr(data.investorSign, 150),
    selectedSlot: data.selectedSlot || '',
    methodOfPayment: cleanStr(data.methodOfPayment, 80),
    officialDate: cleanStr(data.officialDate, 50),
    status: 'submitted',
    submittedAt: Timestamp.now(),
  };

  let docRef;
  try {
    docRef = await addDoc(collection(db, 'contractSubmissions'), submissionPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'contractSubmissions');
    throw error;
  }

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        contractCompleted: true,
        contractSubmissionId: docRef.id,
        contractSubmittedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not update user contractCompleted flag:', error);
  }

  return { id: docRef.id, ...submissionPayload };
}

/**
 * Fetch existing Contract submission for user if available.
 */
export async function fetchUserContractSubmission(uid: string): Promise<ContractFormData | null> {
  try {
    const q = query(collection(db, 'contractSubmissions'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // Pick the most recent one if multiple exist
      const sorted = snapshot.docs
        .map((d) => d.data() as any)
        .sort((a, b) => {
          const tA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : 0;
          const tB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : 0;
          return tB - tA;
        });
      const d = sorted[0];
      return {
        ...initialContractFormData,
        ...d,
        remarks: { ...initialContractFormData.remarks, ...(d.remarks || {}) },
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Contract submission:', error);
    return null;
  }
}
