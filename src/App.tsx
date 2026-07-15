import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import QuestionPage from "./pages/QuestionPage";
import CodexPage from "./pages/CodexPage";
import VerseReaderPage from "./pages/VerseReaderPage";
import ETUReaderPage from "./pages/ETUReaderPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import AdminVerses from "./pages/admin/AdminVerses";
import AdminRoles from "./pages/admin/AdminRoles";
import ConquestPage from "./pages/ConquestPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import TopNav from "./component/TopNav";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { onboarded } = useAuth();

  // First login after sign-up (pathway not yet chosen) bounces the user into
  // /onboarding, once. Returning users with a pathway already set skip straight
  // past it — this only fires for the new-user case, not every login.
  useEffect(() => {
    if (onboarded === false && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [onboarded, location.pathname, navigate]);

  // ETU and the admin portal are their own surfaces with their own chrome — hide the
  // Original Script nav there.
  const showNav =
    location.pathname !== "/onboarding" &&
    !location.pathname.startsWith("/etu") &&
    !location.pathname.startsWith("/admin");

  return (
    <>
      {showNav && <TopNav />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/codex" element={<CodexPage />} />
        <Route path="/codex/:book/:chapter/:verse" element={<VerseReaderPage />} />
        {/* Stable, deep-linkable verse identity: /etu/genesis/1/1 — the university
            course platform (and anyone else) can link straight into a specific verse. */}
        <Route path="/etu" element={<Navigate to="/etu/genesis/1" replace />} />
        <Route path="/etu/:book/:chapter" element={<ETUReaderPage />} />
        <Route path="/etu/:book/:chapter/:verse" element={<ETUReaderPage />} />
        {/* Admin portal — AdminLayout gates on /api/admin/me (non-admins bounce to /home) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="verses" element={<AdminVerses />} />
          <Route path="roles" element={<AdminRoles />} />
        </Route>
        <Route path="/conquest" element={<ConquestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/community/:userId" element={<PublicProfilePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}