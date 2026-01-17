import Hero from '../components/home/Hero';
import CountriesSection from '../components/home/CountriesSection';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';

const Home = () => {
  return (
    <main>
      <Hero />
      <CountriesSection />
      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
};

export default Home;