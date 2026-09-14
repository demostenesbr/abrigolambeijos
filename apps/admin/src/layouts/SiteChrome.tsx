import NavMenu from "./NavMenu";
import Footer from "./Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <NavMenu />
      {children}
      <Footer />
    </div>
  );
}
