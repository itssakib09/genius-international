import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-candidates.css';

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    country: '',
    jobTitle: '',
    phone: '',
    email: '',
    status: 'pending',
    notes: '',
    trackingId: ''
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const docRef = doc(db, 'candidates', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          alert('Candidate not found');
          navigate('/admin/candidates');
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
        alert('Failed to load candidate');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCandidate();
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
      const { trackingId, createdAt, ...updateData } = formData;
      
      await updateDoc(doc(db, 'candidates', id), {
        ...updateData,
        updatedAt: new Date()
      });
      
      navigate('/admin/candidates');
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading candidate...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        className="admin-candidate-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="form-header">
          <div>
            <h1>Edit Candidate</h1>
            <p className="form-subtitle">Update candidate information</p>
          </div>
          <motion.button
            className="btn-secondary"
            onClick={() => navigate('/admin/candidates')}
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
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Passport Number *</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder="e.g. A12345678"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +880 1234-567890"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Job Details & Status</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tracking ID</label>
                  <input
                    type="text"
                    value={formData.trackingId}
                    disabled
                    className="readonly-field"
                  />
                  <small className="field-note">Tracking ID cannot be changed</small>
                </div>

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
                  <label>Destination Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Country</option>
                    <option value="Russia">Russia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Poland">Poland</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Application Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Notes</h3>
              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Add any relevant notes about the candidate, application, or requirements..."
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <motion.button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/candidates')}
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
              <span>{loading ? 'Updating...' : 'Update Candidate'}</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AdminLayout>
  );
};

export default EditCandidate;