import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import {
  CertificateFormData,
  CERTIFICATE_IMAGE_URL,
  initialCertificateFormData,
  downloadCompletedCertificatePDF,
  saveCertificateSubmission,
  fetchUserCertificateSubmission,
} from '../services/certificatePdfService';
import { fetchUserContractSubmission } from '../services/contractPdfService';
import { fetchUserKycSubmission } from '../services/kycPdfService';
import { fetchUserAgreementSubmission } from '../services/agreementPdfService';
import {
  Award,
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

interface CertificateDocumentViewerProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isPopup?: boolean;
  onClosePopup?: () => void;
  onSubmitted?: (submissionId: string, data: CertificateFormData) => void;
  onDownloadAgreementPdf?: () => void;
  onDownloadKycPdf?: () => void;
  agreementSubmittedId?: string;
}

export default function CertificateDocumentViewer({
  user,
  profile,
  isPopup = false,
  onClosePopup,
  onSubmitted,
  onDownloadAgreementPdf,
  onDownloadKycPdf,
  agreementSubmittedId,
}: CertificateDocumentViewerProps) {
  const [formData, setFormData] = useState<CertificateFormData>(initialCertificateFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; submittedAt: Date } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(isPopup ? 95 : 100);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Auto-populate from existing Certificate submission or prior forms (Contract, KYC, Agreement, Profile)
  useEffect(() => {
    if (!user) return;
    setLoadingExisting(true);

    Promise.all([
      fetchUserCertificateSubmission(user.uid),
      fetchUserContractSubmission(user.uid),
      fetchUserKycSubmission(user.uid),
      fetchUserAgreementSubmission(user.uid),
    ])
      .then(([existingCert, contractData, kycData, agreementData]) => {
        if (existingCert) {
          setFormData(existingCert);
          if (!isPopup) {
            toast.info('Loaded your previously completed Certificate of Investment. You can review or update it.');
          }
          return;
        }

        const derivedName =
          agreementData?.partnerName ||
          kycData?.fullName ||
          contractData?.name ||
          profile?.displayName ||
          user.displayName ||
          '';

        const derivedIrCode = contractData?.irCode || '';
        const derivedAmount =
          agreementData?.amountPaid || contractData?.totalAmountPaid || '';
        const derivedTenure =
          contractData?.startDay && contractData?.endDay
            ? `${contractData.startDay} ${contractData.startMonthYear} - ${contractData.endDay} ${contractData.endMonthYear}`.trim()
            : '12 Months';
        const derivedArea = agreementData?.fundingPackage
          ? `Rice Farming (${agreementData.fundingPackage})`
          : 'Rice Farming';

        setFormData((prev) => ({
          ...prev,
          irCode: prev.irCode || derivedIrCode,
          investorName: prev.investorName || derivedName,
          periodMonths: prev.periodMonths || '12',
          tenureOfInvestment: prev.tenureOfInvestment || derivedTenure,
          areaOfInvestment: prev.areaOfInvestment || derivedArea,
          amountInvested: prev.amountInvested || derivedAmount,
          subscriptionDate: prev.subscriptionDate || contractData?.subscriptionDate || prev.subscriptionDate,
          paymentDate: prev.paymentDate || contractData?.paymentDate || prev.paymentDate,
        }));
      })
      .finally(() => setLoadingExisting(false));
  }, [user, profile, isPopup]);

  const handleChange = (field: keyof CertificateFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!formData.investorName.trim()) errors.push('Certified Investor / Partner Full Name is required');
    if (!formData.periodMonths.trim()) errors.push('Investment Period (months) is required');
    if (!formData.tenureOfInvestment.trim()) errors.push('Tenure of Investment is required');
    if (!formData.areaOfInvestment.trim()) errors.push('Area of Investment is required');
    if (!formData.amountInvested.trim()) errors.push('Amount Invested is required');
    if (!formData.subscriptionDate.trim()) errors.push('Subscription Date is required');
    if (!formData.paymentDate.trim()) errors.push('Payment Date is required');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Please complete all required certificate fields before finishing.');
      return;
    }

    setSubmitting(true);
    try {
      const submission = await saveCertificateSubmission(user ? user.uid : null, formData);
      setSubmittedData({
        id: submission.id,
        submittedAt: new Date(),
      });
      setShowSuccessModal(true);
      toast.success('Certificate of Investment completed! All 4 onboarding documents are done.');
      if (onSubmitted) {
        onSubmitted(submission.id, formData);
      }
    } catch (error: any) {
      console.error('Certificate submission error:', error);
      toast.error(error?.message || 'Failed to save Certificate of Investment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Generating your official SBH Certificate of Investment PDF...', { id: 'cert-pdf-gen' });
      await downloadCompletedCertificatePDF(formData);
      toast.success('Official SBH Certificate of Investment PDF downloaded!', { id: 'cert-pdf-gen' });
    } catch (error: any) {
      console.error('Certificate PDF error:', error);
      toast.error('Failed to generate Certificate PDF: ' + (error?.message || 'Unknown error'), { id: 'cert-pdf-gen' });
    }
  };

  const requiredFields = [
    formData.investorName,
    formData.periodMonths,
    formData.tenureOfInvestment,
    formData.areaOfInvestment,
    formData.amountInvested,
    formData.subscriptionDate,
    formData.paymentDate,
  ];
  const requiredCount = requiredFields.length;
  const completedCount = requiredFields.filter((v) => String(v || '').trim().length > 0).length;

  const inputClass = (field: string, extra = '') =>
    `absolute text-[#071330] font-semibold text-[10px] sm:text-[13px] px-1.5 rounded-sm bg-transparent outline-none transition-all duration-150 ${
      activeField === field ? 'bg-blue-50/85 ring-2 ring-blue-500 shadow-sm' : 'hover:bg-blue-50/35'
    } ${extra}`;

  return (
    <div className={isPopup ? 'flex flex-col h-full bg-slate-900 text-slate-100' : 'min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pt-20'}>
      {/* Top Sticky Control Bar */}
      <section className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 z-30 shadow-xl backdrop-blur-md ${isPopup ? 'sticky top-0' : 'sticky top-16'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Title */}
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2">
                    <h1 className="text-sm sm:text-base font-black tracking-wide uppercase text-white">
                      SBH Certificate of Investment
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Form 4 of 4 • Final Form
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                      <ShieldCheck className="w-3 h-3" /> Digitally Fillable
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isPopup && agreementSubmittedId
                      ? `Agreement (${agreementSubmittedId}) Signed! Complete this final Certificate of Investment.`
                      : 'Salvage Biz-Hub Nig Ltd • RC: 1840192 • Final onboarding form before selecting your investment slots.'}
                  </p>
                </div>
              </div>

              {isPopup && onClosePopup && (
                <button
                  type="button"
                  onClick={onClosePopup}
                  className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close Certificate Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
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
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(isPopup ? 95 : 100)}
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
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (completedCount / requiredCount) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-300">
                  {completedCount}/{requiredCount}
                </span>
              </div>

              {/* Quick Downloads for earlier docs if triggered from popup flow */}
              {isPopup && onDownloadKycPdf && (
                <button
                  type="button"
                  onClick={onDownloadKycPdf}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  title="Download KYC PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KYC PDF</span>
                </button>
              )}

              {isPopup && onDownloadAgreementPdf && (
                <button
                  type="button"
                  onClick={onDownloadAgreementPdf}
                  className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  title="Download Signed 6-Page Agreement PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agreement PDF</span>
                </button>
              )}

              {/* Download Certificate PDF */}
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Download Certificate</span>
              </button>

              {/* Submit Certificate */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-green-900/30 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Complete Certificate</span>
                  </>
                )}
              </button>

              {isPopup && onClosePopup && (
                <button
                  type="button"
                  onClick={onClosePopup}
                  className="hidden lg:inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close Certificate Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-6 flex flex-col items-center">
        {/* Four-Step Onboarding Strip */}
        <div className="w-full max-w-5xl mb-4 bg-slate-800/80 border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <Link
              to="/contract?onboarding=true"
              onClick={onClosePopup}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold transition-colors"
            >
              1. Contract Form
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to="/kyc?onboarding=true"
              onClick={onClosePopup}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold transition-colors"
            >
              2. KYC Form
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to="/agreement"
              onClick={onClosePopup}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold transition-colors"
            >
              3. JV Agreement
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black">
              4. Investment Certificate
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {loadingExisting ? 'Syncing your details...' : 'Verify & complete the final Certificate details below.'}
          </span>
        </div>

        {/* Guest Sign-in Notice */}
        {!user && (
          <div className="w-full max-w-5xl mb-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                You are completing this Certificate as a guest. You can fill and download your official PDF now, or sign in to save it to your account.
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
          <div className="w-full max-w-5xl mb-4 bg-red-950/60 border border-red-500/40 rounded-2xl p-4 text-xs text-red-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Please complete the following Certificate fields:</p>
              <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-red-300">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Landscape Document Canvas Wrapper */}
        <div
          className="w-full overflow-x-auto flex justify-center py-2 px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Container: Original Landscape Aspect Ratio 3300 / 2472 */}
          <div
            className="relative bg-white text-black shadow-2xl rounded-sm select-text"
            style={{
              width: `${(960 * zoomLevel) / 100}px`,
              minWidth: `${(960 * zoomLevel) / 100}px`,
              aspectRatio: '3300 / 2472',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Authentic Original Certificate Image */}
            <img
              src={CERTIFICATE_IMAGE_URL}
              alt="Salvage Biz-Hub Nig Ltd Original Certificate of Investment"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />

            {/* Interactive Fields Overlay */}
            <div className="absolute inset-0 w-full h-full">
              {/* IR CODE (Top-Right Box) */}
              <input
                type="text"
                name="irCode"
                value={formData.irCode}
                onChange={(e) => handleChange('irCode', e.target.value)}
                onFocus={() => setActiveField('irCode')}
                onBlur={() => setActiveField(null)}
                placeholder="IR Code"
                className={inputClass('irCode', 'text-center text-[9px] sm:text-[11px]')}
                style={{ left: '80.45%', top: '13.83%', width: '11.06%', height: '1.86%' }}
              />

              {/* THIS IS TO CERTIFY THAT (Investor Name — Centered Big Line) */}
              <input
                type="text"
                name="investorName"
                value={formData.investorName}
                onChange={(e) => handleChange('investorName', e.target.value)}
                onFocus={() => setActiveField('investorName')}
                onBlur={() => setActiveField(null)}
                placeholder="Investor / Partner Full Legal Name"
                className={inputClass('investorName', 'text-center font-serif font-bold text-sm sm:text-xl tracking-wide')}
                style={{ left: '16.67%', top: '47.94%', width: '71.52%', height: '3.32%' }}
              />

              {/* Period of ___ months */}
              <input
                type="text"
                name="periodMonths"
                value={formData.periodMonths}
                onChange={(e) => handleChange('periodMonths', e.target.value)}
                onFocus={() => setActiveField('periodMonths')}
                onBlur={() => setActiveField(null)}
                placeholder="12"
                className={inputClass('periodMonths', 'text-center text-[10px] sm:text-[12px]')}
                style={{ left: '73.79%', top: '53.56%', width: '4.94%', height: '1.78%' }}
              />

              {/* Tenure of Investment */}
              <input
                type="text"
                name="tenureOfInvestment"
                value={formData.tenureOfInvestment}
                onChange={(e) => handleChange('tenureOfInvestment', e.target.value)}
                onFocus={() => setActiveField('tenureOfInvestment')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 12 Months"
                className={inputClass('tenureOfInvestment')}
                style={{ left: '33.39%', top: '62.14%', width: '19.18%', height: '1.94%' }}
              />

              {/* Area of Investment */}
              <input
                type="text"
                name="areaOfInvestment"
                value={formData.areaOfInvestment}
                onChange={(e) => handleChange('areaOfInvestment', e.target.value)}
                onFocus={() => setActiveField('areaOfInvestment')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. Rice Farming"
                className={inputClass('areaOfInvestment')}
                style={{ left: '71.00%', top: '62.14%', width: '22.91%', height: '1.94%' }}
              />

              {/* Amount Invested */}
              <input
                type="text"
                name="amountInvested"
                value={formData.amountInvested}
                onChange={(e) => handleChange('amountInvested', e.target.value)}
                onFocus={() => setActiveField('amountInvested')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. NGN 1,200,000.00"
                className={inputClass('amountInvested')}
                style={{ left: '54.03%', top: '67.11%', width: '39.82%', height: '1.94%' }}
              />

              {/* Subscription Date */}
              <input
                type="text"
                name="subscriptionDate"
                value={formData.subscriptionDate}
                onChange={(e) => handleChange('subscriptionDate', e.target.value)}
                onFocus={() => setActiveField('subscriptionDate')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={inputClass('subscriptionDate')}
                style={{ left: '29.76%', top: '72.33%', width: '25.82%', height: '1.94%' }}
              />

              {/* Payment Date */}
              <input
                type="text"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                onFocus={() => setActiveField('paymentDate')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={inputClass('paymentDate')}
                style={{ left: '69.18%', top: '72.33%', width: '24.73%', height: '1.94%' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Submission Action Bar */}
        <div className="w-full max-w-5xl mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-3 text-xs text-slate-300">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white">Step 4 of 4 (Last Form): Official Certificate of Investment</p>
              <p className="text-slate-400">
                Complete this final certificate to unlock investment package checkout and download your certificate PDF.
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
              <span>Download Certificate</span>
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
                  <span>Completing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete & Finish Onboarding</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Final Completion Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide mb-2">
                Certificate Issued & Onboarding Complete!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Congratulations, <strong className="text-white">{formData.investorName}</strong>! Your Salvage Biz-Hub Nig Ltd Certificate of Investment has been completed and saved with ID{' '}
                <span className="font-mono text-emerald-400 font-bold">{submittedData?.id || 'COMPLETED'}</span>.
              </p>

              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Certified Investor:</span>
                  <span className="font-bold text-white">{formData.investorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Amount & Period:</span>
                  <span className="text-white">
                    {formData.amountInvested} ({formData.periodMonths} months)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">All 4 Onboarding Forms:</span>
                  <span className="font-bold text-emerald-400">Completed ✓</span>
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
                    <span>Download Certificate PDF</span>
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
