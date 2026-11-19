import React from 'react';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import CertificateDocumentViewer from '../components/CertificateDocumentViewer';

interface CertificateFormProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
}

export default function CertificateForm({ user, profile }: CertificateFormProps) {
  return <CertificateDocumentViewer user={user} profile={profile} isPopup={false} />;
}
