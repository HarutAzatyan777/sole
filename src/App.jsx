import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";  // <-- ԱՅՍՏԵՂ
import "@fontsource/inter"; 
import "@fontsource/dm-serif-display";

import { getRoutes } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <HelmetProvider> {/* <-- ԱՂԲՅՈՒՐ */}
        <Router>
          <RoutesWithAuth />
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

// Wrapper to access context
function RoutesWithAuth() {
  const { user } = useAuth();
  return <Routes>{getRoutes(user)}</Routes>;
}
