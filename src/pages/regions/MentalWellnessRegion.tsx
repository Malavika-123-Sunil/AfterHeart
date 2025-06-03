import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, PhoneCall, MessageSquare, Award, Filter, Users } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Mock data for therapists
const mockTherapists = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    specialization: "Relationship Counseling",
    location: "Mumbai, Maharashtra",
    distance: 2.5,
    rating: 4.9,
    verified: true,
    image: "https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg",
    availableToday: true,
  },
  {
    id: 2,
    name: "Dr. Rajiv Mehta",
    specialization: "Grief & Loss Therapy",
    location: "Delhi, Delhi",
    distance: 4.8,
    rating: 4.7,
    verified: true,
    image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg",
    availableToday: false,
  },
  {
    id: 3,
    name: "Ms. Priya Desai",
    specialization: "Emotional Recovery",
    location: "Bangalore, Karnataka",
    distance: 3.2,
    rating: 4.8,
    verified: true,
    image: "https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg",
    availableToday: true,
  },
  {
    id: 4,
    name: "Dr. Karan Singhania",
    specialization: "Trauma & Heartbreak",
    location: "Chennai, Tamil Nadu",
    distance: 5.1,
    rating: 4.6,
    verified: false,
    image: "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg",
    availableToday: true,
  },
  {
    id: 5,
    name: "Ms. Neha Kapoor",
    specialization: "Self-Esteem Building",
    location: "Pune, Maharashtra",
    distance: 1.8,
    rating: 4.9,
    verified: true,
    image: "https://images.pexels.com/photos/7584538/pexels-photo-7584538.jpeg",
    availableToday: false,
  },
  {
    id: 6,
    name: "Dr. Vikram Reddy",
    specialization: "Attachment Issues",
    location: "Hyderabad, Telangana",
    distance: 6.3,
    rating: 4.7,
    verified: true,
    image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg",
    availableToday: true,
  },
];

