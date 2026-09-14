import NavMenu from "./NavMenu";
import Footer from "./Footer";

export function SiteChrome({
  children,
  role,
  onClose,
}: {
  children: React.ReactNode;
  role: string;
  onClose: () => void;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <NavMenu role={role} onClose={onClose} />
      {children}
      <Footer />
    </div>
  );
}
