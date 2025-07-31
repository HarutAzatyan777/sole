import React from "react";
import "./ContactPage.css"; // Optional: for styling

const ContactPage = () => {
  return (
    <section className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>

        <div className="contact-info">
          <div>
            <h3>Phone</h3>
            <p>+374 55 44-48-55</p>
          </div>

          <div>
            <h3>Email</h3>
            <p>hello@solejewelry.com</p>
          </div>

          <div>
            <h3>Address</h3>
            <p>Khorenatsi 24, Yerevan</p>
          </div>
        </div>

        <div className="contact-hours">
          <h3>Working Hours</h3>
          <p>Monday - Sunday: 8:00 AM - 11:00 PM</p>
        </div>

        <div className="contact-description">
          <p>
            Our gold jewelry is crafted from high-quality materials with traditional craftsmanship and modern design.
            Each piece tells its own story and uniqueness, blending heritage with innovation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
