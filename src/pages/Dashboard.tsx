import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Compass, Brain } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const regions = [
    {
      id: 'music',
      title: 'Music Therapy',
      description: 'Discover healing playlists and create your own collections for emotional processing.',
      icon: <Music size={36} className="text-primary-600" />,
      color: 'bg-primary-100',
      path: '/music',
    },
    {
      id: 'trips',
      title: 'Healing Trips',
      description: 'Explore peaceful destinations and travel packages designed for self-discovery.',
      icon: <Compass size={36} className="text-secondary-600" />,
      color: 'bg-secondary-100',
      path: '/trips',
    },
    {
      id: 'wellness',
      title: 'Mental Wellness',
      description: 'Connect with professionals specialized in heartbreak and relationship recovery.',
      icon: <Brain size={36} className="text-accent-600" />,
      color: 'bg-accent-100',
      path: '/wellness',
    },
  ];
  
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-3">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-accent-700 mb-8 text-lg">
            Your healing journey continues. Where would you like to focus today?
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {regions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={region.path} className="block h-full">
                <div className="region-card h-full">
                  <div className={`p-4 ${region.color} rounded-full mb-6`}>
                    {region.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold text-primary-800 mb-4">
                    {region.title}
                  </h3>
                  <p className="text-accent-700 text-center">
                    {region.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-semibold text-primary-800 mb-4">
            Your Healing Progress
          </h2>
          <p className="text-accent-700 mb-6">
            Track your journey through various healing activities and milestones.
          </p>
          
          <div className="bg-primary-50 rounded-lg p-6">
            <p className="text-primary-700 text-center">
              Complete your profile to start tracking your healing progress.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-2xl font-display font-semibold text-primary-800 mb-4">
            Daily Reflection
          </h2>
          <p className="text-accent-700 mb-6">
            Taking a moment to reflect can be a powerful healing practice.
          </p>
          
          <div className="bg-primary-50 rounded-lg p-6">
            <p className="text-primary-700 text-center italic">
              "What small act of self-care can you gift yourself today?"
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;