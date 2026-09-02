'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const cards = [
  {
    img: '/images/about-me/about-1.jpg',
    title: 'Race Day',
    desc: 'Crossing the finish line',
  },
  {
    img: '/images/about-me/about-2.jpg',
    title: 'Above the Clouds',
    desc: 'Summit views on the trail',
  },
  {
    img: '/images/about-me/about-3.jpg',
    title: 'Trail Running',
    desc: 'Chasing the next peak',
  },
  {
    img: '/images/about-me/about-4.jpg',
    title: 'Night Run',
    desc: 'Keep moving forward',
  },
];

export default function StackedCards() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="relative flex justify-center items-center h-80"
      style={{ perspective: 1000 }}
    >
      {cards.map((card, i) => {
        const centerIndex = (cards.length - 1) / 2;
        const offsetX = (i - centerIndex) * 180;
        const rotate = [-12, -4, 6, 14][i];

        const isActive = hovered === i;

        return (
          <motion.div
            key={i}
            className="absolute w-55 h-70 rounded-2xl cursor-pointer"
            style={{
              rotate,
              x: offsetX,
              zIndex: isActive ? 50 : i,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* INNER */}
            <motion.div
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
              animate={{
                rotateY: isActive ? 180 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(1px)',
                }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 bg-[#1f1f1f] text-white flex flex-col justify-end p-4 rounded-2xl"
                style={{
                  transform: 'rotateY(180deg) translateZ(1px)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                }}
              >
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <p className="text-sm text-gray-300">{card.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}