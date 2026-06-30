import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import QuestionPage from "./pages/QuestionPage";
import CodexPage from "./pages/CodexPage";
import VerseReaderPage from "./pages/VerseReaderPage";
import ConquestPage from "./pages/ConquestPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import TopNav from "./component/TopNav";

function AppRoutes() {
  const location = useLocation();
  const showNav = location.pathname !== "/";

  return (
    <>
      {showNav && <TopNav />}
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/codex" element={<CodexPage />} />
        <Route path="/codex/:book/:chapter/:verse" element={<VerseReaderPage />} />
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