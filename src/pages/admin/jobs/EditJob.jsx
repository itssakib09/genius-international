import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-jobs.css';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    country: '',
    jobTitle: '',
    salaryRange: '',
    jobType: '',
    description: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          alert('Job not found');
          navigate('/admin/jobs');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        alert('Failed to load job');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, 'jobs', id), {
        ...formData,
        updatedAt: new Date()
      });
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading job...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        className="admin-job-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="form-header">
          <div>
            <h1>Edit Job</h1>
            <p className="form-subtitle">Update job posting details</p>
          </div>
          <motion.button
            className="btn-secondary"
            onClick={() => navigate('/admin/jobs')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={18} />
            <span>Back to List</span>
          </motion.button>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="form-card">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Construction Worker"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Qatar"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Doha"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Compensation & Status</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Salary Range *</label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    placeholder="e.g. $3,000 - $4,500/month"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="active">Active (Visible on website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Job Description</h3>
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe the job role, responsibilities, and requirements..."
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <motion.button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/jobs')}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={18} />
              <span>{loading ? 'Updating...' : 'Update Job'}</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AdminLayout>
  );
};

export default EditJob;