import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toolsRef = useRef(null);

  // Toggle main menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Toggle dropdown accordion
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Close dropdown when clicking outside (desktop + mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // mobile support
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Close menu & dropdown on link click
  const handleLinkClick = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="site-header adobe-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src="/logo.jpg" alt="Logo" />
        </Link>

        {/* Navigation */}
        <nav className={`navigation ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/about" onClick={handleLinkClick}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleLinkClick}>
                Contact
              </Link>
            </li>

            <li
              className={`dropdown ${activeDropdown === "tools" ? "open" : ""}`}
              ref={toolsRef}
            >
              <button
                className="dropdown-btn"
                onClick={() => toggleDropdown("tools")}
                aria-expanded={activeDropdown === "tools"}
              >
                Tools <span className="arrow-line"></span>
              </button>

              <ul className="dropdown-menu">
                <li>
                  <Link to="/diamond-info" onClick={handleLinkClick}>
                    Diamond Info
                  </Link>
                </li>
                <li>
                  <Link to="/gold-calculator" onClick={handleLinkClick}>
                    Gold Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/diamont-mm-converter/en" onClick={handleLinkClick}>
                    Diamond MM Converter
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jewelry-priceCalculator-calculator/en"
                    onClick={handleLinkClick}
                  >
                    JewelryPriceCalculator
                  </Link>
                </li>
                <li>
                  <Link to="/gold-price" onClick={handleLinkClick}>
                    Gold Price
                  </Link>
                </li>

                <li>
                  <Link to="/exchange-rate" onClick={handleLinkClick}>
                    ExchangeRatePage
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/blog" onClick={handleLinkClick}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        {/* Burger Menu */}
        <button
          className={`burger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
