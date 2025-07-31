import React from "react";
import "./Footer.css";
import instaLogo from "../../assets/logo.png"; // Add your Instagram logo here
import qrCode from "../../assets/instagram-qr.png";      // Add your QR code image here

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <h2 className="footer-title">Gold Jewelry</h2>
        <p className="footer-description">
          Our gold jewelry is made from high-quality materials, with traditional craftsmanship and modern design. Each piece of jewelry carries its own history and uniqueness, combining heritage and innovation.
        </p>
        <address className="footer-address">
          Address: Khorenatsi 24, Yerevan<br />
          Phone: +374 94 12 34 56
        </address>

        <div className="footer-social">
          <a
            href="https://www.instagram.com/sole_jewelry_?igsh=ZWRxN3g1cGhqb2Jy&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-link"
          >
            <img src={instaLogo} alt="Instagram" className="insta-logo" />
            <span>@sole_jewelry_</span>
          </a>
          <img src={qrCode} alt="Instagram QR" className="qr-code" />
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Gold Jewelry. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
