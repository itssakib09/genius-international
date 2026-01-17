// src/pages/About.jsx
import { motion } from 'framer-motion';
import { Award, Users, Globe, Shield } from 'lucide-react';
import Card from '../components/common/Card';
import './pages.css';

const About = () => {
  const values = [
    { icon: Shield, title: 'Trust & Transparency', description: 'We believe in complete transparency in all our dealings' },
    { icon: Users, title: 'Client-First Approach', description: 'Your success is our success' },
    { icon: Globe, title: 'Global Network', description: 'Strong partnerships worldwide' },
    { icon: Award, title: 'Legal Compliance', description: '100% legal and documented process' },
  ];

  return (
    <main className="page-content">
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>About Genius International</h1>
            <p className="page-subtitle">
              Your trusted partner in global work permit processing
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Card className="about-content">
            <h2>Who We Are</h2>
            <p>
              Genius International is a registered migration agency based in Uttara, Dhaka, Bangladesh. 
              We specialize in helping Bangladeshi workers find legitimate employment opportunities abroad 
              and guide them through the entire work permit process.
            </p>
            <p>
              With years of experience and a commitment to legal, transparent service, we've helped 
              hundreds of workers achieve their dreams of working in Russia, Qatar, and various European countries.
            </p>
          </Card>

          <h3 className="section-title text-center" style={{ marginTop: '48px' }}>Our Values</h3>
          <div className="features-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <Icon size={40} className="feature-icon" strokeWidth={1.5} />
                  <h3 className="feature-title">{value.title}</h3>
                  <p className="feature-description">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;