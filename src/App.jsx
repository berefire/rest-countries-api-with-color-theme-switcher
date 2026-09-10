import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header/Header";
import Attribution from "@/components/Attribution/Attribution";
import Home from "@/pages/Home/Home";
import CountryDetailPage from "@/pages/CountryDetailPage/CountryDetailPage";

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white dark:bg-blue-950">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryDetailPage />} />
        </Routes>
      </main>
      <Attribution />
    </div>
  );
}

export default App;