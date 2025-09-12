import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showSearch?: boolean;
}

const Layout = ({ children, showSearch = true }: LayoutProps) => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/recipes?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onSearch={handleSearch} showSearch={showSearch} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;