import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './pages.css';

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: 'Construction Worker',
      country: 'Russia',
      location: 'Moscow',
      salary: '$800 - $1,200/month',
      type: 'Full-time',
      description: 'Experienced workers needed for residential construction projects.',
    },
    {
      id: 2,
      title: 'Hotel Staff',
      country: 'Qatar',
      location: 'Doha',
      salary: '$900 - $1,400/month',
      type: 'Full-time',
      description: 'Housekeeping and front desk positions available in 5-star hotels.',
    },
    {
      id: 3,
      title: 'Warehouse Operator',
      country: 'Europe',
      location: 'Poland',
      salary: '€1,000 - €1,500/month',
      type: 'Full-time',
      description: 'Forklift operators and logistics staff for warehouse operations.',
    },
    {
      id: 4,
      title: 'Factory Worker',
      country: 'Russia',
      location: 'St. Petersburg',
      salary: '$750 - $1,100/month',
      type: 'Full-time',
      description: 'Production line workers for manufacturing facility.',
    },
    {
      id: 5,
      title: 'Restaurant Staff',
      country: 'Qatar',
      location: 'Doha',
      salary: '$850 - $1,300/month',
      type: 'Full-time',
      description: 'Cooks, waiters, and kitchen helpers for international restaurants.',
    },
    {
      id: 6,
      title: 'Agricultural Worker',
      country: 'Europe',
      location: 'Netherlands',
      salary: '€1,200 - €1,600/month',
      type: 'Seasonal',
      description: 'Seasonal workers for greenhouse and farm operations.',
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
            <h1>Available Job Opportunities</h1>
            <p className="page-subtitle">
              Browse current openings and visit our office to apply
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="jobs-grid">
            {jobs.map((job) => (
              <Card key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-flag">{job.country === 'Russia' ? '🇷🇺' : job.country === 'Qatar' ? '🇶🇦' : '🇪🇺'}</div>
                  <span className="job-type">{job.type}</span>
                </div>
                
                <h3 className="job-title">{job.title}</h3>
                
                <div className="job-details">
                  <div className="job-detail">
                    <MapPin size={18} />
                    <span>{job.location}, {job.country}</span>
                  </div>
                  <div className="job-detail">
                    <DollarSign size={18} />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className="job-description">{job.description}</p>

                <Button href="/contact" variant="secondary" size="sm" className="job-apply-btn">
                  Visit Office to Apply
                </Button>
              </Card>
            ))}
          </div>

          <motion.div
            className="jobs-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Don't See Your Ideal Job?</h3>
            <p>Visit our office to discuss other opportunities that match your skills and experience.</p>
            <Button href="/contact" variant="primary" size="lg">
              Contact Our Office
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Jobs;