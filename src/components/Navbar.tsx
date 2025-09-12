import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChefHat } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const Navbar = ({ onSearch, showSearch = true }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-spice bg-clip-text text-transparent">
              Recipe Finder
            </span>
          </Link>

          {/* Search Bar */}
          {showSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-secondary/50 border-border focus:border-primary transition-colors"
                />
              </div>
            </form>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              asChild
              className="hidden md:inline-flex"
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={isActive("/recipes") ? "default" : "ghost"}
              asChild
              className="hidden md:inline-flex"
            >
              <Link to="/recipes">Recipes</Link>
            </Button>
            <Button
              variant={isActive("/about") ? "default" : "ghost"}
              asChild
              className="hidden md:inline-flex"
            >
              <Link to="/about">About</Link>
            </Button>
            <Button
              variant={isActive("/contact") ? "default" : "ghost"}
              asChild
              className="hidden md:inline-flex"
            >
              <Link to="/contact">Contact</Link>
            </Button>

            {/* Mobile Search Button */}
            <Button variant="outline" size="icon" className="md:hidden">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-secondary/50 border-border focus:border-primary transition-colors"
              />
            </div>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;