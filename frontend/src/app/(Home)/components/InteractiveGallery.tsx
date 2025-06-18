'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const images = [
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
  '/img4.jpg',
  '/img5.jpg',
];

export default function InteractiveGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full h-screen bg-neutral-900 flex items-center justify-center overflow-hidden">
      <div className="flex w-full h-[80vh] px-6 gap-2 max-w-7xl">
        {images.map((img, index) => (
          <motion.div
            key={img}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'relative cursor-pointer rounded-xl overflow-hidden shadow-lg flex items-end justify-start bg-cover bg-center',
              activeIndex === index ? 'flex-[5]' : 'flex-[1] grayscale'
            )}
            style={{ backgroundImage: `url(${img})` }}
            onClick={() => setActiveIndex(index)}
          >
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  key="label"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-md"
                >
                  <h3 className="text-lg font-semibold">Image {index + 1}</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
