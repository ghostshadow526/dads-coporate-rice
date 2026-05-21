import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, AlertCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { generateAgreementPDF } from '../services/pdfService';

interface InvestmentAgreementModalProps {
  user: any;
  investment: any;
  onComplete: () => void;
  onCancel?: () => void;
}

export default function InvestmentAgreementModal({
  user,
  investment,
  onComplete,
  onCancel,
}: InvestmentAgreementModalProps) {
  const [formData, setFormData] = useState({
    effectiveDate: new Date().toISOString().split('T')[0],
    partnerName: investment.fullName || '',
    partnerAddress: investment.address || '',
    fundingPackage: `${investment.slots} slot(s)`,
    amountPaid: `NGN ${investment.amount.toLocaleString()}`,
    witnessName: '',
    witnessRelationship: '',
    witnessSignature: '',
  });

  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasReadAgreement, setHasReadAgreement] = useState(false);

  const documentSections = [
    {
      title: 'SALVAGE BIZ-HUB NIG LTD',
      content: 'JOINT-VENTURE FARMING AGREEMENT',
      subtitle: 'Head Office Address: Block A Josfood, Adjacent Civil Defense Headquarters, Jos, Plateau State.',
    },
  ];

  const handleDownload = async () => {
    if (!formData.partnerName || !formData.partnerAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await generateAgreementPDF({
        ...formData,
        user,
        investment,
        signatureRequired: true,
      });
      toast.success('Agreement downloaded successfully!');
      setTimeout(() => onComplete(), 1000);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleScrollCheck = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPercentage = (e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight)) * 100;
    setScrollPosition(scrollPercentage);
    if (scrollPercentage > 80) {
      setHasReadAgreement(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="agreement-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 md:px-8 py-4 text-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Investment Agreement</h2>
                  <p className="text-sm text-green-100">SALVAGE BIZ-HUB NIG LTD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Agreement Text */}
            <div
              onScroll={handleScrollCheck}
              className="flex-1 overflow-y-auto px-6 md:px-8 py-6 text-sm text-gray-700 leading-relaxed"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Title Section */}
                <div className="text-center space-y-2 mb-8 pb-6 border-b">
                  <h1 className="text-2xl font-bold text-gray-900">SALVAGE BIZ-HUB NIG LTD</h1>
                  <h2 className="text-xl font-bold text-gray-800">JOINT-VENTURE FARMING AGREEMENT</h2>
                  <p className="text-xs text-gray-600 mt-3">
                    Head Office Address: Block A Josfood, Adjacent Civil Defense Headquarters, Jos, Plateau State.
                    <br />
                    Email: salvagebizhub@gmail.com | Phone: +234 (0)9167313334
                  </p>
                </div>

                {/* Introduction */}
                <div className="space-y-4">
                  <p>
                    This Joint-venture agriculture business agreement ("Contract") is entered into on{' '}
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                      className="border-b border-gray-300 px-2 py-1 font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500 w-48"
                    />{' '}
                    ("Effective Date") by and between; Salvage Biz-Hub Nig Ltd ("Company"), a company duly registered with
                    the Corporate Affairs Commission (CAC) with registration No. RC-1840192, compliance and certified with
                    (SCUML) certificate by the Economic and financial crimes commission (EFCC) and a registered member of
                    the Plateau State Chamber of Commerce, Mines and Agriculture (PLACCIMA).
                  </p>

                  <p className="font-semibold">And</p>

                  <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Partner Name</label>
                      <input
                        type="text"
                        value={formData.partnerName}
                        onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                        className="w-full border-b-2 border-gray-400 px-2 py-1 font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Full Name"
                      />
                    </p>
                    <p>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Contact Address</label>
                      <input
                        type="text"
                        value={formData.partnerAddress}
                        onChange={(e) => setFormData({ ...formData, partnerAddress: e.target.value })}
                        className="w-full border-b-2 border-gray-400 px-2 py-1 font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Full Address"
                      />
                    </p>
                  </div>
                </div>

                {/* Key Terms Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 uppercase">PARTNERSHIP TERMS</h3>

                  <div className="space-y-3">
                    <p>
                      <strong>Funding Package Subscribed to:</strong>
                      <span className="ml-2 px-3 py-1 bg-green-50 rounded border border-green-200 text-gray-900 font-semibold">
                        {formData.fundingPackage}
                      </span>
                    </p>
                    <p>
                      <strong>Amount Paid:</strong>
                      <span className="ml-2 px-3 py-1 bg-green-50 rounded border border-green-200 text-gray-900 font-semibold">
                        {formData.amountPaid}
                      </span>
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="font-semibold text-gray-900">ROI - Profit Sharing Terms:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-gray-700">
                      <li>38% profit sharing (ROI) to the partner in every six (6) months</li>
                      <li>Minimum 12 months funding period before principal capital withdrawal</li>
                      <li>Farm proceeds (profit) shared every 6 months after cultivation and harvesting</li>
                      <li>Risk managed through insurance with 0% loss guarantee</li>
                    </ul>
                  </div>
                </div>

                {/* Company Policy */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 uppercase">COMPANY POLICY</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Rice Purchase Requirement:</strong> Partner must purchase finished DAD's RICE brand products
                      per slot (1 bag 50kg on hectare, 25kg on half-hectare, 10kg on acres)
                    </p>
                    <p>
                      <strong>Tax Responsibility:</strong> VAT of 7.5% from investor's profit shall be debited for tax payment
                    </p>
                    <p>
                      <strong>Fund Source Verification:</strong> All provided KYC information must be accurate and complete.
                      Company will not accept funds from illicit sources.
                    </p>
                  </div>
                </div>

                {/* Important Clauses */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 uppercase">KEY CLAUSES & CONDITIONS</h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="font-semibold">Communication Channels:</p>
                      <p className="text-sm">Phone: 09167313334 | Email: salvagebizhub.investment@gmail.com</p>
                      <p className="text-sm">Office Hours: 8:30 AM - 4:30 PM, Monday to Friday</p>
                    </div>
                    <div>
                      <p className="font-semibold">ROI Payment Timeline:</p>
                      <p className="text-sm">Payment within 21-28 days after due date (subject to partner fund recovery)</p>
                    </div>
                    <div>
                      <p className="font-semibold">Termination Clause:</p>
                      <p className="text-sm">Early termination subject to agreed approval; investor liable for inconvenience costs</p>
                    </div>
                    <div>
                      <p className="font-semibold">Dispute Resolution:</p>
                      <p className="text-sm">
                        Disputes resolved through Alternative Dispute Resolution (ADR) or arbitration per Nigerian law
                      </p>
                    </div>
                  </div>
                </div>

                {/* Witness Section */}
                <div className="space-y-4 mt-8 pt-6 border-t">
                  <h3 className="font-bold text-gray-900 uppercase">WITNESS INFORMATION</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Witness Name</label>
                      <input
                        type="text"
                        value={formData.witnessName}
                        onChange={(e) => setFormData({ ...formData, witnessName: e.target.value })}
                        className="w-full border-b-2 border-gray-300 px-2 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Relationship</label>
                      <input
                        type="text"
                        value={formData.witnessRelationship}
                        onChange={(e) => setFormData({ ...formData, witnessRelationship: e.target.value })}
                        className="w-full border-b-2 border-gray-300 px-2 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g., Spouse, Friend, Colleague"
                      />
                    </div>
                  </div>
                </div>

                {/* Scroll Indicator */}
                {!hasReadAgreement && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Please scroll down to read the full agreement</p>
                      <p>{Math.round(scrollPosition)}% read</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 md:px-8 py-4 space-y-4">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                id="agree"
                checked={hasReadAgreement}
                onChange={(e) => setHasReadAgreement(e.target.checked)}
                className="mt-1 rounded focus:ring-green-500"
              />
              <label htmlFor="agree">I have read and understand the agreement terms</label>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleDownload}
                disabled={!hasReadAgreement || !formData.partnerName || !formData.partnerAddress}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Download Agreement PDF</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
