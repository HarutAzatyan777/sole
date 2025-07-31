import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header diamond-header">
      <div className="header-container diamond-header-container">
        <Link to="/" className="logo diamond-logo">
          <img src="/logo.jpg" alt="Logo" />
        </Link>

        <nav className={`navigation diamond-nav ${menuOpen ? "open" : ""}`}>
          <ul className="diamond-nav-list">
            <li>
              <Link to="/menu" onClick={() => setMenuOpen(false)}>
                Menu
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
            {/* Ավելացրեցինք նոր լինգկ՝ Diamond Info */}
            <li>
              <Link to="/diamond-info" onClick={() => setMenuOpen(false)}>
                Diamond Info
              </Link>
            </li>
          </ul>
        </nav>

        <button
          className={`burger diamond-burger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <line x1="4" y1="4" x2="20" y2="20" stroke="black" strokeWidth="2" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="black" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" stroke="black" strokeWidth="2" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="black" strokeWidth="2" />
              <line x1="3" y1="18" x2="21" y2="18" stroke="black" strokeWidth="2" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
