import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

const Legal = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="legal-page page-enter">
      <div className="container">
        <Link to="/" className="legal-page__back">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="legal-page__content">
          <h1>{isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}</h1>
          <p className="legal-page__date">Last updated: June 2026</p>

          {isPrivacy ? (
            <>
              <h2>1. Information We Collect</h2>
              <p>We collect personal information that you provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us.</p>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
              
              <h2>3. Information Sharing</h2>
              <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
              
              <h2>4. Data Security</h2>
              <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
            </>
          ) : (
            <>
              <h2>1. Agreement to Terms</h2>
              <p>By viewing or using this website, you agree to be bound by all of these Terms of Use and our Privacy Policy. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
              
              <h2>2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on ThisDat's website for personal, non-commercial transitory viewing only.</p>
              
              <h2>3. Medical Disclaimer</h2>
              <p>The information provided on this website is for informational purposes only and is not intended as a substitute for advice from your physician or other health care professional. You should not use the information on this website for diagnosis or treatment of any health problem or for prescription of any medication or other treatment.</p>
              
              <h2>4. Limitations</h2>
              <p>In no event shall ThisDat or its suppliers be liable for any damages arising out of the use or inability to use the materials on ThisDat's website.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Legal;
