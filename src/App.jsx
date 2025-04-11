import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ClaimCoins from './pages/ClaimCoins';
import Navbar from './components/NavBar';
import FoodTabs from './pages/FoodTabs';
import ViewRedeemedItems from './pages/ViewRedeemedItems';
import TierProgress from './pages/TierProgress';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCard from './pages/AuthCard';
import ScanClaim from './pages/ScanClaim';

function App() {
  return (
    <BrowserRouter>
      <AppWithNavbar />
    </BrowserRouter>
  );
}

function AppWithNavbar() {
  const location = useLocation();
  // Hide Navbar on Landing, Login, or Register pages:
  const hideNavbar =
    location.pathname === '/' ||
    location.pathname === '/auth' ||
    location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* The landing page can be set as the homepage if you prefer */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthCard />} />

        <Route
          path="/claim"
          element={
            <ProtectedRoute>
              <ClaimCoins />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food"
          element={
            <ProtectedRoute>
              <FoodTabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-redeemed-items"
          element={
            <ProtectedRoute>
              <ViewRedeemedItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tier-progress"
          element={
            <ProtectedRoute>
              <TierProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan-claim"
          element={
            <ProtectedRoute>
              <ScanClaim />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </>
  );
}

export default App;
