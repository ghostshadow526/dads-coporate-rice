import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import { 
  KycFormData, 
  initialKycFormData, 
  ORIGINAL_PDF_URL, 
  downloadCompletedKycPDF, 
  saveKycSubmission,
  fetchUserKycSubmission
} from '../services/kycPdfService';
import AgreementPopupModal from '../components/AgreementPopupModal';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Send, 
  Eye, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Info,
  Maximize2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface KycProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
}

export default function Kyc({ user, profile }: KycProps) {
  const [formData, setFormData] = useState<KycFormData>(initialKycFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; submittedAt: Date } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 85% to 150%
  const [activeField, setActiveField] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAgreementPopup, setShowAgreementPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true' || searchParams.get('flow') === 'onboarding';
  const navigate = useNavigate();
  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Auto-populate known fields from logged-in user profile if fields are empty
  useEffect(() => {
    if (user) {
      setLoadingExisting(true);
      fetchUserKycSubmission(user.uid)
        .then((existing) => {
          if (existing) {
            setFormData(existing);
            toast.info('Loaded your previously submitted KYC information. You can review or update it anytime.');
          } else if (profile) {
            setFormData((prev) => ({
              ...prev,
              fullName: prev.fullName || profile.displayName || '',
              email: prev.email || profile.email || user.email || '',
              phoneNumber: prev.phoneNumber || profile.phoneNumber || '',
              residentialAddress: prev.residentialAddress || profile.address || '',
              city: prev.city || profile.city || '',
              stateProvince: prev.stateProvince || profile.state || '',
              declarationFullName: prev.declarationFullName || profile.displayName || '',
              signature: prev.signature || profile.displayName || '',
            }));
          }
        })
        .finally(() => setLoadingExisting(false));
    }
  }, [user, profile]);

  // Keep declaration full name synced with full name if not manually modified
  const handleFullNameChange = (val: string) => {
    setFormData((prev) => {
      const shouldSyncDeclaration = !prev.declarationFullName || prev.declarationFullName === prev.fullName;
      const shouldSyncSignature = !prev.signature || prev.signature === prev.fullName;
      return {
        ...prev,
        fullName: val,
        declarationFullName: shouldSyncDeclaration ? val : prev.declarationFullName,
        signature: shouldSyncSignature ? val : prev.signature,
      };
    });
  };

  // Field change helper
  const handleChange = (field: keyof KycFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle nested checkbox helpers
  const handleSourceOfIncomeToggle = (key: keyof KycFormData['sourceOfIncome']) => {
    setFormData((prev) => ({
      ...prev,
      sourceOfIncome: {
        ...prev.sourceOfIncome,
        [key]: !prev.sourceOfIncome[key],
      },
    }));
  };

  const handleSourceOfFundsToggle = (key: keyof KycFormData['sourceOfFunds']) => {
    setFormData((prev) => ({
      ...prev,
      sourceOfFunds: {
        ...prev.sourceOfFunds,
        [key]: !prev.sourceOfFunds[key],
      },
    }));
  };

  // Validate required fields
  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!formData.fullName.trim()) errors.push('Full Name is required');
    if (!formData.dateOfBirth.trim()) errors.push('Date of Birth is required');
    if (!formData.gender) errors.push('Gender selection is required');
    if (!formData.nationality.trim()) errors.push('Nationality is required');
    if (!formData.identificationType) errors.push('Identification Type is required');
    if (!formData.identificationNumber.trim()) errors.push('Identification Number is required');
    if (!formData.residentialAddress.trim()) errors.push('Residential Address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.country.trim()) errors.push('Country is required');
    if (!formData.email.trim() || !formData.email.includes('@')) errors.push('Valid Email is required');
    if (!formData.phoneNumber.trim()) errors.push('Phone Number is required');
    if (!formData.occupation.trim()) errors.push('Occupation/Designation is required');
    if (!formData.natureOfBusiness.trim()) errors.push('Nature of Business is required');
    if (!formData.annualIncomeRange) errors.push('Annual Income Range is required');
    if (!formData.bankName.trim()) errors.push('Bank Name is required');
    if (!formData.accountNumber.trim()) errors.push('Account Number is required');
    if (!formData.accountName.trim()) errors.push('Account Name is required');
    if (!formData.isPEP) errors.push('Politically Exposed Person (PEP) status selection is required');
    if (formData.isPEP === 'Yes' && !formData.pepDetails.trim()) errors.push('Please provide PEP details');
    if (!formData.declarationFullName.trim()) errors.push('Declaration Full Name is required');
    if (!formData.signature.trim()) errors.push('Typed signature is required in the declaration');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Submit KYC Document
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Please complete all required fields highlighted on the document.');
      return;
    }

    setSubmitting(true);
    try {
      const submission = await saveKycSubmission(user ? user.uid : null, formData);
      setSubmittedData({
        id: submission.id,
        submittedAt: new Date(),
      });
      setShowAgreementPopup(true);
      toast.success('KYC submitted! Please complete and sign your Joint-Venture Farming Agreement.');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit KYC form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Download filled PDF
  const handleDownload = async () => {
    try {
      toast.loading('Generating your official KYC PDF...', { id: 'pdf-gen' });
      await downloadCompletedKycPDF(formData);
      toast.success('Official KYC PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (error: any) {
      console.error('PDF error:', error);
      toast.error('Failed to generate PDF: ' + (error.message || 'Unknown error'), { id: 'pdf-gen' });
    }
  };

  // Download blank template
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = ORIGINAL_PDF_URL;
    link.download = 'SBH_KYC_BLANK_FORM.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate completed count
  const requiredCount = 18;
  let completedCount = 0;
  if (formData.fullName.trim()) completedCount++;
  if (formData.dateOfBirth.trim()) completedCount++;
  if (formData.gender) completedCount++;
  if (formData.nationality.trim()) completedCount++;
  if (formData.identificationType) completedCount++;
  if (formData.identificationNumber.trim()) completedCount++;
  if (formData.residentialAddress.trim()) completedCount++;
  if (formData.city.trim()) completedCount++;
  if (formData.country.trim()) completedCount++;
  if (formData.email.trim()) completedCount++;
  if (formData.phoneNumber.trim()) completedCount++;
  if (formData.occupation.trim()) completedCount++;
  if (formData.natureOfBusiness.trim()) completedCount++;
  if (formData.annualIncomeRange) completedCount++;
  if (formData.bankName.trim()) completedCount++;
  if (formData.accountNumber.trim()) completedCount++;
  if (formData.accountName.trim()) completedCount++;
  if (formData.isPEP) completedCount++;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pt-20">
      {/* Top Banner & Control Bar */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 sticky top-16 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title & Trust Badges */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-white flex items-center gap-2">
                    Official SBH KYC Document
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    <ShieldCheck className="w-3 h-3" /> Digitally Fillable
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Salvage Biz-Hub Nig Ltd • RC: 1840192 • Complete directly on the original document below
                </p>
              </div>
            </div>

            {/* Actions & Toolbar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-300 font-bold min-w-[42px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 15))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Tracker */}
              <div className="hidden xl:flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
                <div className="w-20 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-brand-orange h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (completedCount / requiredCount) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-300">
                  {completedCount}/{requiredCount}
                </span>
              </div>

              {/* Download Filled PDF */}
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Download PDF</span>
              </button>

              {/* Submit KYC Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-green-900/30 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Completed Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-6 flex flex-col items-center">
        {/* Four-Step Onboarding Flow Strip */}
        <div className="w-full max-w-5xl mb-4 bg-slate-800/80 border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <Link
              to={isOnboarding ? '/contract?onboarding=true' : '/contract'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold transition-colors"
            >
              1. Contract Form
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-orange text-white font-bold">
              2. KYC Form
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to="/agreement"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-colors"
            >
              3. JV Agreement
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to="/certificate"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-colors"
            >
              4. Certificate
            </Link>
          </div>
          <span className="text-[11px] text-slate-400">
            {isOnboarding
              ? 'Step 2 of 4: Submit KYC to open Agreement & Certificate.'
              : 'Form 2 of 4 • Complete directly on the original SBH KYC document.'}
          </span>
        </div>

        {/* User Login Guidance */}
        {!user && (
          <div className="w-full max-w-4xl mb-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                You are currently completing this document as a guest. You can still fill, submit and download your KYC PDF now, or log in to link it to your account.
              </span>
            </div>
            <Link
              to="/login"
              className="ml-4 shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Validation Errors Notice if any */}
        {validationErrors.length > 0 && (
          <div className="w-full max-w-4xl mb-4 bg-red-950/60 border border-red-500/40 rounded-2xl p-4 text-xs text-red-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Please complete the following required fields before final submission:</p>
              <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-red-300">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Scrollable Document Canvas Wrapper */}
        <div 
          className="w-full overflow-x-auto flex justify-center py-2 px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Document Container: Standard A4 Aspect Ratio 1080 / 1408 = 0.76704 */}
          <div 
            ref={documentContainerRef}
            className="relative bg-white text-black shadow-2xl rounded-sm transition-transform duration-200 origin-top select-text"
            style={{
              width: `${(850 * zoomLevel) / 100}px`,
              minWidth: `${(850 * zoomLevel) / 100}px`,
              aspectRatio: '1080 / 1408',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* The Authentic Original Document Image Background */}
            <img 
              src="/assets/aistudio/sbh_kyc_page1.jpg"
              alt="Salvage Biz-Hub Nig Ltd Original KYC Form"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />

            {/* Interactive Form Fields Overlay */}
            <div className="absolute inset-0 w-full h-full">
              {/* SECTION 1: INVESTOR DETAILS */}

              {/* 1.1 Full Name */}
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                onFocus={() => setActiveField('fullName')}
                onBlur={() => setActiveField(null)}
                placeholder="Enter your full legal name"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'fullName' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '21.39%',
                  top: '20.25%',
                  width: '43.70%',
                  height: '1.60%',
                }}
              />

              {/* 1.1 Date of Birth */}
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                onFocus={() => setActiveField('dateOfBirth')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'dateOfBirth' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '76.39%',
                  top: '20.25%',
                  width: '18.52%',
                  height: '1.60%',
                }}
              />

              {/* 1.1 Gender Checkboxes */}
              {/* Male */}
              <button
                type="button"
                onClick={() => handleChange('gender', formData.gender === 'Male' ? '' : 'Male')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '23.40%',
                  top: '22.35%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Select Male"
              >
                {formData.gender === 'Male' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Female */}
              <button
                type="button"
                onClick={() => handleChange('gender', formData.gender === 'Female' ? '' : 'Female')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '32.00%',
                  top: '22.35%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Select Female"
              >
                {formData.gender === 'Female' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* 1.1 Nationality */}
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                onFocus={() => setActiveField('nationality')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. Nigerian"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'nationality' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '45.65%',
                  top: '22.35%',
                  width: '25.93%',
                  height: '1.55%',
                }}
              />

              {/* 1.1 Identification Type Checkboxes */}
              {/* Passport */}
              <button
                type="button"
                onClick={() => handleChange('identificationType', formData.identificationType === 'Passport' ? '' : 'Passport')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '35.55%',
                  top: '24.40%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Select Passport"
              >
                {formData.identificationType === 'Passport' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* National ID */}
              <button
                type="button"
                onClick={() => handleChange('identificationType', formData.identificationType === 'National ID' ? '' : 'National ID')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '47.55%',
                  top: '24.40%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Select National ID"
              >
                {formData.identificationType === 'National ID' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Driver's License */}
              <button
                type="button"
                onClick={() => handleChange('identificationType', formData.identificationType === "Driver's License" ? '' : "Driver's License")}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '63.60%',
                  top: '24.40%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Select Driver's License"
              >
                {formData.identificationType === "Driver's License" && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* 1.1 Identification Number */}
              <input
                type="text"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={(e) => handleChange('identificationNumber', e.target.value)}
                onFocus={() => setActiveField('identificationNumber')}
                onBlur={() => setActiveField(null)}
                placeholder="ID / NIN / Driver's Lic #"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'identificationNumber' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '30.65%',
                  top: '26.10%',
                  width: '19.91%',
                  height: '1.55%',
                }}
              />

              {/* 1.1 Expiry Date */}
              <input
                type="text"
                name="idExpiryDate"
                value={formData.idExpiryDate}
                onChange={(e) => handleChange('idExpiryDate', e.target.value)}
                onFocus={() => setActiveField('idExpiryDate')}
                onBlur={() => setActiveField(null)}
                placeholder="MM/YYYY or N/A"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'idExpiryDate' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '61.11%',
                  top: '26.10%',
                  width: '10.00%',
                  height: '1.55%',
                }}
              />

              {/* 1.1 Issuing Country */}
              <input
                type="text"
                name="issuingCountry"
                value={formData.issuingCountry}
                onChange={(e) => handleChange('issuingCountry', e.target.value)}
                onFocus={() => setActiveField('issuingCountry')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. Nigeria"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'issuingCountry' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '84.81%',
                  top: '26.10%',
                  width: '10.00%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 Residential Address */}
              <input
                type="text"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={(e) => handleChange('residentialAddress', e.target.value)}
                onFocus={() => setActiveField('residentialAddress')}
                onBlur={() => setActiveField(null)}
                placeholder="Street address, apartment or estate"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'residentialAddress' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '28.89%',
                  top: '29.55%',
                  width: '65.46%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 City */}
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onFocus={() => setActiveField('city')}
                onBlur={() => setActiveField(null)}
                placeholder="City"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'city' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '16.39%',
                  top: '31.55%',
                  width: '21.85%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 State/Province */}
              <input
                type="text"
                name="stateProvince"
                value={formData.stateProvince}
                onChange={(e) => handleChange('stateProvince', e.target.value)}
                onFocus={() => setActiveField('stateProvince')}
                onBlur={() => setActiveField(null)}
                placeholder="State / Province"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'stateProvince' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '51.30%',
                  top: '31.55%',
                  width: '18.89%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 Country */}
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                onFocus={() => setActiveField('country')}
                onBlur={() => setActiveField(null)}
                placeholder="Country"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'country' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '78.15%',
                  top: '31.55%',
                  width: '16.94%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
                placeholder="investor@example.com"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'email' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '17.69%',
                  top: '33.60%',
                  width: '27.87%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 Phone Number */}
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                onFocus={() => setActiveField('phoneNumber')}
                onBlur={() => setActiveField(null)}
                placeholder="+234 ..."
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'phoneNumber' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '58.89%',
                  top: '33.60%',
                  width: '20.00%',
                  height: '1.55%',
                }}
              />

              {/* 1.2 Postal Code */}
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                onFocus={() => setActiveField('postalCode')}
                onBlur={() => setActiveField(null)}
                placeholder="Code"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'postalCode' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '89.81%',
                  top: '33.60%',
                  width: '5.00%',
                  height: '1.55%',
                }}
              />

              {/* 1.3 Occupation/Designation */}
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                onFocus={() => setActiveField('occupation')}
                onBlur={() => setActiveField(null)}
                placeholder="Occupation / Designation"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'occupation' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '32.22%',
                  top: '37.30%',
                  width: '21.85%',
                  height: '1.55%',
                }}
              />

              {/* 1.3 Employer/Business Name */}
              <input
                type="text"
                name="employerBusinessName"
                value={formData.employerBusinessName}
                onChange={(e) => handleChange('employerBusinessName', e.target.value)}
                onFocus={() => setActiveField('employerBusinessName')}
                onBlur={() => setActiveField(null)}
                placeholder="Employer or Business Name"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'employerBusinessName' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '76.20%',
                  top: '37.30%',
                  width: '18.98%',
                  height: '1.55%',
                }}
              />

              {/* 1.3 Nature of Business */}
              <input
                type="text"
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={(e) => handleChange('natureOfBusiness', e.target.value)}
                onFocus={() => setActiveField('natureOfBusiness')}
                onBlur={() => setActiveField(null)}
                placeholder="Describe your sector / industry / business activities"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'natureOfBusiness' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '28.06%',
                  top: '39.35%',
                  width: '66.48%',
                  height: '1.55%',
                }}
              />

              {/* 1.3 Source of Income Checkboxes */}
              {/* Employment */}
              <button
                type="button"
                onClick={() => handleSourceOfIncomeToggle('employment')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '27.15%',
                  top: '41.65%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Employment"
              >
                {formData.sourceOfIncome.employment && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Business */}
              <button
                type="button"
                onClick={() => handleSourceOfIncomeToggle('business')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '40.10%',
                  top: '41.65%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Business"
              >
                {formData.sourceOfIncome.business && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Inheritance */}
              <button
                type="button"
                onClick={() => handleSourceOfIncomeToggle('inheritance')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '49.80%',
                  top: '41.65%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Inheritance"
              >
                {formData.sourceOfIncome.inheritance && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Investment */}
              <button
                type="button"
                onClick={() => handleSourceOfIncomeToggle('investment')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '61.45%',
                  top: '41.65%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Investment"
              >
                {formData.sourceOfIncome.investment && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Other */}
              <button
                type="button"
                onClick={() => handleSourceOfIncomeToggle('other')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '72.95%',
                  top: '41.65%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Other"
              >
                {formData.sourceOfIncome.other && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Other specify text */}
              <input
                type="text"
                name="sourceOfIncomeOther"
                value={formData.sourceOfIncome.otherSpecify}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  sourceOfIncome: { ...prev.sourceOfIncome, other: true, otherSpecify: e.target.value }
                }))}
                onFocus={() => setActiveField('sourceOfIncomeOther')}
                onBlur={() => setActiveField(null)}
                placeholder="Specify if other"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'sourceOfIncomeOther' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '80.65%',
                  top: '41.55%',
                  width: '13.89%',
                  height: '1.55%',
                }}
              />

              {/* 1.3 Annual Income Range Checkboxes */}
              {/* N500,000 - N1,000,000 */}
              <button
                type="button"
                onClick={() => handleChange('annualIncomeRange', formData.annualIncomeRange === 'N500k-N1m' ? '' : 'N500k-N1m')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '30.95%',
                  top: '43.75%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="N500,000 - N1,000,000"
              >
                {formData.annualIncomeRange === 'N500k-N1m' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* N2,000,000 – N5,000,000 */}
              <button
                type="button"
                onClick={() => handleChange('annualIncomeRange', formData.annualIncomeRange === 'N2m-N5m' ? '' : 'N2m-N5m')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '52.50%',
                  top: '43.75%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="N2,000,000 – N5,000,000"
              >
                {formData.annualIncomeRange === 'N2m-N5m' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* N6,000,000 – N10,000,000 */}
              <button
                type="button"
                onClick={() => handleChange('annualIncomeRange', formData.annualIncomeRange === 'N6m-N10m' ? '' : 'N6m-N10m')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '75.95%',
                  top: '43.75%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="N6,000,000 – N10,000,000"
              >
                {formData.annualIncomeRange === 'N6m-N10m' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* N11,000,000 – N20,000,000 */}
              <button
                type="button"
                onClick={() => handleChange('annualIncomeRange', formData.annualIncomeRange === 'N11m-N20m' ? '' : 'N11m-N20m')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '22.88%',
                  top: '45.75%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="N11,000,000 – N20,000,000"
              >
                {formData.annualIncomeRange === 'N11m-N20m' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* 21,000,000- N50,000,000 */}
              <button
                type="button"
                onClick={() => handleChange('annualIncomeRange', formData.annualIncomeRange === 'N21m-N50m' ? '' : 'N21m-N50m')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '45.20%',
                  top: '45.75%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="21,000,000- N50,000,000"
              >
                {formData.annualIncomeRange === 'N21m-N50m' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* N51,000,000 and above */}
              <button
                type="button"
                onClick={() => handleChange('annualIncomeRange', formData.annualIncomeRange === 'N51m+' ? '' : 'N51m+')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '71.10%',
                  top: '45.75%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="N51,000,000 and above"
              >
                {formData.annualIncomeRange === 'N51m+' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* SECTION 2: INVESTMENT DETAILS */}

              {/* 2.1 Purpose of Investment */}
              <input
                type="text"
                name="investmentPurpose"
                value={formData.investmentPurpose}
                onChange={(e) => handleChange('investmentPurpose', e.target.value)}
                onFocus={() => setActiveField('investmentPurpose')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. Wealth growth, Paddy rice production"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'investmentPurpose' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '30.83%',
                  top: '53.70%',
                  width: '18.89%',
                  height: '1.55%',
                }}
              />

              {/* 2.1 Expected Return on Investment Amount */}
              <input
                type="text"
                name="expectedReturnAmount"
                value={formData.expectedReturnAmount}
                onChange={(e) => handleChange('expectedReturnAmount', e.target.value)}
                onFocus={() => setActiveField('expectedReturnAmount')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 1,500,000"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'expectedReturnAmount' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '84.63%',
                  top: '53.70%',
                  width: '10.00%',
                  height: '1.55%',
                }}
              />

              {/* 2.1 Expected Frequency Checkboxes */}
              {/* One-time */}
              <button
                type="button"
                onClick={() => handleChange('expectedFrequency', formData.expectedFrequency === 'One-time' ? '' : 'One-time')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '40.75%',
                  top: '55.80%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="One-time"
              >
                {formData.expectedFrequency === 'One-time' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Biannual */}
              <button
                type="button"
                onClick={() => handleChange('expectedFrequency', formData.expectedFrequency === 'Biannual' ? '' : 'Biannual')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '50.95%',
                  top: '55.80%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Biannual"
              >
                {formData.expectedFrequency === 'Biannual' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Annually */}
              <button
                type="button"
                onClick={() => handleChange('expectedFrequency', formData.expectedFrequency === 'Annually' ? '' : 'Annually')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '60.85%',
                  top: '55.80%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Annually"
              >
                {formData.expectedFrequency === 'Annually' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Other */}
              <button
                type="button"
                onClick={() => handleChange('expectedFrequency', formData.expectedFrequency === 'Other' ? '' : 'Other')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '70.85%',
                  top: '55.80%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Other"
              >
                {formData.expectedFrequency === 'Other' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Frequency other specify */}
              <input
                type="text"
                name="expectedFrequencyOther"
                value={formData.expectedFrequencyOther}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  expectedFrequency: 'Other',
                  expectedFrequencyOther: e.target.value,
                }))}
                onFocus={() => setActiveField('expectedFrequencyOther')}
                onBlur={() => setActiveField(null)}
                placeholder="Specify frequency"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'expectedFrequencyOther' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '77.50%',
                  top: '55.70%',
                  width: '16.94%',
                  height: '1.55%',
                }}
              />

              {/* 2.2 Source of Funds Checkboxes */}
              {/* Salary */}
              <button
                type="button"
                onClick={() => handleSourceOfFundsToggle('salary')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '36.70%',
                  top: '59.60%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Salary"
              >
                {formData.sourceOfFunds.salary && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Business Revenue */}
              <button
                type="button"
                onClick={() => handleSourceOfFundsToggle('businessRevenue')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '44.45%',
                  top: '59.60%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Business Revenue"
              >
                {formData.sourceOfFunds.businessRevenue && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Inheritance */}
              <button
                type="button"
                onClick={() => handleSourceOfFundsToggle('inheritance')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '61.60%',
                  top: '59.60%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Inheritance"
              >
                {formData.sourceOfFunds.inheritance && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Investments */}
              <button
                type="button"
                onClick={() => handleSourceOfFundsToggle('investments')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '73.25%',
                  top: '59.60%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Investments"
              >
                {formData.sourceOfFunds.investments && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Other */}
              <button
                type="button"
                onClick={() => handleSourceOfFundsToggle('other')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '85.50%',
                  top: '59.60%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="Other(s)"
              >
                {formData.sourceOfFunds.other && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Source of funds other specify line */}
              <input
                type="text"
                name="sourceOfFundsOther"
                value={formData.sourceOfFunds.otherSpecify}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  sourceOfFunds: { ...prev.sourceOfFunds, other: true, otherSpecify: e.target.value },
                }))}
                onFocus={() => setActiveField('sourceOfFundsOther')}
                onBlur={() => setActiveField(null)}
                placeholder="Specify other sources of funds"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'sourceOfFundsOther' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '17.22%',
                  top: '61.20%',
                  width: '77.41%',
                  height: '1.55%',
                }}
              />

              {/* 2.2 Bank Name */}
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                onFocus={() => setActiveField('bankName')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. GTBank / Access / Zenith"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'bankName' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '21.67%',
                  top: '62.90%',
                  width: '14.91%',
                  height: '1.55%',
                }}
              />

              {/* 2.2 Account Number */}
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                onFocus={() => setActiveField('accountNumber')}
                onBlur={() => setActiveField(null)}
                placeholder="10-digit NUBAN"
                maxLength={10}
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'accountNumber' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '51.76%',
                  top: '62.90%',
                  width: '14.91%',
                  height: '1.55%',
                }}
              />

              {/* 2.2 Account Name */}
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={(e) => handleChange('accountName', e.target.value)}
                onFocus={() => setActiveField('accountName')}
                onBlur={() => setActiveField(null)}
                placeholder="Name on bank account"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'accountName' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '78.61%',
                  top: '62.90%',
                  width: '15.93%',
                  height: '1.55%',
                }}
              />

              {/* SECTION 3: COMPLIANCE & DECLARATION */}

              {/* 3.1 PEP Checkboxes */}
              {/* Yes */}
              <button
                type="button"
                onClick={() => handleChange('isPEP', formData.isPEP === 'Yes' ? '' : 'Yes')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '77.60%',
                  top: '70.30%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="PEP Yes"
              >
                {formData.isPEP === 'Yes' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* No */}
              <button
                type="button"
                onClick={() => handleChange('isPEP', formData.isPEP === 'No' ? '' : 'No')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{
                  left: '85.30%',
                  top: '70.30%',
                  width: '1.50%',
                  height: '1.20%',
                }}
                title="PEP No"
              >
                {formData.isPEP === 'No' && (
                  <span className="text-[#071330] font-black text-[12px] sm:text-[14px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* 3.1 PEP Details Line */}
              <input
                type="text"
                name="pepDetails"
                value={formData.pepDetails}
                onChange={(e) => handleChange('pepDetails', e.target.value)}
                onFocus={() => setActiveField('pepDetails')}
                onBlur={() => setActiveField(null)}
                placeholder="If Yes, state official public role / family connection"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'pepDetails' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '36.02%',
                  top: '71.95%',
                  width: '57.59%',
                  height: '1.55%',
                }}
              />

              {/* 3.2 Declaration Full Name */}
              <input
                type="text"
                name="declarationFullName"
                value={formData.declarationFullName}
                onChange={(e) => handleChange('declarationFullName', e.target.value)}
                onFocus={() => setActiveField('declarationFullName')}
                onBlur={() => setActiveField(null)}
                placeholder="Full Legal Name"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'declarationFullName' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '7.59%',
                  top: '75.50%',
                  width: '49.63%',
                  height: '1.55%',
                }}
              />

              {/* 3.2 Typed Signature */}
              <input
                type="text"
                name="signature"
                value={formData.signature}
                onChange={(e) => handleChange('signature', e.target.value)}
                onFocus={() => setActiveField('signature')}
                onBlur={() => setActiveField(null)}
                placeholder="Type your signature name"
                className={`absolute text-[#071330] font-bold italic font-serif text-[12px] sm:text-[14px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'signature' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '14.63%',
                  top: '82.45%',
                  width: '23.80%',
                  height: '1.55%',
                }}
              />

              {/* 3.2 Date */}
              <input
                type="text"
                name="declarationDate"
                value={formData.declarationDate}
                onChange={(e) => handleChange('declarationDate', e.target.value)}
                onFocus={() => setActiveField('declarationDate')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={`absolute text-[#071330] font-semibold text-[11px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
                  activeField === 'declarationDate' 
                    ? 'bg-blue-50/70 ring-2 ring-blue-500 shadow-sm' 
                    : 'hover:bg-blue-50/30'
                }`}
                style={{
                  left: '58.33%',
                  top: '82.45%',
                  width: '27.78%',
                  height: '1.55%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Submission Action Bar */}
        <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-3 text-xs text-slate-300">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white">256-Bit Encrypted Compliance Record</p>
              <p className="text-slate-400">All submissions are archived securely in accordance with Nigerian regulatory requirements.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-white/10"
            >
              <Download className="w-4 h-4 text-brand-yellow" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-950/40 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit KYC Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide mb-2">
                KYC Document Submitted!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Thank you, <strong className="text-white">{formData.fullName}</strong>. Your original Salvage Biz-Hub Nig Ltd KYC document has been securely processed and archived with ID <span className="font-mono text-emerald-400 font-bold">{submittedData?.id || 'COMPLETED'}</span>.
              </p>

              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Investor:</span>
                  <span className="font-bold text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">ID Document:</span>
                  <span className="text-white">{formData.identificationType} ({formData.identificationNumber})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Submission Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Compliance Status:</span>
                  <span className="font-bold text-emerald-400">Submitted & Verified</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowAgreementPopup(true);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <span>Open Joint-Venture Agreement (Step 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange/90 hover:to-amber-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Completed PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(false);
                      if (user) {
                        navigate('/dashboard');
                      }
                    }}
                    className="sm:w-36 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs transition-colors"
                  >
                    {user ? 'Go to Dashboard' : 'Done'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post-KYC Automatic Joint-Venture Farming Agreement Popup */}
      <AgreementPopupModal
        isOpen={showAgreementPopup}
        onClose={() => {
          setShowAgreementPopup(false);
          if (submittedData) {
            setShowSuccessModal(true);
          }
        }}
        user={user}
        profile={profile}
        kycSubmittedId={submittedData?.id}
        onDownloadKycPdf={handleDownload}
      />
    </div>
  );
}
