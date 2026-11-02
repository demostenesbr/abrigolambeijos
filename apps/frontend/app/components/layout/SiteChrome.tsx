import NavMenu from "./NavMenu";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import SessionWatcher from "./SessionWatcher";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SessionWatcher />
      <NavMenu />
      {children}
      <Footer />
      <CookieConsent />
    </div>
  );
}
