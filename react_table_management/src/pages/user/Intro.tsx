import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const Intro: React.FC = () => {
  const controls = useAnimation();

  // Animation on mount
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    });
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-pulse">
          Welcome to TableEase
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl"
        >
          Book your table with ease and enjoy a seamless dining experience!
        </motion.p>
        <motion.a
          href="/booking" // Replace with actual booking page route
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,255,255,0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300"
        >
          Start Booking Now
        </motion.a>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 bg-pink-400 rounded-full opacity-50"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    </div>
  );
};

export default Intro;