import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Music, Compass, Brain, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="py-6 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="text-secondary-500" size={28} />
            <span className="text-2xl font-display font-semibold text-primary-800">AfterHeart</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-6">
                Begin Your Healing Journey After Heartbreak
              </h1>
              <p className="text-lg text-accent-700 mb-8 max-w-lg">
                You're not alone. AfterHeart provides a safe space and tools to help you heal, 
                grow, and rediscover joy after romantic heartbreak.
              </p>
              <div className="flex space-x-4">
                <Link to="/signup" className="btn-primary">
                  Start Healing Now
                </Link>
                <Link to="/login" className="btn-outline">
                  I'm Returning
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <img 
                src="https://images.pexels.com/photos/5340280/pexels-photo-5340280.jpeg" 
                alt="Person meditating peacefully" 
                className="rounded-2xl shadow-lg max-w-full h-auto"
                style={{ maxHeight: '500px' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-4">
              Your Complete Healing Companion
            </h2>
            <p className="text-lg text-accent-700 max-w-2xl mx-auto">
              AfterHeart offers a holistic approach to healing with three specialized regions 
              designed to support different aspects of your recovery journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Music Therapy */}
            <motion.div 
              className="region-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="p-4 bg-primary-100 rounded-full mb-6">
                <Music size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-4">
                Music Therapy
              </h3>
              <p className="text-accent-700 text-center mb-6">
                Discover healing playlists, create your own collections, and use music as a 
                therapeutic tool for emotional processing.
              </p>
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                Explore Music <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>

            {/* Healing Trips */}
            <motion.div 
              className="region-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="p-4 bg-secondary-100 rounded-full mb-6">
                <Compass size={32} className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-4">
                Healing Trips
              </h3>
              <p className="text-accent-700 text-center mb-6">
                Discover peaceful destinations across India and find travel packages specifically 
                designed for healing and self-discovery.
              </p>
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                Find Destinations <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>

            {/* Mental Wellness */}
            <motion.div 
              className="region-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="p-4 bg-accent-100 rounded-full mb-6">
                <Brain size={32} className="text-accent-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-4">
                Mental Wellness
              </h3>
              <p className="text-accent-700 text-center mb-6">
                Connect with mental health professionals specialized in heartbreak and relationship 
                recovery to guide your healing process.
              </p>
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                Meet Professionals <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-primary-50 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-4">
              Stories of Healing
            </h2>
            <p className="text-lg text-accent-700 max-w-2xl mx-auto">
              See how AfterHeart has helped others on their journey to recovery and new beginnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-accent-700 mb-6">
                "After my breakup, I felt completely lost. The healing trips section led me to a 
                peaceful retreat in Rishikesh where I finally found space to breathe and begin 
                my healing journey."
              </p>
              <div className="flex items-center">
                <div className="mr-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">SA</span>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800">Sanya A.</h4>
                  <p className="text-sm text-accent-600">Delhi, 28</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-accent-700 mb-6">
                "The curated playlists helped me process emotions I didn't even know I had. Music 
                became my daily therapy, and the community playlists showed me I wasn't alone in 
                what I was feeling."
              </p>
              <div className="flex items-center">
                <div className="mr-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">RK</span>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800">Rahul K.</h4>
                  <p className="text-sm text-accent-600">Mumbai, 32</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-accent-700 mb-6">
                "Finding a therapist who specialized in relationship grief changed everything for me. 
                The mental wellness section made it easy to connect with professionals who actually 
                understood what I was going through."
              </p>
              <div className="flex items-center">
                <div className="mr-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium">PJ</span>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800">Priya J.</h4>
                  <p className="text-sm text-accent-600">Bangalore, 29</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-50 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-6">
              Your Heart Deserves to Heal
            </h2>
            <p className="text-lg text-accent-700 mb-8">
              Join thousands on their journey to recovery. AfterHeart provides the tools, 
              community, and professional support to help you move forward.
            </p>
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Begin Your Healing Journey
            </Link>
            <p className="mt-6 text-accent-600">
              Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="text-secondary-300" size={24} />
                <span className="text-xl font-display font-semibold">AfterHeart</span>
              </div>
              <p className="text-primary-200 max-w-xs">
                Providing compassionate support for healing after heartbreak.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-primary-200 hover:text-white">Home</Link></li>
                  <li><Link to="/login" className="text-primary-200 hover:text-white">Login</Link></li>
                  <li><Link to="/signup" className="text-primary-200 hover:text-white">Sign Up</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-primary-200 hover:text-white">Crisis Support</a></li>
                  <li><a href="#" className="text-primary-200 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-primary-200 hover:text-white">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-primary-200 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-primary-200 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-primary-200 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-300 text-sm">
              © 2025 AfterHeart. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-primary-300 text-sm">
                If you're in crisis, please call the National Mental Health Helpline: <a href="tel:1800-599-0019" className="underline">1800-599-0019</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;