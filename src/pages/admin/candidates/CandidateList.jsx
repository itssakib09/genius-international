import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, Search, X } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-candidates.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, candidate: null });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'candidates'));
      const candidatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCandidates(candidatesData);
      setFilteredCandidates(candidatesData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCandidates(candidates);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = candidates.filter(candidate => 
      candidate.fullName?.toLowerCase().includes(term) ||
      candidate.trackingId?.toLowerCase().includes(term) ||
      candidate.passportNumber?.toLowerCase().includes(term)
    );
    setFilteredCandidates(filtered);
  }, [searchTerm, candidates]);

  const handleDelete = async () => {
    if (!deleteModal.candidate) return;

    try {
      await deleteDoc(doc(db, 'candidates', deleteModal.candidate.id));
      const updatedCandidates = candidates.filter(c => c.id !== deleteModal.candidate.id);
      setCandidates(updatedCandidates);
      setDeleteModal({ show: false, candidate: null });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': { bg: '#FEF3C7', text: '#92400E' },
      'processing': { bg: '#DBEAFE', text: '#1E40AF' },
      'approved': { bg: '#D1FAE5', text: '#065F46' },
      'rejected': { bg: '#FEE2E2', text: '#991B1B' }
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
          <p>Loading candidates...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-candidates">
        <motion.div
          className="admin-candidates-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1>Manage Candidates</h1>
            <p className="subtitle">{candidates.length} total candidate{candidates.length !== 1 ? 's' : ''}</p>
          </div>
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/admin/candidates/add')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>Add New Candidate</span>
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
            placeholder="Search by name, tracking ID, or passport number..."
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

        {filteredCandidates.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Users size={64} />
            <h3>{searchTerm ? 'No candidates found' : 'No candidates yet'}</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Add your first candidate to get started'}</p>
          </motion.div>
        ) : (
          <motion.div
            className="candidates-cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCandidates.map((candidate) => {
              const statusColors = getStatusColor(candidate.status);
              return (
                <motion.div
                  key={candidate.id}
                  className="candidate-card"
                  variants={cardVariants}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
                  layout
                >
                  <div className="candidate-card-header">
                    <div className="candidate-meta">
                      <h3>{candidate.fullName}</h3>
                      <div className="candidate-info">
                        <span className="tracking-id">{candidate.trackingId}</span>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: statusColors.bg, 
                            color: statusColors.text 
                          }}
                        >
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="candidate-details">
                    <div className="detail-row">
                      <span className="label">Job Title:</span>
                      <span className="value">{candidate.jobTitle}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Country:</span>
                      <span className="value">{candidate.country}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Passport:</span>
                      <span className="value">{candidate.passportNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{candidate.phone}</span>
                    </div>
                  </div>

                  <div className="candidate-card-footer">
                    <span className="email">{candidate.email}</span>
                    <div className="candidate-actions">
                      <motion.button
                        className="btn-action edit"
                        onClick={() => navigate(`/admin/candidates/edit/${candidate.id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Edit candidate"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        className="btn-action delete"
                        onClick={() => setDeleteModal({ show: true, candidate })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete candidate"
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
              onClick={() => setDeleteModal({ show: false, candidate: null })}
            />
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3>Delete Candidate</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{deleteModal.candidate?.fullName}</strong>?</p>
                <p className="warning">This action cannot be undone. Tracking ID: {deleteModal.candidate?.trackingId}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setDeleteModal({ show: false, candidate: null })}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  Delete Candidate
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default CandidateList;