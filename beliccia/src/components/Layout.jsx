// src/components/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import InstagramFloatingStories from "./InstagramFloatingStories";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";

const HEADER_HEIGHT = "9rem";

export default function Layout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <>
      <Header />

      <main
        className={`page-container${isHomePage ? " no-padding" : ""}`}
        style={{
          paddingTop: isHomePage ? undefined : HEADER_HEIGHT,
        }}
      >
        <Outlet />
      </main>

      <WhatsAppFloatingButton />
      <InstagramFloatingStories />

      <Footer />
    </>
  );
}
