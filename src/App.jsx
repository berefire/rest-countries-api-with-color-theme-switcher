import { Routes, Route, useLocation } from "react-router-dom";
import RouteAnnouncer from "@/components/RouteAnnouncer/RouteAnnouncer";
import { useEffect, useRef } from "react";
import Header from "@/components/Header/Header";
import Attribution from "@/components/Attribution/Attribution";
import Home from "@/pages/Home/Home";
import CountryDetailPage from "@/pages/CountryDetailPage/CountryDetailPage";

function App() {
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, [location]);

  return (
    <div className="min-h-dvh flex flex-col bg-white dark:bg-blue-950">
      <Header />
      <main className="flex-1 focus:outline-none" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryDetailPage />} />
        </Routes>
      </main>
      <RouteAnnouncer />
      <Attribution />
    </div>
  );
}

export default App;