import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, FirebaseUser, db, doc, onSnapshot, setDoc, Timestamp } from './firebase';
import { UserProfile } from './types';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BoardOfDirectors from './pages/BoardOfDirectors';
import Testimonials from './pages/Testimonials';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
import Investment from './pages/Investment';
import Cooperative from './pages/Cooperative';
import BuyRice from './pages/BuyRice';
import Training from './pages/Training';
import Login from './pages/Login';
import Contact from './pages/Contact';
import CooperativeLanding from './pages/CooperativeLanding';
import InvestmentLanding from './pages/InvestmentLanding';
import PaymentStatus from './pages/PaymentStatus';
import Admin from './pages/Admin';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TalkToUs from './components/TalkToUs';
import TestimonialsSection from './components/TestimonialsSection';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const coerceTimestamp = (value: any): Timestamp => {
    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
      return value as Timestamp;
    }
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return Timestamp.fromDate(parsed);
      }
    }
    return Timestamp.now();
  };

  const normalizeUserProfile = (raw: any, firebaseUser: FirebaseUser): UserProfile => {
    const createdAt = coerceTimestamp(raw?.createdAt);

    return {
      uid: raw?.uid || firebaseUser.uid,
      displayName: raw?.displayName ?? firebaseUser.displayName ?? null,
      email: raw?.email || firebaseUser.email || '',
      phoneNumber: raw?.phoneNumber ?? '',
      address: raw?.address ?? '',
      city: raw?.city ?? '',
      state: raw?.state ?? '',
      role: raw?.role || 'user',
      isUpgraded: raw?.isUpgraded ?? false,
      walletBalance: typeof raw?.walletBalance === 'number' ? raw.walletBalance : 0,
      createdAt,
    };
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);

        unsubscribeProfile = onSnapshot(
          userRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              const normalized = normalizeUserProfile(snapshot.data(), firebaseUser);
              setUserProfile(normalized);

              // Backfill any missing/invalid fields once (e.g., older docs).
              const raw = snapshot.data() as any;
              const needsBackfill =
                raw?.uid !== normalized.uid ||
                raw?.email !== normalized.email ||
                raw?.role == null ||
                raw?.createdAt == null ||
                (raw?.createdAt && !(typeof raw.createdAt === 'object' && typeof raw.createdAt.toDate === 'function')) ||
                raw?.walletBalance == null ||
                raw?.isUpgraded == null ||
                raw?.phoneNumber == null ||
                raw?.address == null ||
                raw?.city == null ||
                raw?.state == null;

              if (needsBackfill) {
                await setDoc(userRef, normalized, { merge: true });
              }
            } else {
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName ?? null,
                email: firebaseUser.email || '',
                phoneNumber: '',
                address: '',
                city: '',
                state: '',
                role: 'user',
                isUpgraded: false,
                createdAt: Timestamp.now(),
                walletBalance: 0,
              };
              await setDoc(userRef, newProfile);
              setUserProfile(newProfile);
            }

            setLoading(false);
          },
          () => {
            // If the profile subscription fails, fall back to showing the app without a profile.
            setUserProfile(null);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent user={user} userProfile={userProfile} />
    </Router>
  );
}

function AppContent({ user, userProfile }: { user: FirebaseUser | null, userProfile: UserProfile | null }) {
  const location = useLocation();
  const isAppPage = location.pathname.startsWith('/dashboard') || 
                    location.pathname.startsWith('/invest') || 
                    location.pathname.startsWith('/cooperative') || 
                    location.pathname.startsWith('/buy-rice') || 
                    location.pathname.startsWith('/training') ||
                    location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900">
        {!isAppPage && <Navbar user={user} profile={userProfile} />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/about/board" element={<BoardOfDirectors />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cooperative-info" element={<CooperativeLanding />} />
            <Route path="/investment-info" element={<InvestmentLanding />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route
              path="/admin"
              element={
                user && userProfile?.role === 'admin'
                  ? <DashboardLayout><Admin currentUser={user} profile={userProfile} /></DashboardLayout>
                  : <Navigate to="/login" />
              }
            />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={user ? <DashboardLayout><Dashboard user={user} profile={userProfile} /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/invest" element={user ? <DashboardLayout><Investment user={user} profile={userProfile} /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/cooperative" element={user ? <DashboardLayout><Cooperative user={user} profile={userProfile} /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/buy-rice" element={user ? <DashboardLayout><BuyRice user={user} profile={userProfile} /></DashboardLayout> : <Navigate to="/login" />} />
            <Route path="/training" element={user ? <DashboardLayout><Training user={user} profile={userProfile} /></DashboardLayout> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {!isAppPage && (
          <>
            <TestimonialsSection />
            <TalkToUs />
            <Footer />
          </>
        )}
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}
