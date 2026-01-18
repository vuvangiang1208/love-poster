
import React, { useState, useEffect, useMemo } from 'react';
import { ACHIEVEMENTS, MAIN_POSTER_CONFIG, HARDCODED_POEM } from './constants';
import PosterCard from './components/PosterCard';
import { generatePosterImage, generateSpecificImage } from './services/geminiService';
import { AIPoemResponse } from './types';

const Petals = () => {
  const petals = useMemo(() => [...Array(25)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 15,
    delay: Math.random() * 20,
    duration: 12 + Math.random() * 12,
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map(p => (
        <div 
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.8}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [aiContent] = useState<AIPoemResponse>(HARDCODED_POEM);
  const [posterImg, setPosterImg] = useState<string | null>(MAIN_POSTER_CONFIG.imageUrl || null);
  const [achievementBgs, setAchievementBgs] = useState<Record<string, string | null>>(() => {
    const initialBgs: Record<string, string | null> = {};
    ACHIEVEMENTS.forEach(ach => {
      initialBgs[ach.id] = ach.imageUrl || null;
    });
    return initialBgs;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Chỉ tạo ảnh Poster nếu chưa có URL fix trong code
        const mainImgPromise = !MAIN_POSTER_CONFIG.imageUrl 
          ? generatePosterImage(MAIN_POSTER_CONFIG.imagePrompt) 
          : Promise.resolve(MAIN_POSTER_CONFIG.imageUrl);

        // Chỉ tạo ảnh cho thành tựu nếu chưa có URL fix trong code
        const bgPromises = ACHIEVEMENTS.map(async (ach) => {
          if (ach.imageUrl) return { id: ach.id, img: ach.imageUrl };
          const img = await generateSpecificImage(ach.imagePrompt);
          return { id: ach.id, img };
        });

        const [mainImg, ...bgs] = await Promise.all([
          mainImgPromise,
          ...bgPromises
        ]);
        
        if (mainImg) setPosterImg(mainImg);
        
        const bgsMap: Record<string, string | null> = {};
        bgs.forEach(item => {
          bgsMap[item.id] = item.img;
        });
        setAchievementBgs(bgsMap);
        
      } catch (err) {
        console.error("Failed to load visual magic", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen text-[#fce7f3] selection:bg-rose-900/50 relative font-body bg-[#08020a]">
      <Petals />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 max-w-5xl">
          <div className="flex justify-center mb-8 animate-bounce">
             <span className="inline-block px-8 py-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-[10px] font-black tracking-[0.5em] uppercase backdrop-blur-xl">
              Chương Mới: Tình Yêu 2025
            </span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-romantic-main font-bold mb-10 gradient-text leading-tight drop-shadow-2xl">
            Thành Tựu <br /> 2025
          </h1>
          
          <p className="text-2xl md:text-4xl font-calligraphy text-rose-200/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            "2025 - Khi những nhịp tim bắt đầu hòa chung một giai điệu..."
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500/20"></div>
          </div>
        </div>
      </section>

      {/* Achievement Grid */}
      <section id="poster-grid" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-calligraphy font-bold text-white mb-6">Những cột mốc ngọt ngào</h2>
            <p className="font-serif-elegant italic text-rose-300/60 text-lg">Ghi dấu lại từng khoảnh khắc đáng nhớ nhất của chúng ta</p>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ACHIEVEMENTS.map((achievement, index) => (
              <PosterCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index} 
                bgImage={achievementBgs[achievement.id]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Poetry & Final Poster */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#120616]/80 backdrop-blur-3xl rounded-[4rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5 soft-glow-box">
            <div className="relative h-[450px] md:h-[650px] group overflow-hidden bg-[#15051a]">
              {!posterImg ? (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-rose-400 font-bold tracking-widest text-xs animate-pulse">ĐANG VẼ LỜI YÊU...</p>
                   </div>
                </div>
              ) : (
                <img 
                  src={posterImg} 
                  alt="Romantic Vision 2025" 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                  style={{ opacity: posterImg ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#120616] via-transparent to-transparent"></div>
              
              <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center">
                 <p className="text-xs tracking-[0.3em] font-black text-rose-400 uppercase">Poster 2025</p>
                 <p className="text-xl font-romantic-main text-white mt-1">Hạnh Phúc</p>
              </div>
            </div>

            <div className="p-10 md:p-20 text-center md:text-left">
              <div className="mb-16">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-10 opacity-80">
                  <div className="h-[1px] w-12 bg-rose-500"></div>
                  <h3 className="text-rose-400 font-bold uppercase tracking-[0.5em] text-xs">LỜI TỪ TRÁI TIM ANH</h3>
                </div>
                
                <div className="text-4xl md:text-7xl font-calligraphy text-white leading-[1.3] md:leading-[1.5] drop-shadow-2xl">
                  {aiContent.poem.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">{line}</p>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-white/10 relative">
                <div className="absolute top-[-10px] left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-5 h-5 bg-[#120616] flex items-center justify-center">
                   <span className="text-rose-500">❦</span>
                </div>
                
                <p className="text-xl md:text-2xl text-rose-100/80 font-serif-elegant italic leading-relaxed max-w-4xl mx-auto md:mx-0">
                  "{aiContent.quote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sweet Footer */}
      <footer className="py-32 text-center px-4 relative z-10">
        <div className="text-5xl mb-10 icon-glow animate-pulse">❤️</div>
        <h2 className="text-white font-calligraphy text-6xl md:text-8xl mb-6">
          Anh yêu em rất nhiều!
        </h2>
        <div className="flex flex-col items-center gap-4">
            <p className="font-serif-elegant text-rose-200/50 tracking-[0.3em] text-sm italic">Mãi mãi là bao xa? Là cho đến khi tim ngừng đập.</p>
            <p className="text-[10px] text-rose-500/40 tracking-[0.8em] font-bold uppercase mt-8">Forever Yours • Anniversary 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
