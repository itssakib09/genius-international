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

  return (
    <section className="section section-how">
      <div className="container">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
              }}
              whileHover={{ y: -4 }}
            >
              <motion.div
                className="step-number"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.number}
              </motion.div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;