import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, Clock, Package } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './pages.css';

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setShowDemo(true);
    }
  };

  const demoStatus = {
    id: trackingId || 'GEN2025001',
    applicant: 'Sample Applicant',
    country: 'Qatar',
    status: 'In Progress',
    timeline: [
      { step: 'Application Submitted', status: 'completed', date: '15 Jan 2025' },
      { step: 'Document Verification', status: 'completed', date: '18 Jan 2025' },
      { step: 'Embassy Processing', status: 'in-progress', date: 'In Progress' },
      { step: 'Visa Approved', status: 'pending', date: 'Pending' },
    ],
  };

  return (
    <main className="page-content">
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Track Your Application</h1>
            <p className="page-subtitle">
              Enter your tracking ID to check your visa application status
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Card className="tracking-form-card">
            <form onSubmit={handleSubmit} className="tracking-form">
              <div className="tracking-input-group">
                <Search className="tracking-input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Enter your tracking ID (e.g., GEN2025001)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="tracking-input"
                />
              </div>
              <Button type="submit" variant="primary" size="lg">
                Track Application
              </Button>
            </form>
          </Card>

          {showDemo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="tracking-result">
                <div className="tracking-result-header">
                  <div>
                    <h3>Application Status</h3>
                    <p className="tracking-id">ID: {demoStatus.id}</p>
                  </div>
                  <span className="status-badge status-in-progress">
                    {demoStatus.status}
                  </span>
                </div>

                <div className="tracking-info">
                  <div className="tracking-info-item">
                    <span className="label">Applicant:</span>
                    <span className="value">{demoStatus.applicant}</span>
                  </div>
                  <div className="tracking-info-item">
                    <span className="label">Destination:</span>
                    <span className="value">{demoStatus.country}</span>
                  </div>
                </div>

                <div className="tracking-timeline">
                  <h4>Processing Timeline</h4>
                  <div className="timeline">
                    {demoStatus.timeline.map((item, index) => (
                      <div key={index} className={`timeline-item timeline-${item.status}`}>
                        <div className="timeline-icon">
                          {item.status === 'completed' && <CheckCircle2 size={24} />}
                          {item.status === 'in-progress' && <Clock size={24} />}
                          {item.status === 'pending' && <Package size={24} />}
                        </div>
                        <div className="timeline-content">
                          <h5>{item.step}</h5>
                          <p>{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tracking-note">
                  <p>
                    <strong>Note:</strong> This is a demo result. Your actual tracking information 
                    will be available after you receive your tracking ID from our office.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div
            className="tracking-help"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Need Help?</h3>
            <p>
              If you don't have a tracking ID yet, please visit our office to submit your application. 
              You'll receive a unique tracking ID after your documents are verified.
            </p>
            <Button href="/contact" variant="secondary" size="md">
              Visit Our Office
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Tracking;