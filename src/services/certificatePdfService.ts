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

export interface CertificateFormData {
  irCode: string;
  investorName: string;
  periodMonths: string;
  tenureOfInvestment: string;
  areaOfInvestment: string;
  amountInvested: string;
  subscriptionDate: string;
  paymentDate: string;
}

const defaultDateStr = new Date().toLocaleDateString('en-GB');

export const initialCertificateFormData: CertificateFormData = {
  irCode: '',
  investorName: '',
  periodMonths: '',
  tenureOfInvestment: '',
  areaOfInvestment: 'Rice Farming',
  amountInvested: '',
  subscriptionDate: defaultDateStr,
  paymentDate: defaultDateStr,
};

export const ORIGINAL_CERTIFICATE_PDF_URL = '/assets/aistudio/SBH_CONTRACT_CERTIFICATE__3d16746c.pdf';
export const CERTIFICATE_IMAGE_URL = '/assets/aistudio/sbh_certificate_page1.jpg';
export const CERTIFICATE_IMAGE_WIDTH = 3300;
export const CERTIFICATE_IMAGE_HEIGHT = 2472;

/**
 * Maps pixel coordinates from the 3300x2472 image space to the PDF's landscape 842x595 pt page space.
 * The original content stream places /X1 at cm [1 0 0 1 23.85193 0] and [794.29614 0 0 595 0 0].
 */
export const toCertificatePdfCoord = (x: number, y: number, w: number = 0, h: number = 0) => {
  const pdfX = 23.85193 + (x / CERTIFICATE_IMAGE_WIDTH) * 794.29614;
  const pdfW = (w / CERTIFICATE_IMAGE_WIDTH) * 794.29614;
  const pdfH = (h / CERTIFICATE_IMAGE_HEIGHT) * 595;
  const pdfY = (1 - (y + h) / CERTIFICATE_IMAGE_HEIGHT) * 595;
  return { x: pdfX, y: pdfY, width: pdfW, height: pdfH };
};

/**
 * Loads the original SBH Certificate of Investment PDF and embeds AcroForm fields & inked values.
 */
export async function generateCompletedCertificatePDF(
  data: CertificateFormData,
  options: { flatten?: boolean } = {}
): Promise<Uint8Array> {
  const response = await fetch(ORIGINAL_CERTIFICATE_PDF_URL);
  if (!response.ok) {
    throw new Error('Failed to load the original SBH Certificate of Investment PDF template.');
  }

  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPage(0);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const serifBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const form = pdfDoc.getForm();

  const inkColor = rgb(0.05, 0.12, 0.38);

  const drawText = (
    text: string,
    x: number,
    y: number,
    w: number,
    h: number,
    size = 10,
    centered = false,
    useSerif = false
  ) => {
    if (!text) return;
    const pos = toCertificatePdfCoord(x, y, w, h);
    const activeFont = useSerif ? serifBoldFont : boldFont;
    let drawX = pos.x + 3;
    if (centered) {
      const textWidth = activeFont.widthOfTextAtSize(String(text), size);
      drawX = Math.max(pos.x + 2, pos.x + (pos.width - textWidth) / 2);
    }
    page.drawText(String(text), {
      x: drawX,
      y: pos.y + 3,
      size,
      font: activeFont,
      color: inkColor,
      maxWidth: pos.width - 6,
    });
  };

  const addAcroField = (name: string, value: string, x: number, y: number, w: number, h: number) => {
    try {
      const rect = toCertificatePdfCoord(x, y, w, h);
      const tf = form.createTextField(name);
      tf.setText(value || '');
      tf.addToPage(page, rect);
    } catch {
      // Ignore duplicate registration
    }
  };

  // IR CODE (top right box)
  drawText(data.irCode, 2655, 342, 365, 46, 9, true);
  addAcroField('irCode', data.irCode, 2655, 342, 365, 46);

  // THIS IS TO CERTIFY THAT (Investor Name — prominent centered line)
  drawText(data.investorName, 550, 1185, 2360, 82, 20, true, true);
  addAcroField('investorName', data.investorName, 550, 1185, 2360, 82);

  // Period of ___ months
  drawText(data.periodMonths, 2435, 1324, 163, 44, 10, true);
  addAcroField('periodMonths', data.periodMonths, 2435, 1324, 163, 44);

  // Tenure of Investment
  drawText(data.tenureOfInvestment, 1102, 1536, 633, 48, 10);
  addAcroField('tenureOfInvestment', data.tenureOfInvestment, 1102, 1536, 633, 48);

  // Area of Investment
  drawText(data.areaOfInvestment, 2343, 1536, 756, 48, 10);
  addAcroField('areaOfInvestment', data.areaOfInvestment, 2343, 1536, 756, 48);

  // Amount Invested
  drawText(data.amountInvested, 1783, 1659, 1314, 48, 10.5);
  addAcroField('amountInvested', data.amountInvested, 1783, 1659, 1314, 48);

  // Subscription Date
  drawText(data.subscriptionDate, 982, 1788, 852, 48, 10);
  addAcroField('subscriptionDate', data.subscriptionDate, 982, 1788, 852, 48);

  // Payment Date
  drawText(data.paymentDate, 2283, 1788, 816, 48, 10);
  addAcroField('paymentDate', data.paymentDate, 2283, 1788, 816, 48);

  if (options.flatten) {
    form.flatten();
  }

  return await pdfDoc.save();
}

