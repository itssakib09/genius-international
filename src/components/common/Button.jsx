import { motion } from 'framer-motion';
import '../../styles/components/button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  href,
  className = '',
  ...props 
}) => {
  const Component = href ? motion.a : motion.button;
  
  return (
    <Component
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      href={href}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;