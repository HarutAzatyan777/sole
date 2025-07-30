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
            <li><Link to="/menu" onClick={() => setMenuOpen(false)}>Մենյու</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>Մեր մասին</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Կապ</Link></li>
          </ul>
        </nav>

        <button
          className={`burger diamond-burger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Փակել Մենյուն" : "Բացել Մենյուն"}
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
