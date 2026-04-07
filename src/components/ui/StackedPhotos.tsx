'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const cards = [
  {
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    title: 'Daily Life',
    desc: 'Moments outside coding',
  },
  {
    img: 'https://images.unsplash.com/photo-1520975922284-9e0ce827a1b4',
    title: 'Fun Stuff',
    desc: 'Skate, chill, explore',
  },
  {
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    title: 'Running',
    desc: 'Keep moving forward',
  },
  {
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    title: 'Nature',
    desc: 'Reset & recharge',
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
              }}
              animate={{
                rotateY: isActive ? 180 : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(1px)',
                }}
              >
                <img
                  src={`${card.img}?w=400&h=500&fit=crop`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 bg-[#1f1f1f] text-white flex flex-col justify-end p-4 rounded-2xl"
                style={{
                  transform: 'rotateY(180deg) translateZ(1px)',
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