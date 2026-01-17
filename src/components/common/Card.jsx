import { motion } from 'framer-motion';
import '../../styles/components/card.css';

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`card card-${variant} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? { y: -8, boxShadow: "var(--shadow-hover)" } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;