import { motion } from 'framer-motion';
import '../../styles/components/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Genius International</h3>
            <p>Your trusted partner for global work permits</p>
          </motion.div>

          <motion.div
            className="footer-disclaimer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p>
              <strong>Important Notice:</strong> All visa processing is done physically at our office. 
              No payments are accepted online. Please visit our office in Uttara, Dhaka for legitimate services.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>&copy; {new Date().getFullYear()} Genius International. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;