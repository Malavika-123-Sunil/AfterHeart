import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const affirmations = [
  "Your healing is a journey, not a destination.",
  "It's okay to not be okay sometimes.",
  "Each day brings you closer to the person you're meant to be.",
  "Your heart knows how to heal itself. Give it time.",
  "This pain is not your forever home.",
  "You are growing through what you're going through.",
  "Healing doesn't mean the damage never existed. It means it no longer controls your life.",
  "Be gentle with yourself. You're doing the best you can.",
  "Your worth is not determined by someone else's inability to see it.",
  "Trust that this ending is making space for a beautiful new beginning.",
  "You have survived 100% of your worst days so far.",
  "Sometimes the heart needs more time to accept what the mind already knows.",
  "You will find love again, starting with the love you give yourself."
];

const Affirmation: React.FC = () => {
  const [affirmation, setAffirmation] = useState('');
  
  useEffect(() => {
    // Get a random affirmation when component mounts
    const random = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[random]);
  }, []);
  
  return (
    <motion.div 
      className="affirmation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      <p className="text-lg md:text-xl">"{affirmation}"</p>
    </motion.div>
  );
};

export default Affirmation;