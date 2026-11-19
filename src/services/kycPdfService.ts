import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { db, collection, addDoc, doc, setDoc, getDocs, query, where, Timestamp } from '../firebase';

export interface KycFormData {
  // 1.1 Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | '';
  nationality: string;
  identificationType: 'Passport' | 'National ID' | "Driver's License" | '';
  identificationNumber: string;
  idExpiryDate: string;
  issuingCountry: string;

  // 1.2 Contact Information
  residentialAddress: string;
  city: string;
  stateProvince: string;
  country: string;
  email: string;
  phoneNumber: string;
  postalCode: string;

  // 1.3 Employment/Business Information
  occupation: string;
  employerBusinessName: string;
  natureOfBusiness: string;
  sourceOfIncome: {
    employment: boolean;
    business: boolean;
    inheritance: boolean;
    investment: boolean;
    other: boolean;
    otherSpecify: string;
  };
  annualIncomeRange: 'N500k-N1m' | 'N2m-N5m' | 'N6m-N10m' | 'N11m-N20m' | 'N21m-N50m' | 'N51m+' | '';

  // 2.1 Investment Information
  investmentPurpose: string;
  expectedReturnAmount: string;
  expectedFrequency: 'One-time' | 'Biannual' | 'Annually' | 'Other' | '';
  expectedFrequencyOther: string;

  // 2.2 Source of Funds
  sourceOfFunds: {
    salary: boolean;
    businessRevenue: boolean;
    inheritance: boolean;
    investments: boolean;
    other: boolean;
    otherSpecify: string;
  };
  bankName: string;
  accountNumber: string;
  accountName: string;

  // 3.1 PEP Status
  isPEP: 'Yes' | 'No' | '';
  pepDetails: string;

  // 3.2 Declaration & Consent
  declarationFullName: string;
  signature: string;
  declarationDate: string;
}

export const initialKycFormData: KycFormData = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  nationality: 'Nigerian',
  identificationType: '',
  identificationNumber: '',
  idExpiryDate: '',
  issuingCountry: 'Nigeria',
  residentialAddress: '',
  city: '',
  stateProvince: '',
  country: 'Nigeria',
  email: '',
  phoneNumber: '',
  postalCode: '',
  occupation: '',
  employerBusinessName: '',
  natureOfBusiness: '',
  sourceOfIncome: {
    employment: false,
    business: false,
    inheritance: false,
    investment: false,
    other: false,
    otherSpecify: '',
  },
  annualIncomeRange: '',
  investmentPurpose: '',
  expectedReturnAmount: '',
  expectedFrequency: '',
  expectedFrequencyOther: '',
  sourceOfFunds: {
    salary: false,
    businessRevenue: false,
    inheritance: false,
    investments: false,
    other: false,
    otherSpecify: '',
  },
  bankName: '',
  accountNumber: '',
  accountName: '',
  isPEP: '',
  pepDetails: '',
  declarationFullName: '',
  signature: '',
  declarationDate: new Date().toLocaleDateString('en-GB'),
};

export const ORIGINAL_PDF_URL = '/assets/aistudio/SBH_KYC_FORM_25db60de.pdf';

/**
 * Helper to map coordinates from original 1080x1408 image space
 * to the PDF's 595x842 pt page coordinate system.
 */
export const toPdfCoord = (x: number, y: number, w: number = 0, h: number = 0) => {
  const pdfX = (x / 1080) * 595;
  const pdfW = (w / 1080) * 595;
  const pdfH = (h / 1408) * 775.70367;
  // In PDF coordinates, origin (0,0) is bottom-left. Image sits between y=33.148 and y=808.852.
  const pdfY = 33.14816 + (1 - (y + h) / 1408) * 775.70367;
  return { x: pdfX, y: pdfY, width: pdfW, height: pdfH };
};

/**
 * Loads the original PDF and creates an interactive fillable AcroForm PDF or filled PDF.
 */
