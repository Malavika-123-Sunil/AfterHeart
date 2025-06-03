import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Map, Calendar, Users, Star, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Mock data for Indian states
const indianStates = [
  'Himachal Pradesh',
  'Uttarakhand',
  'Kerala',
  'Goa',
  'Rajasthan',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'West Bengal',
  'Sikkim',
];

// Mock data for peaceful places
const mockPlaces = [
  {
    id: 1,
    name: "Dharamshala",
    state: "Himachal Pradesh",
    type: "Hills",
    image: "https://images.pexels.com/photos/2825039/pexels-photo-2825039.jpeg",
    rating: 4.7,
  },
  {
    id: 2,
    name: "Varkala Beach",
    state: "Kerala",
    type: "Beach",
    image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Rishikesh",
    state: "Uttarakhand",
    type: "Spiritual",
    image: "https://images.pexels.com/photos/7266781/pexels-photo-7266781.jpeg",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Coorg",
    state: "Karnataka",
    type: "Hills",
    image: "https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Andaman Islands",
    state: "Andaman & Nicobar",
    type: "Beach",
    image: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Munnar",
    state: "Kerala",
    type: "Hills",
    image: "https://images.pexels.com/photos/6650184/pexels-photo-6650184.jpeg",
    rating: 4.7,
  },
];

// Mock packages
const mockPackages = [
  {
    id: 1,
    title: "Himalayan Healing Retreat",
    location: "Dharamshala, Himachal Pradesh",
    duration: 5,
    price: 25000,
    image: "https://images.pexels.com/photos/2825039/pexels-photo-2825039.jpeg",
    inclusions: ["Accommodation", "Meals", "Guided Meditation", "Nature Walks"],
    isGroup: false,
  },
  {
    id: 2,
    title: "Coastal Serenity Package",
    location: "Varkala, Kerala",
    duration: 4,
    price: 20000,
    image: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg",
    inclusions: ["Accommodation", "Breakfast", "Yoga Sessions", "Beach Time"],
    isGroup: false,
  },
  {
    id: 3,
    title: "Group Spiritual Journey",
    location: "Rishikesh, Uttarakhand",
    duration: 7,
    price: 35000,
    image: "https://images.pexels.com/photos/7266781/pexels-photo-7266781.jpeg",
    inclusions: ["Accommodation", "All Meals", "Group Therapy", "Yoga & Meditation"],
    isGroup: true,
    participants: 12,
    startDate: "Jun 15, 2025",
  },
  {
    id: 4,
    title: "Mountain Healing Collective",
    location: "Manali, Himachal Pradesh",
    duration: 6,
    price: 30000,
    image: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
    inclusions: ["Accommodation", "All Meals", "Group Activities", "Nature Therapy"],
    isGroup: true,
    participants: 8,
    startDate: "Jul 10, 2025",
  },
];

