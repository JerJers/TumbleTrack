import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/organisms/NavBar";
import DashboardPage from "./pages/DashboardPage";
import LogLoadPage from "./pages/LogLoadPage";
import ClothingPage from "./pages/ClothingPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-shell">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/log" element={<LogLoadPage />} />
            <Route path="/clothing" element={<ClothingPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
