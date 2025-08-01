import React from "react";
import "./AboutPage.css"; // Make sure you handle styling for video

const AboutPage = () => {
  return (
    <section className="about-page">
      {/* Background video */}
      <video className="background-video" autoPlay loop muted playsInline>
     
        <source src="/videos/jewelry-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="aboute-container">
        <h1>About Us</h1>
        <p>
          Sole Jewelry is dedicated to creating exceptional gold and silver jewelry
          that expresses refined style and individuality. All of our products are
          crafted with great care and love to ensure quality, durability, and beauty.
        </p>
        <p>
          Our store has been operating since 2018, and we have already served
          thousands of satisfied customers—both locally and internationally. We are
          proud of the trust and affection of our clients.
        </p>
        <p>
          Interested in jewelry made to your own vision? We offer custom-made orders
          tailored to your preferences.
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
