import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-4D49B9MX9V', {
      page_path: location.pathname,
    });
  }, [location]);

  return null;
}

export default AnalyticsTracker;