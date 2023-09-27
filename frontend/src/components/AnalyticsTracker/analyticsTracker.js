import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics only once
    if (!ReactGA.ga()) {
      ReactGA.initialize('G-3CRZGVCEKY');
    }

    // Track the page view
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return null;
}

export default AnalyticsTracker;
