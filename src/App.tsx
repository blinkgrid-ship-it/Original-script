import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import QuestionPage from "./pages/QuestionPage";
import CodexPage from "./pages/CodexPage";
import VerseReaderPage from "./pages/VerseReaderPage";
import ETUReaderPage from "./pages/ETUReaderPage";
import ConquestPage from "./pages/ConquestPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import TopNav from "./component/TopNav";

function AppRoutes() {
  const location = useLocation();
  // ETU is its own product with its own header — hide the Original Script nav there.
  const showNav = location.pathname !== "/" && !location.pathname.startsWith("/etu");

  return (
    <>
      {showNav && <TopNav />}
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/codex" element={<CodexPage />} />
        <Route path="/codex/:book/:chapter/:verse" element={<VerseReaderPage />} />
        {/* Stable, deep-linkable verse identity: /etu/genesis/1/1 — the university
            course platform (and anyone else) can link straight into a specific verse. */}
        <Route path="/etu" element={<Navigate to="/etu/genesis/1" replace />} />
        <Route path="/etu/:book/:chapter" element={<ETUReaderPage />} />
        <Route path="/etu/:book/:chapter/:verse" element={<ETUReaderPage />} />
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