/**
 * Triggers immediate browser download of the completed Certificate of Investment PDF.
 */
export async function downloadCompletedCertificatePDF(data: CertificateFormData, filename?: string) {
  const bytes = await generateCompletedCertificatePDF(data);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (data.investorName || 'Investor').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = filename || `SBH_CERTIFICATE_OF_INVESTMENT_${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

const cleanStr = (val: string, maxLen = 200) => String(val || '').trim().slice(0, maxLen);

/**
 * Save Certificate of Investment submission to Firestore.
 */
export async function saveCertificateSubmission(uid: string | null, data: CertificateFormData) {
  const submissionPayload = {
    uid: uid || 'anonymous',
    irCode: cleanStr(data.irCode, 60),
    investorName: cleanStr(data.investorName, 150),
    periodMonths: cleanStr(data.periodMonths, 40),
    tenureOfInvestment: cleanStr(data.tenureOfInvestment, 80),
    areaOfInvestment: cleanStr(data.areaOfInvestment, 120),
    amountInvested: cleanStr(data.amountInvested, 80),
    subscriptionDate: cleanStr(data.subscriptionDate, 50),
    paymentDate: cleanStr(data.paymentDate, 50),
    status: 'submitted',
    submittedAt: Timestamp.now(),
  };

  if (!uid) {
    return {
      id: `CERT-${Date.now().toString(36).toUpperCase()}`,
      ...submissionPayload,
    };
  }

  let docRef;
  try {
    docRef = await addDoc(collection(db, 'certificateSubmissions'), submissionPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'certificateSubmissions');
    throw error;
  }

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        certificateCompleted: true,
        certificateSubmissionId: docRef.id,
        certificateSubmittedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not update user certificateCompleted flag:', error);
  }

  return { id: docRef.id, ...submissionPayload };
}

/**
 * Fetch existing Certificate submission for user if available.
 */
export async function fetchUserCertificateSubmission(uid: string): Promise<CertificateFormData | null> {
  try {
    const q = query(collection(db, 'certificateSubmissions'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const sorted = snapshot.docs
        .map((d) => d.data() as any)
        .sort((a, b) => {
          const tA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : 0;
          const tB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : 0;
          return tB - tA;
        });
      const d = sorted[0];
      return {
        ...initialCertificateFormData,
        ...d,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Certificate submission:', error);
    return null;
  }
}
