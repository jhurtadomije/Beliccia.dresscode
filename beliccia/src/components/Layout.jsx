// src/components/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import InstagramFloatingStories from "./instagram/InstagramFloatingStories";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";
import PageTransition from "./PageTransition";
import CookieBanner from "./CookieBanner";

const HEADER_HEIGHT = "9rem";

export default function Layout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <>
    <CookieBanner/>
      <Header />

      <main
        className={`page-container${isHomePage ? " no-padding" : ""}`}
        style={{
          paddingTop: isHomePage ? undefined : HEADER_HEIGHT,
        }}
      >
        <PageTransition key={location.pathname}>
        <Outlet />
        </PageTransition>
      </main>

      <WhatsAppFloatingButton />
      <InstagramFloatingStories />

      <Footer />
    </>
  );
}
