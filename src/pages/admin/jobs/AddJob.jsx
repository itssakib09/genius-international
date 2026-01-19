import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-jobs.css';

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    jobTitle: '',
    salaryRange: '',
    jobType: '',
    description: '',
    location: '',
    status: 'active'
  });

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
      await addDoc(collection(db, 'jobs'), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job');
    } finally {
      setLoading(false);
    }
  };

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
            <h1>Add New Job</h1>
            <p className="form-subtitle">Create a new job posting</p>
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
              <span>{loading ? 'Saving...' : 'Add Job'}</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AdminLayout>
  );
};

export default AddJob;