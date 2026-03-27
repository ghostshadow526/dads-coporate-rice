import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

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
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900">
          <Navbar user={user} profile={userProfile} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/about/board" element={<BoardOfDirectors />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={user ? <Dashboard user={user} profile={userProfile} /> : <Navigate to="/login" />} />
              <Route path="/invest" element={user ? <Investment user={user} profile={userProfile} /> : <Navigate to="/login" />} />
              <Route path="/cooperative" element={user ? <Cooperative user={user} profile={userProfile} /> : <Navigate to="/login" />} />
              <Route path="/buy-rice" element={user ? <BuyRice user={user} profile={userProfile} /> : <Navigate to="/login" />} />
              <Route path="/training" element={user ? <Training user={user} profile={userProfile} /> : <Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
