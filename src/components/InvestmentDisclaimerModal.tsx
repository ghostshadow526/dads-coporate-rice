import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface InvestmentDisclaimerModalProps {
  onAccept: () => void;
  onDecline?: () => void;
}

export default function InvestmentDisclaimerModal({
  onAccept,
  onDecline,
}: InvestmentDisclaimerModalProps) {
  const [hasRead, setHasRead] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleAccept = () => {
    if (!hasAccepted) {
      toast.error('Please check the acceptance box');
      return;
    }
    toast.success('Disclaimer accepted!');
    setTimeout(() => onAccept(), 500);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="disclaimer-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 md:px-8 py-4 text-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-bold">Important Disclaimer</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">SALVAGE BIZ-HUB INVESTMENT PACKAGES</h1>
                <p className="text-gray-600 text-sm mt-2">Please read this disclaimer carefully before proceeding</p>
              </div>

              {/* Disclaimer Content */}
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                  <p className="font-semibold text-gray-900 mb-2">
                    At Salvage Biz-Hub, we are committed to providing transparent and responsible investment opportunities.
                  </p>
                  <p>By participating in any of our investment packages, you acknowledge and agree to the following:</p>
                </div>

                {/* Section 1 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">1. Source of Funds</h3>
                  <p className="text-gray-700">
                    Investor(s) are expected to use funds obtained through legitimate and lawful means. Salvage Biz-Hub
                    operates in line with regulatory standards and encourages full compliance with all applicable laws.
                    <strong className="block mt-2">
                      Responsibility for the source of investment funds remains with the Investor and he/she takes
                      responsibility for any arising matters regarding the invested fund.
                    </strong>
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">2. Regulatory Compliance</h3>
                  <p className="text-gray-700">
                    The Company maintains a commitment to ethical business practices, including adherence to applicable
                    financial and anti-money laundering regulations. Where necessary, the Company may conduct checks to
                    ensure compliance.
                  </p>
                </div>

                {/* Section 3 */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <h3 className="font-bold text-gray-900 mb-2">3. Investment Risk Awareness</h3>
                  <p className="text-gray-700">
                    Every investment carries a degree of risk, and while Salvage Biz-Hub strives to create profitable
                    opportunities, returns cannot be 100% guaranteed.
                  </p>
                  <p className="text-red-700 font-semibold mt-2">
                    ✓ Principal capital IS 100% refund guaranteed.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Investors are encouraged to make informed decisions and invest amounts aligned with their financial
                    capacity.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">4. Shared Responsibility</h3>
                  <p className="text-gray-700">
                    Investment decisions are made at the discretion of the Investor. Salvage Biz-Hub provides opportunities
                    and guidance, while outcomes may vary depending on market and operational conditions.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">5. Commitment to Transparency</h3>
                  <p className="text-gray-700">
                    We are dedicated to maintaining clear communication and building trust with our investors. Should any
                    concerns arise, our team remains available to provide clarification and support.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <p className="font-semibold text-gray-900 mb-2">For Questions or Concerns:</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Email:</strong> salvagebizhub.investment@gmail.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +234 (0)9167313334, +234 (0)8087040744
                    </p>
                    <p>
                      <strong>Hours:</strong> 8:30 AM - 4:30 PM, Monday to Friday
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Statement */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 text-center">
                  By proceeding with any investment package, you confirm your understanding of the above and your
                  willingness to participate under these terms.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 md:px-8 py-4 space-y-4">
            <div className="space-y-3">
              <label className="flex items-start space-x-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRead}
                  onChange={(e) => setHasRead(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-gray-700">I have read and understand the disclaimer</span>
              </label>

              <label className="flex items-start space-x-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAccepted}
                  onChange={(e) => setHasAccepted(e.target.checked)}
                  disabled={!hasRead}
                  className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500 cursor-pointer disabled:opacity-50"
                />
                <span className={`${!hasRead ? 'text-gray-400' : 'text-gray-700'}`}>
                  I accept the terms and conditions and confirm my understanding of the investment risks
                </span>
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onDecline}
                className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold"
              >
                Decline
              </button>
              <motion.button
                onClick={handleAccept}
                disabled={!hasAccepted}
                whileHover={{ scale: hasAccepted ? 1.02 : 1 }}
                whileTap={{ scale: hasAccepted ? 0.98 : 1 }}
                className="flex items-center justify-center space-x-2 px-6 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Accept & Continue</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
