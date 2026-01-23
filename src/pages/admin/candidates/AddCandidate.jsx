import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-candidates.css';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    country: '',
    jobTitle: '',
    phone: '',
    email: '',
    status: 'pending',
    notes: ''
  });

  const generateTrackingId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `GEN-${year}-${random}`;
  };

  const checkDuplicates = async (passportNumber, trackingId) => {
    const passportQuery = query(
      collection(db, 'candidates'),
      where('passportNumber', '==', passportNumber)
    );
    const passportSnapshot = await getDocs(passportQuery);
    
    if (!passportSnapshot.empty) {
      throw new Error('A candidate with this passport number already exists');
    }

    const trackingQuery = query(
      collection(db, 'candidates'),
      where('trackingId', '==', trackingId)
    );
    const trackingSnapshot = await getDocs(trackingQuery);
    
    if (!trackingSnapshot.empty) {
      return generateTrackingId();
    }
    
    return trackingId;
  };

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
      let trackingId = generateTrackingId();
      trackingId = await checkDuplicates(formData.passportNumber, trackingId);

      await addDoc(collection(db, 'candidates'), {
        ...formData,
        trackingId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      navigate('/admin/candidates');
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert(error.message || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

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
            <h1>Add New Candidate</h1>
            <p className="form-subtitle">Register a new candidate for work permit processing</p>
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
              <h3>Job Details</h3>
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

            <div className="info-box">
              <p><strong>Note:</strong> A unique tracking ID will be automatically generated when you save this candidate.</p>
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
              <span>{loading ? 'Saving...' : 'Add Candidate'}</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AdminLayout>
  );
};

export default AddCandidate;