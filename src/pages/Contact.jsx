// src/pages/Contact.jsx
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import './pages.css';

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office Address',
      details: 'Uttara, Dhaka, Bangladesh',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+880 1234-567890',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@geniusinternational.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
    },
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
            <h1>Contact Us</h1>
            <p className="page-subtitle">
              Visit our office for consultation and application submission
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={info.title} className="contact-card">
                  <Icon size={32} className="contact-icon" strokeWidth={1.5} />
                  <h3 className="contact-title">{info.title}</h3>
                  <p className="contact-details">{info.details}</p>
                </Card>
              );
            })}
          </div>

          <Card className="contact-notice">
            <h3>Important Notice</h3>
            <p>
              All visa applications must be submitted in person at our office. 
              We do not accept online applications or payments. Please bring all required 
              documents when you visit us.
            </p>
            <p style={{ marginTop: '16px' }}>
              <strong>Required Documents:</strong> Valid passport, recent photographs, 
              educational certificates, experience letters (if applicable).
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Contact;