const MentalWellnessRegion: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [filterAvailableToday, setFilterAvailableToday] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  
  let filteredTherapists = mockTherapists.filter(therapist => 
    (searchQuery === '' || 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!filterAvailableToday || therapist.availableToday)
  );
  
  if (sortByDistance) {
    filteredTherapists = [...filteredTherapists].sort((a, b) => a.distance - b.distance);
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-3">
            Mental Wellness
          </h1>
          <p className="text-accent-700 mb-8 text-lg">
            Connect with mental health professionals who specialize in heartbreak recovery.
          </p>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="flex items-center p-4 border-b border-accent-100">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-accent-500" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search therapists by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => setFilterAvailableToday(!filterAvailableToday)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  filterAvailableToday 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                <Calendar size={16} className="mr-2" />
                Available Today
              </button>
              <button
                onClick={() => setSortByDistance(!sortByDistance)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  sortByDistance 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                <Filter size={16} className="mr-2" />
                Sort by Distance
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapists.map((therapist) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer ${
                    selectedTherapist === therapist.id ? 'ring-2 ring-primary-500' : 'border border-accent-100'
                  }`}
                  onClick={() => setSelectedTherapist(therapist.id === selectedTherapist ? null : therapist.id)}
                >
                  <div className="p-4 pb-0 flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img
                        src={therapist.image}
                        alt={therapist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-primary-800">{therapist.name}</h3>
                        {therapist.verified && (
                          <span className="ml-2 text-success-500" title="Verified Professional">
                            <Award size={16} fill="currentColor" />
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-accent-600">
                        {therapist.specialization}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-accent-600 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {therapist.location}
                      </p>
                      <p className="text-xs text-accent-600">
                        {therapist.distance} km away
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-primary-50 px-2 py-1 rounded text-xs text-primary-700">
                        Rating: {therapist.rating}/5
                      </div>
                      {therapist.availableToday ? (
                        <div className="bg-success-50 px-2 py-1 rounded text-xs text-success-700">
                          Available Today
                        </div>
                      ) : (
                        <div className="bg-accent-50 px-2 py-1 rounded text-xs text-accent-700">
                          Next Week
                        </div>
                      )}
                    </div>
                    
                    {selectedTherapist === therapist.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t border-accent-100"
                      >
                        <p className="text-sm text-accent-700 mb-4">
                          Specializes in helping individuals navigate the emotional challenges of heartbreak and relationship transitions.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="btn-primary text-sm flex items-center justify-center py-2">
                            <Calendar size={16} className="mr-2" />
                            Book Session
                          </button>
                          <button className="btn-outline text-sm flex items-center justify-center py-2">
                            <MessageSquare size={16} className="mr-2" />
                            Chat
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white rounded-2xl shadow-md p-8"
          >
            <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
              Types of Support Available
            </h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-800">One-on-One Sessions</h3>
                  <p className="text-sm text-accent-700">
                    Private therapy sessions focused specifically on heartbreak recovery.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Users size={20} className="text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-800">Group Therapy</h3>
                  <p className="text-sm text-accent-700">
                    Facilitated groups where you can connect with others going through similar experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <MessageSquare size={20} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-800">Text Support</h3>
                  <p className="text-sm text-accent-700">
                    Text-based therapy for moments when you need immediate guidance.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <PhoneCall size={20} className="text-success-600" />
                </div>
                <div>
                  <h3 className="font-medium text-primary-800">Crisis Support</h3>
                  <p className="text-sm text-accent-700">
                    24/7 emergency support for moments of acute emotional distress.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white rounded-2xl shadow-md p-8"
          >
            <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
              Upcoming Group Sessions
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-primary-800">Moving Beyond Heartbreak</h3>
                  <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded">Online</span>
                </div>
                <div className="flex items-center text-accent-600 text-sm mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-3">Tomorrow, 7:00 PM</span>
                  <Clock size={14} className="mr-1" />
                  <span>90 minutes</span>
                </div>
                <p className="text-sm text-accent-700 mb-3">
                  A supportive group session focused on practical strategies for moving forward after a relationship ends.
                </p>
                <button className="btn-primary text-sm w-full">
                  Reserve Spot (4 left)
                </button>
              </div>
              
              <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-primary-800">Rebuilding Self-Worth</h3>
                  <span className="bg-secondary-100 text-secondary-700 text-xs px-2 py-1 rounded">In Person</span>
                </div>
                <div className="flex items-center text-accent-600 text-sm mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span className="mr-3">Saturday, 11:00 AM</span>
                  <Clock size={14} className="mr-1" />
                  <span>2 hours</span>
                </div>
                <p className="text-sm text-accent-700 mb-3">
                  Focused on rebuilding confidence and self-esteem after experiencing heartbreak.
                </p>
                <button className="btn-primary text-sm w-full">
                  Reserve Spot (2 left)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8 mb-8"
        >
          <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
            Emotional First Aid Resources
          </h2>
          <p className="text-accent-700 mb-6">
            For moments when you need immediate support or self-help resources.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <h3 className="font-medium text-primary-800 mb-2">Crisis Helpline</h3>
              <p className="text-sm text-accent-700 mb-3">
                24/7 emotional support for moments of crisis.
              </p>
              <a href="tel:1800-599-0019" className="btn-primary text-sm w-full flex items-center justify-center">
                <PhoneCall size={16} className="mr-2" />
                1800-599-0019
              </a>
            </div>
            
            <div className="bg-accent-50 rounded-lg p-4 border border-accent-100">
              <h3 className="font-medium text-primary-800 mb-2">Guided Meditations</h3>
              <p className="text-sm text-accent-700 mb-3">
                Audio meditations for calming intense emotions.
              </p>
              <button className="btn-primary text-sm w-full">
                Listen Now
              </button>
            </div>
            
            <div className="bg-success-50 rounded-lg p-4 border border-success-100">
              <h3 className="font-medium text-primary-800 mb-2">Self-Care Checklist</h3>
              <p className="text-sm text-accent-700 mb-3">
                Simple daily practices for emotional wellbeing.
              </p>
              <button className="btn-primary text-sm w-full">
                View Checklist
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MentalWellnessRegion;