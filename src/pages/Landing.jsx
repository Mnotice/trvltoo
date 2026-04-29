import { useNavigate } from 'react-router-dom';
import LandingNav from '../components/Landing/LandingNav';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import HowItWorks from '../components/Landing/HowItWorks';
import Footer from '../components/Landing/Footer';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LandingNav />
      <Hero onStartPlanning={() => navigate('/plan')} />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}
