import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./AuthContext.tsx";
import { useEffect } from "react";

function AppBootstrap() {
  
  useEffect(() => {
    document.getElementById("initial-loader")?.remove();
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <AppBootstrap />
    </AuthProvider>
  </BrowserRouter>,
);
