import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import QuestionPage from "./pages/QuestionPage";
import CodexPage from "./pages/CodexPage";
import ConquestPage from "./pages/ConquestPage";
import ProfilePage from "./pages/ProfilePage";
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
        <Route path="/conquest" element={<ConquestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    // ThemeProvider must be outermost so the data-theme attribute on <html>
    // is set before any child renders. AuthProvider sits inside.
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}