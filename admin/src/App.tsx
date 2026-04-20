import { useEffect, useState } from 'react';
import { auth, onAuthStateChanged, FirebaseUser, db, doc, getDoc } from './firebase';
import { Toaster } from 'sonner';
import AdminPanel from './components/AdminPanel';
import LoginPage from './pages/Login';

interface AdminUserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  role?: 'user' | 'admin';
  isUpgraded?: boolean;
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AdminUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as AdminUserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <LoginPage />
      ) : profile?.role === 'admin' ? (
        <AdminPanel currentUser={user} profile={profile} />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">You do not have admin privileges.</p>
            <button
              onClick={() => auth.signOut()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
