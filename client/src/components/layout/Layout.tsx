import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { gsap } from "gsap";
import "./layout.css";
import { ThemeProvider } from "../../contexts/theme-provider";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    gsap.fromTo(
      ".page-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="font-sans antialiased min-h-screen">
        <main className="page-content">{children || <Outlet />}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
