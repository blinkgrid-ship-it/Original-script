import { Routes, Route } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import ConquestPage from "./pages/ConquestPage";
import QuestionPage from "./pages/QuestionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/question" element={<QuestionPage />} />
      <Route path="/conquest" element={<ConquestPage />} />
    </Routes>
  );
}