import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/logo.jpg" alt="Logo" />
        </Link>

        <nav className={`navigation ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/menu" onClick={() => setMenuOpen(false)}>Մենյու</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>Մեր մասին</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Կապ</Link></li>
          </ul>
        </nav>

        <button className={`burger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