export async function generateCompletedKycPDF(data: KycFormData, options: { flatten?: boolean } = {}): Promise<Uint8Array> {
  const response = await fetch(ORIGINAL_PDF_URL);
  if (!response.ok) {
    throw new Error('Failed to load the original SBH KYC PDF template.');
  }
  const existingPdfBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();

  // Dark authentic ink color (clean, dark navy/charcoal ink)
  const inkColor = rgb(0.05, 0.12, 0.38);

  // Helper to draw text onto the blank line
  const drawLineText = (text: string, x: number, y: number, size = 8.5) => {
    if (!text) return;
    const pos = toPdfCoord(x, y, 100, 15);
    page.drawText(String(text), {
      x: pos.x,
      y: pos.y + 2,
      size,
      font: boldFont,
      color: inkColor,
    });
  };

  // Helper to draw checkmark
  const drawCheck = (x: number, y: number) => {
    const pos = toPdfCoord(x, y, 14, 14);
    page.drawText('X', {
      x: pos.x + 1.5,
      y: pos.y + 1,
      size: 9.5,
      font: boldFont,
      color: inkColor,
    });
  };

  // Helper to register AcroForm text field
  const addAcroField = (name: string, value: string, x: number, y: number, w: number, h: number) => {
    try {
      const rect = toPdfCoord(x, y, w, h);
      const tf = form.createTextField(name);
      tf.setText(value || '');
      tf.addToPage(page, rect);
    } catch {
      // Ignore field creation collisions if any
    }
  };

  // Helper to register AcroForm checkbox
  const addAcroCheck = (name: string, isChecked: boolean, x: number, y: number) => {
    try {
      const rect = toPdfCoord(x, y, 14, 14);
      const cb = form.createCheckBox(name);
      if (isChecked) {
        cb.check();
      }
      cb.addToPage(page, rect);
    } catch {
      // Ignore
    }
  };

  // 1.1 Personal Information
  drawLineText(data.fullName, 236, 292);
  addAcroField('fullName', data.fullName, 231, 288, 472, 19);

  drawLineText(data.dateOfBirth, 840, 292);
  addAcroField('dateOfBirth', data.dateOfBirth, 825, 288, 195, 19);

  if (data.gender === 'Male') {
    drawCheck(254, 316);
    addAcroCheck('gender_male', true, 254, 316);
  } else if (data.gender === 'Female') {
    drawCheck(347, 316);
    addAcroCheck('gender_female', true, 347, 316);
  }

  drawLineText(data.nationality, 498, 321);
  addAcroField('nationality', data.nationality, 493, 317, 279, 18);

  if (data.identificationType === 'Passport') {
    drawCheck(385, 345);
    addAcroCheck('id_passport', true, 385, 345);
  } else if (data.identificationType === 'National ID') {
    drawCheck(515, 345);
    addAcroCheck('id_national_id', true, 515, 345);
  } else if (data.identificationType === "Driver's License") {
    drawCheck(688, 345);
    addAcroCheck('id_drivers_license', true, 688, 345);
  }

  drawLineText(data.identificationNumber, 336, 374);
  addAcroField('identificationNumber', data.identificationNumber, 331, 370, 215, 19);

  drawLineText(data.idExpiryDate, 665, 374);
  addAcroField('idExpiryDate', data.idExpiryDate, 660, 370, 108, 19);

  drawLineText(data.issuingCountry, 921, 374);
  addAcroField('issuingCountry', data.issuingCountry, 916, 370, 108, 19);

  // 1.2 Contact Information
  drawLineText(data.residentialAddress, 317, 423, 8);
  addAcroField('residentialAddress', data.residentialAddress, 312, 419, 707, 19);

  drawLineText(data.city, 182, 451);
  addAcroField('city', data.city, 177, 447, 236, 19);

  drawLineText(data.stateProvince, 559, 451);
  addAcroField('stateProvince', data.stateProvince, 554, 447, 204, 19);

  drawLineText(data.country, 849, 451);
  addAcroField('country', data.country, 844, 447, 183, 19);

  drawLineText(data.email, 196, 480);
  addAcroField('email', data.email, 191, 476, 301, 19);

  drawLineText(data.phoneNumber, 641, 480);
  addAcroField('phoneNumber', data.phoneNumber, 636, 476, 216, 19);

  drawLineText(data.postalCode, 975, 480);
  addAcroField('postalCode', data.postalCode, 970, 476, 54, 19);

  // 1.3 Employment/Business Information
  drawLineText(data.occupation, 353, 532);
  addAcroField('occupation', data.occupation, 348, 528, 236, 19);

  drawLineText(data.employerBusinessName, 828, 532);
  addAcroField('employerBusinessName', data.employerBusinessName, 823, 528, 205, 19);

  drawLineText(data.natureOfBusiness, 308, 561, 8);
  addAcroField('natureOfBusiness', data.natureOfBusiness, 303, 557, 718, 19);

  // Source of Income
  if (data.sourceOfIncome.employment) {
    drawCheck(294, 588);
    addAcroCheck('soi_employment', true, 294, 588);
  }
  if (data.sourceOfIncome.business) {
    drawCheck(434, 588);
    addAcroCheck('soi_business', true, 434, 588);
  }
  if (data.sourceOfIncome.inheritance) {
    drawCheck(539, 588);
    addAcroCheck('soi_inheritance', true, 539, 588);
  }
  if (data.sourceOfIncome.investment) {
    drawCheck(665, 588);
    addAcroCheck('soi_investment', true, 665, 588);
  }
  if (data.sourceOfIncome.other) {
    drawCheck(789, 588);
    addAcroCheck('soi_other', true, 789, 588);
  }
  if (data.sourceOfIncome.otherSpecify) {
    drawLineText(data.sourceOfIncome.otherSpecify, 876, 591, 8);
    addAcroField('soi_other_specify', data.sourceOfIncome.otherSpecify, 871, 588, 150, 19);
  }

  // Annual Income Range
  if (data.annualIncomeRange === 'N500k-N1m') {
    drawCheck(335, 617);
    addAcroCheck('income_500k_1m', true, 335, 617);
  } else if (data.annualIncomeRange === 'N2m-N5m') {
    drawCheck(568, 617);
    addAcroCheck('income_2m_5m', true, 568, 617);
  } else if (data.annualIncomeRange === 'N6m-N10m') {
    drawCheck(821, 617);
    addAcroCheck('income_6m_10m', true, 821, 617);
  } else if (data.annualIncomeRange === 'N11m-N20m') {
    drawCheck(248, 645);
    addAcroCheck('income_11m_20m', true, 248, 645);
  } else if (data.annualIncomeRange === 'N21m-N50m') {
    drawCheck(490, 645);
    addAcroCheck('income_21m_50m', true, 490, 645);
  } else if (data.annualIncomeRange === 'N51m+') {
    drawCheck(769, 645);
    addAcroCheck('income_51m_plus', true, 769, 645);
  }

  // 2.1 Investment Information
  drawLineText(data.investmentPurpose, 338, 763, 8);
  addAcroField('investmentPurpose', data.investmentPurpose, 333, 759, 204, 19);

  drawLineText(data.expectedReturnAmount, 919, 763);
  addAcroField('expectedReturnAmount', data.expectedReturnAmount, 914, 759, 108, 19);

  // Expected Frequency
  if (data.expectedFrequency === 'One-time') {
    drawCheck(441, 787);
    addAcroCheck('freq_onetime', true, 441, 787);
  } else if (data.expectedFrequency === 'Biannual') {
    drawCheck(551, 787);
    addAcroCheck('freq_biannual', true, 551, 787);
  } else if (data.expectedFrequency === 'Annually') {
    drawCheck(658, 787);
    addAcroCheck('freq_annually', true, 658, 787);
  } else if (data.expectedFrequency === 'Other') {
    drawCheck(766, 787);
    addAcroCheck('freq_other', true, 766, 787);
  }
  if (data.expectedFrequencyOther) {
    drawLineText(data.expectedFrequencyOther, 842, 790, 8);
    addAcroField('freq_other_specify', data.expectedFrequencyOther, 837, 787, 183, 19);
  }

  // 2.2 Source of Funds
  if (data.sourceOfFunds.salary) {
    drawCheck(397, 840);
    addAcroCheck('sof_salary', true, 397, 840);
  }
  if (data.sourceOfFunds.businessRevenue) {
    drawCheck(481, 840);
    addAcroCheck('sof_business_revenue', true, 481, 840);
  }
  if (data.sourceOfFunds.inheritance) {
    drawCheck(666, 840);
    addAcroCheck('sof_inheritance', true, 666, 840);
  }
  if (data.sourceOfFunds.investments) {
    drawCheck(792, 840);
    addAcroCheck('sof_investments', true, 792, 840);
  }
  if (data.sourceOfFunds.other) {
    drawCheck(924, 840);
    addAcroCheck('sof_other', true, 924, 840);
  }
  if (data.sourceOfFunds.otherSpecify) {
    drawLineText(data.sourceOfFunds.otherSpecify, 191, 868, 8);
    addAcroField('sof_other_specify', data.sourceOfFunds.otherSpecify, 186, 865, 836, 19);
  }

  drawLineText(data.bankName, 239, 893);
  addAcroField('bankName', data.bankName, 234, 889, 161, 19);

  drawLineText(data.accountNumber, 564, 893);
  addAcroField('accountNumber', data.accountNumber, 559, 889, 161, 19);

  drawLineText(data.accountName, 854, 893);
  addAcroField('accountName', data.accountName, 849, 889, 172, 19);

  // 3.1 PEP Status
  if (data.isPEP === 'Yes') {
    drawCheck(839, 991);
    addAcroCheck('pep_yes', true, 839, 991);
  } else if (data.isPEP === 'No') {
    drawCheck(922, 991);
    addAcroCheck('pep_no', true, 922, 991);
  }
  if (data.pepDetails) {
    drawLineText(data.pepDetails, 394, 1019, 8);
    addAcroField('pepDetails', data.pepDetails, 389, 1016, 622, 19);
  }

  // 3.2 Declaration & Consent
  drawLineText(data.declarationFullName, 87, 1070);
  addAcroField('declarationFullName', data.declarationFullName, 82, 1066, 536, 19);

  drawLineText(data.signature, 163, 1168, 9.5);
  addAcroField('signature', data.signature, 158, 1164, 257, 19);

  drawLineText(data.declarationDate, 635, 1168);
  addAcroField('declarationDate', data.declarationDate, 630, 1164, 300, 19);

  if (options.flatten) {
    form.flatten();
  }

  return await pdfDoc.save();
}

