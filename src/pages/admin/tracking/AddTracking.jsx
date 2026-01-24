import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-tracking.css';

const AddTracking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({
    status: 'Processing',
    timeline: [
      {
        step: 'Application Submitted',
        date: new Date().toISOString().split('T')[0],
        note: ''
      }
    ]
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'candidates'));
        const candidatesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, []);

  const generateTrackingId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `GEN-${year}-${random}`;
  };

  const handleCandidateSelect = (e) => {
    const candidate = candidates.find(c => c.id === e.target.value);
    setSelectedCandidate(candidate);
  };

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

  const checkDuplicateTracking = async (trackingId) => {
    const q = query(collection(db, 'tracking'), where('trackingId', '==', trackingId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }

    setLoading(true);

    try {
      let trackingId = generateTrackingId();
      let isDuplicate = await checkDuplicateTracking(trackingId);
      
      while (isDuplicate) {
        trackingId = generateTrackingId();
        isDuplicate = await checkDuplicateTracking(trackingId);
      }

      await addDoc(collection(db, 'tracking'), {
        trackingId,
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.fullName,
        passportNumber: selectedCandidate.passportNumber,
        jobTitle: selectedCandidate.jobTitle,
        destination: selectedCandidate.country,
        status: formData.status,
        timeline: formData.timeline,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      navigate('/admin/tracking');
    } catch (error) {
      console.error('Error adding tracking:', error);
      alert('Failed to add tracking');
    } finally {
      setLoading(false);
    }
  };

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
            <h1>Add New Tracking</h1>
            <p className="form-subtitle">Create a new tracking entry for candidate application</p>
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
              <h3>Select Candidate</h3>
              <div className="form-group full-width">
                <label>Candidate *</label>
                <select
                  onChange={handleCandidateSelect}
                  required
                  disabled={loading}
                >
                  <option value="">Select a candidate</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.fullName} - {candidate.trackingId} ({candidate.country})
                    </option>
                  ))}
                </select>
              </div>

              {selectedCandidate && (
                <div className="candidate-preview">
                  <h4>Candidate Information</h4>
                  <div className="preview-grid">
                    <div><strong>Name:</strong> {selectedCandidate.fullName}</div>
                    <div><strong>Passport:</strong> {selectedCandidate.passportNumber}</div>
                    <div><strong>Job:</strong> {selectedCandidate.jobTitle}</div>
                    <div><strong>Country:</strong> {selectedCandidate.country}</div>
                  </div>
                </div>
              )}
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

            <div className="info-box">
              <p><strong>Note:</strong> A unique tracking ID will be automatically generated when you save this entry.</p>
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
              disabled={loading || !selectedCandidate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={18} />
              <span>{loading ? 'Saving...' : 'Add Tracking'}</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AdminLayout>
  );
};

export default AddTracking;