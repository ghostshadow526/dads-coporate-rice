import React from 'react';
import { FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import AgreementDocumentViewer from '../components/AgreementDocumentViewer';

interface AgreementFormProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
}

export default function AgreementForm({ user, profile }: AgreementFormProps) {
  return <AgreementDocumentViewer user={user} profile={profile} isPopup={false} />;
}
