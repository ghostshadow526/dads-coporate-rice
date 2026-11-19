import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import {
  AgreementFormData,
  AGREEMENT_PAGE_IMAGES,
  initialAgreementFormData,
  downloadCompletedAgreementPDF,
  saveAgreementSubmission,
  fetchUserAgreementSubmission,
} from '../services/agreementPdfService';
import { fetchUserContractSubmission } from '../services/contractPdfService';
import { fetchUserKycSubmission } from '../services/kycPdfService';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Send,
  ShieldCheck,
  Lock,
  Info,
  ArrowRight,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AgreementDocumentViewerProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isPopup?: boolean;
  onClosePopup?: () => void;
  onSubmitted?: (submissionId: string, data: AgreementFormData) => void;
  onDownloadKycPdf?: () => void;
  kycSubmittedId?: string;
}

interface ValidationErrorItem {
  page: number;
  message: string;
}

export default function AgreementDocumentViewer({
  user,
  profile,
  isPopup = false,
  onClosePopup,
  onSubmitted,
  onDownloadKycPdf,
  kycSubmittedId,
}: AgreementDocumentViewerProps) {
  const [formData, setFormData] = useState<AgreementFormData>(initialAgreementFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; submittedAt: Date } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(isPopup ? 90 : 100);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  const navigate = useNavigate();

  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);

  const scrollToPage = (pageNum: number) => {
    const target = pageRefs.current[pageNum - 1];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-populate from existing Agreement submission, Contract Form, KYC Form, and Profile
  useEffect(() => {
    if (!user) return;
    setLoadingExisting(true);

    Promise.all([
      fetchUserAgreementSubmission(user.uid),
      fetchUserContractSubmission(user.uid),
      fetchUserKycSubmission(user.uid),
    ])
      .then(([existingAgreement, contractData, kycData]) => {
        if (existingAgreement) {
          setFormData(existingAgreement);
          if (!isPopup) {
            toast.info('Loaded your previously submitted Joint-Venture Agreement. You can review or update it.');
          }
          return;
        }

        const derivedName =
          kycData?.fullName || contractData?.name || profile?.displayName || user.displayName || '';
        const derivedAddress = [
          kycData?.residentialAddress || profile?.address || '',
          kycData?.city || profile?.city || '',
          kycData?.stateProvince || profile?.state || '',
        ]
          .filter(Boolean)
          .join(', ');

        const derivedPackage = contractData?.selectedSlot
          ? `${contractData.selectedSlot} Slot Package`
          : '';
        const derivedSlots = contractData?.hectaresInvested || '';
        const derivedAmount = contractData?.totalAmountPaid || '';
        const derivedNok = contractData?.nextOfKin || '';

        setFormData((prev) => ({
          ...prev,
          partnerName: prev.partnerName || derivedName,
          partnerAddress: prev.partnerAddress || derivedAddress,
          noticeAddress: prev.noticeAddress || derivedAddress,
          fundingPackage: prev.fundingPackage || derivedPackage,
          numberOfSlots: prev.numberOfSlots || derivedSlots,
          amountPaid: prev.amountPaid || derivedAmount,
          partnerSignName: prev.partnerSignName || derivedName,
          partnerSignature: prev.partnerSignature || kycData?.signature || contractData?.investorSign || derivedName,
          nokName: prev.nokName || derivedNok,
        }));
      })
      .finally(() => setLoadingExisting(false));
  }, [user, profile, isPopup]);

  const handleChange = (field: keyof AgreementFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePartnerNameChange = (val: string) => {
    setFormData((prev) => {
      const syncSignName = !prev.partnerSignName || prev.partnerSignName === prev.partnerName;
      const syncSig = !prev.partnerSignature || prev.partnerSignature === prev.partnerName;
      return {
        ...prev,
        partnerName: val,
        partnerSignName: syncSignName ? val : prev.partnerSignName,
        partnerSignature: syncSig ? val : prev.partnerSignature,
      };
    });
  };

  const handlePartnerAddressChange = (val: string) => {
    setFormData((prev) => {
      const syncNotice = !prev.noticeAddress || prev.noticeAddress === prev.partnerAddress;
      return {
        ...prev,
        partnerAddress: val,
        noticeAddress: syncNotice ? val : prev.noticeAddress,
      };
    });
  };

  const validateForm = (): ValidationErrorItem[] => {
    const errors: ValidationErrorItem[] = [];
    if (!formData.effectiveDay.trim()) errors.push({ page: 1, message: 'Page 1: Effective Day is required (e.g. 19th)' });
    if (!formData.effectiveMonthYear.trim()) errors.push({ page: 1, message: 'Page 1: Effective Month & Year is required' });
    if (!formData.partnerName.trim()) errors.push({ page: 1, message: 'Page 1: Partner Full Name is required' });
    if (!formData.partnerAddress.trim()) errors.push({ page: 1, message: 'Page 1: Partner Contact Address is required' });

    if (!formData.fundingPackage.trim()) errors.push({ page: 2, message: 'Page 2: Funding Package Subscribed To is required' });
    if (!formData.numberOfSlots.trim()) errors.push({ page: 2, message: 'Page 2: Number of Slot(s) is required' });
    if (!formData.amountPaid.trim()) errors.push({ page: 2, message: 'Page 2: Amount Paid is required' });

    if (!formData.noticeAddress.trim()) errors.push({ page: 6, message: 'Page 6: Partner/Financier Notice Address is required' });
    if (!formData.partnerSignName.trim()) errors.push({ page: 6, message: 'Page 6: Partner Printed Name is required' });
    if (!formData.partnerSignature.trim()) errors.push({ page: 6, message: 'Page 6: Partner Signature or Initial is required' });
    if (!formData.partnerSignDate.trim()) errors.push({ page: 6, message: 'Page 6: Partner Signature Date is required' });
    if (!formData.nokSignature.trim()) errors.push({ page: 6, message: 'Page 6: Next of Kin Signature or Initial is required' });
    if (!formData.nokName.trim()) errors.push({ page: 6, message: 'Page 6: Next of Kin Name is required' });
    if (!formData.nokRelationship.trim()) errors.push({ page: 6, message: 'Page 6: Next of Kin Relationship is required' });

    setValidationErrors(errors);
    return errors;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error('Please complete all required fields across Pages 1, 2, and 6.');
      scrollToPage(errors[0].page);
      return;
    }

    setSubmitting(true);
    try {
      const submission = await saveAgreementSubmission(user ? user.uid : null, formData);
      setSubmittedData({
        id: submission.id,
        submittedAt: new Date(),
      });
      setShowSuccessModal(true);
      toast.success('Joint-Venture Farming Agreement signed & submitted!');
      if (onSubmitted) {
        onSubmitted(submission.id, formData);
      }
    } catch (error: any) {
      console.error('Agreement submission error:', error);
      toast.error(error?.message || 'Failed to submit Joint-Venture Agreement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Generating your signed 6-page Joint-Venture Agreement PDF...', { id: 'agreement-pdf-gen' });
      await downloadCompletedAgreementPDF(formData);
      toast.success('Signed 6-page Joint-Venture Agreement PDF downloaded!', { id: 'agreement-pdf-gen' });
    } catch (error: any) {
      console.error('Agreement PDF error:', error);
      toast.error('Failed to generate PDF: ' + (error?.message || 'Unknown error'), { id: 'agreement-pdf-gen' });
    }
  };

  const requiredFields = [
    formData.effectiveDay,
    formData.effectiveMonthYear,
    formData.partnerName,
    formData.partnerAddress,
    formData.fundingPackage,
    formData.numberOfSlots,
    formData.amountPaid,
    formData.noticeAddress,
    formData.partnerSignName,
    formData.partnerSignature,
    formData.partnerSignDate,
    formData.nokSignature,
    formData.nokName,
    formData.nokRelationship,
  ];
  const requiredCount = requiredFields.length;
  const completedCount = requiredFields.filter((v) => String(v || '').trim().length > 0).length;

  const inputClass = (field: string, extra = '') =>
    `absolute text-[#071330] font-semibold text-[10px] sm:text-[12px] px-1 rounded-sm bg-transparent outline-none transition-all duration-150 ${
      activeField === field ? 'bg-blue-50/85 ring-2 ring-blue-500 shadow-sm' : 'hover:bg-blue-50/35'
    } ${extra}`;

  return (
    <div className={isPopup ? 'flex flex-col h-full bg-slate-900 text-slate-100' : 'min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pt-20'}>
      {/* Sticky Top Control Bar */}
      <section className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 z-30 shadow-xl backdrop-blur-md ${isPopup ? 'sticky top-0' : 'sticky top-16'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Title */}
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2">
                    <h1 className="text-sm sm:text-base font-black tracking-wide uppercase text-white">
                      SBH Joint-Venture Farming Agreement
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Form 3 of 3 • 6 Pages
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                      <ShieldCheck className="w-3 h-3" /> Digitally Fillable
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isPopup && kycSubmittedId
                      ? `KYC (${kycSubmittedId}) Submitted! Review all 6 pages and sign on Pages 1, 2 & 6.`
                      : 'Salvage Biz-Hub Nig Ltd • Review all 6 pages and fill the highlighted blank lines on Pages 1, 2 & 6.'}
                  </p>
                </div>
              </div>

              {isPopup && onClosePopup && (
                <button
                  type="button"
                  onClick={onClosePopup}
                  className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close Agreement Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Toolbar Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Page Quick Jump */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-[11px]">
                {[1, 2, 3, 4, 5, 6].map((pg) => {
                  const hasFields = pg === 1 || pg === 2 || pg === 6;
                  return (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => scrollToPage(pg)}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                        hasFields
                          ? 'text-emerald-300 hover:bg-emerald-500/20'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title={hasFields ? `Jump to Page ${pg} (Fillable)` : `Jump to Page ${pg}`}
                    >
                      P{pg}
                      {hasFields ? '*' : ''}
                    </button>
                  );
                })}
              </div>

              {/* Zoom */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-300 font-bold min-w-[40px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(135, z + 10))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(isPopup ? 90 : 100)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors ml-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress */}
              <div className="hidden xl:flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
                <div className="w-16 bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (completedCount / requiredCount) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-300">
                  {completedCount}/{requiredCount}
                </span>
              </div>

              {/* Download KYC PDF shortcut if inside post-KYC popup */}
              {isPopup && onDownloadKycPdf && (
                <button
                  type="button"
                  onClick={onDownloadKycPdf}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  title="Download your completed KYC PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KYC PDF</span>
                </button>
              )}

              {/* Download Signed Agreement PDF */}
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Download Agreement</span>
              </button>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-green-900/30 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Sign & Submit Agreement</span>
                  </>
                )}
              </button>

              {isPopup && onClosePopup && (
                <button
                  type="button"
                  onClick={onClosePopup}
                  className="hidden lg:inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close Agreement Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Scrollable Document Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-6 flex flex-col items-center">
        {/* Three-Step Onboarding Flow Strip */}
        <div className="w-full max-w-4xl mb-4 bg-slate-800/80 border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <Link
              to="/contract?onboarding=true"
              onClick={onClosePopup}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold transition-colors"
            >
              1. Contract Form
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to="/kyc?onboarding=true"
              onClick={onClosePopup}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold transition-colors"
            >
              2. KYC Form
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold">
              3. Joint-Venture Agreement
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {loadingExisting ? 'Syncing your details...' : 'Fillable blanks are on Page 1, Page 2, and Page 6 (*).'}
          </span>
        </div>

        {/* Guest Sign-in Banner */}
        {!user && (
          <div className="w-full max-w-4xl mb-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                You are viewing this Agreement as a guest. You can fill and download your signed 6-page PDF now, or sign in to link it to your investor profile.
              </span>
            </div>
            <Link
              to="/login"
              onClick={onClosePopup}
              className="ml-4 shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="w-full max-w-4xl mb-4 bg-red-950/60 border border-red-500/40 rounded-2xl p-4 text-xs text-red-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold mb-1.5">Please complete all required agreement fields (click any item to jump):</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-red-300">
                {validationErrors.map((err, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => scrollToPage(err.page)}
                      className="text-left underline decoration-red-400/50 hover:text-white transition-colors"
                    >
                      {err.message}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 6-Page Document Canvas */}
        <div
          className="w-full overflow-x-auto flex flex-col items-center gap-6 py-2 px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {AGREEMENT_PAGE_IMAGES.map((src, index) => {
            const pageNum = index + 1;
            const isFillablePage = pageNum === 1 || pageNum === 2 || pageNum === 6;

            return (
              <div
                key={pageNum}
                ref={(el) => {
                  pageRefs.current[index] = el;
                }}
                className="flex flex-col items-center"
              >
                {/* Page Header Label */}
                <div
                  className="flex items-center justify-between mb-2 px-1 text-[11px] font-bold text-slate-400"
                  style={{ width: `${(820 * zoomLevel) / 100}px` }}
                >
                  <span>
                    Page {pageNum} of 6 {isFillablePage ? '— Interactive Fillable Fields' : '— Agreement Terms'}
                  </span>
                  {pageNum === 1 && (
                    <button
                      type="button"
                      onClick={() => scrollToPage(2)}
                      className="text-emerald-400 hover:underline"
                    >
                      Next Fillable: Page 2 →
                    </button>
                  )}
                  {pageNum === 2 && (
                    <button
                      type="button"
                      onClick={() => scrollToPage(6)}
                      className="text-emerald-400 hover:underline"
                    >
                      Jump to Signatures (Page 6) →
                    </button>
                  )}
                </div>

                {/* Page Container: Authentic 2318 / 3000 Aspect Ratio */}
                <div
                  className="relative bg-white text-black shadow-2xl rounded-sm select-text"
                  style={{
                    width: `${(820 * zoomLevel) / 100}px`,
                    minWidth: `${(820 * zoomLevel) / 100}px`,
                    aspectRatio: '2318 / 3000',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <img
                    src={src}
                    alt={`Salvage Biz-Hub Joint-Venture Farming Agreement - Page ${pageNum}`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                  />

                  {/* Interactive Fields on Page 1 */}
                  {pageNum === 1 && (
                    <div className="absolute inset-0 w-full h-full">
                      {/* Effective Date Day */}
                      <input
                        type="text"
                        name="effectiveDay"
                        value={formData.effectiveDay}
                        onChange={(e) => handleChange('effectiveDay', e.target.value)}
                        onFocus={() => setActiveField('effectiveDay')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. 19th"
                        className={inputClass('effectiveDay', 'text-center')}
                        style={{ left: '10.79%', top: '19.20%', width: '6.73%', height: '1.60%' }}
                      />

                      {/* Effective Date Month & Year */}
                      <input
                        type="text"
                        name="effectiveMonthYear"
                        value={formData.effectiveMonthYear}
                        onChange={(e) => handleChange('effectiveMonthYear', e.target.value)}
                        onFocus={() => setActiveField('effectiveMonthYear')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Month, Year"
                        className={inputClass('effectiveMonthYear')}
                        style={{ left: '24.85%', top: '19.20%', width: '33.18%', height: '1.60%' }}
                      />

                      {/* Partner Name */}
                      <input
                        type="text"
                        name="partnerName"
                        value={formData.partnerName}
                        onChange={(e) => handlePartnerNameChange(e.target.value)}
                        onFocus={() => setActiveField('partnerName')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Partner / Financier Full Legal Name"
                        className={inputClass('partnerName')}
                        style={{ left: '8.28%', top: '43.33%', width: '51.94%', height: '1.63%' }}
                      />

                      {/* Partner Address */}
                      <input
                        type="text"
                        name="partnerAddress"
                        value={formData.partnerAddress}
                        onChange={(e) => handlePartnerAddressChange(e.target.value)}
                        onFocus={() => setActiveField('partnerAddress')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Partner / Financier Full Contact Address"
                        className={inputClass('partnerAddress')}
                        style={{ left: '10.53%', top: '45.67%', width: '82.31%', height: '1.63%' }}
                      />
                    </div>
                  )}

                  {/* Interactive Fields on Page 2 */}
                  {pageNum === 2 && (
                    <div className="absolute inset-0 w-full h-full">
                      {/* Clause 1.1(c): Funding Package */}
                      <input
                        type="text"
                        name="fundingPackage"
                        value={formData.fundingPackage}
                        onChange={(e) => handleChange('fundingPackage', e.target.value)}
                        onFocus={() => setActiveField('fundingPackage')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. Gold / Silver / Bronze"
                        className={inputClass('fundingPackage')}
                        style={{ left: '43.74%', top: '35.47%', width: '30.93%', height: '1.60%' }}
                      />

                      {/* Number of Slots */}
                      <input
                        type="text"
                        name="numberOfSlots"
                        value={formData.numberOfSlots}
                        onChange={(e) => handleChange('numberOfSlots', e.target.value)}
                        onFocus={() => setActiveField('numberOfSlots')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. 1 Slot"
                        className={inputClass('numberOfSlots')}
                        style={{ left: '13.89%', top: '38.53%', width: '22.86%', height: '1.60%' }}
                      />

                      {/* Amount Paid */}
                      <input
                        type="text"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={(e) => handleChange('amountPaid', e.target.value)}
                        onFocus={() => setActiveField('amountPaid')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. 1,200,000.00"
                        className={inputClass('amountPaid')}
                        style={{ left: '51.81%', top: '38.53%', width: '40.08%', height: '1.60%' }}
                      />
                    </div>
                  )}

                  {/* Interactive Fields on Page 6 */}
                  {pageNum === 6 && (
                    <div className="absolute inset-0 w-full h-full">
                      {/* Notices: Partner Address */}
                      <input
                        type="text"
                        name="noticeAddress"
                        value={formData.noticeAddress}
                        onChange={(e) => handleChange('noticeAddress', e.target.value)}
                        onFocus={() => setActiveField('noticeAddress')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Partner / Financier Notice Address"
                        className={inputClass('noticeAddress')}
                        style={{ left: '32.79%', top: '27.40%', width: '59.53%', height: '1.60%' }}
                      />

                      {/* MD Date (optional) */}
                      <input
                        type="text"
                        name="mdDate"
                        value={formData.mdDate}
                        onChange={(e) => handleChange('mdDate', e.target.value)}
                        onFocus={() => setActiveField('mdDate')}
                        onBlur={() => setActiveField(null)}
                        placeholder="DD/MM/YYYY"
                        className={inputClass('mdDate', 'text-[9px] sm:text-[10px]')}
                        style={{ left: '32.01%', top: '61.47%', width: '7.94%', height: '1.60%' }}
                      />

                      {/* Partner Signature Block: Name */}
                      <input
                        type="text"
                        name="partnerSignName"
                        value={formData.partnerSignName}
                        onChange={(e) => handleChange('partnerSignName', e.target.value)}
                        onFocus={() => setActiveField('partnerSignName')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Partner Full Name"
                        className={inputClass('partnerSignName')}
                        style={{ left: '14.84%', top: '68.87%', width: '44.74%', height: '1.60%' }}
                      />

                      {/* Partner Signature or Initial */}
                      <input
                        type="text"
                        name="partnerSignature"
                        value={formData.partnerSignature}
                        onChange={(e) => handleChange('partnerSignature', e.target.value)}
                        onFocus={() => setActiveField('partnerSignature')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Type Signature / Initial"
                        className={inputClass('partnerSignature', 'font-bold italic font-serif')}
                        style={{ left: '26.70%', top: '71.93%', width: '33.22%', height: '1.60%' }}
                      />

                      {/* Partner Date */}
                      <input
                        type="text"
                        name="partnerSignDate"
                        value={formData.partnerSignDate}
                        onChange={(e) => handleChange('partnerSignDate', e.target.value)}
                        onFocus={() => setActiveField('partnerSignDate')}
                        onBlur={() => setActiveField(null)}
                        placeholder="DD/MM/YYYY"
                        className={inputClass('partnerSignDate')}
                        style={{ left: '13.72%', top: '75.00%', width: '45.77%', height: '1.60%' }}
                      />

                      {/* Next of Kin Signature or Initial */}
                      <input
                        type="text"
                        name="nokSignature"
                        value={formData.nokSignature}
                        onChange={(e) => handleChange('nokSignature', e.target.value)}
                        onFocus={() => setActiveField('nokSignature')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Next of Kin Signature / Initial"
                        className={inputClass('nokSignature', 'font-bold italic font-serif')}
                        style={{ left: '26.70%', top: '82.47%', width: '33.22%', height: '1.60%' }}
                      />

                      {/* Next of Kin Name */}
                      <input
                        type="text"
                        name="nokName"
                        value={formData.nokName}
                        onChange={(e) => handleChange('nokName', e.target.value)}
                        onFocus={() => setActiveField('nokName')}
                        onBlur={() => setActiveField(null)}
                        placeholder="Next of Kin Full Name"
                        className={inputClass('nokName')}
                        style={{ left: '14.84%', top: '85.47%', width: '44.74%', height: '1.60%' }}
                      />

                      {/* Next of Kin Relationship */}
                      <input
                        type="text"
                        name="nokRelationship"
                        value={formData.nokRelationship}
                        onChange={(e) => handleChange('nokRelationship', e.target.value)}
                        onFocus={() => setActiveField('nokRelationship')}
                        onBlur={() => setActiveField(null)}
                        placeholder="e.g. Spouse / Sibling"
                        className={inputClass('nokRelationship')}
                        style={{ left: '41.54%', top: '88.53%', width: '18.29%', height: '1.60%' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Submission Action Bar */}
        <div className="w-full max-w-4xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-3 text-xs text-slate-300">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white">Step 3 of 3: Joint-Venture Farming Agreement</p>
              <p className="text-slate-400">
                Complete Pages 1, 2 & 6, then submit to unlock your investment slots and download your signed 6-page PDF.
              </p>
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
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-green-950/40 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign & Submit Agreement</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Post-Agreement Success Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
                Agreement Signed & Completed!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Thank you, <strong className="text-white">{formData.partnerName}</strong>. Your Salvage Biz-Hub Nig Ltd 6-Page Joint-Venture Farming Agreement has been archived with ID{' '}
                <span className="font-mono text-emerald-400 font-bold">{submittedData?.id || 'COMPLETED'}</span>.
              </p>

              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Partner / Financier:</span>
                  <span className="font-bold text-white">{formData.partnerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Package & Slots:</span>
                  <span className="text-white">
                    {formData.fundingPackage} ({formData.numberOfSlots})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Next of Kin Witness:</span>
                  <span className="font-bold text-emerald-400">
                    {formData.nokName} ({formData.nokRelationship})
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(false);
                      if (onClosePopup) onClosePopup();
                      navigate('/invest');
                    }}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
                  >
                    <span>Proceed to Investment Packages</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-orange to-amber-600 hover:from-brand-orange/90 hover:to-amber-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed 6-Page PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSuccessModal(false);
                      if (onClosePopup) onClosePopup();
                      if (user) {
                        navigate('/dashboard?tab=documents');
                      }
                    }}
                    className="sm:w-36 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs transition-colors"
                  >
                    {user ? 'My Documents' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
