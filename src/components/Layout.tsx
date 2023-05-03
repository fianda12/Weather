import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-container w-full h-screen flex flex-col bg-white overflow-auto">
      <div className="h-full overflow-auto p-3">{children}</div>
    </div>
  );
}

export default Layout;
