import { motion } from 'framer-motion';
import './sections.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Check Jobs Online',
      description: 'Browse available opportunities on our website',
    },
    {
      number: '2',
      title: 'Prepare Required Documents',
      description: 'Gather passport, photos, and relevant certificates',
    },
    {
      number: '3',
      title: 'Visit Our Office in Uttara',
      description: 'Meet our team and submit your application in person',
    },
    {
      number: '4',
      title: 'Receive Tracking ID',
      description: 'Get a unique ID to monitor your application status',
    },
    {
      number: '5',
      title: 'Track Application Online',
      description: 'Stay updated on your visa processing progress',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
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
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section className="section section-how">
      <div className="container">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ 
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          How It Works
        </motion.h2>

        <motion.div
          className="steps-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              className="step"
              variants={itemVariants}
            >
              <div className="step-number">
                {step.number}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;