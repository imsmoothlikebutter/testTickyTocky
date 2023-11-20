// Import React and a CSS file for styling
import React from "react";
import "../styles/AboutUs.css";

// Functional component representing an "About Us" page
export const AboutUs = () => {
  return (
    // Render the content of the "About Us" page
    <div className="about-us">
      <div className="content">
        <h2>About TickyTocky</h2>
        <p>
          TickyTocky is dedicated to ensuring the authenticity of watches. We
          are committed to providing watch enthusiasts, collectors, and buyers
          with a trusted and reliable resource to verify the authenticity of
          timepieces.
        </p>
        <h2>Our Mission</h2>
        <p>
          At TickyTocky, we employ a team of expert horologists who meticulously
          inspect and certify each watch that comes through our doors. Our
          rigorous authentication process involves a comprehensive examination
          of the watch's components, movement, and provenance.
        </p>
        <h2>Our Database</h2>
        <p>
          We maintain a comprehensive database of certified watches, making it
          easy for users to search and verify the authenticity of their
          timepieces. Our database is continually updated with new
          certifications, making it an invaluable tool for watch enthusiasts
          worldwide.
        </p>
        <h2>Why Choose TickyTocky</h2>
        <p>
          With TickyTocky, you can trust that your watch has been thoroughly
          examined and certified by experts in the field. Our commitment to
          accuracy and integrity sets us apart, ensuring that you can buy, sell,
          and collect watches with confidence.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions, need assistance, or want to learn more
          about our services, please don't hesitate to contact us. Our dedicated
          team is here to help you.
        </p>
        <p className="contact-info">
          Contact Email:{" "}
          <a href="mailto:info@tickytocky.com">info@tickytocky.com</a>
        </p>
      </div>
    </div>
  );
};
