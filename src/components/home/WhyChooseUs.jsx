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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 12
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section className="section section-why">
      <div className="container">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ 
            duration: 0.45,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          Why Choose Genius International
        </motion.h2>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="feature-card" hover={true}>
                  <Icon className="feature-icon" size={40} strokeWidth={1.5} />
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;