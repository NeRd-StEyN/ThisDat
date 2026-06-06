import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page page-enter">
      <div className="container">
        <Link to="/" className="contact-page__back">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="contact-page__header">
          <h1>Get In Touch</h1>
          <p>We're here to help! Send us your questions, feedback, or concerns.</p>
        </div>

        <div className="contact-page__grid">
          <div className="contact-page__info">
            <div className="contact-page__info-card">
              <Phone className="contact-icon" size={24} />
              <h3>Phone Support</h3>
              <p>+91 1800-123-4567</p>
              <span className="contact-hours">Mon-Sat: 9AM - 8PM</span>
            </div>
            <div className="contact-page__info-card">
              <Mail className="contact-icon" size={24} />
              <h3>Email Us</h3>
              <p>support@thisdat.com</p>
              <span className="contact-hours">We'll reply within 24 hours</span>
            </div>
            <div className="contact-page__info-card">
              <MapPin className="contact-icon" size={24} />
              <h3>Office</h3>
              <p>123 Health Avenue, MedCity</p>
              <span className="contact-hours">New Delhi, India - 110001</span>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Contact;
