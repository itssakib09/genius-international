import { motion } from 'framer-motion';
import { CheckCircle2, Ban, BarChart3, Building2 } from 'lucide-react';
import Card from '../common/Card';
import './sections.css';

const WhyChooseUs = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: '100% Legal & Office-Based',
      description: 'All processing done through our registered office with full transparency',
    },
    {
      icon: Ban,
      title: 'No Online Payments',
      description: 'Payments accepted only at our physical office for your security',
    },
    {
      icon: BarChart3,
      title: 'Transparent Tracking System',
      description: 'Monitor your application status 24/7 with your unique tracking ID',
    },
    {
      icon: Building2,
      title: 'Physical Office in Dhaka',
      description: 'Visit us anytime during business hours for consultation and support',
    },
  ];

  return (
    <section className="section section-why">
      <div className="container">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Genius International
        </motion.h2>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="feature-card">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Icon className="feature-icon" size={40} strokeWidth={1.5} />
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;