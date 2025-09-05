
import { NavbarData } from "../data/Navbar";
import { NavLink } from "react-router-dom";
import { FileText, Home } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full glass-effect border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PasteApp
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {NavbarData.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`
                }
              >
                {link.title === "Home" ? (
                  <Home className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span>{link.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
