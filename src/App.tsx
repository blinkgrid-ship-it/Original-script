import { Routes, Route, useLocation } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import LandingPage from "./pages/LandingPage";
import QuestionPage from "./pages/QuestionPage";
import CodexPage from "./pages/CodexPage";
import ConquestPage from "./pages/ConquestPage";
import ProfilePage from "./pages/ProfilePage";
import TopNav from "./component/TopNav";
export default function App() {
  const { pathname } = useLocation();
  const showNav = pathname !== "/";

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