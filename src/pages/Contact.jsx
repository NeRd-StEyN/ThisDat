import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../components/Toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Your message has been sent successfully!", "Message Sent");
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

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

          <form className="contact-page__form" onSubmit={handleSubmit}>
            <h2>Send a Message</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea 
                required 
                placeholder="How can we help you today?" 
                rows="5"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="contact-submit" disabled={loading}>
              {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
