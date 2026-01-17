import { motion } from 'framer-motion';
import Card from '../common/Card';
import './sections.css';

const CountriesSection = () => {
  const countries = [
    {
      icon: '🇷🇺',
      name: 'Russia',
      description: 'Construction, manufacturing, and technical roles',
    },
    {
      icon: '🇶🇦',
      name: 'Qatar',
      description: 'Hospitality, engineering, and service sectors',
    },
    {
      icon: '🇪🇺',
      name: 'Europe',
      description: 'Healthcare, agriculture, and skilled labor',
    },
  ];

  return (
    <section className="section section-countries">
      <div className="container">
        <motion.h2
          className="section-title text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Destinations We Serve
        </motion.h2>

        <div className="countries-grid">
          {countries.map((country, index) => (
            <Card key={country.name} className="country-card">
              <motion.div
                className="country-icon"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                {country.icon}
              </motion.div>
              <h3 className="country-name">{country.name}</h3>
              <p className="country-description">{country.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;