const TripRegion: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [currentTab, setCurrentTab] = useState('destinations');
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  
  const filteredPlaces = mockPlaces.filter(place => 
    (selectedState === '' || place.state === selectedState) &&
    (searchQuery === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPackages = mockPackages.filter(pkg => 
    (durationFilter === null || pkg.duration <= durationFilter) &&
    (searchQuery === '' || 
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-3">
            Healing Trips
          </h1>
          <p className="text-accent-700 mb-8 text-lg">
            Discover peaceful destinations across India to aid your healing journey.
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
                placeholder="Search destinations or packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex border-b border-accent-100">
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                currentTab === 'destinations'
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-accent-600 hover:text-primary-600'
              }`}
              onClick={() => setCurrentTab('destinations')}
            >
              <Map size={16} className="inline-block mr-2" />
              Destinations
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                currentTab === 'packages'
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-accent-600 hover:text-primary-600'
              }`}
              onClick={() => setCurrentTab('packages')}
            >
              <Calendar size={16} className="inline-block mr-2" />
              Packages
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                currentTab === 'group'
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-accent-600 hover:text-primary-600'
              }`}
              onClick={() => setCurrentTab('group')}
            >
              <Users size={16} className="inline-block mr-2" />
              Group Travel
            </button>
          </div>
          
          {currentTab === 'destinations' && (
            <div className="p-6">
              <div className="flex flex-wrap mb-6">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium mr-2 mb-2 ${
                    selectedState === '' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                  onClick={() => setSelectedState('')}
                >
                  All States
                </button>
                {indianStates.map((state) => (
                  <button
                    key={state}
                    className={`px-4 py-2 rounded-full text-sm font-medium mr-2 mb-2 ${
                      selectedState === state 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                    onClick={() => setSelectedState(state)}
                  >
                    {state}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map((place) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer ${
                      selectedPlace === place.id ? 'ring-2 ring-primary-500' : 'border border-accent-100'
                    }`}
                    onClick={() => setSelectedPlace(place.id === selectedPlace ? null : place.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-primary-700">
                        {place.type}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-primary-800">{place.name}</h3>
                          <p className="text-sm text-accent-600 flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            {place.state}
                          </p>
                        </div>
                        <div className="flex items-center bg-primary-50 px-2 py-1 rounded">
                          <Star size={14} className="text-warning-500 mr-1" fill="currentColor" />
                          <span className="text-sm font-medium">{place.rating}</span>
                        </div>
                      </div>
                      
                      {selectedPlace === place.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-accent-100"
                        >
                          <p className="text-sm text-accent-700 mb-3">
                            A peaceful destination perfect for reflection and healing amid nature.
                          </p>
                          <button className="btn-primary w-full text-sm">
                            View Travel Packages
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {currentTab === 'packages' && (
            <div className="p-6">
              <div className="flex flex-wrap mb-6">
                <span className="text-accent-700 mr-3 flex items-center">Duration:</span>
                {[null, 3, 5, 7, 10].map((days) => (
                  <button
                    key={days === null ? 'all' : days}
                    className={`px-4 py-2 rounded-full text-sm font-medium mr-2 mb-2 ${
                      durationFilter === days 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                    onClick={() => setDurationFilter(days)}
                  >
                    {days === null ? 'Any' : `${days} days or less`}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPackages.filter(pkg => !pkg.isGroup).map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-accent-100 flex flex-col sm:flex-row"
                  >
                    <div className="sm:w-2/5 h-48 sm:h-auto">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 sm:w-3/5">
                      <h3 className="font-medium text-primary-800 text-lg">{pkg.title}</h3>
                      <p className="text-sm text-accent-600 flex items-center mt-1 mb-3">
                        <MapPin size={14} className="mr-1" />
                        {pkg.location}
                      </p>
                      
                      <div className="flex items-center mb-3">
                        <div className="px-3 py-1 bg-primary-50 rounded-full text-xs text-primary-700 font-medium mr-2">
                          {pkg.duration} days
                        </div>
                        <div className="px-3 py-1 bg-secondary-50 rounded-full text-xs text-secondary-700 font-medium">
                          ₹{pkg.price.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs text-accent-700 mb-1">Inclusions:</p>
                        <div className="flex flex-wrap">
                          {pkg.inclusions.map((item, index) => (
                            <span key={index} className="text-xs bg-accent-50 text-accent-700 px-2 py-1 rounded mr-1 mb-1">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button className="btn-primary w-full text-sm">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {currentTab === 'group' && (
            <div className="p-6">
              <div className="bg-primary-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-primary-800 mb-2">Group Healing Journeys</h3>
                <p className="text-sm text-accent-700">
                  Travel with others who understand your journey. Our group packages include 
                  guided activities and shared experiences to support collective healing.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockPackages.filter(pkg => pkg.isGroup).map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-accent-100 flex flex-col sm:flex-row"
                  >
                    <div className="sm:w-2/5 h-48 sm:h-auto relative">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Group Trip
                      </div>
                    </div>
                    <div className="p-4 sm:w-3/5">
                      <h3 className="font-medium text-primary-800 text-lg">{pkg.title}</h3>
                      <p className="text-sm text-accent-600 flex items-center mt-1 mb-2">
                        <MapPin size={14} className="mr-1" />
                        {pkg.location}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="px-3 py-1 bg-primary-50 rounded text-xs text-primary-700">
                          <Calendar size={12} className="inline mr-1" />
                          {pkg.startDate}
                        </div>
                        <div className="px-3 py-1 bg-secondary-50 rounded text-xs text-secondary-700">
                          <Users size={12} className="inline mr-1" />
                          {pkg.participants} joined
                        </div>
                        <div className="px-3 py-1 bg-accent-50 rounded text-xs text-accent-700">
                          {pkg.duration} days
                        </div>
                        <div className="px-3 py-1 bg-success-50 rounded text-xs text-success-700">
                          ₹{pkg.price.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs text-accent-700 mb-1">Inclusions:</p>
                        <div className="flex flex-wrap">
                          {pkg.inclusions.map((item, index) => (
                            <span key={index} className="text-xs bg-accent-50 text-accent-700 px-2 py-1 rounded mr-1 mb-1">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button className="btn-primary w-full text-sm">
                        Join This Journey
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8 mb-8"
        >
          <h2 className="text-xl font-display font-semibold text-primary-800 mb-4">
            Why Travel Aids Healing
          </h2>
          <p className="text-accent-700 mb-6">
            Changing your environment can significantly impact your emotional healing process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">Physical Distance Creates Mental Space</h3>
              <p className="text-accent-700 text-sm">
                Being in a new place helps create mental distance from painful memories and associations.
              </p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">Nature's Healing Power</h3>
              <p className="text-accent-700 text-sm">
                Natural environments have been shown to reduce stress, anxiety, and rumination.
              </p>
            </div>
            <div className="bg-accent-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">New Perspectives</h3>
              <p className="text-accent-700 text-sm">
                Encountering different cultures and ways of life can help reframe your own experiences.
              </p>
            </div>
            <div className="bg-success-50 rounded-lg p-6">
              <h3 className="font-medium text-primary-800 mb-2">Shared Healing</h3>
              <p className="text-accent-700 text-sm">
                Group journeys create connections with others who understand, reducing isolation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TripRegion;