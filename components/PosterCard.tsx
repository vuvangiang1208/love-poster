import React, { useState } from 'react';
import { Achievement } from '../types';

interface PosterCardProps {
  achievement: Achievement;
  index: number;
  bgImage?: string | null;
}

const PosterCard: React.FC<PosterCardProps> = ({ achievement, index, bgImage }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div 
      className="achievement-card relative overflow-hidden h-[450px] flex flex-col items-center justify-end p-8 group border-none"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full bg-[#15051a]">
        {bgImage ? (
          <img 
            src={bgImage} 
            alt={achievement.title}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110 ${loaded ? 'opacity-70 group-hover:opacity-90' : 'opacity-0'}`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${achievement.color} opacity-20`}></div>
        )}
        
        {/* Skeleton pulse while loading */}
        {!loaded && bgImage && (
          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
        )}
      </div>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0411] via-[#0d0411]/40 to-transparent"></div>

      {/* Text Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center transform transition-transform duration-500 group-hover:translate-y-[-5px]">
        {/* Icon with Glow */}
        <div className="text-5xl mb-4 transform transition-all group-hover:scale-125 duration-700 icon-glow">
          {achievement.icon}
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-rose-400 text-[10px] tracking-[0.3em] font-bold mb-2 uppercase opacity-80">
            {achievement.subCaption}
          </span>
          <h3 className="text-2xl md:text-3xl font-serif-elegant font-bold text-white leading-tight mb-3 drop-shadow-lg">
            {achievement.title}
          </h3>
          <p className="text-rose-100/70 text-sm leading-relaxed max-w-[280px] font-medium transition-opacity duration-500 group-hover:text-rose-100">
            {achievement.description}
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="flex gap-2 mt-6 items-center">
            <div className="w-8 h-[1px] bg-rose-500/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <div className="w-8 h-[1px] bg-rose-500/30"></div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;

