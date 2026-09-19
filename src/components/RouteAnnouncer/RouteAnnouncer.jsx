import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function RouteAnnouncer() {
  const location = useLocation();
  const announcementRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const heading = document.querySelector("main h1, main h2");
      if (announcementRef.current) {
        announcementRef.current.textContent = heading?.textContent ?? document.title;
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return <div ref={announcementRef} role="status" aria-live="polite" className="sr-only" />;
}

export default RouteAnnouncer;