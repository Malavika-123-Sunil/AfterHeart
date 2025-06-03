import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <Heart size={64} className="text-secondary-500 mx-auto mb-6 animate-float" />
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-accent-700 mb-8">
          It seems you've wandered off your healing path. Let's get you back to a safe space.
        </p>
        
        <Link to="/" className="btn-primary inline-flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;