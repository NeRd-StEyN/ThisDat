import { useState, useEffect } from 'react';
import './AuthCarousel.css';

const carouselItems = [
  {
    title: "Make Healthcare Simpler",
    description: "Get medicine information, order medicines, book lab tests and consult doctors online from the comfort of your home.",
    iconClass: "illustration-1" // We can style these or just use text/emojis if images are missing
  },
  {
    title: "Medicines, Home Delivered",
    description: "Order any medicine or health product and we'll deliver it for free straight to your door.",
    iconClass: "illustration-2"
  },
  {
    title: "Authentic Medicines",
    description: "100% genuine medicines from top brands with guaranteed quality and safety.",
    iconClass: "illustration-3"
  },
  {
    title: "Track Your Orders",
    description: "Easily track your orders in real-time and get instant updates on delivery.",
    iconClass: "illustration-4"
  }
];

const AuthCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const item = carouselItems[activeIndex];

  return (
    <div className="auth-carousel">
      <div className={`auth-1mg-illustration ${item.iconClass}`}></div>
      <h2 className="auth-carousel__title fade-in" key={`title-${activeIndex}`}>{item.title}</h2>
      <p className="auth-carousel__desc fade-in" key={`desc-${activeIndex}`}>{item.description}</p>
      
      <div className="auth-1mg-dots">
        {carouselItems.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            style={{ cursor: 'pointer' }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AuthCarousel;
