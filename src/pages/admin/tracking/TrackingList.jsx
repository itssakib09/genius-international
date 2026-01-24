import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, MapPin, FileText } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-tracking.css';

const TrackingList = () => {
  const [trackings, setTrackings] = useState([]);
  const [filteredTrackings, setFilteredTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, tracking: null });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchTrackings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tracking'));
      const trackingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrackings(trackingsData);
      setFilteredTrackings(trackingsData);
    } catch (error) {
      console.error('Error fetching trackings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackings();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTrackings(trackings);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = trackings.filter(tracking => 
      tracking.trackingId?.toLowerCase().includes(term) ||
      tracking.candidateName?.toLowerCase().includes(term) ||
      tracking.passportNumber?.toLowerCase().includes(term)
    );
    setFilteredTrackings(filtered);
  }, [searchTerm, trackings]);

  const handleDelete = async () => {
    if (!deleteModal.tracking) return;

    try {
      await deleteDoc(doc(db, 'tracking', deleteModal.tracking.id));
      const updatedTrackings = trackings.filter(t => t.id !== deleteModal.tracking.id);
      setTrackings(updatedTrackings);
      setDeleteModal({ show: false, tracking: null });
    } catch (error) {
      console.error('Error deleting tracking:', error);
      alert('Failed to delete tracking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': { bg: '#DBEAFE', text: '#1E40AF' },
      'Document Verified': { bg: '#E0E7FF', text: '#4338CA' },
      'Embassy Appointment': { bg: '#FEF3C7', text: '#92400E' },
      'Medical Completed': { bg: '#DDD6FE', text: '#6B21A8' },
      'Visa Approved': { bg: '#D1FAE5', text: '#065F46' },
      'Flight Ready': { bg: '#D1FAE5', text: '#047857' },
      'Completed': { bg: '#DCFCE7', text: '#166534' },
      'Rejected': { bg: '#FEE2E2', text: '#991B1B' }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#374151' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading tracking entries...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-tracking">
        <motion.div
          className="admin-tracking-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1>Manage Tracking</h1>
            <p className="subtitle">{trackings.length} total tracking entr{trackings.length !== 1 ? 'ies' : 'y'}</p>
          </div>
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/admin/tracking/add')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>Add New Tracking</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="search-box"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by tracking ID, name, or passport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <motion.button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          )}
        </motion.div>

        {filteredTrackings.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FileText size={64} />
            <h3>{searchTerm ? 'No tracking entries found' : 'No tracking entries yet'}</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Add your first tracking entry to get started'}</p>
          </motion.div>
        ) : (
          <motion.div
            className="tracking-cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTrackings.map((tracking) => {
              const statusColors = getStatusColor(tracking.status);
              return (
                <motion.div
                  key={tracking.id}
                  className="tracking-card"
                  variants={cardVariants}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
                  layout
                >
                  <div className="tracking-card-header">
                    <div className="tracking-meta">
                      <h3>{tracking.candidateName}</h3>
                      <div className="tracking-info">
                        <span className="tracking-id-badge">{tracking.trackingId}</span>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: statusColors.bg, 
                            color: statusColors.text 
                          }}
                        >
                          {tracking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="tracking-details">
                    <div className="detail-row">
                      <span className="label">Passport:</span>
                      <span className="value">{tracking.passportNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Job Title:</span>
                      <span className="value">{tracking.jobTitle}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Destination:</span>
                      <span className="value">
                        <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {tracking.destination}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Timeline Steps:</span>
                      <span className="value">{tracking.timeline?.length || 0} step{tracking.timeline?.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="tracking-card-footer">
                    <span className="updated-date">
                      Updated: {tracking.updatedAt?.toDate ? new Date(tracking.updatedAt.toDate()).toLocaleDateString() : 'N/A'}
                    </span>
                    <div className="tracking-actions">
                      <motion.button
                        className="btn-action edit"
                        onClick={() => navigate(`/admin/tracking/edit/${tracking.id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Edit tracking"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        className="btn-action delete"
                        onClick={() => setDeleteModal({ show: true, tracking })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete tracking"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {deleteModal.show && (
          <>
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ show: false, tracking: null })}
            />
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3>Delete Tracking Entry</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete tracking for <strong>{deleteModal.tracking?.candidateName}</strong>?</p>
                <p className="warning">This action cannot be undone. Tracking ID: {deleteModal.tracking?.trackingId}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setDeleteModal({ show: false, tracking: null })}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  Delete Tracking
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default TrackingList;