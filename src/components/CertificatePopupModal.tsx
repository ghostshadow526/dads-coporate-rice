import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import CertificateDocumentViewer from './CertificateDocumentViewer';
import { CertificateFormData } from '../services/certificatePdfService';

interface CertificatePopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  agreementSubmittedId?: string;
  onDownloadAgreementPdf?: () => void;
  onDownloadKycPdf?: () => void;
  onSubmitted?: (submissionId: string, data: CertificateFormData) => void;
}

export default function CertificatePopupModal({
  isOpen,
  onClose,
  user,
  profile,
  agreementSubmittedId,
  onDownloadAgreementPdf,
  onDownloadKycPdf,
  onSubmitted,
}: CertificatePopupModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full sm:h-[92vh] sm:max-w-6xl bg-slate-900 sm:rounded-3xl border border-white/15 shadow-2xl overflow-y-auto overflow-x-hidden relative flex flex-col"
          >
            <CertificateDocumentViewer
              user={user}
              profile={profile}
              isPopup={true}
              onClosePopup={onClose}
              onSubmitted={onSubmitted}
              onDownloadAgreementPdf={onDownloadAgreementPdf}
              onDownloadKycPdf={onDownloadKycPdf}
              agreementSubmittedId={agreementSubmittedId}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
