import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import {
  ContractFormData,
  initialContractFormData,
  downloadCompletedContractPDF,
  saveContractSubmission,
  fetchUserContractSubmission,
} from '../services/contractPdfService';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ContractFormProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
}

export default function ContractForm({ user, profile }: ContractFormProps) {
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true' || searchParams.get('flow') === 'onboarding';
  const [formData, setFormData] = useState<ContractFormData>(initialContractFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; submittedAt: Date } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Auto-populate known fields from user profile or existing submission
  useEffect(() => {
    if (user) {
      setLoadingExisting(true);
      fetchUserContractSubmission(user.uid)
        .then((existing) => {
          if (existing) {
            setFormData(existing);
            toast.info('Loaded your previously submitted Contract Form. You can review or update it.');
          } else if (profile) {
            setFormData((prev) => ({
              ...prev,
              name: prev.name || profile.displayName || '',
              email: prev.email || profile.email || user.email || '',
              phoneNo: prev.phoneNo || profile.phoneNumber || '',
              acctName: prev.acctName || profile.displayName || '',
              investorSign: prev.investorSign || profile.displayName || '',
            }));
          }
        })
        .finally(() => setLoadingExisting(false));
    }
  }, [user, profile]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const shouldSyncSign = !prev.investorSign || prev.investorSign === prev.name;
      const shouldSyncAcctName = !prev.acctName || prev.acctName === prev.name;
      return {
        ...prev,
        name: val,
        investorSign: shouldSyncSign ? val : prev.investorSign,
        acctName: shouldSyncAcctName ? val : prev.acctName,
      };
    });
  };

  const handleChange = (field: keyof ContractFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemarkChange = (key: keyof ContractFormData['remarks'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      remarks: {
        ...prev.remarks,
        [key]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Full Name is required');
    if (!formData.phoneNo.trim()) errors.push('Phone No. is required');
    if (!formData.email.trim() || !formData.email.includes('@')) errors.push('Valid Email is required');
    if (!formData.nextOfKin.trim()) errors.push('Next of Kin is required');
    if (!formData.nextOfKinPhone.trim()) errors.push('Next of Kin Phone is required');
    if (!formData.hectaresInvested.trim()) errors.push('Number of Hectare(s) invested is required');
    if (!formData.totalAmountPaid.trim()) errors.push('Total amount paid is required');
    if (!formData.bankName.trim()) errors.push('Bank name is required');
    if (!formData.acctName.trim()) errors.push('Account Name is required');
    if (!formData.acctNo.trim()) errors.push('Account Number is required');
    if (!formData.investorSign.trim()) errors.push('Investor Signature is required');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user) {
      toast.error('Please sign in first to submit and save your Contract Form.');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      toast.error('Please complete all required fields highlighted on the document.');
      return;
    }

    setSubmitting(true);
    try {
      const submission = await saveContractSubmission(user.uid, formData);
      setSubmittedData({
        id: submission.id,
        submittedAt: new Date(),
      });
      setShowSuccessModal(true);
      toast.success('Contract form submitted! Proceeding to Step 2 (KYC Form).');
    } catch (error: any) {
      console.error('Contract submission error:', error);
      toast.error(error?.message || 'Failed to submit contract form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading('Generating your official SBH Contract PDF...', { id: 'contract-pdf-gen' });
      await downloadCompletedContractPDF(formData);
      toast.success('Official SBH Contract PDF downloaded!', { id: 'contract-pdf-gen' });
    } catch (error: any) {
      console.error('PDF error:', error);
      toast.error('Failed to generate PDF: ' + (error?.message || 'Unknown error'), { id: 'contract-pdf-gen' });
    }
  };

  const requiredCount = 11;
  let completedCount = 0;
  if (formData.name.trim()) completedCount++;
  if (formData.phoneNo.trim()) completedCount++;
  if (formData.email.trim()) completedCount++;
  if (formData.nextOfKin.trim()) completedCount++;
  if (formData.nextOfKinPhone.trim()) completedCount++;
  if (formData.hectaresInvested.trim()) completedCount++;
  if (formData.totalAmountPaid.trim()) completedCount++;
  if (formData.bankName.trim()) completedCount++;
  if (formData.acctName.trim()) completedCount++;
  if (formData.acctNo.trim()) completedCount++;
  if (formData.investorSign.trim()) completedCount++;

  const inputClass = (field: string, extra = '') =>
    `absolute text-[#071330] font-semibold text-[10px] sm:text-[12px] px-1 rounded-sm bg-transparent outline-none transition-all duration-150 ${
      activeField === field ? 'bg-blue-50/80 ring-2 ring-blue-500 shadow-sm' : 'hover:bg-blue-50/35'
    } ${extra}`;

  const remarkRows: Array<{ key: keyof ContractFormData['remarks']; top: string; height: string; label: string }> = [
    { key: 'r1', top: '51.26%', height: '1.65%', label: 'Row 1 Remark' },
    { key: 'r2', top: '53.29%', height: '1.65%', label: 'Row 2 Remark' },
    { key: 'r3', top: '55.31%', height: '1.65%', label: 'Row 3 Remark' },
    { key: 'r4', top: '57.37%', height: '1.65%', label: 'Row 4 Remark' },
    { key: 'r5', top: '59.40%', height: '1.65%', label: 'Row 5 Remark' },
    { key: 'r6', top: '61.43%', height: '1.65%', label: 'Row 6 Remark' },
    { key: 'r7', top: '63.46%', height: '1.65%', label: 'Row 7 Remark' },
    { key: 'r8', top: '65.49%', height: '1.65%', label: 'Row 8 Remark' },
    { key: 'r9', top: '67.54%', height: '1.65%', label: 'Row 9 Remark' },
    { key: 'r10', top: '69.57%', height: '1.65%', label: 'Row 10 Remark' },
    { key: 'r11', top: '71.60%', height: '1.65%', label: 'Row 11 Remark' },
    { key: 'r12', top: '73.60%', height: '1.45%', label: 'Row 12 Remark' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pt-20">
      {/* Top Banner & Control Bar */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 sticky top-16 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title & Trust Badges */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">
                    Official SBH Investment Contract Form
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Form 1 of 4
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    <ShieldCheck className="w-3 h-3" /> Digitally Fillable
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Salvage Biz-Hub Nig Ltd • RC: 1840192 • Complete Contract Form first, then KYC, Agreement & Certificate
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
                    className="bg-green-500 h-full rounded-full transition-all duration-300"
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

              {/* Submit Contract Form Button */}
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
                    <span>Submit & Continue to KYC</span>
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-green-600 text-white font-bold">
              1. Contract Form
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to={isOnboarding ? '/kyc?onboarding=true' : '/kyc'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-colors"
            >
              2. KYC Form
            </Link>
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
            {loadingExisting ? 'Checking saved submission...' : 'Fill out the blank lines directly on the form below.'}
          </span>
        </div>

        {/* User Login Guidance */}
        {!user && (
          <div className="w-full max-w-4xl mb-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                Sign in to save your completed Investment Contract Form to your account before moving on to the KYC Form.
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

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 && (
          <div className="w-full max-w-4xl mb-4 bg-red-950/60 border border-red-500/40 rounded-2xl p-4 text-xs text-red-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Please complete the following required fields before submitting:</p>
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
          {/* Document Container: Original Aspect Ratio 2480 / 3500 */}
          <div
            ref={documentContainerRef}
            className="relative bg-white text-black shadow-2xl rounded-sm transition-transform duration-200 origin-top select-text"
            style={{
              width: `${(850 * zoomLevel) / 100}px`,
              minWidth: `${(850 * zoomLevel) / 100}px`,
              aspectRatio: '2480 / 3500',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Authentic Original Contract Document Image Background */}
            <img
              src="/assets/aistudio/sbh_contract_page1.jpg"
              alt="Salvage Biz-Hub Nig Ltd Original Contract Form"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />

            {/* Interactive Form Fields Overlay */}
            <div className="absolute inset-0 w-full h-full">
              {/* IR CODE */}
              <input
                type="text"
                name="irCode"
                value={formData.irCode}
                onChange={(e) => handleChange('irCode', e.target.value)}
                onFocus={() => setActiveField('irCode')}
                onBlur={() => setActiveField(null)}
                placeholder="IR Code"
                className={inputClass('irCode', 'text-center')}
                style={{ left: '80.08%', top: '18.14%', width: '13.47%', height: '1.60%' }}
              />

              {/* Paragraph: Season */}
              <input
                type="text"
                name="season"
                value={formData.season}
                onChange={(e) => handleChange('season', e.target.value)}
                onFocus={() => setActiveField('season')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 2026 Wet"
                className={inputClass('season', 'text-center')}
                style={{ left: '76.77%', top: '24.57%', width: '12.66%', height: '1.37%' }}
              />

              {/* Paragraph: Start Day */}
              <input
                type="text"
                name="startDay"
                value={formData.startDay}
                onChange={(e) => handleChange('startDay', e.target.value)}
                onFocus={() => setActiveField('startDay')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 1st"
                className={inputClass('startDay', 'text-center')}
                style={{ left: '7.82%', top: '28.51%', width: '7.38%', height: '1.37%' }}
              />

              {/* Paragraph: Start Month/Year */}
              <input
                type="text"
                name="startMonthYear"
                value={formData.startMonthYear}
                onChange={(e) => handleChange('startMonthYear', e.target.value)}
                onFocus={() => setActiveField('startMonthYear')}
                onBlur={() => setActiveField(null)}
                placeholder="Month, Year"
                className={inputClass('startMonthYear', 'text-center')}
                style={{ left: '21.13%', top: '28.51%', width: '22.38%', height: '1.37%' }}
              />

              {/* Paragraph: End Day */}
              <input
                type="text"
                name="endDay"
                value={formData.endDay}
                onChange={(e) => handleChange('endDay', e.target.value)}
                onFocus={() => setActiveField('endDay')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 1st"
                className={inputClass('endDay', 'text-center')}
                style={{ left: '50.65%', top: '28.51%', width: '6.33%', height: '1.37%' }}
              />

              {/* Paragraph: End Month/Year */}
              <input
                type="text"
                name="endMonthYear"
                value={formData.endMonthYear}
                onChange={(e) => handleChange('endMonthYear', e.target.value)}
                onFocus={() => setActiveField('endMonthYear')}
                onBlur={() => setActiveField(null)}
                placeholder="Month, Year"
                className={inputClass('endMonthYear', 'text-center')}
                style={{ left: '63.79%', top: '28.51%', width: '18.06%', height: '1.37%' }}
              />

              {/* Investor Row 1: Name, Phone No, Email */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => setActiveField('name')}
                onBlur={() => setActiveField(null)}
                placeholder="Full Name"
                className={inputClass('name')}
                style={{ left: '10.56%', top: '39.09%', width: '29.92%', height: '1.37%' }}
              />

              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={(e) => handleChange('phoneNo', e.target.value)}
                onFocus={() => setActiveField('phoneNo')}
                onBlur={() => setActiveField(null)}
                placeholder="+234 ..."
                className={inputClass('phoneNo')}
                style={{ left: '51.29%', top: '39.09%', width: '20.20%', height: '1.37%' }}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
                placeholder="Email address"
                className={inputClass('email', 'text-[9px] sm:text-[11px]')}
                style={{ left: '79.03%', top: '39.09%', width: '16.98%', height: '1.37%' }}
              />

              {/* Investor Row 2: Next of Kin, Phone, Email */}
              <input
                type="text"
                name="nextOfKin"
                value={formData.nextOfKin}
                onChange={(e) => handleChange('nextOfKin', e.target.value)}
                onFocus={() => setActiveField('nextOfKin')}
                onBlur={() => setActiveField(null)}
                placeholder="Next of Kin Full Name"
                className={inputClass('nextOfKin')}
                style={{ left: '15.16%', top: '41.74%', width: '31.98%', height: '1.37%' }}
              />

              <input
                type="tel"
                name="nextOfKinPhone"
                value={formData.nextOfKinPhone}
                onChange={(e) => handleChange('nextOfKinPhone', e.target.value)}
                onFocus={() => setActiveField('nextOfKinPhone')}
                onBlur={() => setActiveField(null)}
                placeholder="Phone"
                className={inputClass('nextOfKinPhone')}
                style={{ left: '53.75%', top: '41.74%', width: '19.27%', height: '1.37%' }}
              />

              <input
                type="email"
                name="nextOfKinEmail"
                value={formData.nextOfKinEmail}
                onChange={(e) => handleChange('nextOfKinEmail', e.target.value)}
                onFocus={() => setActiveField('nextOfKinEmail')}
                onBlur={() => setActiveField(null)}
                placeholder="Email"
                className={inputClass('nextOfKinEmail', 'text-[9px] sm:text-[11px]')}
                style={{ left: '79.44%', top: '41.74%', width: '15.89%', height: '1.37%' }}
              />

              {/* Investor Row 3: Subscription Date, Payment Date */}
              <input
                type="text"
                name="subscriptionDate"
                value={formData.subscriptionDate}
                onChange={(e) => handleChange('subscriptionDate', e.target.value)}
                onFocus={() => setActiveField('subscriptionDate')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={inputClass('subscriptionDate')}
                style={{ left: '20.16%', top: '43.80%', width: '31.94%', height: '1.37%' }}
              />

              <input
                type="text"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                onFocus={() => setActiveField('paymentDate')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={inputClass('paymentDate')}
                style={{ left: '65.20%', top: '43.80%', width: '29.88%', height: '1.37%' }}
              />

              {/* EOP Table REMARK Cells (1 to 12) */}
              {remarkRows.map((row) => (
                <input
                  key={row.key}
                  type="text"
                  name={row.key}
                  value={formData.remarks[row.key]}
                  onChange={(e) => handleRemarkChange(row.key, e.target.value)}
                  onFocus={() => setActiveField(row.key)}
                  onBlur={() => setActiveField(null)}
                  placeholder="Remark"
                  aria-label={row.label}
                  className={inputClass(row.key, 'text-[9px] sm:text-[11px]')}
                  style={{
                    left: '81.53%',
                    top: row.top,
                    width: '13.15%',
                    height: row.height,
                  }}
                />
              ))}

              {/* Summary Row 1: Hectares Invested, Total Amount Paid, Date */}
              <input
                type="text"
                name="hectaresInvested"
                value={formData.hectaresInvested}
                onChange={(e) => handleChange('hectaresInvested', e.target.value)}
                onFocus={() => setActiveField('hectaresInvested')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 1"
                className={inputClass('hectaresInvested', 'text-center')}
                style={{ left: '31.53%', top: '78.57%', width: '9.23%', height: '1.37%' }}
              />

              <input
                type="text"
                name="totalAmountPaid"
                value={formData.totalAmountPaid}
                onChange={(e) => handleChange('totalAmountPaid', e.target.value)}
                onFocus={() => setActiveField('totalAmountPaid')}
                onBlur={() => setActiveField(null)}
                placeholder="e.g. 1,200,000"
                className={inputClass('totalAmountPaid')}
                style={{ left: '57.94%', top: '78.57%', width: '18.75%', height: '1.37%' }}
              />

              <input
                type="text"
                name="amountPaidDate"
                value={formData.amountPaidDate}
                onChange={(e) => handleChange('amountPaidDate', e.target.value)}
                onFocus={() => setActiveField('amountPaidDate')}
                onBlur={() => setActiveField(null)}
                placeholder="DD/MM/YYYY"
                className={inputClass('amountPaidDate')}
                style={{ left: '82.38%', top: '78.57%', width: '12.30%', height: '1.37%' }}
              />

              {/* Summary Row 2: Amount In Words (Line 1 & Line 2) */}
              <input
                type="text"
                name="amountInWordsLine1"
                value={formData.amountInWordsLine1}
                onChange={(e) => handleChange('amountInWordsLine1', e.target.value)}
                onFocus={() => setActiveField('amountInWordsLine1')}
                onBlur={() => setActiveField(null)}
                placeholder="Amount in words (e.g. One Million Two Hundred Thousand Naira Only)"
                className={inputClass('amountInWordsLine1')}
                style={{ left: '6.65%', top: '80.86%', width: '84.68%', height: '1.37%' }}
              />

              <input
                type="text"
                name="amountInWordsLine2"
                value={formData.amountInWordsLine2}
                onChange={(e) => handleChange('amountInWordsLine2', e.target.value)}
                onFocus={() => setActiveField('amountInWordsLine2')}
                onBlur={() => setActiveField(null)}
                placeholder="Amount in words continuation (optional)"
                className={inputClass('amountInWordsLine2')}
                style={{ left: '5.44%', top: '82.46%', width: '82.86%', height: '1.37%' }}
              />

              {/* Summary Row 3: Expected ROI Rice & GT to Pay at Maturity */}
              <input
                type="text"
                name="expectedRoiRice"
                value={formData.expectedRoiRice}
                onChange={(e) => handleChange('expectedRoiRice', e.target.value)}
                onFocus={() => setActiveField('expectedRoiRice')}
                onBlur={() => setActiveField(null)}
                placeholder="Price/Amount"
                className={inputClass('expectedRoiRice')}
                style={{ left: '34.60%', top: '84.91%', width: '9.19%', height: '1.37%' }}
              />

              <input
                type="text"
                name="gtToPayAtMaturity"
                value={formData.gtToPayAtMaturity}
                onChange={(e) => handleChange('gtToPayAtMaturity', e.target.value)}
                onFocus={() => setActiveField('gtToPayAtMaturity')}
                onBlur={() => setActiveField(null)}
                placeholder="Maturity Total"
                className={inputClass('gtToPayAtMaturity')}
                style={{ left: '68.19%', top: '84.91%', width: '14.40%', height: '1.37%' }}
              />

              {/* Bank & Signature Row */}
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                onFocus={() => setActiveField('bankName')}
                onBlur={() => setActiveField(null)}
                placeholder="Bank Name"
                className={inputClass('bankName', 'text-[9px] sm:text-[11px]')}
                style={{ left: '9.96%', top: '87.03%', width: '13.31%', height: '1.37%' }}
              />

              <input
                type="text"
                name="acctName"
                value={formData.acctName}
                onChange={(e) => handleChange('acctName', e.target.value)}
                onFocus={() => setActiveField('acctName')}
                onBlur={() => setActiveField(null)}
                placeholder="Account Name"
                className={inputClass('acctName', 'text-[9px] sm:text-[11px]')}
                style={{ left: '34.27%', top: '87.03%', width: '22.86%', height: '1.37%' }}
              />

              <input
                type="text"
                name="acctNo"
                value={formData.acctNo}
                onChange={(e) => handleChange('acctNo', e.target.value)}
                onFocus={() => setActiveField('acctNo')}
                onBlur={() => setActiveField(null)}
                placeholder="10-digit NUBAN"
                maxLength={10}
                className={inputClass('acctNo')}
                style={{ left: '65.32%', top: '87.03%', width: '18.51%', height: '1.37%' }}
              />

              <input
                type="text"
                name="investorSign"
                value={formData.investorSign}
                onChange={(e) => handleChange('investorSign', e.target.value)}
                onFocus={() => setActiveField('investorSign')}
                onBlur={() => setActiveField(null)}
                placeholder="Sign"
                className={inputClass('investorSign', 'font-bold italic font-serif')}
                style={{ left: '88.87%', top: '87.03%', width: '7.14%', height: '1.37%' }}
              />

              {/* Package Slot Checkboxes */}
              {/* Bronze Slot */}
              <button
                type="button"
                onClick={() => handleChange('selectedSlot', formData.selectedSlot === 'Bronze' ? '' : 'Bronze')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{ left: '25.97%', top: '91.20%', width: '3.27%', height: '1.34%' }}
                title="Bronze Slot - N300,000"
              >
                {formData.selectedSlot === 'Bronze' && (
                  <span className="text-[#071330] font-black text-[13px] sm:text-[16px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Silver Slot */}
              <button
                type="button"
                onClick={() => handleChange('selectedSlot', formData.selectedSlot === 'Silver' ? '' : 'Silver')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{ left: '49.35%', top: '91.20%', width: '3.27%', height: '1.34%' }}
                title="Silver Slot - N600,000"
              >
                {formData.selectedSlot === 'Silver' && (
                  <span className="text-[#071330] font-black text-[13px] sm:text-[16px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Gold Slot */}
              <button
                type="button"
                onClick={() => handleChange('selectedSlot', formData.selectedSlot === 'Gold' ? '' : 'Gold')}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{ left: '81.73%', top: '91.20%', width: '3.23%', height: '1.34%' }}
                title="Gold Slot - N1,200,000 and above"
              >
                {formData.selectedSlot === 'Gold' && (
                  <span className="text-[#071330] font-black text-[13px] sm:text-[16px] leading-none select-none">
                    ✕
                  </span>
                )}
                <span className="absolute inset-0 rounded-sm group-hover:bg-blue-500/20 transition-colors" />
              </button>

              {/* Bottom Payment Method & Official Date */}
              <input
                type="text"
                name="methodOfPayment"
                value={formData.methodOfPayment}
                onChange={(e) => handleChange('methodOfPayment', e.target.value)}
                onFocus={() => setActiveField('methodOfPayment')}
                onBlur={() => setActiveField(null)}
                placeholder="Transfer/Card"
                className={inputClass('methodOfPayment', 'text-[9px] sm:text-[10px]')}
                style={{ left: '76.13%', top: '95.03%', width: '8.43%', height: '1.37%' }}
              />

              <input
                type="text"
                name="officialDate"
                value={formData.officialDate}
                onChange={(e) => handleChange('officialDate', e.target.value)}
                onFocus={() => setActiveField('officialDate')}
                onBlur={() => setActiveField(null)}
                placeholder="Date"
                className={inputClass('officialDate', 'text-[9px] sm:text-[10px]')}
                style={{ left: '89.07%', top: '95.03%', width: '7.18%', height: '1.37%' }}
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
              <p className="font-bold text-white">Step 1 of 4: SBH Investment Contract Form</p>
              <p className="text-slate-400">After submitting this contract form, you will complete KYC, Agreement, and Certificate of Investment.</p>
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
                  <span>Submit & Go to KYC Form</span>
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
                Contract Form Submitted!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. Your Salvage Biz-Hub Nig Ltd Investment Contract Form has been archived with ID{' '}
                <span className="font-mono text-emerald-400 font-bold">{submittedData?.id || 'COMPLETED'}</span>. Next, please complete Step 2: your SBH KYC Form.
              </p>

              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Investor:</span>
                  <span className="font-bold text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Hectares / Amount:</span>
                  <span className="text-white">
                    {formData.hectaresInvested} ha • ₦{formData.totalAmountPaid}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Next Required Step:</span>
                  <span className="font-bold text-amber-400">Step 2: SBH KYC Form</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/kyc?onboarding=true');
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <span>Continue to Step 2: Fill KYC Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition-all border border-white/10"
                >
                  <Download className="w-4 h-4 text-brand-yellow" />
                  <span>Download Completed Contract PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
