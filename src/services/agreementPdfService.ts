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

export interface AgreementFormData {
  // Page 1 — Effective Date & Partner Details
  effectiveDay: string;
  effectiveMonthYear: string;
  partnerName: string;
  partnerAddress: string;

  // Page 2 — Clause 1.1(c) Funding Package Details
  fundingPackage: string;
  numberOfSlots: string;
  amountPaid: string;

  // Page 6 — Notices & Execution Signatures
  noticeAddress: string;
  mdDate: string;
  partnerSignName: string;
  partnerSignature: string;
  partnerSignDate: string;
  nokSignature: string;
  nokName: string;
  nokRelationship: string;
}

const getOrdinalDay = (day: number): string => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const now = new Date();
const defaultMonthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const defaultDateStr = now.toLocaleDateString('en-GB');

export const initialAgreementFormData: AgreementFormData = {
  effectiveDay: getOrdinalDay(now.getDate()),
  effectiveMonthYear: defaultMonthYear,
  partnerName: '',
  partnerAddress: '',
  fundingPackage: '',
  numberOfSlots: '',
  amountPaid: '',
  noticeAddress: '',
  mdDate: '',
  partnerSignName: '',
  partnerSignature: '',
  partnerSignDate: defaultDateStr,
  nokSignature: '',
  nokName: '',
  nokRelationship: '',
};

export const ORIGINAL_AGREEMENT_PDF_URL = '/assets/aistudio/SBH_CONTRACT_AGREEMENT__02a627d9.pdf';
export const AGREEMENT_IMAGE_WIDTH = 2318;
export const AGREEMENT_IMAGE_HEIGHT = 3000;

export const AGREEMENT_PAGE_IMAGES = [
  '/assets/aistudio/sbh_agreement_page1.jpg',
  '/assets/aistudio/sbh_agreement_page2.jpg',
  '/assets/aistudio/sbh_agreement_page3.jpg',
  '/assets/aistudio/sbh_agreement_page4.jpg',
  '/assets/aistudio/sbh_agreement_page5.jpg',
  '/assets/aistudio/sbh_agreement_page6.jpg',
];

/**
 * Maps pixel coordinates from the 2318x3000 image space to the PDF's 595x842 pt page space.
 * The original content stream places /X1 at cm [595 0 0 770.06042 0 35.96979].
 */
export const toAgreementPdfCoord = (x: number, y: number, w: number = 0, h: number = 0) => {
  const pdfX = (x / AGREEMENT_IMAGE_WIDTH) * 595;
  const pdfW = (w / AGREEMENT_IMAGE_WIDTH) * 595;
  const pdfH = (h / AGREEMENT_IMAGE_HEIGHT) * 770.06042;
  const pdfY = 35.96979 + (1 - (y + h) / AGREEMENT_IMAGE_HEIGHT) * 770.06042;
  return { x: pdfX, y: pdfY, width: pdfW, height: pdfH };
};

/**
 * Loads the 6-page original SBH Joint-Venture Farming Agreement PDF and overlays
 * AcroForm fields & inked values onto Pages 1, 2, and 6 while keeping all 6 pages intact.
 */
