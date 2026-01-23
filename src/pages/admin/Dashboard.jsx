import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, TrendingUp, UserCheck } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/db';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    pendingCandidates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Jobs stats
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const totalJobs = jobsSnapshot.size;
        
        const activeQuery = query(collection(db, 'jobs'), where('status', '==', 'active'));
        const activeSnapshot = await getDocs(activeQuery);
        const activeJobs = activeSnapshot.size;

        // Candidates stats
        const candidatesSnapshot = await getDocs(collection(db, 'candidates'));
        const totalCandidates = candidatesSnapshot.size;
        
        const pendingQuery = query(collection(db, 'candidates'), where('status', '==', 'pending'));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingCandidates = pendingSnapshot.size;

        setStats({ totalJobs, activeJobs, totalCandidates, pendingCandidates });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayStats = [
    {
      label: 'Total Jobs',
      value: loading ? '...' : stats.totalJobs,
      icon: Briefcase,
      color: 'var(--primary)'
    },
    {
      label: 'Active Jobs',
      value: loading ? '...' : stats.activeJobs,
      icon: TrendingUp,
      color: '#059669'
    },
    {
      label: 'Total Candidates',
      value: loading ? '...' : stats.totalCandidates,
      icon: Users,
      color: '#7C3AED'
    },
    {
      label: 'Pending Applications',
      value: loading ? '...' : stats.pendingCandidates,
      icon: UserCheck,
      color: '#DC2626'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Jobs',
      description: 'Add, edit, or remove job listings',
      action: () => navigate('/admin/jobs'),
      icon: Briefcase
    },
    {
      title: 'Manage Candidates',
      description: 'View and manage candidate applications',
      action: () => navigate('/admin/candidates'),
      icon: Users
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <AdminLayout>
      <motion.div
        className="admin-dashboard"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back to Genius International Admin</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-grid">
          {displayStats.map((stat) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <motion.div
                key={action.title}
                className="action-card"
                onClick={action.action}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="action-icon">
                  <action.icon size={28} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;