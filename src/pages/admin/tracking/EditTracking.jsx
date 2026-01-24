import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-tracking.css';

const EditTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    trackingId: '',
    candidateName: '',
    passportNumber: '',
    jobTitle: '',
    destination: '',
    status: 'Processing',
    timeline: []
  });

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const docRef = doc(db, 'tracking', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          alert('Tracking entry not found');
          navigate('/admin/tracking');
        }
      } catch (error) {
        console.error('Error fetching tracking:', error);
        alert('Failed to load tracking');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTracking();
  }, [id, navigate]);

  const handleStatusChange = (e) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData({ ...formData, timeline: newTimeline });
  };

  const addTimelineStep = () => {
    setFormData({
      ...formData,
      timeline: [
        ...formData.timeline,
        { step: '', date: new Date().toISOString().split('T')[0], note: '' }
      ]
    });
  };

  const removeTimelineStep = (index) => {
    if (formData.timeline.length === 1) {
      alert('At least one timeline step is required');
      return;
    }
    const newTimeline = formData.timeline.filter((_, i) => i !== index);
    setFormData({ ...formData, timeline: newTimeline });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { trackingId, candidateId, candidateName, passportNumber, jobTitle, destination, createdAt, ...updateData } = formData;

      await updateDoc(doc(db, 'tracking', id), {
        ...updateData,
        updatedAt: new Date()
      });

      navigate('/admin/tracking');
    } catch (error) {
      console.error('Error updating tracking:', error);
      alert('Failed to update tracking');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading tracking...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        className="admin-tracking-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="form-header">
          <div>
            <h1>Edit Tracking</h1>
            <p className="form-subtitle">Update tracking entry and timeline</p>
          </div>
          <motion.button
            className="btn-secondary"
            onClick={() => navigate('/admin/tracking')}
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
              <h3>Candidate Information</h3>
              <div className="candidate-preview">
                <div className="preview-grid">
                  <div><strong>Tracking ID:</strong> {formData.trackingId}</div>
                  <div><strong>Name:</strong> {formData.candidateName}</div>
                  <div><strong>Passport:</strong> {formData.passportNumber}</div>
                  <div><strong>Job:</strong> {formData.jobTitle}</div>
                  <div><strong>Destination:</strong> {formData.destination}</div>
                </div>
              </div>
              <p className="field-note">Candidate information cannot be changed. To update candidate details, edit the candidate record directly.</p>
            </div>

            <div className="form-section">
              <h3>Status</h3>
              <div className="form-group">
                <label>Current Status *</label>
                <select
                  value={formData.status}
                  onChange={handleStatusChange}
                  disabled={loading}
                >
                  <option value="Processing">Processing</option>
                  <option value="Document Verified">Document Verified</option>
                  <option value="Embassy Appointment">Embassy Appointment</option>
                  <option value="Medical Completed">Medical Completed</option>
                  <option value="Visa Approved">Visa Approved</option>
                  <option value="Flight Ready">Flight Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header-with-button">
                <h3>Timeline Steps</h3>
                <motion.button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={addTimelineStep}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  <span>Add Step</span>
                </motion.button>
              </div>

              {formData.timeline.map((item, index) => (
                <div key={index} className="timeline-step-form">
                  <div className="timeline-step-header">
                    <span className="step-number">Step {index + 1}</span>
                    {formData.timeline.length > 1 && (
                      <motion.button
                        type="button"
                        className="btn-action delete"
                        onClick={() => removeTimelineStep(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Step Name *</label>
                      <input
                        type="text"
                        value={item.step}
                        onChange={(e) => handleTimelineChange(index, 'step', e.target.value)}
                        placeholder="e.g. Application Submitted"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
required
disabled={loading}
/>
</div>
                <div className="form-group full-width">
                  <label>Note (Optional)</label>
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleTimelineChange(index, 'note', e.target.value)}
                    placeholder="Add any additional information..."
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <motion.button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/admin/tracking')}
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
          <span>{loading ? 'Updating...' : 'Update Tracking'}</span>
        </motion.button>
      </div>
    </motion.form>
  </motion.div>
</AdminLayout>
);
};
export default EditTracking;