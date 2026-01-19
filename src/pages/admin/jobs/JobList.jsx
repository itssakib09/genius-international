import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/db';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, MapPin, Briefcase } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../../styles/pages/admin-jobs.css';

const AdminJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, job: null });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.job) return;

    try {
      await deleteDoc(doc(db, 'jobs', deleteModal.job.id));
      setJobs(jobs.filter(job => job.id !== deleteModal.job.id));
      setDeleteModal({ show: false, job: null });
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'jobs', id), {
        status: newStatus,
        updatedAt: new Date()
      });
      setJobs(jobs.map(job => 
        job.id === id ? { ...job, status: newStatus } : job
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
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
          <p>Loading jobs...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-jobs">
        <motion.div
          className="admin-jobs-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1>Manage Jobs</h1>
            <p className="subtitle">{jobs.length} total job{jobs.length !== 1 ? 's' : ''}</p>
          </div>
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/admin/jobs/add')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} />
            <span>Add New Job</span>
          </motion.button>
        </motion.div>

        {jobs.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Briefcase size={64} />
            <h3>No jobs yet</h3>
            <p>Create your first job posting to get started</p>
            <button className="btn-primary" onClick={() => navigate('/admin/jobs/add')}>
              <Plus size={18} />
              <span>Add New Job</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="jobs-cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="job-card-admin"
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
                layout
              >
                <div className="job-card-header">
                  <div className="job-meta">
                    <h3>{job.jobTitle}</h3>
                    <div className="job-info">
                      <span className="info-item">
                        <MapPin size={14} />
                        {job.country}
                      </span>
                      <span className="info-item">
                        <Briefcase size={14} />
                        {job.jobType}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    className={`status-toggle ${job.status || 'active'}`}
                    onClick={() => toggleStatus(job.id, job.status || 'active')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {(job.status || 'active') === 'active' ? (
                      <><Eye size={16} /> Visible</>
                    ) : (
                      <><EyeOff size={16} /> Hidden</>
                    )}
                  </motion.button>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-card-footer">
                  <span className="salary">{job.salaryRange}</span>
                  <div className="job-actions">
                    <motion.button
                      className="btn-action edit"
                      onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      className="btn-action delete"
                      onClick={() => setDeleteModal({ show: true, job })}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
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
              onClick={() => setDeleteModal({ show: false, job: null })}
            />
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h3>Delete Job</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{deleteModal.job?.jobTitle}</strong>?</p>
                <p className="warning">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setDeleteModal({ show: false, job: null })}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  Delete Job
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminJobList;