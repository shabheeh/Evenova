import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, MapPin, Menu, X } from "lucide-react";
import { useTheme } from "../../contexts/theme-provider";
import { NavLink as Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/app/store";

export const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-serif font-bold text-primary">
                Evenova
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/events"
                className="text-foreground hover:text-primary transition-colors"
              >
                Events
              </Link>
              <Link
                to="/create-event"
                className="text-foreground hover:text-primary transition-colors"
              >
                Create Event
              </Link>
            </nav>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {!isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            ) : <div>
                  {user?.name}
                </div>}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search events..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors py-2"
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  className="text-foreground hover:text-primary transition-colors py-2"
                >
                  Events
                </Link>
                <Link
                  to="/create-event"
                  className="text-foreground hover:text-primary transition-colors py-2"
                >
                  Create Event
                </Link>
              </nav>
              {!isAuthenticated ? (
                <div className="flex space-x-2 pt-2">
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link to="/register">Sign up</Link>
                  </Button>
                </div>
              ) : (
                <div>
                  {user?.name}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
