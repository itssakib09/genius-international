import { motion } from 'framer-motion';
import Button from '../common/Button';
import './hero.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80" 
          alt="Global Business"
          className="hero-bg-image"
        />
        <div className="hero-overlay" />
      </div>

      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="hero-title">
            Your Trusted Gateway to Global Work Permits
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero-subtitle">
            Legal & Office-Based Processing for Russia, Qatar & Europe
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero-buttons">
            <Button href="/jobs" variant="primary" size="lg" className="btn-mobile-full">
              View Jobs
            </Button>
            <Button href="/contact" variant="outline-white" size="lg" className="btn-mobile-full">
              Visit Our Office
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;