/**
 * Trigger immediate browser download of the completed KYC PDF
 */
export async function downloadCompletedKycPDF(data: KycFormData, filename?: string) {
  const bytes = await generateCompletedKycPDF(data);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (data.fullName || 'Investor').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = filename || `SBH_KYC_${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Save KYC Submission to Firestore
 */
export async function saveKycSubmission(uid: string | null, data: KycFormData) {
  const submissionPayload = {
    uid: uid || 'guest_' + Date.now(),
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    nationality: data.nationality,
    identificationType: data.identificationType,
    identificationNumber: data.identificationNumber,
    idExpiryDate: data.idExpiryDate,
    issuingCountry: data.issuingCountry,
    residentialAddress: data.residentialAddress,
    city: data.city,
    stateProvince: data.stateProvince,
    country: data.country,
    postalCode: data.postalCode,
    occupation: data.occupation,
    employerBusinessName: data.employerBusinessName,
    natureOfBusiness: data.natureOfBusiness,
    sourceOfIncome: data.sourceOfIncome,
    annualIncomeRange: data.annualIncomeRange,
    investmentPurpose: data.investmentPurpose,
    expectedReturnAmount: data.expectedReturnAmount,
    expectedFrequency: data.expectedFrequency,
    expectedFrequencyOther: data.expectedFrequencyOther,
    sourceOfFunds: data.sourceOfFunds,
    bankName: data.bankName,
    accountNumber: data.accountNumber,
    accountName: data.accountName,
    isPEP: data.isPEP,
    pepDetails: data.pepDetails,
    declarationFullName: data.declarationFullName,
    signature: data.signature,
    declarationDate: data.declarationDate,
    status: 'submitted',
    submittedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'kycSubmissions'), submissionPayload);

  // If user is authenticated, backfill KYC flag on their profile
  if (uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        kycCompleted: true,
        kycSubmissionId: docRef.id,
        kycSubmittedAt: Timestamp.now(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not update user kycCompleted flag:', e);
    }
  }

  return { id: docRef.id, ...submissionPayload };
}

/**
 * Fetch existing KYC submission for user if available
 */
export async function fetchUserKycSubmission(uid: string): Promise<KycFormData | null> {
  try {
    const q = query(
      collection(db, 'kycSubmissions'),
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0].data() as any;
      return {
        ...initialKycFormData,
        ...d,
        sourceOfIncome: { ...initialKycFormData.sourceOfIncome, ...(d.sourceOfIncome || {}) },
        sourceOfFunds: { ...initialKycFormData.sourceOfFunds, ...(d.sourceOfFunds || {}) },
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching KYC submission:', e);
    return null;
  }
}
