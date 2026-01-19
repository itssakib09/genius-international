import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/db';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './pages.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getCountryFlag = (country) => {
    const flags = {
      'Russia': '🇷🇺',
      'Qatar': '🇶🇦',
      'Europe': '🇪🇺',
      'Poland': '🇵🇱',
      'Netherlands': '🇳🇱'
    };
    return flags[country] || '🌍';
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
            <h1>Available Job Opportunities</h1>
            <p className="page-subtitle">
              Browse current openings and visit our office to apply
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="jobs-loading">
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="jobs-empty">
              <p>No job opportunities available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <Card key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-flag">{getCountryFlag(job.country)}</div>
                    <span className="job-type">{job.jobType}</span>
                  </div>
                  
                  <h3 className="job-title">{job.jobTitle}</h3>
                  
                  <div className="job-details">
                    <div className="job-detail">
                      <MapPin size={18} />
                      <span>{job.location}, {job.country}</span>
                    </div>
                    <div className="job-detail">
                      <DollarSign size={18} />
                      <span>{job.salaryRange}</span>
                    </div>
                  </div>

                  <p className="job-description">{job.description}</p>

                  <Button href="/contact" variant="secondary" size="sm" className="job-apply-btn">
                    Visit Office to Apply
                  </Button>
                </Card>
              ))}
            </div>
          )}

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