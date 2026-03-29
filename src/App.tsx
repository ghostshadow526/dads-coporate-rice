import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, FirebaseUser, db, doc, getDoc, setDoc, Timestamp } from './firebase';
import { UserProfile } from './types';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BoardOfDirectors from './pages/BoardOfDirectors';
import Testimonials from './pages/Testimonials';
import Dashboard from './pages/Dashboard';
import Investment from './pages/Investment';
import Cooperative from './pages/Cooperative';
import BuyRice from './pages/BuyRice';
import Training from './pages/Training';
import Login from './pages/Login';
import Contact from './pages/Contact';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create user profile
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email!,
            role: 'user',
            createdAt: Timestamp.now(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
          setUserProfile(newProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
                    location.pathname.startsWith('/training');

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            
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