export async function generateCompletedAgreementPDF(
  data: AgreementFormData,
  options: { flatten?: boolean } = {}
): Promise<Uint8Array> {
  const response = await fetch(ORIGINAL_AGREEMENT_PDF_URL);
  if (!response.ok) {
    throw new Error('Failed to load the original SBH Joint-Venture Agreement PDF template.');
  }

  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page1 = pdfDoc.getPage(0);
  const page2 = pdfDoc.getPage(1);
  const page6 = pdfDoc.getPage(5);

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
  const form = pdfDoc.getForm();
  const inkColor = rgb(0.05, 0.12, 0.38);

  const drawTextOnPage = (
    page: ReturnType<typeof pdfDoc.getPage>,
    text: string,
    x: number,
    y: number,
    w: number,
    h: number,
    size = 9,
    useItalic = false
  ) => {
    if (!text) return;
    const pos = toAgreementPdfCoord(x, y, w, h);
    page.drawText(String(text), {
      x: pos.x + 2,
      y: pos.y + 3,
      size,
      font: useItalic ? italicFont : boldFont,
      color: inkColor,
      maxWidth: pos.width - 4,
    });
  };

  const addAcroField = (
    page: ReturnType<typeof pdfDoc.getPage>,
    name: string,
    value: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    try {
      const rect = toAgreementPdfCoord(x, y, w, h);
      const tf = form.createTextField(name);
      tf.setText(value || '');
      tf.addToPage(page, rect);
    } catch {
      // Ignore duplicate registration errors
    }
  };

  // Page 1 Fields
  drawTextOnPage(page1, data.effectiveDay, 250, 576, 156, 48, 9);
  addAcroField(page1, 'effectiveDay', data.effectiveDay, 250, 576, 156, 48);

  drawTextOnPage(page1, data.effectiveMonthYear, 576, 576, 769, 48, 9);
  addAcroField(page1, 'effectiveMonthYear', data.effectiveMonthYear, 576, 576, 769, 48);

  drawTextOnPage(page1, data.partnerName, 192, 1300, 1204, 49, 9.5);
  addAcroField(page1, 'partnerName', data.partnerName, 192, 1300, 1204, 49);

  drawTextOnPage(page1, data.partnerAddress, 244, 1370, 1908, 49, 8.5);
  addAcroField(page1, 'partnerAddress', data.partnerAddress, 244, 1370, 1908, 49);

  // Page 2 Fields (Clause 1.1 c)
  drawTextOnPage(page2, data.fundingPackage, 1014, 1064, 717, 48, 9);
  addAcroField(page2, 'fundingPackage', data.fundingPackage, 1014, 1064, 717, 48);

  drawTextOnPage(page2, data.numberOfSlots, 322, 1156, 530, 48, 9);
  addAcroField(page2, 'numberOfSlots', data.numberOfSlots, 322, 1156, 530, 48);

  drawTextOnPage(page2, data.amountPaid, 1201, 1156, 929, 48, 9);
  addAcroField(page2, 'amountPaid', data.amountPaid, 1201, 1156, 929, 48);

  // Page 6 Fields (Notices & Signatures)
  drawTextOnPage(page6, data.noticeAddress, 760, 822, 1380, 48, 8.5);
  addAcroField(page6, 'noticeAddress', data.noticeAddress, 760, 822, 1380, 48);

  drawTextOnPage(page6, data.mdDate, 742, 1844, 184, 48, 8.5);
  addAcroField(page6, 'mdDate', data.mdDate, 742, 1844, 184, 48);

  drawTextOnPage(page6, data.partnerSignName, 344, 2066, 1037, 48, 9);
  addAcroField(page6, 'partnerSignName', data.partnerSignName, 344, 2066, 1037, 48);

  drawTextOnPage(page6, data.partnerSignature, 619, 2158, 770, 48, 10, true);
  addAcroField(page6, 'partnerSignature', data.partnerSignature, 619, 2158, 770, 48);

  drawTextOnPage(page6, data.partnerSignDate, 318, 2250, 1061, 48, 9);
  addAcroField(page6, 'partnerSignDate', data.partnerSignDate, 318, 2250, 1061, 48);

  drawTextOnPage(page6, data.nokSignature, 619, 2474, 770, 48, 10, true);
  addAcroField(page6, 'nokSignature', data.nokSignature, 619, 2474, 770, 48);

  drawTextOnPage(page6, data.nokName, 344, 2564, 1037, 48, 9);
  addAcroField(page6, 'nokName', data.nokName, 344, 2564, 1037, 48);

  drawTextOnPage(page6, data.nokRelationship, 963, 2656, 424, 48, 8.5);
  addAcroField(page6, 'nokRelationship', data.nokRelationship, 963, 2656, 424, 48);

  if (options.flatten) {
    form.flatten();
  }

  return await pdfDoc.save();
}

/**
 * Triggers immediate browser download of the completed 6-page Agreement PDF.
 */
export async function downloadCompletedAgreementPDF(data: AgreementFormData, filename?: string) {
  const bytes = await generateCompletedAgreementPDF(data);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (data.partnerName || 'Partner').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = filename || `SBH_JOINT_VENTURE_AGREEMENT_${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

const cleanStr = (val: string, maxLen = 250) => String(val || '').trim().slice(0, maxLen);

/**
 * Save Joint-Venture Farming Agreement Submission to Firestore.
 */
export async function saveAgreementSubmission(uid: string | null, data: AgreementFormData) {
  const submissionPayload = {
    uid: uid || 'anonymous',
    effectiveDay: cleanStr(data.effectiveDay, 40),
    effectiveMonthYear: cleanStr(data.effectiveMonthYear, 80),
    partnerName: cleanStr(data.partnerName, 150),
    partnerAddress: cleanStr(data.partnerAddress, 300),
    fundingPackage: cleanStr(data.fundingPackage, 120),
    numberOfSlots: cleanStr(data.numberOfSlots, 40),
    amountPaid: cleanStr(data.amountPaid, 80),
    noticeAddress: cleanStr(data.noticeAddress, 300),
    mdDate: cleanStr(data.mdDate, 50),
    partnerSignName: cleanStr(data.partnerSignName, 150),
    partnerSignature: cleanStr(data.partnerSignature, 150),
    partnerSignDate: cleanStr(data.partnerSignDate, 50),
    nokSignature: cleanStr(data.nokSignature, 150),
    nokName: cleanStr(data.nokName, 150),
    nokRelationship: cleanStr(data.nokRelationship, 80),
    status: 'submitted',
    submittedAt: Timestamp.now(),
  };

  if (!uid) {
    // Allow guest completion during guest KYC preview while returning a local submission reference
    return {
      id: `LOCAL-${Date.now().toString(36).toUpperCase()}`,
      ...submissionPayload,
    };
  }

  let docRef;
  try {
    docRef = await addDoc(collection(db, 'agreementSubmissions'), submissionPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'agreementSubmissions');
    throw error;
  }

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        agreementCompleted: true,
        agreementSubmissionId: docRef.id,
        agreementSubmittedAt: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not update user agreementCompleted flag:', error);
  }

  return { id: docRef.id, ...submissionPayload };
}

/**
 * Fetch existing Agreement submission for user if available.
 */
export async function fetchUserAgreementSubmission(uid: string): Promise<AgreementFormData | null> {
  try {
    const q = query(collection(db, 'agreementSubmissions'), where('uid', '==', uid));
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
        ...initialAgreementFormData,
        ...d,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Agreement submission:', error);
    return null;
  }
}
