import React from "react";
import "./ContactPage.css"; // Optional: for styling

const ContactPage = () => {
  return (
    <section className="contact-page">
      <div className="container">
        <h1>Կապ մեզ հետ</h1>

        <div className="contact-info">
          <div>
            <h3>Հեռախոս</h3>
            <p>+374 55 44-48-55</p>
          </div>

          <div>
            <h3>Էլ. հասցե</h3>
            <p>hello@solejewelry.com</p>
          </div>

          <div>
            <h3>Հասցե</h3>
            <p>Մոսկովյան 26, Երևան</p>
          </div>
        </div>

        <div className="contact-hours">
          <h3>Աշխատանքային ժամեր</h3>
          <p>Երկուշաբթի - Կիրակի: 8:00 - 23:00</p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
