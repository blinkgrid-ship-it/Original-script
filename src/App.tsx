import { Routes, Route } from "react-router-dom";
import LandingPage from "./component/landing/LandingPage";
import CodexPage from "./component/landing/CodexPage";
import ConquestPage from "./pages/ConquestPage";
import ChroniclePage from "./pages/ChroniclePage";
import CommunityPage from "./pages/CommunityPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/codex" element={<CodexPage />} />
      <Route path="/conquest" element={<ConquestPage />} />
      <Route path="/chronicle" element={<ChroniclePage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}