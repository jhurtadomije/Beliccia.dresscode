import AppRoutes from "./AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <BackToTop/>
      <AppRoutes />
    </>
  );
}
