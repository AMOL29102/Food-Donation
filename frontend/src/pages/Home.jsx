import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaSearch, FaBullhorn } from 'react-icons/fa';
import heroBg from '../assets/hero-bg.png';
import donateFoodImg from '../assets/donate-food.png';
import findFoodImg from '../assets/find-food.png';
import communityHandsImg from '../assets/community-hands.png';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const FeatureCard = ({ icon, title, description, image }) => (
    <motion.div
      variants={itemVariants}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-shadow duration-300"
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-green-500 p-3 rounded-full text-white">{icon}</div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center text-center text-white -mt-20"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-3xl px-4"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Bridge the Gap Between <span className="text-green-500">Waste</span> and <span className="text-green-500">Want</span>.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 mb-8">
            Join RescueBites to connect surplus food with those who need it most. Reduce waste, fight hunger, and build a stronger community.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4">
            <Link to="/post-food" className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-transform hover:scale-105 flex items-center gap-2">
              Donate Food <FaHandHoldingHeart />
            </Link>
            <Link to="/available-food" className="bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-transform hover:scale-105 flex items-center gap-2">
              Find Food <FaSearch />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-2 text-white">How It Works</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">A simple, three-step process to make a difference.</p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<FaBullhorn size={24} />}
              title="Providers Post Food"
              description="Restaurants, cafes, and individuals can easily post details about their surplus food items available for donation."
              image={donateFoodImg}
            />
            <FeatureCard
              icon={<FaSearch size={24} />}
              title="Consumers Find Food"
              description="Charities, NGOs, and individuals in need can browse available listings and book the food they require."
              image={findFoodImg}
            />
            <FeatureCard
              icon={<FaHandHoldingHeart size={24} />}
              title="Community Connects"
              description="Arrange a convenient pickup, ensuring that good food nourishes people instead of ending up in a landfill."
              image={communityHandsImg}
            />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;